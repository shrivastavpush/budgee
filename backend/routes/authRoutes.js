const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const { authLimiter, uploadLimiter } = require('../middleware/rateLimiter')
const {
    registerUser,
    loginUser,
    getUserInfo,
} = require('../controllers/authController')

const router = express.Router()

router.post("/register", authLimiter, registerUser)
router.post("/login", authLimiter, loginUser)
router.get("/getUser", protect, getUserInfo)

router.post("/upload-image", uploadLimiter, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
    }

    const backendUrl = process.env.BACKEND_URL || "https://budgee-backend.onrender.com"

    const imageUrl = `${backendUrl}/uploads/${req.file.filename}`

    res.status(200).json({ imageUrl })
})

module.exports = router