const Income = require('../models/Income')
const Expense = require('../models/Expense')
const { isValidObjectId, Types } = require('mongoose')
const { clearCache } = require('../config/cache')

//Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id
        const userObjectId = new Types.ObjectId(String(userId))

        //fetching total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
        console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });

        //total expense
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
        console.log("totalExpense", { totalExpense, userId: isValidObjectId(userId) });

        // Prepare response
        const response = {
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: last30DaysTotalExpense,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: last60DaysTotalIncome,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: allRecentTransactions
        }

        res.json(response)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error })
    }
}

// Function to clear dashboard cache when income or expense is modified
exports.clearDashboardCache = (userId) => {
    clearCache('/api/v1/dashboard')
    clearCache(`/api/v1/dashboard/${userId}`)
}