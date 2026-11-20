const mongoose = require('mongoose')
const { amountField, jsonTransform } = require('../utils/money')

const IncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    icon: { type: String },
    source: { type: String, required: true }, //source of income
    amountCents: amountField, // integer cents; API exposes decimal `amount`
    date: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { transform: jsonTransform } }
)

// Index for optimizing dashboard queries
// amountCents included so dashboard totals/windows are served from the index alone
IncomeSchema.index({ userId: 1, date: -1, amountCents: 1 })

module.exports = mongoose.model('Income', IncomeSchema)
