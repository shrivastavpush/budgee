const xlsx = require('xlsx')
const Income = require('../models/Income')
const mongoose = require('mongoose')
const { sanitize } = require('express-mongo-sanitize')

// add income
exports.addIncome = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        // Sanitize request body to prevent NoSQL injection
        sanitize(req.body)
        const { icon, source, amount, date } = req.body

        // Validate required fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Sanitize and validate source
        const sanitizedSource = source.trim()
        if (sanitizedSource.length > 50) {
            return res.status(400).json({ message: "Source name too long" });
        }

        // Sanitize and validate amount
        const sanitizedAmount = parseFloat(amount);
        if (isNaN(sanitizedAmount) || sanitizedAmount <= 0 || sanitizedAmount > 1000000) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Sanitize date
        const sanitizedDate = new Date(date);
        if (isNaN(sanitizedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // Validate date is not in the future
        const currentDate = new Date();
        if (sanitizedDate > currentDate) {
            return res.status(400).json({ message: "Date cannot be in the future" });
        }

        const newIncome = new Income({
            userId,
            icon: icon ? icon.trim() : undefined,
            source: sanitizedSource,
            amount: sanitizedAmount,
            date: sanitizedDate
        })

        await newIncome.save()
        res.status(200).json(newIncome)

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
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
        // Validate userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const income = await Income.find({
            userId: new mongoose.Types.ObjectId(userId)
        }).sort({ date: -1 })

        res.json(income)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// delete income
exports.deleteIncome = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        const incomeId = req.params.id

        // Validate incomeId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(incomeId)) {
            return res.status(400).json({ message: "Invalid income ID format" });
        }

        const deletedIncome = await Income.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(incomeId),
            userId: new mongoose.Types.ObjectId(userId)
        });

        if (!deletedIncome) {
            return res.status(404).json({ message: "Income not found" });
        }

        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// download excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    try {
        // Validate userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const income = await Income.find({
            userId: new mongoose.Types.ObjectId(userId)
        }).sort({ date: -1 })

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
        res.status(500).json({ message: "Server Error" })
    }
}

// update income
exports.updateIncome = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        // Sanitize request body to prevent NoSQL injection
        sanitize(req.body)
        const { icon, source, amount, date } = req.body
        const incomeId = req.params.id

        // Validate incomeId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(incomeId)) {
            return res.status(400).json({ message: "Invalid income ID format" });
        }

        // Validate required fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Sanitize and validate source
        const sanitizedSource = source.trim()
        if (sanitizedSource.length > 50) {
            return res.status(400).json({ message: "Source name too long" });
        }

        // Sanitize and validate amount
        const sanitizedAmount = parseFloat(amount);
        if (isNaN(sanitizedAmount) || sanitizedAmount <= 0 || sanitizedAmount > 1000000) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Sanitize date
        const sanitizedDate = new Date(date);
        if (isNaN(sanitizedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // Validate date is not in the future
        const currentDate = new Date();
        if (sanitizedDate > currentDate) {
            return res.status(400).json({ message: "Date cannot be in the future" });
        }

        // Find and update the income using $set operator
        const updatedIncome = await Income.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(incomeId),
                userId: new mongoose.Types.ObjectId(userId)
            },
            {
                $set: {
                    icon: icon ? icon.trim() : undefined,
                    source: sanitizedSource,
                    amount: sanitizedAmount,
                    date: sanitizedDate
                }
            },
            { new: true }
        )

        if (!updatedIncome) {
            return res.status(404).json({ message: "Income not found" });
        }

        res.status(200).json(updatedIncome)
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server Error" })
    }
}