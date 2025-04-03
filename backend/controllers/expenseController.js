const xlsx = require('xlsx')
const Expense = require('../models/Expense')
const { clearCache } = require('../config/cache')
const { clearDashboardCache } = require('./dashboardController')

// add Expense
exports.addExpense = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        const { icon, category, amount, date } = req.body

        //checking for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        })

        await newExpense.save()

        // Clear cache for expense routes and dashboard
        clearCache('/api/v1/expense')
        clearCache(`/api/v1/expense/${userId}`)
        clearDashboardCache(userId)

        res.status(200).json(newExpense)

    } catch (error) {
        // console.error("Error adding Expense:", error);
        res.status(500).json({ message: "Server Error" })
    }
}

// get all Expense
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 })
        res.json(expense)

    } catch (error) {
        // console.error("Error adding Expense:", error);
        res.status(500).json({ message: "Server Error" })
    }
}

// delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id)
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" })
        }

        await Expense.findByIdAndDelete(req.params.id)

        // Clear cache for expense routes and dashboard
        clearCache('/api/v1/expense')
        clearCache(`/api/v1/expense/${expense.userId}`)
        clearDashboardCache(expense.userId)

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        // console.error("Error adding Expense:", error);
        res.status(500).json({ message: "Server Error" })
    }
}

// downlaod excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 })

        //Preparing data for Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }))

        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(data)

        xlsx.utils.book_append_sheet(wb, ws, 'Expense')
        xlsx.writeFile(wb, 'expense_details.xlsx')
        res.download('expense_details.xlsx')
    } catch (error) {
        // console.error("Error adding Expense:", error);
        res.status(500).json({ message: "Server Error" })
    }
}