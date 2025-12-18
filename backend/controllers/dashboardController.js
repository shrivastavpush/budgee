const Income = require('../models/Income')
const Expense = require('../models/Expense')
const { isValidObjectId, Types } = require('mongoose')

//Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id
    const userObjectId = new Types.ObjectId(userId)

    // Calculate date ranges
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Use Promise.all to run queries in parallel
    const [
      totalIncome,
      totalExpense,
      last60DaysIncome,
      last30DaysExpense,
      recentTransactions
    ] = await Promise.all([
      // Get total income
      Income.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),

      // Get total expense
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),

      // Get last 60 days income with aggregation
      Income.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: sixtyDaysAgo }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            transactions: { $push: '$$ROOT' }
          }
        }
      ]),

      // Get last 30 days expense with aggregation
      Expense.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            transactions: { $push: '$$ROOT' }
          }
        }
      ]),

      // Get recent transactions using aggregation
      Income.aggregate([
        { $match: { userId: userObjectId } },
        { $sort: { date: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 1,
            source: 1,
            amount: 1,
            date: 1,
            icon: 1,
            type: { $literal: 'income' }
          }
        }
      ])
    ])

    // Get recent expenses and combine with income
    const recentExpenses = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $sort: { date: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          category: 1,
          amount: 1,
          date: 1,
          icon: 1,
          type: { $literal: 'expense' }
        }
      }
    ])

    // Combine and sort recent transactions
    const allRecentTransactions = [...recentTransactions, ...recentExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    // Prepare response
    res.json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: last30DaysExpense[0]?.total || 0,
        transactions: last30DaysExpense[0]?.transactions || []
      },
      last60DaysIncome: {
        total: last60DaysIncome[0]?.total || 0,
        transactions: last60DaysIncome[0]?.transactions || []
      },
      recentTransactions: allRecentTransactions
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    res.status(500).json({ message: 'Server Error', error })
  }
}