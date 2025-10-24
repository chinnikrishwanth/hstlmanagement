const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Prioritize local MongoDB over Atlas
    const mongoURI = process.env.MONGOLINK && process.env.MONGOLINK.includes('localhost') 
      ? process.env.MONGOLINK 
      : 'mongodb://localhost:27017/hostel_management';
    
    console.log('Attempting to connect to MongoDB...');
    console.log('Using URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      bufferCommands: false // Disable mongoose buffering
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Falling back to demo mode (in-memory storage)');
    // Don't exit, let the server run in demo mode
  }
};

module.exports = connectDB;
