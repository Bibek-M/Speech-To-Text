const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");


router.post("/upload", upload.single("myFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please select a file to upload." });
    }

    res.status(200).json({
      message: "File uploaded successfully!",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error occurred during upload." });
  }
});

module.exports = router;