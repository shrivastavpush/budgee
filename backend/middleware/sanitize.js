const isDangerousKey = (key) => key.startsWith('$') || key.includes('.')

const sanitizeObject = (value) => {
  if (!value || typeof value !== 'object') return

  if (Array.isArray(value)) {
    value.forEach(sanitizeObject)
    return
  }

  for (const key of Object.keys(value)) {
    if (isDangerousKey(key)) {
      delete value[key]
      continue
    }
    sanitizeObject(value[key])
  }
}

// Express 5 makes req.query a getter, so we mutate in place instead of reassigning.
const sanitizeRequest = (req, _res, next) => {
  sanitizeObject(req.body)
  sanitizeObject(req.params)
  sanitizeObject(req.query)
  next()
}

module.exports = sanitizeRequest
