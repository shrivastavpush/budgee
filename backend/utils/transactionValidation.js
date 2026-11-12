const parseAmount = (amount) => {
  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}

const parseDate = (date) => {
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return null
  return value
}

const getUserId = (req, res) => {
  const userId = req.user?.id
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized, user not found' })
    return null
  }
  return userId
}

module.exports = { parseAmount, parseDate, getUserId }
