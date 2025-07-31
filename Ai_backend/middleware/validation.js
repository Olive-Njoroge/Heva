/**
 * Validation Middleware
 * Provides request validation for chat API endpoints
 * Validates message content, user IDs, and conversation IDs
 */

/**
 * Validate chat message request
 * Ensures the message field meets requirements for length and format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} - Error response or calls next()
 */
const validateMessage = (req, res, next) => {
  const { message } = req.body;

  // Check if message exists
  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Message is required',
      field: 'message'
    });
  }

  // Check if message is a string
  if (typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Message must be a string',
      field: 'message'
    });
  }

  // Check message length
  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Message cannot be empty',
      field: 'message'
    });
  }

  if (trimmedMessage.length > 4000) {
    return res.status(400).json({
      success: false,
      error: 'Message is too long (maximum 4000 characters)',
      field: 'message',
      maxLength: 4000,
      currentLength: trimmedMessage.length
    });
  }

  // Sanitize and add trimmed message back to request
  req.body.message = trimmedMessage;

  next();
};

/**
 * Validate optional fields
 * Validates userId and conversationId if provided in the request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} - Error response or calls next()
 */
const validateOptionalFields = (req, res, next) => {
  const { userId, conversationId } = req.body;

  // Validate userId if provided
  if (userId && typeof userId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'userId must be a string',
      field: 'userId'
    });
  }

  // Validate conversationId if provided
  if (conversationId && typeof conversationId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'conversationId must be a string',
      field: 'conversationId'
    });
  }

  next();
};

module.exports = {
  validateMessage,
  validateOptionalFields
};