/**
 * Chat Service
 * 
 * Frontend service for communicating with the AI chatbot backend.
 * Handles message sending, chat history retrieval, and API communication.
 * 
 * Features:
 * - Message sending with timeout handling
 * - Chat history retrieval with filtering options
 * - Error handling and retry logic
 * - TypeScript interfaces for type safety
 * - Environment-based API URL configuration
 */

// Frontend API service for chatbot communication

/**
 * Interface for chat message requests
 */
export interface ChatMessage {
  message: string;
  userId?: string;
  conversationId?: string;
}

/**
 * Interface for chat API responses
 */
export interface ChatResponse {
  success: boolean;
  response?: string;
  conversationId?: string;
  timestamp?: string;
  error?: string;
  details?: string;
}

/**
 * Interface for chat history responses
 */
export interface ChatHistory {
  success: boolean;
  history?: Array<{
    id: string;
    userMessage: string;
    aiResponse: string;
    timestamp: string;
    conversationId?: string;
  }>;
  count?: number;
  total?: number;
}

/**
 * Chat service class for API communication
 */
class ChatService {
  private baseURL: string;
  private defaultTimeout: number = 30000; // 30 seconds

  /**
   * Initialize chat service with API base URL
   * @param {string} baseURL - Base URL for the API (defaults to environment variable or localhost)
   */
  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  /**
   * Send message to chatbot
   * @param {ChatMessage} data - Message data including text and optional user/conversation IDs
   * @returns {Promise<ChatResponse>} API response with bot's reply
   * @throws {Error} When API call fails or times out
   */
  async sendMessage(data: ChatMessage): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(this.defaultTimeout),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Chat service error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred while sending your message.');
    }
  }

  /**
   * Get chat history
   * Retrieves previous messages for a user or conversation
   * @param {Object} params - Optional parameters for filtering history
   * @param {string} params.userId - Filter by user ID
   * @param {string} params.conversationId - Filter by conversation ID  
   * @param {number} params.limit - Maximum number of messages to return
   * @returns {Promise<ChatHistory>} Chat history data
   * @throws {Error} When API call fails
   */
  async getChatHistory(params?: {
    userId?: string;
    conversationId?: string;
    limit?: number;
  }): Promise<ChatHistory> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.userId) searchParams.append('userId', params.userId);
      if (params?.conversationId) searchParams.append('conversationId', params.conversationId);
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.baseURL}/api/chat/history?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Get chat history error:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch chat history');
    }
  }

  /**
   * Check API status
   * Verifies if the chat API is online and responsive
   * @returns {Promise<Object>} API status information
   * @throws {Error} When status check fails
   */
  async checkStatus(): Promise<{ status: string; service: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/chat/status`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Status check error:', error);
      throw error instanceof Error ? error : new Error('Failed to check API status');
    }
  }

  /**
   * Check health endpoint
   */
  async checkHealth(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
  }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Health check error:', error);
      throw error instanceof Error ? error : new Error('Failed to check API health');
    }
  }
}

// Create singleton instance
export const chatService = new ChatService();

// Export default instance
export default chatService;