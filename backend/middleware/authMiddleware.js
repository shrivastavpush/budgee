const jwt = require('jsonwebtoken')
const { allowedOrigins } = require('../config/origins')

// Stateless JWT verification: no DB hit per request. Access tokens last 15m;
// revocation/deleted users are enforced at refresh time (/auth/refresh).
exports.protect = (req, res, next) => {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    })
    if (!decoded?.id || decoded.typ === 'refresh') {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
    req.user = { id: decoded.id, _id: decoded.id }
    next()
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

// CSRF defence for cookie-authenticated endpoints: browsers always send Origin
// on cross-site POSTs, so reject any that isn't on the allowlist.
exports.requireTrustedOrigin = (req, res, next) => {
  const origin = req.headers.origin
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'Untrusted origin' })
  }
  next()
}
