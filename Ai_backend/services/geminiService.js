const axios = require('axios');

/**
 * Enhanced Gemini Service for HEVA Credit Scoring AI
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.apiUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
  }

  /**
   * Generate enhanced system prompt for credit scoring assistant
   */
  getSystemPrompt() {
    return `You are HEVA AI, a specialized credit scoring and financial assessment assistant for creative professionals in industries like fashion, film, music, digital art, and performing arts.

Your expertise includes:
- Credit score analysis and improvement strategies
- Loan applications and approval processes for creatives
- Financial assessments for creative businesses with irregular income
- Risk evaluation for non-traditional income sources
- Portfolio-based lending for creative assets
- Industry-specific financial advice for artists and creators
- Credit decisioning and underwriting processes
- Financial planning for freelancers and gig workers
- Business credit for creative ventures
- Alternative credit scoring methods for creatives

You can help with questions about:
✅ Credit scores, credit reports, credit history
✅ Loan applications, mortgage advice, personal loans
✅ Financial assessments, risk analysis, creditworthiness
✅ Business financing for creative industries
✅ Income verification for freelancers and artists
✅ Portfolio valuation for lending purposes
✅ Financial planning and budgeting for irregular income
✅ Credit repair and improvement strategies
✅ Industry-specific financial challenges for creatives
✅ Alternative income documentation methods
✅ Building credit as a freelancer or artist
✅ Creative business financial management

Communication style:
- Be helpful, professional, and informative
- Provide specific, actionable advice
- Acknowledge the unique challenges of creative professionals
- Use clear, understandable language
- Give practical examples relevant to creative industries
- If asked about non-financial topics, politely redirect to financial/credit matters

Remember: You are helping creative professionals navigate financial systems that weren't always designed for their unique circumstances.`;
  }

  /**
   * Call Gemini AI API with enhanced prompting
   */
  async generateResponse(userMessage, conversationHistory = []) {
    try {
      console.log('🤖 Generating AI response for credit scoring query...');

      // Build conversation context
      let conversationContext = '';
      if (conversationHistory.length > 0) {
        conversationContext = '\n\nRecent conversation:\n' + 
          conversationHistory.slice(-3).map(msg => 
            `User: ${msg.userMessage}\nHEVA AI: ${msg.aiResponse}`
          ).join('\n\n');
      }

      // Construct the full prompt
      const fullPrompt = `${this.getSystemPrompt()}

${conversationContext}

User's current question: "${userMessage}"

Please provide a helpful, detailed response focused on credit scoring, financial assessment, or related financial topics for creative professionals. If the question is not related to finance or credit, politely redirect them to ask about credit or financial matters.

Response:`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ]
      };

      const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      console.log('✅ Gemini API response received');

      // Extract response text
      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        console.error('❌ Invalid response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('Invalid response from Gemini AI');
      }

      return {
        success: true,
        response: aiResponse.trim(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        if (error.response.status === 429) {
          return {
            success: false,
            error: 'Service is currently busy. Please try again in a moment.',
            details: 'Rate limit exceeded'
          };
        } else if (error.response.status === 401) {
          return {
            success: false,
            error: 'Service configuration error. Please contact support.',
            details: 'Invalid API key'
          };
        } else if (error.response.status >= 500) {
          return {
            success: false,
            error: 'AI service is temporarily unavailable. Please try again later.',
            details: 'Server error'
          };
        }
      } else if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Request took too long. Please try again with a shorter question.',
          details: 'Timeout'
        };
      } else if (error.code === 'ENOTFOUND') {
        return {
          success: false,
          error: 'Unable to connect to AI service. Please check your internet connection.',
          details: 'Connection failed'
        };
      }
      
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        details: error.message
      };
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  async callGeminiAPI(message) {
    const result = await this.generateResponse(message);
    if (result.success) {
      return result.response;
    } else {
      throw new Error(result.error);
    }
  }

  /**
   * Test Gemini API connection
   */
  async testConnection() {
    try {
      console.log('🔍 Testing Gemini API connection...');
      const testResult = await this.generateResponse('Test: What is a credit score?');
      
      if (testResult.success) {
        console.log('✅ Gemini API connection test successful');
        return true;
      } else {
        console.error('❌ Gemini API test failed:', testResult.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Gemini API connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Health check for monitoring
   */
  async checkHealth() {
    try {
      const isHealthy = await this.testConnection();
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        service: 'Gemini AI',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Gemini service health check failed: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new GeminiService();