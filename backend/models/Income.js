const mongoose = require('mongoose')

const IncomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    icon: { type: String },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true }
)

// Add compound indexes for frequently queried fields
IncomeSchema.index({ userId: 1, date: -1 })
IncomeSchema.index({ userId: 1, amount: -1 })

module.exports = mongoose.model('Income', IncomeSchema)