const Income = require('../models/Income')
const Expense = require('../models/Expense')
const { Types } = require('mongoose')

const WINDOW_TRANSACTION_LIMIT = 10
const RECENT_TRANSACTION_LIMIT = 5

const incomeFields = {
  _id: 1,
  source: 1,
  amount: 1,
  date: 1,
  icon: 1,
}

const expenseFields = {
  _id: 1,
  category: 1,
  amount: 1,
  date: 1,
  icon: 1,
}

const windowSummary = (match, fields) => [
  { $match: match },
  {
    $facet: {
      totals: [{ $group: { _id: null, total: { $sum: '$amount' } } }],
      transactions: [
        { $sort: { date: -1 } },
        { $limit: WINDOW_TRANSACTION_LIMIT },
        { $project: fields },
      ],
    },
  },
]

exports.getDashboardData = async (req, res) => {
  try {
    const userObjectId = new Types.ObjectId(req.user.id)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalIncome,
      totalExpense,
      last60DaysIncome,
      last30DaysExpense,
      recentIncome,
      recentExpenses,
    ] = await Promise.all([
      Income.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Income.aggregate(
        windowSummary(
          { userId: userObjectId, date: { $gte: sixtyDaysAgo } },
          incomeFields
        )
      ),
      Expense.aggregate(
        windowSummary(
          { userId: userObjectId, date: { $gte: thirtyDaysAgo } },
          expenseFields
        )
      ),
      Income.aggregate([
        { $match: { userId: userObjectId } },
        { $sort: { date: -1 } },
        { $limit: RECENT_TRANSACTION_LIMIT },
        {
          $project: {
            ...incomeFields,
            type: { $literal: 'income' },
          },
        },
      ]),
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $sort: { date: -1 } },
        { $limit: RECENT_TRANSACTION_LIMIT },
        {
          $project: {
            ...expenseFields,
            type: { $literal: 'expense' },
          },
        },
      ]),
    ])

    const recentTransactions = [...recentIncome, ...recentExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, RECENT_TRANSACTION_LIMIT)

    const incomeWindow = last60DaysIncome[0] || {}
    const expenseWindow = last30DaysExpense[0] || {}

    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expenseWindow.totals?.[0]?.total || 0,
        transactions: expenseWindow.transactions || [],
      },
      last60DaysIncome: {
        total: incomeWindow.totals?.[0]?.total || 0,
        transactions: incomeWindow.transactions || [],
      },
      recentTransactions,
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}
