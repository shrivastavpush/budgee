const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

const parsePositiveAmount = (amount) => {
  const value = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}

const parseTransactionDate = (date) => {
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return null
  return value
}

const parsePageLimit = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  const requested = parseInt(query.limit, 10)
  const limit = Math.min(
    Number.isFinite(requested) && requested > 0 ? requested : DEFAULT_LIMIT,
    MAX_LIMIT
  )

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  }
}

module.exports = {
  parsePositiveAmount,
  parseTransactionDate,
  parsePageLimit,
}
