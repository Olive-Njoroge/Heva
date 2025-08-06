const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

// Send chat message
router.post('/', sendMessage);

// Get chat history
router.get('/history', getChatHistory);

// Get chat status
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'HEVA Chat Assistant',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;