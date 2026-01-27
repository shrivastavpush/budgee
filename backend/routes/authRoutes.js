const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
  authLimiter,
  apiLimiter,
  dbLimiter,
  uploadLimiter,
} = require('../middleware/rateLimiter')
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require('../controllers/authController')

const { uploadImage } = require('../controllers/uploadController')

const router = express.Router()

// Auth routes with strict rate limiting and DB operation limiting
router.post('/register', authLimiter, dbLimiter, registerUser)
router.post('/login', authLimiter, dbLimiter, loginUser)

// Protected routes with API rate limiting and DB operation limiting
router.get('/getUser', apiLimiter, dbLimiter, protect, getUserInfo)

// Upload route with upload-specific rate limiting
router.post('/upload-image', uploadLimiter, upload.single('image'), uploadImage)

module.exports = router
