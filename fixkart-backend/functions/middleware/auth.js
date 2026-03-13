/**
 * Authentication Middleware
 * Centralized auth verification for all routes
 */

const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * Verify Firebase Auth Token
 * Attaches user info to req.user
 */
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      phone: decodedToken.phone_number,
    };
    
    next();
  } catch (error) {
    console.error('Auth verification error:', error.code);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: 'TokenExpired',
        message: 'Authentication token has expired',
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'InvalidToken',
      message: 'Invalid authentication token',
    });
  }
};

/**
 * Verify Admin Role
 * Must be used after verifyAuth
 */
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const adminDoc = await db.collection('admins').doc(req.user.uid).get();
    
    if (!adminDoc.exists) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    req.adminData = adminDoc.data();
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'ServerError',
      message: 'Failed to verify admin access',
    });
  }
};

/**
 * Verify Worker Role
 * Must be used after verifyAuth
 */
const verifyWorker = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const workerDoc = await db.collection('workers').doc(req.user.uid).get();
    
    if (!workerDoc.exists) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Worker access required',
      });
    }

    const workerData = workerDoc.data();
    
    if (workerData.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'AccountInactive',
        message: 'Worker account is not active',
      });
    }

    req.workerData = workerData;
    next();
  } catch (error) {
    console.error('Worker verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'ServerError',
      message: 'Failed to verify worker access',
    });
  }
};

/**
 * Optional Auth
 * Attaches user info if token present, continues otherwise
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      phone: decodedToken.phone_number,
    };
    
    next();
  } catch (error) {
    // Token invalid but continue anyway
    next();
  }
};

/**
 * Rate Limiting by User
 */
const rateLimitStore = new Map();

const rateLimit = (options = {}) => {
  const windowMs = options.windowMs || 60000; // 1 minute
  const maxRequests = options.max || 60;
  const keyPrefix = options.keyPrefix || 'rl';

  return (req, res, next) => {
    const key = `${keyPrefix}:${req.user?.uid || req.ip}`;
    const now = Date.now();
    
    let record = rateLimitStore.get(key);
    
    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
    } else {
      record.count++;
    }
    
    rateLimitStore.set(key, record);
    
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'TooManyRequests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((record.startTime + windowMs - now) / 1000),
      });
    }
    
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil((record.startTime + windowMs) / 1000));
    
    next();
  };
};

// Clean up rate limit store periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now - record.startTime > 300000) { // 5 minutes
      rateLimitStore.delete(key);
    }
  }
}, 60000);

module.exports = {
  verifyAuth,
  verifyAdmin,
  verifyWorker,
  optionalAuth,
  rateLimit,
};
