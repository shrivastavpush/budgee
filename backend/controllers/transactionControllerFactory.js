const xlsx = require('xlsx')
const mongoose = require('mongoose')
const {
  parsePositiveAmount,
  parseTransactionDate,
  parsePageLimit,
} = require('../utils/transactionQuery')

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
    const amount = parsePositiveAmount(body.amount)
    const date = parseTransactionDate(body.date)
    const icon = typeof body.icon === 'string' ? body.icon : ''
    if (
      !name ||
      name.length > MAX_LABEL_LENGTH ||
      icon.length > MAX_ICON_LENGTH ||
      amount == null ||
      !date
    ) {
      return null
    }
    return { icon, [field]: name, amount, date }
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
        data,
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
      res.json(doc)
    } catch (e) {
      next(e)
    }
  }

  const downloadExcel = async (req, res, next) => {
    try {
      const items = await Model.find({ userId: req.user.id })
        .sort({ date: -1 })
        .limit(MAX_EXPORT_ROWS)
        .select(`${field} amount date -_id`)
        .lean()
      const rows = items.map((i) => ({
        [label]: safeCell(i[field]),
        Amount: i.amount,
        Date: i.date,
      }))
      const wb = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(rows), entity)
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
