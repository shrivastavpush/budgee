const express = require('express')
const {
  protect,
  requireTrustedOrigin,
} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
  authLimiter,
  apiLimiter,
  uploadLimiter,
} = require('../middleware/rateLimiter')
const {
  registerUser,
  loginUser,
  getUserInfo,
  refreshToken,
  logoutUser,
} = require('../controllers/authController')

const { uploadImage } = require('../controllers/uploadController')

const router = express.Router()

// Auth routes with strict rate limiting and DB operation limiting
router.post('/register', authLimiter, registerUser)
router.post('/login', authLimiter, loginUser)

router.post('/refresh', apiLimiter, requireTrustedOrigin, refreshToken)
router.post('/logout', apiLimiter, requireTrustedOrigin, logoutUser)

router.get('/getUser', apiLimiter, protect, getUserInfo)

// Upload route with upload-specific rate limiting
router.post(
  '/upload-image',
  protect,
  uploadLimiter,
  upload.single('image'),
  uploadImage
)

module.exports = router
