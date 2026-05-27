const mongoose = require("mongoose");

const transcriptionSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  text: {
    type: String,
    required: true,
    default: "Processing transcription...",
  },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transcription", transcriptionSchema);
