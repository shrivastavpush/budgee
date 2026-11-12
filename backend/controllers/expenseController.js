const xlsx = require('xlsx')
const mongoose = require('mongoose')
const Expense = require('../models/Expense')
const {
  parsePositiveAmount,
  parseTransactionDate,
  parsePageLimit,
} = require('../utils/transactionQuery')

exports.addExpense = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  try {
    const category =
      typeof req.body.category === 'string' ? req.body.category.trim() : ''
    const amount = parsePositiveAmount(req.body.amount)
    const date = parseTransactionDate(req.body.date)
    const icon = typeof req.body.icon === 'string' ? req.body.icon : ''

    if (!category || amount == null || !date) {
      return res.status(400).json({
        message: 'Category, a positive amount, and a valid date are required',
      })
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date,
    })

    await newExpense.save()
    res.status(201).json(newExpense)
  } catch (error) {
    next(error)
  }
}

exports.getAllExpense = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  try {
    const { page, limit, skip } = parsePageLimit(req.query)
    const filter = { userId }

    const [expense, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Expense.countDocuments(filter),
    ])

    res.json({
      data: expense,
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

exports.deleteExpense = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Expense not found' })
  }

  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId,
    })

    if (!deletedExpense) {
      return res
        .status(404)
        .json({ message: 'Expense not found or unauthorized access' })
    }

    res.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    next(error)
  }
}

exports.downloadExpenseExcel = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 })

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }))

    const wb = xlsx.utils.book_new()
    const ws = xlsx.utils.json_to_sheet(data)
    xlsx.utils.book_append_sheet(wb, ws, 'Expense')

    const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="expense_details.xlsx"'
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

exports.updateExpense = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' })
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Expense not found' })
  }

  try {
    const category =
      typeof req.body.category === 'string' ? req.body.category.trim() : ''
    const amount = parsePositiveAmount(req.body.amount)
    const date = parseTransactionDate(req.body.date)
    const icon = typeof req.body.icon === 'string' ? req.body.icon : ''

    if (!category || amount == null || !date) {
      return res.status(400).json({
        message: 'Category, a positive amount, and a valid date are required',
      })
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
      },
      { icon, category, amount, date },
      { new: true }
    )

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.status(200).json(updatedExpense)
  } catch (error) {
    next(error)
  }
}
