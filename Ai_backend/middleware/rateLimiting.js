const rateLimit = require('express-rate-limit');

/**
 * Rate limiting for chat endpoints
 * More restrictive than general API rate limiting
 */
const chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per minute for chat
  message: {
    success: false,
    error: 'Too many chat messages. Please wait a moment before sending another message.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Skip rate limiting in development mode for testing
    return process.env.NODE_ENV === 'development' && req.ip === '::1';
  }
});

/**
 * Rate limiting for expensive operations
 */
const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per 15 minutes
  message: {
    success: false,
    error: 'Too many requests for this operation. Please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  chatRateLimit,
  strictRateLimit
};