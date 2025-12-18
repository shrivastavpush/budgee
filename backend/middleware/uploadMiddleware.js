const multer = require('multer')
const sanitize = require('sanitize-filename');

//Configuring the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Get user name from req.user (populated by authMiddleware)
    let userName = req.user && req.user.fullName ? req.user.fullName : "user";
    userName = sanitize(userName).replace(/\s+/g, '_');
    const timeOfUpload = Date.now();
    const safeName = sanitize(file.originalname).replace(/\s+/g, '_');
    cb(null, `${userName}_${timeOfUpload}_${safeName}`);
  },
})

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