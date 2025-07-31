const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const { validateMessage } = require('../middleware/validation');
const { chatRateLimit } = require('../middleware/rateLimiting');

const router = express.Router();

// POST /api/chat - Send message to Gemini AI
router.post('/', chatRateLimit, validateMessage, sendMessage);

// GET /api/chat/history - Get chat history (optional feature)
router.get('/history', getChatHistory);

// GET /api/chat/status - Check AI service status
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'Gemini AI',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;