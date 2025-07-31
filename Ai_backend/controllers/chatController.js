const { callGeminiAPI } = require('../services/geminiService');
const { logChatInteraction } = require('../utils/logger');

// Store chat history in memory (use database in production)
let chatHistory = [];

/**
 * Send message to Gemini AI and return response
 */
const sendMessage = async (req, res) => {
  try {
    const { message, userId = 'anonymous', conversationId = null } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    console.log(`📨 Received message from ${clientIP}: "${message.substring(0, 50)}..."`);

    // Call Gemini AI service
    const aiResponse = await callGeminiAPI(message);

    // Create chat interaction object
    const chatInteraction = {
      id: Date.now().toString(),
      userId,
      conversationId,
      userMessage: message,
      aiResponse,
      timestamp: new Date().toISOString(),
      clientIP
    };

    // Store in memory (replace with database in production)
    chatHistory.push(chatInteraction);

    // Keep only last 1000 interactions to prevent memory issues
    if (chatHistory.length > 1000) {
      chatHistory = chatHistory.slice(-1000);
    }

    // Log interaction
    logChatInteraction(chatInteraction);

    // Send response
    res.json({
      success: true,
      response: aiResponse,
      conversationId: conversationId || chatInteraction.id,
      timestamp: chatInteraction.timestamp
    });

  } catch (error) {
    console.error('❌ Chat controller error:', error.message);
    
    // Send user-friendly error response
    res.status(500).json({
      success: false,
      error: 'I apologize, but I encountered an error processing your request. Please try again in a moment.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get chat history for a user or conversation
 */
const getChatHistory = async (req, res) => {
  try {
    const { userId, conversationId, limit = 50 } = req.query;
    
    let filteredHistory = chatHistory;

    // Filter by userId if provided
    if (userId) {
      filteredHistory = filteredHistory.filter(chat => chat.userId === userId);
    }

    // Filter by conversationId if provided
    if (conversationId) {
      filteredHistory = filteredHistory.filter(chat => chat.conversationId === conversationId);
    }

    // Limit results
    const limitedHistory = filteredHistory
      .slice(-parseInt(limit))
      .map(chat => ({
        id: chat.id,
        userMessage: chat.userMessage,
        aiResponse: chat.aiResponse,
        timestamp: chat.timestamp,
        conversationId: chat.conversationId
      }));

    res.json({
      success: true,
      history: limitedHistory,
      count: limitedHistory.length,
      total: filteredHistory.length
    });

  } catch (error) {
    console.error('❌ Get chat history error:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory
};