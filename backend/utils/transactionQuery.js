const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

const parseTransactionDate = (date) => {
  // new Date(null) is the epoch and new Date(true) is 1ms: reject non string/number input.
  if (typeof date !== 'string' && typeof date !== 'number') return null
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
  parseTransactionDate,
  parsePageLimit,
}
