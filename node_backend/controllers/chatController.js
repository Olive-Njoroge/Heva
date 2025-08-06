const ChatMessage = require('../models/ChatMessage');

const sendMessage = async (req, res) => {
  try {
    console.log('💬 Chat message received:', req.body);
    
    const { message, userId = 'anonymous', conversationId, context } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Basic credit-related keyword check
    const creditKeywords = ['credit', 'score', 'loan', 'finance', 'payment', 'debt', 'rating', 'application', 'hello', 'hi', 'help'];
    const isCreditRelated = creditKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    let aiResponse;
    
    if (!isCreditRelated) {
      aiResponse = "I'm a credit scoring assistant. I can only help with questions about credit scores, loan applications, financial assessments, and credit decisioning. Please ask me something related to credit or finance.";
    } else {
      // Generate contextual response based on message content
      aiResponse = generateAIResponse(message, context);
    }

    // Save to database
    const chatMessage = new ChatMessage({
      userId: userId !== 'anonymous' ? userId : 'anonymous',
      conversationId: conversationId || `conv_${Date.now()}`,
      userMessage: message.trim(),
      aiResponse,
      context: {
        page: context?.page || 'unknown',
        userScore: context?.userScore,
        userTier: context?.userTier
      }
    });

    const savedMessage = await chatMessage.save();
    console.log('💾 Chat message saved:', savedMessage._id);

    res.json({
      success: true,
      response: aiResponse,
      conversationId: savedMessage.conversationId,
      messageId: savedMessage._id,
      timestamp: savedMessage.timestamp
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;
    
    console.log('📚 Fetching chat history for user:', userId);

    let query = {};
    if (userId && userId !== 'anonymous') {
      query.userId = userId;
    }

    const history = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();

    const formattedHistory = history.map(msg => ({
      id: msg._id,
      userMessage: msg.userMessage,
      aiResponse: msg.aiResponse,
      timestamp: msg.timestamp,
      conversationId: msg.conversationId
    }));

    console.log(`📋 Found ${history.length} chat messages`);

    res.json({
      success: true,
      history: formattedHistory.reverse(), // Show oldest first
      count: history.length
    });

  } catch (error) {
    console.error('❌ Chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history'
    });
  }
};

// Generate AI response based on message content
function generateAIResponse(message, context = {}) {
  const lowerMessage = message.toLowerCase();
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm your HEVA AI assistant. I'm here to help you with your credit score and loan application questions. How can I assist you today?";
  }
  
  // Credit score related
  if (lowerMessage.includes('credit') && lowerMessage.includes('score')) {
    const userScore = context.userScore;
    if (userScore) {
      return `Based on your current credit score of ${userScore}, you're in the "${context.userTier}" tier. This affects your loan eligibility and interest rates. Would you like tips on improving your score?`;
    }
    return "Your credit score is a crucial factor in loan approvals. It ranges from 300-850, with higher scores getting better terms. I can help you understand how to improve it!";
  }
  
  // Loan application
  if (lowerMessage.includes('loan') || lowerMessage.includes('apply')) {
    return "I can guide you through the loan application process! You'll need to provide business information, financial statements, and undergo our credit assessment. Would you like me to explain the requirements?";
  }
  
  // Document questions
  if (lowerMessage.includes('document') || lowerMessage.includes('upload')) {
    return "For your loan application, you'll typically need: business registration, financial statements, bank statements, and ID verification. I can help you understand what specific documents are required.";
  }
  
  // Help requests
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help! I can assist with:\n• Credit score explanations\n• Loan application guidance\n• Document requirements\n• Financial assessment tips\n\nWhat would you like to know more about?";
  }
  
  // Default credit-related response
  return "Thank you for your question about credit and finance. I'm here to help you understand credit scoring, loan applications, and improve your financial profile. Could you be more specific about what you'd like to know?";
}

module.exports = {
  sendMessage,
  getChatHistory
};