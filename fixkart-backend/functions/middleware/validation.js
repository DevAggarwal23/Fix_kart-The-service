/**
 * Validation Middleware
 * Input validation and sanitization
 */

const validator = require('validator');

/**
 * Validate request body against schema
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }
      
      // Skip further validation if not required and not provided
      if (value === undefined || value === null) continue;
      
      // Type check
      if (rules.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rules.type) {
          errors.push({ field, message: `${field} must be of type ${rules.type}` });
          continue;
        }
      }
      
      // String validations
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
        }
        if (rules.email && !validator.isEmail(value)) {
          errors.push({ field, message: `${field} must be a valid email` });
        }
        if (rules.phone && !validator.isMobilePhone(value, 'en-IN')) {
          errors.push({ field, message: `${field} must be a valid phone number` });
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push({ field, message: rules.patternMessage || `${field} format is invalid` });
        }
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
        }
      }
      
      // Number validations
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({ field, message: `${field} must be at least ${rules.min}` });
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push({ field, message: `${field} must be at most ${rules.max}` });
        }
      }
      
      // Array validations
      if (Array.isArray(value)) {
        if (rules.minItems && value.length < rules.minItems) {
          errors.push({ field, message: `${field} must have at least ${rules.minItems} items` });
        }
        if (rules.maxItems && value.length > rules.maxItems) {
          errors.push({ field, message: `${field} must have at most ${rules.maxItems} items` });
        }
      }
      
      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value, req.body);
        if (customError) {
          errors.push({ field, message: customError });
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Validation failed',
        errors,
      });
    }
    
    next();
  };
};

/**
 * Sanitize string input
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return validator.escape(validator.trim(str));
};

/**
 * Sanitize request body
 */
const sanitizeBody = (fields = []) => {
  return (req, res, next) => {
    if (fields.length === 0) {
      // Sanitize all string fields
      for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === 'string') {
          req.body[key] = sanitizeString(value);
        }
      }
    } else {
      // Sanitize specific fields
      for (const field of fields) {
        if (req.body[field] && typeof req.body[field] === 'string') {
          req.body[field] = sanitizeString(req.body[field]);
        }
      }
    }
    next();
  };
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const { limit, page, startAfter } = req.query;
  
  if (limit) {
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'limit must be between 1 and 100',
      });
    }
    req.query.limit = parsedLimit;
  }
  
  if (page) {
    const parsedPage = parseInt(page);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'page must be a positive integer',
      });
    }
    req.query.page = parsedPage;
  }
  
  next();
};

/**
 * Validate date format
 */
const validateDate = (fieldName) => {
  return (req, res, next) => {
    const value = req.body[fieldName] || req.query[fieldName];
    
    if (value && !validator.isISO8601(value)) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: `${fieldName} must be a valid date`,
      });
    }
    
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // User registration
  userRegistration: {
    displayName: { required: true, type: 'string', minLength: 2, maxLength: 50 },
    email: { required: true, type: 'string', email: true },
    phone: { required: true, type: 'string', phone: true },
  },
  
  // Address
  address: {
    label: { required: true, type: 'string', enum: ['home', 'work', 'other'] },
    addressLine1: { required: true, type: 'string', minLength: 5, maxLength: 200 },
    city: { required: true, type: 'string', minLength: 2, maxLength: 50 },
    state: { required: true, type: 'string', minLength: 2, maxLength: 50 },
    pincode: { required: true, type: 'string', pattern: /^[1-9][0-9]{5}$/, patternMessage: 'Invalid pincode' },
  },
  
  // Booking
  booking: {
    serviceId: { required: true, type: 'string' },
    scheduledDate: { required: true, type: 'string' },
    scheduledTime: { required: true, type: 'string' },
    address: { required: true, type: 'object' },
  },
  
  // Review
  review: {
    bookingId: { required: true, type: 'string' },
    serviceId: { required: true, type: 'string' },
    workerId: { required: true, type: 'string' },
    rating: { required: true, type: 'number', min: 1, max: 5 },
    comment: { type: 'string', maxLength: 1000 },
  },
  
  // Payment
  payment: {
    bookingId: { required: true, type: 'string' },
    amount: { required: true, type: 'number', min: 1 },
  },
};

module.exports = {
  validateBody,
  sanitizeString,
  sanitizeBody,
  validatePagination,
  validateDate,
  schemas,
};
