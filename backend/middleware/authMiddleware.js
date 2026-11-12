const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }

    const user = await User.findById(decoded.id).select('_id').lean()
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' })
    }

    req.user = { id: user._id, _id: user._id }
    next()
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}
