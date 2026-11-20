const xlsx = require('xlsx')
const mongoose = require('mongoose')
const sanitize = require('mongo-sanitize')
const {
  parseTransactionDate,
  parsePageLimit,
} = require('../utils/transactionQuery')
const {
  toCents,
  fromCents,
  serializeTransaction,
  INR_EXCEL_FORMAT,
} = require('../utils/money')

const MAX_EXPORT_ROWS = 50000
const MAX_LABEL_LENGTH = 100
const MAX_ICON_LENGTH = 200

// Prevent spreadsheet formula injection in exported cells.
const safeCell = (v) =>
  typeof v === 'string' && /^[=+\-@\t\r]/.test(v) ? `'${v}` : v

/** Sanitize + typeof-check + ObjectId so query values are never operator objects. */
const asObjectId = (raw) => {
  const id = sanitize(raw)
  if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) return null
  return new mongoose.Types.ObjectId(id)
}

/**
 * Builds CRUD + export handlers for a transaction model.
 * field: label field ('source' | 'category'); label/entity: display names.
 */
module.exports = ({ Model, field, label, entity }) => {
  const parseBody = (body) => {
    const name = typeof body[field] === 'string' ? body[field].trim() : ''
    const amountCents = toCents(body.amount)
    const date = parseTransactionDate(body.date)
    const icon = typeof body.icon === 'string' ? body.icon : ''
    if (
      !name ||
      name.length > MAX_LABEL_LENGTH ||
      icon.length > MAX_ICON_LENGTH ||
      amountCents == null ||
      !date
    ) {
      return null
    }
    return { icon, [field]: name, amountCents, date }
  }

  const invalid = (res) =>
    res.status(400).json({
      message: `${label}, a positive amount, and a valid date are required`,
    })

  const add = async (req, res, next) => {
    try {
      const data = parseBody(sanitize(req.body) || {})
      if (!data) return invalid(res)
      const userId = asObjectId(sanitize(req.user?.id))
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })
      const doc = await Model.create({ userId, ...data })
      res.status(201).json(doc)
    } catch (e) {
      next(e)
    }
  }

  const getAll = async (req, res, next) => {
    try {
      const userId = asObjectId(sanitize(req.user?.id))
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })
      const { page, limit, skip } = parsePageLimit(sanitize(req.query) || {})
      const filter = { userId: { $eq: userId } }
      const [data, total] = await Promise.all([
        Model.find(filter)
          .sort({ date: -1, _id: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Model.countDocuments(filter),
      ])
      res.json({
        data: data.map(serializeTransaction),
        pagination: {
          total,
          page,
          limit,
          pages: Math.max(Math.ceil(total / limit), 1),
        },
      })
    } catch (e) {
      next(e)
    }
  }

  const remove = async (req, res, next) => {
    const userId = asObjectId(sanitize(req.user?.id))
    const _id = asObjectId(sanitize(req.params?.id))
    if (!userId || !_id) {
      return res.status(404).json({ message: `${entity} not found` })
    }
    try {
      const deleted = await Model.findOneAndDelete({
        _id: { $eq: _id },
        userId: { $eq: userId },
      }).lean()
      if (!deleted)
        return res.status(404).json({ message: `${entity} not found` })
      res.json({ message: `${entity} deleted successfully` })
    } catch (e) {
      next(e)
    }
  }

  const update = async (req, res, next) => {
    const userId = asObjectId(sanitize(req.user?.id))
    const _id = asObjectId(sanitize(req.params?.id))
    if (!userId || !_id) {
      return res.status(404).json({ message: `${entity} not found` })
    }
    try {
      const data = parseBody(sanitize(req.body) || {})
      if (!data) return invalid(res)
      const doc = await Model.findOneAndUpdate(
        { _id: { $eq: _id }, userId: { $eq: userId } },
        data,
        { new: true }
      ).lean()
      if (!doc) return res.status(404).json({ message: `${entity} not found` })
      res.json(serializeTransaction(doc))
    } catch (e) {
      next(e)
    }
  }

  // Optional ?from=YYYY-MM-DD&to=YYYY-MM-DD (both inclusive).
  const parseRange = (query) => {
    const range = {}
    const fromRaw = sanitize(query.from)
    const toRaw = sanitize(query.to)
    if (fromRaw !== undefined) {
      const from = parseTransactionDate(fromRaw)
      if (!from) return null
      range.$gte = from
    }
    if (toRaw !== undefined) {
      const to = parseTransactionDate(toRaw)
      if (!to) return null
      if (typeof toRaw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(toRaw)) {
        to.setUTCHours(23, 59, 59, 999)
      }
      range.$lte = to
    }
    if (range.$gte && range.$lte && range.$gte > range.$lte) return null
    return range
  }

  const downloadExcel = async (req, res, next) => {
    try {
      const userId = asObjectId(sanitize(req.user?.id))
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })
      const range = parseRange(sanitize(req.query) || {})
      if (!range) {
        return res.status(400).json({ message: 'Invalid date range' })
      }
      // Build filter from sanitized literals only; do not sanitize() the filter
      // itself (that would strip intentional $gte/$lte date bounds).
      const filter = { userId: { $eq: userId } }
      if (Object.keys(range).length) filter.date = range

      const items = await Model.find(filter)
        .sort({ date: -1 })
        .limit(MAX_EXPORT_ROWS)
        .select(`${field} amountCents date -_id`)
        .lean()
      const rows = items.map((i) => ({
        [label]: safeCell(i[field]),
        'Amount (INR)': fromCents(i.amountCents),
        Date: i.date,
      }))
      const ws = xlsx.utils.json_to_sheet(rows)
      // Apply INR number format to the amount column (header row excluded).
      for (let r = 1; r <= rows.length; r++) {
        const cell = ws[xlsx.utils.encode_cell({ r, c: 1 })]
        if (cell) cell.z = INR_EXCEL_FORMAT
      }
      ws['!cols'] = [{ wch: 24 }, { wch: 18 }, { wch: 22 }]
      const wb = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(wb, ws, entity)
      const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${entity.toLowerCase()}_details.xlsx"`
      )
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.send(buffer)
    } catch (e) {
      next(e)
    }
  }

  // Daily totals for the overview chart (covers all data in the window, not one page).
  // Days are bucketed in IST since the app is INR-only.
  const overview = async (req, res, next) => {
    try {
      const userId = asObjectId(sanitize(req.user?.id))
      if (!userId) return res.status(401).json({ message: 'Unauthorized' })
      const daysRaw = sanitize(req.query?.days)
      const days = Math.min(Math.max(parseInt(daysRaw, 10) || 30, 1), 365)
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      const rows = await Model.aggregate([
        {
          $match: {
            userId: { $eq: userId },
            date: { $gte: since },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$date',
                timezone: 'Asia/Kolkata',
              },
            },
            amountCents: { $sum: '$amountCents' },
          },
        },
        { $sort: { _id: 1 } },
      ])
      res.json(
        rows.map((r) => ({ date: r._id, amount: fromCents(r.amountCents) }))
      )
    } catch (e) {
      next(e)
    }
  }

  return { add, getAll, remove, update, downloadExcel, overview }
}
