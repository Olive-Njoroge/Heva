// Frontend API service for AI chatbot communication

export interface ChatMessage {
  message: string;
  userId?: string;
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  conversationId?: string;
  timestamp?: string;
  error?: string;
  details?: string;
}

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

class ChatService {
  private baseURL: string;
  private defaultTimeout: number = 30000; // 30 seconds

  constructor(baseURL: string = import.meta.env.VITE_AI_API_URL || 'http://localhost:3002') {
    this.baseURL = baseURL;
    console.log('🤖 ChatService initialized with AI backend URL:', this.baseURL);
  }

  /**
   * Send message to AI chatbot
   */
  async sendMessage(data: ChatMessage): Promise<ChatResponse> {
    try {
      console.log('🤖 Sending message to AI backend:', this.baseURL);
      
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
        console.error('❌ AI backend error:', result);
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      console.log('✅ AI response received successfully');
      return result;
    } catch (error) {
      console.error('❌ Chat service error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          throw new Error('AI request timed out. Please try again.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to AI service. Please check if the AI backend is running.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred while communicating with the AI service.');
    }
  }

  /**
   * Get chat history from AI backend
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
      console.error('❌ Get chat history error:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch chat history from AI service');
    }
  }

  /**
   * Check AI service status
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
      console.error('❌ AI service status check error:', error);
      throw error instanceof Error ? error : new Error('Failed to check AI service status');
    }
  }

  /**
   * Check AI service health
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
      console.error('❌ AI service health check error:', error);
      throw error instanceof Error ? error : new Error('Failed to check AI service health');
    }
  }

  /**
   * Test AI backend connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing AI backend connection...');
      await this.checkHealth();
      console.log('✅ AI backend connection successful');
      return true;
    } catch (error) {
      console.error('❌ AI backend connection failed:', error);
      return false;
    }
  }
}

// Create singleton instance for AI chat service
export const aiChatService = new ChatService();

// Export default instance (keeping backward compatibility)
export default aiChatService;