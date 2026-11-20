// Amounts are stored as integer cents (field `amountCents`) to avoid float drift
// in sums. The API still speaks decimal `amount`, so clients are unaffected.
const MAX_AMOUNT = 1e12
// App is INR-only for now; all amounts are rupees (decimal) / paise (integer cents).
const CURRENCY = 'INR'
// Excel number format with lakh/crore grouping, e.g. 12,34,567.50
const INR_EXCEL_FORMAT =
  '[>=10000000]"₹"##\\,##\\,##\\,##0.00;[>=100000]"₹"##\\,##\\,##0.00;"₹"##,##0.00'

const toCents = (amount) => {
  const value = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(value) || value <= 0 || value > MAX_AMOUNT) return null
  const cents = Math.round(value * 100)
  return cents > 0 ? cents : null
}

const fromCents = (cents) => (cents || 0) / 100

// Plain-object transform for lean() results and toJSON.
const serializeTransaction = (doc) => {
  const { amountCents, ...rest } = doc
  return { ...rest, amount: fromCents(amountCents), currency: CURRENCY }
}

const amountField = {
  type: Number,
  required: true,
  min: 1,
  validate: {
    validator: Number.isInteger,
    message: 'amountCents must be an integer',
  },
}

const jsonTransform = (_doc, ret) => serializeTransaction(ret)

module.exports = {
  CURRENCY,
  INR_EXCEL_FORMAT,
  toCents,
  fromCents,
  serializeTransaction,
  amountField,
  jsonTransform,
}
