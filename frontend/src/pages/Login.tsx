import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Login() {
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setFormData({ email: '', password: '', role: 'user' });
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setLocalError('');
    setSuccess('');
    clearError();
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');
    clearError();

    try {
      if (isLogin) {
        // Login logic
        console.log('🔄 Starting login process...');
        await login(formData.email, formData.password);
        console.log('✅ Login successful!');
        
        setSuccess('Login successful! Redirecting...');
        // PublicRoute will automatically redirect based on user role from backend
        
      } else {
        // Registration validation
        if (formData.password !== confirmPassword) {
          setLocalError('Passwords do not match.');
          return;
        }
        if (formData.password.length < 6) {
          setLocalError('Password must be at least 6 characters long.');
          return;
        }
        if (!firstName || !lastName) {
          setLocalError('First name and last name are required.');
          return;
        }

        console.log('🔄 Starting registration process...');
        await register({
          email: formData.email,
          password: formData.password,
          firstName,
          lastName,
          role: formData.role
        });
        console.log('✅ Registration successful!');
        
        setSuccess('Account created successfully! Redirecting...');
        // PublicRoute will automatically redirect based on user role
      }
    } catch (err: any) {
      console.error('❌ Auth error:', err);
      setLocalError(err.message || (isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.'));
    }
  };

  const fillDemoCredentials = (demoRole: 'admin' | 'user') => {
    if (demoRole === 'admin') {
      setFormData({
        email: 'admin@heva.com',
        password: 'admin123',
        role: 'admin'
      });
    } else {
      setFormData({
        email: 'user@heva.com',
        password: 'user123',
        role: 'user'
      });
    }
  };

  // Debug component to see authentication state
  const AuthDebug = () => {
    const { user, isAdmin, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded text-xs z-50 max-w-xs">
        <div className="space-y-1">
          <p>✅ Authenticated: {String(isAuthenticated)}</p>
          <p>👤 User: {user?.email}</p>
          <p>🔑 Role: {user?.role}</p>
          <p>👑 Is Admin: {String(isAdmin)}</p>
        </div>
      </div>
    );
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HEVA</h1>
              <p className="text-sm text-gray-300">Credit Scoring Platform</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Title */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-300">
                  {isLogin ? 'Sign in to your account' : 'Join HEVA today'}
                </p>
              </div>

              {/* Error Message */}
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm"
                >
                  {displayError}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm"
                >
                  {success}
                </motion.div>
              )}

              {/* Role Selection - Only show for registration */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Account Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="user"
                        checked={formData.role === 'user'}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'user' }))}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm text-gray-200">Creative Professional</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' }))}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm text-gray-200">Administrator</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Registration fields */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isLogin}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={!isLogin}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>

              {/* Confirm Password for Registration */}
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isLogin}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
              </button>

              {/* Demo Buttons - Only show for login */}
              {isLogin && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-300 text-center">Try demo accounts:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('admin')}
                      className="text-xs bg-white/5 border border-white/20 text-gray-200 hover:bg-white/10 py-2 px-3 rounded-lg transition-colors duration-200"
                    >
                      🔑 Demo Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('user')}
                      className="text-xs bg-white/5 border border-white/20 text-gray-200 hover:bg-white/10 py-2 px-3 rounded-lg transition-colors duration-200"
                    >
                      👤 Demo User
                    </button>
                  </div>
                </div>
              )}

              {/* Toggle Mode */}
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {/* Security Notice */}
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  🔒 Your session will expire when you close the browser or log out
                </p>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-400">
            🔐 Secure login • 🔗 Encrypted connections • 🛡️ Protected data
          </p>
        </motion.div>
      </motion.div>

      {/* Debug Component - Shows authentication state */}
      <AuthDebug />
    </div>
  );
}