const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Application Details
  requestedAmount: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true,
    enum: ['equipment', 'inventory', 'marketing', 'expansion', 'working_capital', 'other']
  },
  purposeDescription: String,
  
  // Business Info
  businessRevenue: {
    annual: Number,
    monthly: Number
  },
  businessAge: Number, // in months
  employeeCount: Number,
  
  // Application Status
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn'],
    default: 'draft'
  },
  stage: {
    type: String,
    enum: ['documents', 'verification', 'assessment', 'decision', 'completed'],
    default: 'documents'
  },
  
  // Decision Info
  approvedAmount: Number,
  interestRate: Number,
  terms: {
    duration: Number, // in months
    paymentFrequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly']
    }
  },
  
  // Review Info
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  decisionReason: String,
  
  // Required Documents Checklist
  requiredDocuments: {
    bankStatement: { completed: Boolean, documentId: mongoose.Schema.Types.ObjectId },
    taxReturn: { completed: Boolean, documentId: mongoose.Schema.Types.ObjectId },
    businessRegistration: { completed: Boolean, documentId: mongoose.Schema.Types.ObjectId },
    identityVerification: { completed: Boolean, documentId: mongoose.Schema.Types.ObjectId },
    proofOfAddress: { completed: Boolean, documentId: mongoose.Schema.Types.ObjectId }
  },
  
  // Timestamps
  submittedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate application number
applicationSchema.pre('save', async function(next) {
  if (this.isNew && !this.applicationNumber) {
    const count = await mongoose.model('Application').countDocuments();
    this.applicationNumber = `APP-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);