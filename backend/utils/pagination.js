const getPagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  const requestedLimit = parseInt(query.limit, 10)
  const limit = Math.min(
    Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 20, 1),
    100
  )
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

module.exports = { getPagination }
