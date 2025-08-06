const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Remove the createIndexes function for now - indexes will be created automatically

module.exports = connectDB;