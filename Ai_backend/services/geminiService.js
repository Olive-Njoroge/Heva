/**
 * Gemini AI Service
 * Handles integration with Google's Gemini AI API for natural language processing
 * Provides chat functionality with safety settings and error handling
 */

const axios = require('axios');

/**
 * Call Gemini AI API with user message
 * Sends a message to Google's Gemini AI and returns the response
 * @param {string} message - User's message to send to the AI
 * @returns {Promise<string>} - AI-generated response text
 * @throws {Error} - Throws error if API call fails or returns invalid response
 */
const callGeminiAPI = async (message) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `${process.env.GEMINI_API_URL}?key=${apiKey}`;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('🤖 Calling Gemini AI API...');

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: message
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
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('✅ Gemini API response received');

    // Extract response text
    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.error('❌ Invalid response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid response from Gemini AI');
    }

    return aiResponse;

  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    if (error.response) {
      // API returned an error response
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response.status === 401) {
        throw new Error('Invalid API key configuration.');
      } else if (error.response.status >= 500) {
        throw new Error('Gemini AI service is temporarily unavailable.');
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('Unable to connect to Gemini AI service.');
    }
    
    throw new Error('Failed to get response from AI service.');
  }
};

/**
 * Test Gemini API connection
 * Sends a test message to verify API connectivity and configuration
 * @returns {Promise<boolean>} - True if connection successful, false otherwise
 */
const testConnection = async () => {
  try {
    console.log('🔍 Testing Gemini API connection...');
    const testResponse = await callGeminiAPI('Hello, can you respond with "Connection successful"?');
    console.log('✅ Gemini API connection test successful:', testResponse);
    return true;
  } catch (error) {
    console.error('❌ Gemini API connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  callGeminiAPI,
  testConnection
};