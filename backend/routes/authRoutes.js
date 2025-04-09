const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
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
router.post("/upload-image", uploadLimiter, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
    }

    const backendUrl = process.env.BACKEND_URL || "https://budgee-backend.onrender.com"

    const imageUrl = `${backendUrl}/uploads/${req.file.filename}`

    res.status(200).json({ imageUrl })
})

module.exports = router