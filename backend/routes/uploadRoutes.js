const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const requireAuth = require("../middleware/authMiddleware"); // Path to your auth middleware
const db = require("../config/db"); // Your database connection pool
const { OpenAI } = require("openai");
const fs = require("fs");

// Initialize Groq client using the correct OpenAI SDK format
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://groq.com" // Corrected Groq API endpoint
});

// 1. File Upload Route (Protected)
router.post("/upload", requireAuth, upload.single("myFile"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please select a file to upload." });
    }

    res.status(200).json({
      message: "File uploaded successfully!",
      user_id: req.user.id, // Verified user ID from Supabase JWT
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error); // Passes to your Global Error Handler
  }
});

// 2. Audio Transcription using Groq Whisper & Save to DB (Protected)
router.post("/transcribe", requireAuth, upload.single("myFile"), async (req, res, next) => {
  let filePath = req.file ? req.file.path : null;

  try {
    if (!filePath) {
      return res.status(400).json({ error: "Please select an audio file to transcribe." });
    }

    const userId = req.user.id; // Extracted from Supabase JWT payload

    // Send the file stream to Groq's high-speed Whisper instance
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      response_format: "json"
    });

    // Save transcription to database linked to the authenticated user ID
    const query = `
      INSERT INTO transcriptions (user_id, file_name, transcription_text) 
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [userId, req.file.originalname, transcription.text];
    const dbResult = await db.query(query, values);

    // Cleanup: Remove the file from local storage after successful processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      message: "Audio transcribed and saved successfully!",
      transcription: dbResult.rows[0]
    });

  } catch (error) {
    // Cleanup: Ensure local files aren't abandoned on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Pass API or DB failures to your Global Error Handler
    error.statusCode = error.statusCode || 500;
    next(error);
  }
});

// 3. Fetch Transcriptions for Authenticated User (Protected)
router.get("/transcriptions", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Securely retrieve only rows belonging to the logged-in user
    const query = "SELECT * FROM transcriptions WHERE user_id = $1 ORDER BY created_at DESC;";
    const result = await db.query(query, [userId]);

    res.status(200).json({ 
      success: true,
      count: result.rows.length,
      transcriptions: result.rows 
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
});

module.exports = router;
