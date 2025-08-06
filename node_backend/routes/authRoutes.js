const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('🚀 Registration attempt received');
    console.log('📝 Request body:', { ...req.body, password: '[HIDDEN]' });
    
    const { firstName, lastName, email, password, role, industry, businessName, businessType, phone } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false,
        error: 'First name, last name, email, and password are required' 
      });
    }

    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters' 
      });
    }

    // Check if user exists
    console.log('🔍 Checking if user exists with email:', email);
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({ 
        success: false,
        error: 'User already exists with this email' 
      });
    }

    // Create user
    console.log('👤 Creating new user...');
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'user',
      industry: industry?.trim(),
      businessName: businessName?.trim(),
      businessType: businessType?.trim(),
      phone: phone?.trim()
    };

    const user = new User(userData);
    const savedUser = await user.save();
    
    console.log('✅ User created successfully with ID:', savedUser._id);

    // Generate JWT
    console.log('🔑 Generating JWT token...');
    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const responseUser = {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
      creditScore: savedUser.creditScore,
      creditTier: savedUser.creditTier,
      industry: savedUser.industry,
      businessName: savedUser.businessName,
      businessType: savedUser.businessType,
      phone: savedUser.phone,
      isActive: savedUser.isActive,
      isVerified: savedUser.isVerified,
      createdAt: savedUser.createdAt
    };

    console.log('🎉 Registration successful, sending response');

    res.status(201).json({
      success: true,
      token,
      user: responseUser,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: 'User with this email already exists' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt received');
    console.log('📧 Email:', req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Login validation failed: Missing credentials');
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // Find user
    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found with email:', email);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    console.log('👤 User found:', user.email, 'Role:', user.role);

    // Check password
    console.log('🔓 Verifying password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password verification failed');
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    console.log('✅ Password verified successfully');

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    console.log('🔑 Generating JWT token for user:', user._id);
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const responseUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      creditScore: user.creditScore,
      creditTier: user.creditTier,
      industry: user.industry,
      businessName: user.businessName,
      businessType: user.businessType,
      phone: user.phone,
      isActive: user.isActive,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin
    };

    console.log('🎉 Login successful for user:', user.email);

    res.json({
      success: true,
      token,
      user: responseUser,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('👤 Fetching current user profile for:', req.user._id);
    
    res.json({
      success: true,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        creditScore: req.user.creditScore,
        creditTier: req.user.creditTier,
        industry: req.user.industry,
        businessName: req.user.businessName,
        businessType: req.user.businessType,
        phone: req.user.phone,
        isActive: req.user.isActive,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching user profile' 
    });
  }
});

module.exports = router;