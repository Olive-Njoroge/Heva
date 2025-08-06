import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: any;
  users?: any[];
  token?: string;
  error?: string;
  message?: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // 🔥 This is necessary for CORS with credentials!
});
   

    // Request interceptor to add auth token - Fixed typing
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          // Ensure headers object exists
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ Response from ${response.config.url}:`, response.data);
        return response;
      },
      (error) => {
        console.error('❌ Response error:', error);
        
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Rest of your methods remain the same...
  // Auth endpoints
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    industry?: string;
    businessName?: string;
    businessType?: string;
    phone?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async getCurrentUser(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/api/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get user');
    }
  }

  async updateProfile(userData: any): Promise<ApiResponse> {
    try {
      const response = await this.api.put('/api/auth/profile', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Update failed');
    }
  }

  // Admin endpoints
  async getAllUsers(page = 1, limit = 50, search = '', role = ''): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(role && { role }),
      });

      const response = await this.api.get(`/api/admin/users?${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  async getAdminStats(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/api/admin/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch stats');
    }
  }

  async updateUser(userId: string, userData: any): Promise<ApiResponse> {
    try {
      const response = await this.api.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update user');
    }
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  }

  // Chat endpoints
  async sendChatMessage(data: {
    message: string;
    userId?: string;
    conversationId?: string;
    context?: any;
  }): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/api/chat', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send message');
    }
  }

  async getChatHistory(userId?: string, limit = 10): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(userId && { userId }),
      });

      const response = await this.api.get(`/api/chat/history?${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get chat history');
    }
  }

  // Health check
  async checkHealth(): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error('Backend server is not responding');
    }
  }
}

export const apiService = new ApiService();
export default apiService;