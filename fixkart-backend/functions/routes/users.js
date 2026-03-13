/**
 * User Routes
 * Handles user profile, addresses, favorites, settings
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply auth middleware to all routes
router.use(verifyAuth);

// ============================================
// USER PROFILE
// ============================================

/**
 * GET /users/profile
 * Get current user's profile
 */
router.get('/profile', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: userDoc.data(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * PUT /users/profile
 * Update user profile
 */
router.put('/profile', async (req, res) => {
  try {
    const { displayName, email, phone, photoURL, dateOfBirth, gender } = req.body;

    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (displayName) updates.displayName = displayName;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (photoURL) updates.photoURL = photoURL;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (gender) updates.gender = gender;

    await db.collection('users').doc(req.user.uid).update(updates);

    // Update Firebase Auth profile
    const authUpdates = {};
    if (displayName) authUpdates.displayName = displayName;
    if (photoURL) authUpdates.photoURL = photoURL;
    if (email && email !== req.user.email) authUpdates.email = email;

    if (Object.keys(authUpdates).length > 0) {
      await admin.auth().updateUser(req.user.uid, authUpdates);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============================================
// ADDRESSES
// ============================================

/**
 * GET /users/addresses
 * Get user's saved addresses
 */
router.get('/addresses', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const addresses = userDoc.data()?.addresses || [];

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to get addresses' });
  }
});

/**
 * POST /users/addresses
 * Add a new address
 */
router.post('/addresses', async (req, res) => {
  try {
    const { type, addressLine1, addressLine2, city, state, pincode, landmark, isDefault } = req.body;

    if (!addressLine1 || !city || !pincode) {
      return res.status(400).json({ error: 'Address line 1, city, and pincode are required' });
    }

    const newAddress = {
      id: `addr_${Date.now()}`,
      type: type || 'home',
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state: state || '',
      pincode,
      landmark: landmark || '',
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
    };

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    let addresses = userDoc.data()?.addresses || [];

    // If this is default, unset other defaults
    if (newAddress.isDefault) {
      addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
    }

    addresses.push(newAddress);

    await db.collection('users').doc(req.user.uid).update({
      addresses,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      address: newAddress,
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

/**
 * PUT /users/addresses/:addressId
 * Update an address
 */
router.put('/addresses/:addressId', async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    let addresses = userDoc.data()?.addresses || [];

    const addressIndex = addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
    }

    addresses[addressIndex] = { ...addresses[addressIndex], ...updates };

    await db.collection('users').doc(req.user.uid).update({
      addresses,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Address updated',
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

/**
 * DELETE /users/addresses/:addressId
 * Delete an address
 */
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    const { addressId } = req.params;

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const addresses = userDoc.data()?.addresses || [];

    const filteredAddresses = addresses.filter(addr => addr.id !== addressId);

    await db.collection('users').doc(req.user.uid).update({
      addresses: filteredAddresses,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Address deleted',
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// ============================================
// FAVORITES
// ============================================

/**
 * GET /users/favorites
 * Get user's favorite workers
 */
router.get('/favorites', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const favoriteIds = userDoc.data()?.favorites || [];

    if (favoriteIds.length === 0) {
      return res.status(200).json({ success: true, favorites: [] });
    }

    // Get worker details
    const workersSnapshot = await db.collection('workers')
      .where(admin.firestore.FieldPath.documentId(), 'in', favoriteIds)
      .get();

    const favorites = workersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      favorites,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

/**
 * POST /users/favorites/:workerId
 * Add worker to favorites
 */
router.post('/favorites/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;

    await db.collection('users').doc(req.user.uid).update({
      favorites: admin.firestore.FieldValue.arrayUnion(workerId),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

/**
 * DELETE /users/favorites/:workerId
 * Remove worker from favorites
 */
router.delete('/favorites/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;

    await db.collection('users').doc(req.user.uid).update({
      favorites: admin.firestore.FieldValue.arrayRemove(workerId),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// ============================================
// SETTINGS
// ============================================

/**
 * GET /users/settings
 * Get user settings
 */
router.get('/settings', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const settings = userDoc.data()?.settings || {};

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

/**
 * PUT /users/settings
 * Update user settings
 */
router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;

    await db.collection('users').doc(req.user.uid).update({
      settings,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Settings updated',
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ============================================
// WALLET
// ============================================

/**
 * GET /users/wallet
 * Get wallet balance and transactions
 */
router.get('/wallet', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const balance = userDoc.data()?.walletBalance || 0;

    // Get recent transactions
    const transactionsSnapshot = await db.collection('walletTransactions')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      balance,
      transactions,
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Failed to get wallet data' });
  }
});

/**
 * POST /users/wallet/add
 * Add money to wallet
 */
router.post('/wallet/add', async (req, res) => {
  try {
    const { amount, paymentId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Update balance
    await db.collection('users').doc(req.user.uid).update({
      walletBalance: admin.firestore.FieldValue.increment(amount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create transaction record
    await db.collection('walletTransactions').add({
      userId: req.user.uid,
      type: 'credit',
      amount,
      description: 'Wallet top-up',
      paymentId: paymentId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Wallet topped up successfully',
    });
  } catch (error) {
    console.error('Add money error:', error);
    res.status(500).json({ error: 'Failed to add money' });
  }
});

// ============================================
// NOTIFICATIONS
// ============================================

/**
 * GET /users/notifications
 * Get user notifications
 */
router.get('/notifications', async (req, res) => {
  try {
    const { limit = 20, unreadOnly = false } = req.query;

    let query = db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));

    if (unreadOnly === 'true') {
      query = query.where('read', '==', false);
    }

    const snapshot = await query.get();
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get unread count
    const unreadSnapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .where('read', '==', false)
      .count()
      .get();

    res.status(200).json({
      success: true,
      notifications,
      unreadCount: unreadSnapshot.data().count,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

/**
 * PUT /users/notifications/:notificationId/read
 * Mark notification as read
 */
router.put('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;

    await db.collection('notifications').doc(notificationId).update({
      read: true,
      readAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

/**
 * PUT /users/notifications/read-all
 * Mark all notifications as read
 */
router.put('/notifications/read-all', async (req, res) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { 
        read: true, 
        readAt: admin.firestore.FieldValue.serverTimestamp() 
      });
    });

    await batch.commit();

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

/**
 * POST /users/fcm-token
 * Update FCM token for push notifications
 */
router.post('/fcm-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'FCM token is required' });
    }

    await db.collection('users').doc(req.user.uid).update({
      fcmToken: token,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'FCM token updated',
    });
  } catch (error) {
    console.error('Update FCM token error:', error);
    res.status(500).json({ error: 'Failed to update FCM token' });
  }
});

module.exports = router;
