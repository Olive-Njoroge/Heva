const mongoose = require('mongoose');

const creditHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 300,
    max: 850
  },
  previousScore: Number,
  change: Number, // +/- from previous score
  tier: {
    type: String,
    enum: ['Rising Star', 'Emerging Talent', 'Needs Improvement'],
    required: true
  },
  
  // Score Breakdown
  factors: {
    paymentHistory: Number,
    creditUtilization: Number,
    lengthOfHistory: Number,
    creditMix: Number,
    newCredit: Number,
    industryFactors: Number
  },
  
  // Reason for change
  reason: String,
  triggeredBy: {
    type: String,
    enum: ['document_upload', 'payment_update', 'manual_adjustment', 'periodic_review']
  },
  
  // Admin notes
  notes: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CreditHistory', creditHistorySchema);