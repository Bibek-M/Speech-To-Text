const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');
const connectDB = require('./config/db');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', uploadRoutes);

// Initialize the database pool
connectDB();

// Global error handler (including your Multer check)
app.use((err, req, res, next) => {
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({ error: `Multer Error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
