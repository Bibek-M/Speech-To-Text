const express = require("express");
const multer = require("multer"); 
const uploadRoutes = require("./routes/uploadRoutes");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  // 1. Handle Multer-specific limits (e.g., file too large)
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File is too large. Maximum limit is 5MB." });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  // 2. Handle Custom File Validation or API Errors
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "An unexpected server error occurred.";

  // Log the complete error server-side for debugging
  console.error(`[Error] ${statusCode}: ${errorMessage}`);

  return res.status(statusCode).json({
    success: false,
    error: errorMessage
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

