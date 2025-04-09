const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getDashboardData } = require('../controllers/dashboardController')
const { apiLimiter } = require('../middleware/rateLimiter')

const router = express.Router()

router.get('/', apiLimiter, protect, getDashboardData)

module.exports = router