const geminiService = require('../services/geminiService');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for conversation history (replace with database in production)
const conversationHistory = new Map();

/**
 * Send message to Gemini AI and return response
 */
const sendMessage = async (req, res) => {
  try {
    const { message, userId = 'anonymous', conversationId } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Trim message and check length
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long. Please keep it under 1000 characters.'
      });
    }

    // Generate or use existing conversation ID
    const currentConversationId = conversationId || uuidv4();

    // Get conversation history for this conversation
    const history = conversationHistory.get(currentConversationId) || [];

    console.log(`💬 Processing message from user ${userId}: "${trimmedMessage.substring(0, 50)}..."`);

    // Generate AI response using the enhanced service
    const aiResponse = await geminiService.generateResponse(trimmedMessage, history);

    if (!aiResponse.success) {
      console.error('❌ AI response failed:', aiResponse.error);
      return res.status(500).json({
        success: false,
        error: aiResponse.error || 'Failed to generate response',
        details: aiResponse.details
      });
    }

    // Create conversation entry
    const conversationEntry = {
      id: uuidv4(),
      userMessage: trimmedMessage,
      aiResponse: aiResponse.response,
      timestamp: new Date().toISOString(),
      userId
    };

    // Add to conversation history
    history.push(conversationEntry);
    
    // Keep only last 10 messages per conversation to manage memory
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
    
    conversationHistory.set(currentConversationId, history);

    console.log('✅ AI response generated successfully');

    // Send successful response
    res.json({
      success: true,
      response: aiResponse.response,
      conversationId: currentConversationId,
      timestamp: aiResponse.timestamp || new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Chat controller error:', error);
    
    // Handle specific error types
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        error: 'Request timed out. Please try again with a shorter message.',
        details: 'Timeout error'
      });
    }

    if (error.code === 'ENOTFOUND' || error.message.includes('network')) {
      return res.status(503).json({
        success: false,
        error: 'AI service is temporarily unavailable. Please try again later.',
        details: 'Network error'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'I apologize, but I encountered an error processing your request. Please try again.',
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

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }

    // Get conversation history
    const history = conversationHistory.get(conversationId) || [];
    
    // Filter by userId if provided
    const filteredHistory = userId 
      ? history.filter(entry => entry.userId === userId)
      : history;

    // Apply limit
    const limitedHistory = filteredHistory.slice(-parseInt(limit));

    // Format response
    const formattedHistory = limitedHistory.map(entry => ({
      id: entry.id,
      userMessage: entry.userMessage,
      aiResponse: entry.aiResponse,
      timestamp: entry.timestamp,
      conversationId: conversationId
    }));

    res.json({
      success: true,
      history: formattedHistory,
      count: formattedHistory.length,
      total: filteredHistory.length
    });

  } catch (error) {
    console.error('❌ Get chat history error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get chat service status
 */
const getStatus = async (req, res) => {
  try {
    const healthCheck = await geminiService.checkHealth();
    
    res.json({
      ...healthCheck,
      endpoint: 'chat',
      activeConversations: conversationHistory.size,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Status check error:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      service: 'Chat Service',
      error: error.message,
      endpoint: 'chat',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Clear conversation history (admin only)
 */
const clearHistory = async (req, res) => {
  try {
    const { conversationId, all = false } = req.body;

    if (all === true) {
      conversationHistory.clear();
      console.log('🗑️ All conversation history cleared');
      res.json({
        success: true,
        message: 'All conversation history cleared'
      });
    } else if (conversationId) {
      conversationHistory.delete(conversationId);
      console.log(`🗑️ Conversation ${conversationId} history cleared`);
      res.json({
        success: true,
        message: `Conversation ${conversationId} history cleared`
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Either conversationId or all=true is required'
      });
    }

  } catch (error) {
    console.error('❌ Clear history error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to clear history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get conversation statistics
 */
const getStats = async (req, res) => {
  try {
    let totalMessages = 0;
    const conversationStats = [];

    for (const [conversationId, history] of conversationHistory.entries()) {
      totalMessages += history.length;
      conversationStats.push({
        conversationId,
        messageCount: history.length,
        lastActivity: history[history.length - 1]?.timestamp,
        participants: [...new Set(history.map(msg => msg.userId))]
      });
    }

    res.json({
      success: true,
      stats: {
        totalConversations: conversationHistory.size,
        totalMessages,
        averageMessagesPerConversation: conversationHistory.size > 0 ? totalMessages / conversationHistory.size : 0,
        conversations: conversationStats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get stats error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getStatus,
  clearHistory,
  getStats
};