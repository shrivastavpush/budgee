const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
    try {
        // 1) Checking if token exists
        let token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" })
        }

        // 2) Verifyin token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 3) Checking if user still exists
        const user = await User.findById(decoded.id).select('-password')
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" })
        }

        // Granting access to protected route
        req.user = user
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Please login again" })
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired. Please login again" })
        }
        return res.status(401).json({ message: "Not authorized, token failed" })
    }
}