import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name?: string; // Add the name field
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

  // Helper function to ensure user has a name field
  const ensureUserHasName = (userData: User): User => {
    if (!userData.name && userData.firstName && userData.lastName) {
      return {
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`.trim()
      };
    }
    return userData;
  };

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth...');
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        console.log('🔑 Found saved token and user, restoring session...');
        setToken(savedToken);
        
        try {
          const parsedUser = JSON.parse(savedUser);
          const userWithName = ensureUserHasName(parsedUser);
          setUser(userWithName);
          console.log('✅ Session restored for:', userWithName.name || userWithName.email);
          
          // Update localStorage if name was added
          if (!parsedUser.name && userWithName.name) {
            localStorage.setItem('user', JSON.stringify(userWithName));
          }
        } catch (error) {
          console.error('❌ Error parsing saved user:', error);
          localStorage.removeItem('user');
          await fetchUser();
        }
      } else if (savedToken) {
        console.log('🔑 Found saved token, fetching user...');
        setToken(savedToken);
        await fetchUser();
      } else {
        console.log('🚫 No saved token found');
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchUser = async () => {
    try {
      console.log('👤 Fetching current user...');
      const response = await apiService.getCurrentUser();
      
      if (response.success && response.user) {
        const userWithName = ensureUserHasName(response.user);
        setUser(userWithName);
        localStorage.setItem('user', JSON.stringify(userWithName));
        console.log('✅ User loaded:', userWithName.name || userWithName.email, userWithName.role);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

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
        
        // Ensure user has name field
        const userWithName = ensureUserHasName(response.user);
        
        setToken(response.token);
        setUser(userWithName);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userWithName));
        
        console.log('💾 Auth state updated - user name:', userWithName.name);
        console.log('💾 Auth state updated - isAdmin:', userWithName.role === 'admin');
        
      } else {
        console.error('❌ AuthContext: Login failed - invalid response');
        throw new Error(response.error || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('❌ AuthContext: Login error:', error);
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
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
        
        // Ensure user has name field
        const userWithName = ensureUserHasName(response.user);
        
        setToken(response.token);
        setUser(userWithName);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userWithName));
        
        console.log('💾 Registration complete - user name:', userWithName.name);
        
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
        const userWithName = ensureUserHasName(response.user);
        setUser(userWithName);
        localStorage.setItem('user', JSON.stringify(userWithName));
        console.log('✅ Profile updated successfully for:', userWithName.name);
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
        // Ensure all users have name fields
        const usersWithNames = response.users.map(ensureUserHasName);
        console.log('✅ Users fetched:', usersWithNames.length);
        return usersWithNames;
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
    console.log('🚪 Logging out user:', user?.name || user?.email);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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