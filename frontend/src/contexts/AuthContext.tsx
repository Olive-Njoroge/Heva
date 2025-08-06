import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  creditScore?: number;
  creditTier?: string;
  industry?: string;
  businessName?: string;
  businessType?: string;
  phone?: string;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  industry?: string;
  businessName?: string;
  businessType?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth...');
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        console.log('🔑 Found saved token, fetching user...');
        setToken(savedToken);
        await fetchUser();
      } else {
        console.log('🚫 No saved token found');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUser = async () => {
    try {
      console.log('👤 Fetching current user...');
      const response = await apiService.getCurrentUser();
      
      if (response.success && response.user) {
        setUser(response.user);
        console.log('✅ User loaded:', response.user.email, response.user.role);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Replace your login and register functions with these:
const login = async (email: string, password: string): Promise<void> => {
  setIsLoading(true);
  setError(null);
  
  try {
    console.log('🔄 AuthContext: Starting login...', { email });
    
    const response = await apiService.login(email, password);
    console.log('📡 AuthContext: API response:', response);
    
    if (response.success && response.token && response.user) {
      console.log('✅ AuthContext: Login successful');
      console.log('👤 User role from backend:', response.user.role);
      
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAdmin(response.user.role === 'admin'); // Use backend role
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('💾 Auth state updated - isAdmin:', response.user.role === 'admin');
      
    } else {
      console.error('❌ AuthContext: Login failed - invalid response');
      throw new Error(response.error || 'Invalid credentials');
    }
  } catch (error: any) {
    console.error('❌ AuthContext: Login error:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


const register = async (userData: RegisterData): Promise<void> => {
  setIsLoading(true);
  setError(null);
  
  try {
    console.log('🔄 AuthContext: Starting registration...', userData);
    
    const response = await apiService.register(userData);
    console.log('📡 AuthContext: Registration response:', response);
    
    if (response.success && response.token && response.user) {
      console.log('✅ AuthContext: Registration successful');
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('token', response.token);
      
    } else {
      console.error('❌ AuthContext: Registration failed - invalid response');
      throw new Error(response.error || 'Registration failed');
    }
  } catch (error: any) {
    console.error('❌ AuthContext: Registration error:', error);
    const errorMessage = error.message || 'Registration failed';
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const updateUser = async (userData: Partial<User>) => {
    try {
      setError(null);
      console.log('📝 Updating user profile...');
      
      const response = await apiService.updateProfile(userData);
      
      if (response.success && response.user) {
        setUser(response.user);
        console.log('✅ Profile updated successfully');
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      console.error('❌ Update error:', errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      if (user?.role !== 'admin') {
        throw new Error('Admin access required');
      }

      setError(null);
      console.log('👥 Fetching all users (Admin)...');
      
      const response = await apiService.getAllUsers();
      
      if (response.success && response.users) {
        console.log('✅ Users fetched:', response.users.length);
        return response.users;
      } else {
        throw new Error(response.error || 'Failed to fetch users');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      console.error('❌ Get users error:', errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (token) {
      console.log('🔄 Refreshing user data...');
      await fetchUser();
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    updateUser,
    getAllUsers,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    refreshUser,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}