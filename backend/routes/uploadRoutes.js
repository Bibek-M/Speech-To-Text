const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { OpenAI } = require("openai");
const fs = require("fs");

// Initialize Groq client using the OpenAI SDK format
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://groq.com"
});

// Existing Route: File Upload
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

// New Route: Audio Transcription using Groq Whisper
router.post("/transcribe", upload.single("myFile"), async (req, res) => {
  let filePath = req.file ? req.file.path : null;

  try {
    if (!filePath) {
      return res.status(400).json({ error: "Please select an audio file to transcribe." });
    }

    // Send the file stream to Groq's high-speed Whisper instance
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      response_format: "json"
    });

    // Cleanup: Remove the file from local storage after successful processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      message: "Audio transcribed successfully!",
      text: transcription.text,
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
      },
    });
  } catch (error) {
    // Cleanup: Ensure local files aren't abandoned on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Transcription error:", error);
    res.status(500).json({ error: "Server error occurred during transcription." });
  }
});

module.exports = router;