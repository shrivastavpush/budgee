const xlsx = require('xlsx')
const Income = require('../models/Income')
const { clearCache } = require('../config/cache')
const { clearDashboardCache } = require('./dashboardController')

// add income
exports.addIncome = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        const { icon, source, amount, date } = req.body

        //checking for missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        })

        await newIncome.save()

        // Clear cache for income routes and dashboard
        clearCache('/api/v1/income')
        clearCache(`/api/v1/income/${userId}`)
        clearDashboardCache(userId)

        res.status(200).json(newIncome)

    } catch (error) {
        // console.error("Error adding income:", error);
        res.status(500).json({ message: "Server Error" })
    }
}

// get all income
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        const income = await Income.find({ userId }).sort({ date: -1 })
        res.json(income)

    } catch (error) {
        // console.error("Error adding income:", error);
        res.status(500).json({ message: "Server Error" })
    }
}

// delete income
exports.deleteIncome = async (req, res) => {
    // const userId = req.user.id
    // if (!userId) {
    //     return res.status(401).json({ message: "Unauthorized, user not found" });
    // }

    try {
        const income = await Income.findById(req.params.id)
        if (!income) {
            return res.status(404).json({ message: "Income not found" })
        }

        await Income.findByIdAndDelete(req.params.id)

        // Clear cache for income routes and dashboard
        clearCache('/api/v1/income')
        clearCache(`/api/v1/income/${income.userId}`)
        clearDashboardCache(income.userId)

        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        // console.error("Error adding income:", error);
        res.status(500).json({ message: "Server Error" })
    }
}

// downlaod excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    try {
        const income = await Income.find({ userId }).sort({ date: -1 })

        //Preparing data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }))

        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(data)

        xlsx.utils.book_append_sheet(wb, ws, 'Income')
        xlsx.writeFile(wb, 'income_details.xlsx')
        res.download('income_details.xlsx')
    } catch (error) {
        // console.error("Error adding income:", error);
        res.status(500).json({ message: "Server Error" })
    }
}