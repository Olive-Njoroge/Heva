import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setRole('user');
    setError('');
    setSuccess('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login logic
        const success = await login(email, password, role);
        if (success) {
          navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        // Registration logic
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          return;
        }

        const success = await register({
          email,
          password,
          firstName,
          lastName,
          role
        });
        
        if (success) {
          setSuccess('Account created successfully! You can now sign in.');
          setIsLogin(true);
          resetForm();
        } else {
          setError('Registration failed. Email may already be in use.');
        }
      }
    } catch (err) {
      setError(isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (demoRole: 'admin' | 'user') => {
    setRole(demoRole);
    if (demoRole === 'admin') {
      setEmail('admin@heva.com');
      setPassword('admin123');
    } else {
      setEmail('emma@example.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
              <h1 className="text-2xl font-bold text-gray-900">HEVA</h1>
              <p className="text-sm text-gray-600">Credit Scoring Platform</p>
            </div>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to your account' : 'Join HEVA to get started'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Name fields for registration */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last name"
                  />
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="user"
                    checked={role === 'user'}
                    onChange={(e) => setRole(e.target.value as 'user')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Creative Professional</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value as 'admin')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Administrator</span>
                </label>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Confirm Password for registration */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Toggle between login and register */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {isLogin 
                  ? "Don't have an account? Create one" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>

            {/* Demo Buttons - only show for login */}
            {isLogin && (
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 text-center mb-4">
                  Try the demo with sample credentials:
                </p>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fillDemoCredentials('admin')}
                    className="w-full"
                    size="sm"
                  >
                    Demo as Administrator
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fillDemoCredentials('user')}
                    className="w-full"
                    size="sm"
                  >
                    Demo as Creative Professional
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Specialized credit scoring for creative industries
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <span>Fashion</span>
            <span>Film</span>
            <span>Music</span>
            <span>Digital Art</span>
            <span>Performing Arts</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}