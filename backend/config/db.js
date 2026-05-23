const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error('Error: MONGODB_URI is missing in .env file');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      maxPoolSize: 10,     
      minPoolSize: 2,      
      socketTimeoutMS: 45000, 
    });
    console.log('MongoDB connected successfully with connection pooling.');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); 
  }
};


mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection lost. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB driver error: ${err}`);
});

module.exports = connectDB;
