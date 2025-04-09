const rateLimit = require('express-rate-limit');

// Rate limiter for authentication routes (more strict)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count successful attempts too
});

// Rate limiter for database operations
const dbLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 DB operations per minute
    message: 'Too many database operations, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false, // Count failed attempts too
});

// Rate limiter for regular API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for file upload routes
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 uploads per hour
    message: 'Too many upload attempts, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    dbLimiter,
    apiLimiter,
    uploadLimiter
}; 