/**
 * Chat Routes
 * Defines API endpoints for chat functionality
 * Integrates middleware for validation, rate limiting, and request handling
 */

const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const { validateMessage } = require('../middleware/validation');
const { chatRateLimit } = require('../middleware/rateLimiting');

const router = express.Router();

/**
 * @route POST /api/chat
 * @desc Send message to Gemini AI
 * @access Public (with rate limiting)
 * @middleware chatRateLimit - Prevents spam/abuse
 * @middleware validateMessage - Validates message format and content
 */
router.post('/', chatRateLimit, validateMessage, sendMessage);

/**
 * @route GET /api/chat/history
 * @desc Get chat history for user or conversation
 * @access Public
 * @param {string} userId - Optional user ID filter
 * @param {string} conversationId - Optional conversation ID filter
 * @param {number} limit - Maximum number of messages to return
 */
router.get('/history', getChatHistory);

/**
 * @route GET /api/chat/status
 * @desc Check AI service status
 * @access Public
 * @returns {Object} Service status and timestamp
 */
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'Gemini AI',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;