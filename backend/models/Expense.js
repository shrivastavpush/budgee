const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true }
)

// Add compound indexes for frequently queried fields
ExpenseSchema.index({ userId: 1, date: -1 })
ExpenseSchema.index({ userId: 1, amount: -1 })

module.exports = mongoose.model('Expense', ExpenseSchema)