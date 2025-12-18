const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const imagekit = require('../config/imageKit')
const { authLimiter, apiLimiter, dbLimiter, uploadLimiter } = require('../middleware/rateLimiter')
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require('../controllers/authController')

const router = express.Router()

// Auth routes with strict rate limiting and DB operation limiting
router.post("/register", authLimiter, dbLimiter, registerUser)
router.post("/login", authLimiter, dbLimiter, loginUser)

// Protected routes with API rate limiting and DB operation limiting
router.get("/getUser", apiLimiter, dbLimiter, protect, getUserInfo)

// Upload route with upload-specific rate limiting
router.post("/upload-image", uploadLimiter, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  try {
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: '/budgee/avatars'
    });

    res.status(200).json({ imageUrl: result.url });
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
})

module.exports = router