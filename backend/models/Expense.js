const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  icon: { type: String },
  category: { type: String, required: true }, //Category
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true }
)

// Index for optimizing dashboard queries
ExpenseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Expense', ExpenseSchema)