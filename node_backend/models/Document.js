const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: String,
  category: {
    type: String,
    required: true,
    enum: ['financial', 'legal', 'portfolio', 'references', 'identity', 'address', 'tax', 'business']
  },
  type: {
    type: String,
    required: true,
    enum: ['PDF', 'JPG', 'JPEG', 'PNG', 'DOC', 'DOCX', 'ZIP', 'TXT']
  },
  size: {
    type: Number, // in bytes
    required: true
  },
  sizeFormatted: String, // "1.2 MB"
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending'
  },
  required: {
    type: Boolean,
    default: false
  },
  description: String,
  filePath: String, // path to stored file
  fileUrl: String, // URL to access file
  
  // Verification Info
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  rejectionReason: String,
  expiryDate: Date,
  
  // Metadata
  metadata: {
    uploadIP: String,
    userAgent: String,
    checksum: String
  },
  
  uploadDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
documentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Document', documentSchema);