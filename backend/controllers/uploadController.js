const imagekit = require('../config/imageKit');

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const username = req.body.username ? req.body.username.replace(/[^a-zA-Z0-9]/g, "_") : "user";
    const now = new Date();
    const date = String(now.getDate()).padStart(2, '0') + String(now.getMonth() + 1).padStart(2, '0') + now.getFullYear();
    const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');

    // Extract extension (default to .jpg if missing)
    const ext = req.file.originalname.split('.').pop() || 'jpg';
    const customFileName = `${username}_${date}_${time}.${ext}`;

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: customFileName,
      folder: '/budgee/avatars'
    });

    res.status(200).json({ imageUrl: result.url });
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};
