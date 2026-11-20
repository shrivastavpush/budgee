const isDangerousKey = (key) => key.startsWith('$') || key.includes('.')

/** Strip keys starting with `$` or containing `.` (mongo-sanitize equivalent). */
const sanitize = (value) => {
  if (value == null || typeof value !== 'object') return value

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) value[i] = sanitize(value[i])
    return value
  }

  for (const key of Object.keys(value)) {
    if (isDangerousKey(key)) {
      delete value[key]
      continue
    }
    value[key] = sanitize(value[key])
  }
  return value
}

// Express 5 makes req.query a getter, so we mutate in place instead of reassigning.
const sanitizeRequest = (req, _res, next) => {
  sanitize(req.body)
  sanitize(req.params)
  sanitize(req.query)
  next()
}

module.exports = sanitizeRequest
module.exports.sanitize = sanitize
