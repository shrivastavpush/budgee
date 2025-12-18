const multer = require('multer')

// Use memory storage for ImageKit upload
const storage = multer.memoryStorage();

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false)
  }
}

// Limit file size to 2MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
})

module.exports = upload