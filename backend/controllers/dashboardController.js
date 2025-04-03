const Income = require('../models/Income')
const Expense = require('../models/Expense')
const { isValidObjectId, Types } = require('mongoose')

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

        //Get income transaction in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ data: -1 })

        //Get total income for last 60 days
        const last60DaysTotalIncome = last60DaysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

        //Get expense transaction in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ data: -1 })

        //Get total expense for last 30 days
        const last30DaysTotalExpense = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

        //Fetching last 5 transactions (income + expense)
        const last5Transactions = [
            ...(await Income.find({ userId }).sort({ data: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId }).sort({ data: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            )
        ].sort((a, b) => b.date - a.date) //sorting latest data first

        //final response
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
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
            recentTransactions: last5Transactions,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error })
    }
}