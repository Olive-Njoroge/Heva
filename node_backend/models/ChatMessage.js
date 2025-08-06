const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'anonymous'
  },
  conversationId: {
    type: String,
    required: true
  },
  userMessage: {
    type: String,
    required: true,
    maxLength: 4000  // Fixed: removed 'dx'
  },
  aiResponse: {  // Fixed: was 'aiResposnse'
    type: String,
    required: true
  },
  context: {
    page: String,
    userScore: Number,
    userTier: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
chatMessageSchema.index({ userId: 1, createdAt: -1 });
chatMessageSchema.index({ conversationId: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);