const multer = require('multer')
const path = require('path')

// Configuring the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, `${uniqueSuffix}${ext}`)
    },
})

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const maxSize = 5 * 1024 * 1024 // 5MB

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false)
        return
    }

    // Check file size
    if (file.size > maxSize) {
        cb(new Error("File size must be less than 5MB"), false)
        return
    }

    cb(null, true)
}

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

module.exports = upload