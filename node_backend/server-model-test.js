const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heva_credit')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.use(express.json());

// Test importing models ONE BY ONE
try {
  console.log('📦 Testing User model...');
  const User = require('./models/User');
  console.log('✅ User model loaded successfully');
} catch (error) {
  console.error('❌ User model error:', error.message);
}

try {
  console.log('📦 Testing ChatMessage model...');
  const ChatMessage = require('./models/ChatMessage');
  console.log('✅ ChatMessage model loaded successfully');
} catch (error) {
  console.error('❌ ChatMessage model error:', error.message);
}

// Add more models here as needed...

try {
  console.log('🔒 Testing auth middleware...');
  const { authenticateToken } = require('./middleware/auth');
  console.log('✅ Auth middleware loaded successfully');
} catch (error) {
  console.error('❌ Auth middleware error:', error.message);
}

app.get('/', (req, res) => {
  res.send('Server with models test working!');
});

app.listen(3001, () => {
  console.log('🚀 Server with models test running on port 3001');
});