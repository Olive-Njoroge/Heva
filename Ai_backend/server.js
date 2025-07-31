/**
 * Express server for AI-powered chat backend
 * Provides chat API endpoints integrated with Google Gemini AI
 * 
 * Features:
 * - Security middleware (Helmet)
 * - Rate limiting protection
 * - CORS configuration for frontend integration
 * - Request/response logging
 * - Error handling
 * - Health check endpoints
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const chatRoutes = require('./routes/chat');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware - protects against common vulnerabilities
app.use(helmet());
// Compression middleware - reduces response size for better performance
app.use(compression());

// CORS configuration - allows cross-origin requests from specified domains
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting - prevents abuse by limiting requests per IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Logging middleware - logs HTTP requests for monitoring and debugging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware - parses JSON and URL-encoded request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Health check endpoint
 * Returns server status, uptime, and environment information
 * @route GET /health
 * @returns {Object} Server health status
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

/**
 * Root endpoint
 * Provides API information and available endpoints
 * @route GET /
 * @returns {Object} Welcome message and endpoint list
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Chat API!',
    endpoints: {
      health: '/health',
      chat: '/api/chat'
    }
  });
});

// API routes - mount chat routes under /api/chat
app.use('/api/chat', chatRoutes);

// 404 handler - catches all unmatched routes
app.use(notFound);

// Error handling middleware - handles all errors thrown in the application
app.use(errorHandler);

/**
 * Graceful shutdown handlers
 * Ensures proper cleanup when server receives termination signals
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

/**
 * Start the Express server
 * Listens on configured port and logs startup information
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Chat API: http://localhost:${PORT}/api/chat`);
});