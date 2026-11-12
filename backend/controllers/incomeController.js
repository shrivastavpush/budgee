const xlsx = require('xlsx')
const mongoose = require('mongoose')
const Income = require('../models/Income')
const {
  parsePositiveAmount,
  parseTransactionDate,
  parsePageLimit,
} = require('../utils/transactionQuery')

exports.addIncome = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  try {
    const source =
      typeof req.body.source === 'string' ? req.body.source.trim() : ''
    const amount = parsePositiveAmount(req.body.amount)
    const date = parseTransactionDate(req.body.date)
    const icon = typeof req.body.icon === 'string' ? req.body.icon : ''

    if (!source || amount == null || !date) {
      return res.status(400).json({
        message: 'Source, a positive amount, and a valid date are required',
      })
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date,
    })

    await newIncome.save()
    res.status(201).json(newIncome)
  } catch (error) {
    next(error)
  }
}

exports.getAllIncome = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  try {
    const { page, limit, skip } = parsePageLimit(req.query)
    const filter = { userId }

    const [income, total] = await Promise.all([
      Income.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Income.countDocuments(filter),
    ])

    res.json({
      data: income,
      pagination: {
        total,
        page,
        limit,
        pages: Math.max(Math.ceil(total / limit), 1),
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.deleteIncome = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Income not found' })
  }

  try {
    const deletedIncome = await Income.findOneAndDelete({
      _id: req.params.id,
      userId,
    })

    if (!deletedIncome) {
      return res
        .status(404)
        .json({ message: 'Income not found or unauthorized access' })
    }

    res.json({ message: 'Income deleted successfully' })
  } catch (error) {
    next(error)
  }
}

exports.downloadIncomeExcel = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  try {
    const income = await Income.find({ userId }).sort({ date: -1 })

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }))

    const wb = xlsx.utils.book_new()
    const ws = xlsx.utils.json_to_sheet(data)
    xlsx.utils.book_append_sheet(wb, ws, 'Income')

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="income_details.xlsx"'
    )
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

    res.send(buffer)
  } catch (error) {
    next(error)
  }
}

exports.updateIncome = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Income not found' })
  }

  try {
    const source =
      typeof req.body.source === 'string' ? req.body.source.trim() : ''
    const amount = parsePositiveAmount(req.body.amount)
    const date = parseTransactionDate(req.body.date)
    const icon = typeof req.body.icon === 'string' ? req.body.icon : ''

    if (!source || amount == null || !date) {
      return res.status(400).json({
        message: 'Source, a positive amount, and a valid date are required',
      })
    }

    const updatedIncome = await Income.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
      },
      { icon, source, amount, date },
      { new: true }
    )

    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income not found' })
    }

    res.status(200).json(updatedIncome)
  } catch (error) {
    next(error)
  }
}
