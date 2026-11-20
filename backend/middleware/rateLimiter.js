const rateLimit = require('express-rate-limit')
const { createLimiterStore } = require('../config/redis')

// Uses Redis when REDIS_URL is set (shared across instances), else in-memory.
const base = { standardHeaders: true, legacyHeaders: false }

const make = (name, options) =>
  rateLimit({ ...base, ...options, store: createLimiterStore(name) })

// Brute-force protection: only failed attempts count, keyed by IP.
const authLimiter = make('auth', {
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  message: { message: 'Too many attempts, please try again after 15 minutes' },
})

// General API traffic (dashboard loads fire several calls per page view).
const apiLimiter = make('api', {
  windowMs: 15 * 60 * 1000,
  limit: 600,
  message: { message: 'Too many requests, please try again later' },
})

const uploadLimiter = make('upload', {
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many upload attempts, please try again later' },
})

module.exports = { authLimiter, apiLimiter, uploadLimiter }
