const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📨 ${timestamp} - ${req.method} ${req.path}`);
  next();
});

// Load routes directly - no complex testing
console.log('🔗 Loading routes...');

try {
  console.log('Loading auth routes...');
  app.use('/api/auth', require('./routes/authRoutes'));
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Auth routes error:', error.message);
}

try {
  console.log('Loading admin routes...');
  app.use('/api/admin', require('./routes/adminRoutes'));
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.error('❌ Admin routes error:', error.message);
}

try {
  console.log('Loading chat routes...');
  app.use('/api/chat', require('./routes/chatRoutes'));
  console.log('✅ Chat routes loaded');
} catch (error) {
  console.error('❌ Chat routes error:', error.message);
}

console.log('📊 All routes loaded');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler - should be last
// 404 handler - Ultra-safe version
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    error: `Route ${req.originalUrl} not found`,
    method: req.method,
    availableRoutes: ['/api/auth', '/api/admin', '/api/chat']
  });
});


const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log('\n🚀 =================================');
  console.log('🚀 HEVA Backend Server Started!');
  console.log('🚀 =================================');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log('🚀 =================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed.');
      process.exit(0);
    });
  });
});

module.exports = app;