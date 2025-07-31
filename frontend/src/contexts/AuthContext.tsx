import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  updateUser: (updatedData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@heva.com',
    role: 'admin',
    joinDate: '2023-01-15',
    lastActivity: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user-1',
    name: 'Emma Rodriguez',
    email: 'emma@example.com',
    role: 'user',
    industry: 'Fashion',
    creditScore: 742,
    businessName: 'Rodriguez Designs',
    location: 'New York, NY',
    yearsInBusiness: 3,
    applicationStatus: 'approved',
    joinDate: '2023-06-10',
    lastActivity: '2024-01-14T15:45:00Z'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('hevaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load registered users from localStorage
    const savedRegisteredUsers = localStorage.getItem('hevaRegisteredUsers');
    if (savedRegisteredUsers) {
      setRegisteredUsers(JSON.parse(savedRegisteredUsers));
    }
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'user'): Promise<boolean> => {
    // Check both mock users and registered users
    const allUsers = [...mockUsers, ...registeredUsers];
    const foundUser = allUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('hevaUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Check if user already exists
      const allUsers = [...mockUsers, ...registeredUsers];
      const existingUser = allUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        return false; // User already exists
      }

      // Generate a new user ID
      const newUserId = `${userData.role}-${Date.now()}`;
      
      // Create new user object
      const newUser: User = {
        id: newUserId,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: userData.role,
        joinDate: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString(),
        // Add default values for user role
        ...(userData.role === 'user' && {
          industry: 'Other', // Default industry
          creditScore: 0, // Will be calculated later
          businessName: `${userData.firstName}'s Business`,
          location: 'Not specified',
          yearsInBusiness: 0,
          applicationStatus: 'pending' as const
        })
      };

      // Add to registered users
      const updatedRegisteredUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedRegisteredUsers);
      
      // Save to localStorage
      localStorage.setItem('hevaRegisteredUsers', JSON.stringify(updatedRegisteredUsers));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const updateUser = async (updatedData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      // Create updated user object
      const updatedUser = { ...user, ...updatedData };
      
      // Update current user state
      setUser(updatedUser);
      localStorage.setItem('hevaUser', JSON.stringify(updatedUser));

      // Update in registered users array if this is a registered user
      const isRegisteredUser = registeredUsers.some(u => u.id === user.id);
      if (isRegisteredUser) {
        const updatedRegisteredUsers = registeredUsers.map(u => 
          u.id === user.id ? updatedUser : u
        );
        setRegisteredUsers(updatedRegisteredUsers);
        localStorage.setItem('hevaRegisteredUsers', JSON.stringify(updatedRegisteredUsers));
      }

      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hevaUser');
  };

  const value = {
    user,
    login,
    register,
    updateUser,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
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