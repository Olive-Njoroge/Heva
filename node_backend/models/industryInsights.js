const mongoose = require('mongoose');

const industryInsightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    enum: ['Fashion', 'Film', 'Music', 'Art', 'Digital Art', 'Performing Arts', 'General']
  },
  trend: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  
  // Content
  content: {
    summary: String,
    details: String,
    sources: [String],
    tags: [String]
  },
  
  // Visibility
  isActive: {
    type: Boolean,
    default: true
  },
  targetTier: {
    type: String,
    enum: ['all', 'Rising Star', 'Emerging Talent', 'Needs Improvement'],
    default: 'all'
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  
  // Admin
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('IndustryInsight', industryInsightSchema);