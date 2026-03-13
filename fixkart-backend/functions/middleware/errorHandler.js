/**
 * Error Handling Middleware
 * Centralized error handling for all routes
 */

/**
 * Custom Application Error
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Predefined Error Types
 */
const ErrorTypes = {
  VALIDATION_ERROR: (message) => new AppError(message || 'Validation failed', 400, 'VALIDATION_ERROR'),
  UNAUTHORIZED: (message) => new AppError(message || 'Unauthorized access', 401, 'UNAUTHORIZED'),
  FORBIDDEN: (message) => new AppError(message || 'Access forbidden', 403, 'FORBIDDEN'),
  NOT_FOUND: (message) => new AppError(message || 'Resource not found', 404, 'NOT_FOUND'),
  DUPLICATE: (message) => new AppError(message || 'Resource already exists', 409, 'DUPLICATE'),
  TOO_MANY_REQUESTS: (message) => new AppError(message || 'Too many requests', 429, 'TOO_MANY_REQUESTS'),
  INTERNAL_ERROR: (message) => new AppError(message || 'Internal server error', 500, 'INTERNAL_ERROR'),
  SERVICE_UNAVAILABLE: (message) => new AppError(message || 'Service unavailable', 503, 'SERVICE_UNAVAILABLE'),
};

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found handler
 * For unmatched routes
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Something went wrong';
  
  // Log error for debugging
  console.error('Error:', {
    code,
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    user: req.user?.uid,
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
  }
  
  if (err.code === 'auth/id-token-expired') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }
  
  if (err.code === 'auth/argument-error') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }
  
  // Firebase Firestore errors
  if (err.code === 'permission-denied') {
    statusCode = 403;
    code = 'PERMISSION_DENIED';
    message = 'Permission denied';
  }
  
  if (err.code === 'not-found') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Resource not found';
  }
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  const response = {
    success: false,
    error: code,
    message,
    ...(isDevelopment && {
      stack: err.stack,
      details: err.details,
    }),
  };
  
  res.status(statusCode).json(response);
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} ${res.statusCode} ${duration}ms`,
      req.user?.uid ? `user:${req.user.uid}` : 'anonymous'
    );
  });
  
  next();
};

/**
 * Response time header
 */
const responseTime = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('header', () => {
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] * 1e-6;
    res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
  });
  
  next();
};

module.exports = {
  AppError,
  ErrorTypes,
  asyncHandler,
  notFoundHandler,
  errorHandler,
  requestLogger,
  responseTime,
};
