/**
 * Helper Utilities
 * Common utility functions used across the application
 */

const crypto = require('crypto');
const moment = require('moment-timezone');

/**
 * Generate random string
 */
const generateRandomString = (length = 10) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

/**
 * Generate OTP
 */
const generateOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Generate referral code
 */
const generateReferralCode = (name = '') => {
  const prefix = name.slice(0, 3).toUpperCase() || 'FIX';
  const suffix = generateRandomString(5).toUpperCase();
  return `${prefix}${suffix}`;
};

/**
 * Generate booking number
 */
const generateBookingNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(4).toUpperCase();
  return `FIX${timestamp}${random}`;
};

/**
 * Generate transaction ID
 */
const generateTransactionId = () => {
  return `TXN${Date.now()}${generateRandomString(6).toUpperCase()}`;
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date
 */
const formatDate = (date, format = 'DD MMM YYYY', timezone = 'Asia/Kolkata') => {
  return moment(date).tz(timezone).format(format);
};

/**
 * Format time
 */
const formatTime = (time, format = 'hh:mm A', timezone = 'Asia/Kolkata') => {
  return moment(time, 'HH:mm').tz(timezone).format(format);
};

/**
 * Format datetime
 */
const formatDateTime = (date, format = 'DD MMM YYYY, hh:mm A', timezone = 'Asia/Kolkata') => {
  return moment(date).tz(timezone).format(format);
};

/**
 * Parse date string to Date object
 */
const parseDate = (dateStr, timeStr = '00:00', timezone = 'Asia/Kolkata') => {
  return moment.tz(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm', timezone).toDate();
};

/**
 * Get time slots for a date
 */
const getTimeSlots = (startHour = 8, endHour = 21, intervalMinutes = 30) => {
  const slots = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = moment({ hour, minute }).format('HH:mm');
      const display = moment({ hour, minute }).format('hh:mm A');
      slots.push({ time, display });
    }
  }
  
  return slots;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (lat1, lon1, lat2, lon2, unit = 'km') => {
  const R = unit === 'km' ? 6371 : 3959; // Earth's radius in km or miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value) => (value * Math.PI) / 180;

/**
 * Paginate array
 */
const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
      hasNext: endIndex < array.length,
      hasPrev: page > 1,
    },
  };
};

/**
 * Sleep/delay function
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry function with exponential backoff
 */
const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
};

/**
 * Debounce function
 */
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Chunk array into smaller arrays
 */
const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Deep clone object
 */
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Omit keys from object
 */
const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

/**
 * Pick keys from object
 */
const pick = (obj, keys) => {
  const result = {};
  keys.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Slugify string
 */
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Capitalize first letter
 */
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Title case string
 */
const titleCase = (str) => {
  return str.split(' ').map(capitalize).join(' ');
};

/**
 * Mask phone number
 */
const maskPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{2})(\d+)(\d{2})/, '$1****$3');
};

/**
 * Mask email
 */
const maskEmail = (email) => {
  if (!email) return '';
  const [local, domain] = email.split('@');
  const maskedLocal = local[0] + '***' + local.slice(-1);
  return `${maskedLocal}@${domain}`;
};

/**
 * Check if value is empty
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Safe JSON parse
 */
const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

module.exports = {
  generateRandomString,
  generateOTP,
  generateReferralCode,
  generateBookingNumber,
  generateTransactionId,
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  parseDate,
  getTimeSlots,
  calculateDistance,
  paginate,
  sleep,
  retry,
  debounce,
  chunk,
  deepClone,
  omit,
  pick,
  slugify,
  capitalize,
  titleCase,
  maskPhone,
  maskEmail,
  isEmpty,
  safeJsonParse,
};
