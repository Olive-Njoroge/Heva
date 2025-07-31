/**
 * Logger Utility
 * Provides logging functionality for chat interactions and errors
 * Writes logs to daily files with proper directory structure
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Log chat interactions to file
 * Creates daily log files for chat interactions with privacy considerations
 * @param {Object} interaction - Chat interaction object containing user message, AI response, etc.
 * @param {string} interaction.timestamp - ISO timestamp of the interaction
 * @param {string} interaction.userId - User identifier
 * @param {string} interaction.conversationId - Conversation identifier
 * @param {string} interaction.userMessage - User's original message
 * @param {string} interaction.aiResponse - AI's response
 * @param {string} interaction.clientIP - Client's IP address
 */
const logChatInteraction = async (interaction) => {
  try {
    const logDir = path.join(__dirname, '../logs');
    const logFile = path.join(logDir, `chat-${new Date().toISOString().split('T')[0]}.log`);
    
    // Create logs directory if it doesn't exist
    try {
      await fs.access(logDir);
    } catch {
      await fs.mkdir(logDir, { recursive: true });
    }

    const logEntry = {
      timestamp: interaction.timestamp,
      userId: interaction.userId,
      conversationId: interaction.conversationId,
      userMessage: interaction.userMessage.substring(0, 200), // Truncate for privacy
      responseLength: interaction.aiResponse.length,
      clientIP: interaction.clientIP
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    await fs.appendFile(logFile, logLine);
    
  } catch (error) {
    console.error('❌ Failed to log chat interaction:', error.message);
  }
};

/**
 * Log errors to file
 * Creates daily error log files with detailed error information and context
 * @param {Error} error - Error object with message and stack trace
 * @param {Object} context - Additional context information (request details, etc.)
 */
const logError = async (error, context = {}) => {
  try {
    const logDir = path.join(__dirname, '../logs');
    const logFile = path.join(logDir, `errors-${new Date().toISOString().split('T')[0]}.log`);
    
    // Create logs directory if it doesn't exist
    try {
      await fs.access(logDir);
    } catch {
      await fs.mkdir(logDir, { recursive: true });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    await fs.appendFile(logFile, logLine);
    
  } catch (logError) {
    console.error('❌ Failed to log error:', logError.message);
  }
};

/**
 * Log system events
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
const logSystemEvent = async (event, data = {}) => {
  try {
    const logDir = path.join(__dirname, '../logs');
    const logFile = path.join(logDir, `system-${new Date().toISOString().split('T')[0]}.log`);
    
    // Create logs directory if it doesn't exist
    try {
      await fs.access(logDir);
    } catch {
      await fs.mkdir(logDir, { recursive: true });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    await fs.appendFile(logFile, logLine);
    
  } catch (error) {
    console.error('❌ Failed to log system event:', error.message);
  }
};

module.exports = {
  logChatInteraction,
  logError,
  logSystemEvent
};