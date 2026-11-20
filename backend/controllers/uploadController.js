const imagekit = require('../config/imageKit')
const User = require('../models/User')

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
}

// Verify magic bytes so a spoofed Content-Type can't smuggle other file types.
const hasValidSignature = (buf, ext) => {
  if (!buf || buf.length < 8) return false
  if (ext === 'png') {
    return buf.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
  }
  return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
}

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  const ext = MIME_TO_EXT[req.file.mimetype]
  if (!ext) {
    return res
      .status(400)
      .json({ message: 'Only .jpeg, .jpg and .png formats are allowed' })
  }

  if (!hasValidSignature(req.file.buffer, ext)) {
    return res.status(400).json({ message: 'Invalid image file' })
  }

  try {
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${req.user.id}_${Date.now()}.${ext}`,
      folder: '/budgee/avatars',
    })

    await User.updateOne(
      { _id: req.user.id },
      { profileImageUrl: result.url }
    )

    res.status(200).json({ imageUrl: result.url })
  } catch (error) {
    console.error('ImageKit Upload Error:', error)
    res.status(500).json({ message: 'Image upload failed' })
  }
}
