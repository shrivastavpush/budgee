const jwt = require('jsonwebtoken')

// Stateless JWT verification: no DB hit per request. Tokens expire in 10h;
// add a token-version/denylist check here if account deletion/revocation is added.
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
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
    req.user = { id: decoded.id, _id: decoded.id }
    next()
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}
