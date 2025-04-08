const xlsx = require('xlsx')
const Expense = require('../models/Expense')
const mongoose = require('mongoose')
const { sanitize } = require('express-mongo-sanitize')

// add Expense
exports.addExpense = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        // Sanitize request body to prevent NoSQL injection
        sanitize(req.body)
        const { icon, category, amount, date } = req.body

        // Validate required fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Sanitize and validate category
        const sanitizedCategory = category.trim()
        if (sanitizedCategory.length > 50) {
            return res.status(400).json({ message: "Category name too long" });
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

        const newExpense = new Expense({
            userId,
            icon: icon ? icon.trim() : undefined,
            category: sanitizedCategory,
            amount: sanitizedAmount,
            date: sanitizedDate
        })

        await newExpense.save()
        res.status(200).json(newExpense)

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
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
        // Validate userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const expense = await Expense.find({
            userId: new mongoose.Types.ObjectId(userId)
        }).sort({ date: -1 })

        res.json(expense)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// delete Expense
exports.deleteExpense = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        const expenseId = req.params.id

        // Validate expenseId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return res.status(400).json({ message: "Invalid expense ID format" });
        }

        const deletedExpense = await Expense.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(expenseId),
            userId: new mongoose.Types.ObjectId(userId)
        });

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
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

// update expense
exports.updateExpense = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    try {
        // Sanitize request body to prevent NoSQL injection
        sanitize(req.body)
        const { icon, category, amount, date } = req.body
        const expenseId = req.params.id

        // Validate expenseId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return res.status(400).json({ message: "Invalid expense ID format" });
        }

        // Validate required fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Sanitize and validate category
        const sanitizedCategory = category.trim()
        if (sanitizedCategory.length > 50) {
            return res.status(400).json({ message: "Category name too long" });
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

        // Find and update the expense using $set operator
        const updatedExpense = await Expense.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(expenseId),
                userId: new mongoose.Types.ObjectId(userId)
            },
            {
                $set: {
                    icon: icon ? icon.trim() : undefined,
                    category: sanitizedCategory,
                    amount: sanitizedAmount,
                    date: sanitizedDate
                }
            },
            { new: true }
        )

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(updatedExpense)
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server Error" })
    }
}