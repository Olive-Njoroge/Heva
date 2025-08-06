const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heva_credit')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.use(express.json());

// Test importing routes ONE BY ONE
console.log('🔍 Testing routes individually...\n');

// Test 1: Auth Routes
try {
  console.log('📦 Testing authRoutes import...');
  const authRoutes = require('./routes/authRoutes');
  console.log('✅ authRoutes imported successfully');
  
  console.log('🔗 Testing authRoutes mounting...');
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes mounted successfully\n');
} catch (error) {
  console.error('❌ authRoutes error:', error.message);
  console.error('Stack:', error.stack);
}

// Test 2: Admin Routes  
try {
  console.log('📦 Testing adminRoutes import...');
  const adminRoutes = require('./routes/adminRoutes');
  console.log('✅ adminRoutes imported successfully');
  
  console.log('🔗 Testing adminRoutes mounting...');
  app.use('/api/admin', adminRoutes);
  console.log('✅ adminRoutes mounted successfully\n');
} catch (error) {
  console.error('❌ adminRoutes error:', error.message);
  console.error('Stack:', error.stack);
}

// Test 3: Chat Routes
try {
  console.log('📦 Testing chatRoutes import...');
  const chatRoutes = require('./routes/chatRoutes');
  console.log('✅ chatRoutes imported successfully');
  
  console.log('🔗 Testing chatRoutes mounting...');
  app.use('/api/chat', chatRoutes);
  console.log('✅ chatRoutes mounted successfully\n');
} catch (error) {
  console.error('❌ chatRoutes error:', error.message);
  console.error('Stack:', error.stack);
}

app.get('/', (req, res) => {
  res.send('Routes test completed - check console for results');
});

app.listen(3001, () => {
  console.log('🚀 Routes test server running on port 3001');
  console.log('📝 Check the console output above for any route errors');
});