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

// One aggregation per collection (3 facets) instead of 3, halving round-trips.
const summary = (userId, since, fields, type) => [
  { $match: { userId } },
  {
    $facet: {
      all: [{ $group: { _id: null, total: { $sum: '$amount' } } }],
      windowTotal: [
        { $match: { date: { $gte: since } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ],
      windowTransactions: [
        { $match: { date: { $gte: since } } },
        { $sort: { date: -1 } },
        { $limit: WINDOW_TRANSACTION_LIMIT },
        { $project: fields },
      ],
      recent: [
        { $sort: { date: -1 } },
        { $limit: RECENT_TRANSACTION_LIMIT },
        { $project: { ...fields, type: { $literal: type } } },
      ],
    },
  },
]

const DAY = 24 * 60 * 60 * 1000

exports.getDashboardData = async (req, res) => {
  try {
    const userObjectId = new Types.ObjectId(req.user.id)
    const now = Date.now()

    const [[income = {}], [expense = {}]] = await Promise.all([
      Income.aggregate(
        summary(userObjectId, new Date(now - 60 * DAY), incomeFields, 'income')
      ),
      Expense.aggregate(
        summary(
          userObjectId,
          new Date(now - 30 * DAY),
          expenseFields,
          'expense'
        )
      ),
    ])

    const totalIncome = income.all?.[0]?.total || 0
    const totalExpense = expense.all?.[0]?.total || 0

    const recentTransactions = [
      ...(income.recent || []),
      ...(expense.recent || []),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, RECENT_TRANSACTION_LIMIT)

    res.json({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      last30DaysExpenses: {
        total: expense.windowTotal?.[0]?.total || 0,
        transactions: expense.windowTransactions || [],
      },
      last60DaysIncome: {
        total: income.windowTotal?.[0]?.total || 0,
        transactions: income.windowTransactions || [],
      },
      recentTransactions,
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}
