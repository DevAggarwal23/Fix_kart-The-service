/**
 * Authentication Routes
 * Handles user registration, login, OTP verification, password reset
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');

const db = admin.firestore();

// ============================================
// PHONE OTP AUTHENTICATION
// ============================================

/**
 * POST /auth/send-otp
 * Send OTP to phone number
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !validator.isMobilePhone(phone, 'en-IN')) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in Firestore
    await db.collection('otps').doc(phone).set({
      otp,
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      attempts: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // TODO: Integrate with SMS provider (MSG91, Twilio)
    // For development, log OTP
    console.log(`OTP for ${phone}: ${otp}`);

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Remove this in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

/**
 * POST /auth/verify-otp
 * Verify OTP and create/login user
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    // Get stored OTP
    const otpDoc = await db.collection('otps').doc(phone).get();

    if (!otpDoc.exists) {
      return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
    }

    const otpData = otpDoc.data();

    // Check expiration
    if (otpData.expiresAt.toDate() < new Date()) {
      await db.collection('otps').doc(phone).delete();
      return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
    }

    // Check attempts
    if (otpData.attempts >= 3) {
      await db.collection('otps').doc(phone).delete();
      return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      await db.collection('otps').doc(phone).update({
        attempts: admin.firestore.FieldValue.increment(1),
      });
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP verified - delete it
    await db.collection('otps').doc(phone).delete();

    // Check if user exists
    let user;
    try {
      user = await admin.auth().getUserByPhoneNumber(`+91${phone.replace(/^\+91/, '')}`);
    } catch (error) {
      // Create new user
      user = await admin.auth().createUser({
        phoneNumber: `+91${phone.replace(/^\+91/, '')}`,
        disabled: false,
      });
    }

    // Generate custom token
    const customToken = await admin.auth().createCustomToken(user.uid);

    res.status(200).json({
      success: true,
      token: customToken,
      user: {
        uid: user.uid,
        phone: user.phoneNumber,
        isNew: user.metadata.creationTime === user.metadata.lastSignInTime,
      },
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// ============================================
// EMAIL AUTHENTICATION
// ============================================

/**
 * POST /auth/register
 * Register new user with email and password
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validate input
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name || null,
      phoneNumber: phone ? `+91${phone.replace(/^\+91/, '')}` : null,
    });

    // Create user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName: name || null,
      phone: phone || null,
      role: 'customer',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
      walletBalance: 0,
      totalBookings: 0,
      totalSpent: 0,
      referralCode: generateReferralCode(),
      addresses: [],
      favorites: [],
      settings: {
        notifications: true,
        smsAlerts: true,
        emailAlerts: true,
        darkMode: false,
      },
    });

    // Generate custom token
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      token: customToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /auth/login
 * Login user with email and password (handled by Firebase client SDK)
 * This endpoint is for server-side validation if needed
 */
router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get user profile
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userData = userDoc.data();

    if (userData.status === 'blocked') {
      return res.status(403).json({ error: 'Account is blocked. Contact support.' });
    }

    // Update last login
    await db.collection('users').doc(decodedToken.uid).update({
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        ...userData,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * POST /auth/forgot-password
 * Send password reset email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    // TODO: Send email with reset link using Nodemailer/SendGrid
    console.log(`Password reset link for ${email}: ${resetLink}`);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    if (error.code === 'auth/user-not-found') {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    }
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// ============================================
// WORKER REGISTRATION
// ============================================

/**
 * POST /auth/register-worker
 * Register as a service professional
 */
router.post('/register-worker', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone, 
      categories, 
      experience,
      address,
      idProof,
    } = req.body;

    // Validate input
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!categories || !categories.length) {
      return res.status(400).json({ error: 'At least one service category is required' });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber: `+91${phone.replace(/^\+91/, '')}`,
    });

    // Set custom claims for worker role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'worker' });

    // Create worker profile in Firestore
    await db.collection('workers').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName: name,
      phone,
      photoURL: null,
      role: 'worker',
      status: 'pending_verification',
      categories,
      experience: experience || 0,
      address: address || null,
      idProof: idProof || null,
      verified: false,
      documentsSubmitted: false,
      backgroundCheckPassed: false,
      rating: 0,
      totalReviews: 0,
      totalJobs: 0,
      completedJobs: 0,
      walletBalance: 0,
      totalEarnings: 0,
      level: 'Bronze',
      isOnline: false,
      currentLocation: null,
      availability: {
        monday: { start: '08:00', end: '20:00' },
        tuesday: { start: '08:00', end: '20:00' },
        wednesday: { start: '08:00', end: '20:00' },
        thursday: { start: '08:00', end: '20:00' },
        friday: { start: '08:00', end: '20:00' },
        saturday: { start: '08:00', end: '18:00' },
        sunday: { start: '10:00', end: '16:00' },
      },
      settings: {
        notifications: true,
        autoAccept: false,
        maxDistance: 10,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Generate custom token
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      token: customToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: name,
        role: 'worker',
        status: 'pending_verification',
      },
    });

  } catch (error) {
    console.error('Worker registration error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ============================================
// TOKEN VALIDATION
// ============================================

/**
 * POST /auth/verify-token
 * Verify Firebase ID token
 */
router.post('/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    res.status(200).json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'customer',
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'FIX';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = router;
