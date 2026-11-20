const xlsx = require('xlsx')
const mongoose = require('mongoose')
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

  const validId = (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) return true
    res.status(404).json({ message: `${entity} not found` })
    return false
  }

  const add = async (req, res, next) => {
    try {
      const data = parseBody(req.body)
      if (!data) return invalid(res)
      const doc = await Model.create({ userId: req.user.id, ...data })
      res.status(201).json(doc)
    } catch (e) {
      next(e)
    }
  }

  const getAll = async (req, res, next) => {
    try {
      const { page, limit, skip } = parsePageLimit(req.query)
      const filter = { userId: req.user.id }
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
    if (!validId(req, res)) return
    try {
      const deleted = await Model.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      }).lean()
      if (!deleted)
        return res.status(404).json({ message: `${entity} not found` })
      res.json({ message: `${entity} deleted successfully` })
    } catch (e) {
      next(e)
    }
  }

  const update = async (req, res, next) => {
    if (!validId(req, res)) return
    try {
      const data = parseBody(req.body)
      if (!data) return invalid(res)
      const doc = await Model.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
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
    if (query.from !== undefined) {
      const from = parseTransactionDate(query.from)
      if (!from) return null
      range.$gte = from
    }
    if (query.to !== undefined) {
      const to = parseTransactionDate(query.to)
      if (!to) return null
      if (/^\d{4}-\d{2}-\d{2}$/.test(query.to)) to.setUTCHours(23, 59, 59, 999)
      range.$lte = to
    }
    if (range.$gte && range.$lte && range.$gte > range.$lte) return null
    return range
  }

  const downloadExcel = async (req, res, next) => {
    try {
      const range = parseRange(req.query)
      if (!range) {
        return res.status(400).json({ message: 'Invalid date range' })
      }
      const filter = { userId: req.user.id }
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

  return { add, getAll, remove, update, downloadExcel }
}
