const sanitize = require('mongo-sanitize')

// Express 5 makes req.query a getter, so we mutate in place instead of reassigning.
const sanitizeRequest = (req, _res, next) => {
  sanitize(req.body)
  sanitize(req.params)
  sanitize(req.query)
  next()
}

module.exports = sanitizeRequest
module.exports.sanitize = sanitize
