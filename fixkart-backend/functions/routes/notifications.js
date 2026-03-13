/**
 * Notifications Routes
 * Handles push notifications, in-app notifications, FCM
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
// IN-APP NOTIFICATIONS
// ============================================

/**
 * GET /notifications
 * Get user's notifications
 */
router.get('/', async (req, res) => {
  try {
    const { type, read, limit = 50, startAfter } = req.query;

    let query = db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc');

    if (type) {
      query = query.where('type', '==', type);
    }

    if (read !== undefined) {
      query = query.where('read', '==', read === 'true');
    }

    query = query.limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('notifications').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const notificationsSnapshot = await query.get();

    const notifications = notificationsSnapshot.docs.map(doc => ({
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
 * PUT /notifications/:notificationId/read
 * Mark notification as read
 */
router.put('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notificationDoc = await db.collection('notifications').doc(notificationId).get();
    if (!notificationDoc.exists) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const notificationData = notificationDoc.data();
    if (notificationData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

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
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

/**
 * PUT /notifications/read-all
 * Mark all notifications as read
 */
router.put('/read-all', async (req, res) => {
  try {
    const batch = db.batch();

    const unreadSnapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .where('read', '==', false)
      .get();

    unreadSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    res.status(200).json({
      success: true,
      message: `${unreadSnapshot.size} notifications marked as read`,
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

/**
 * DELETE /notifications/:notificationId
 * Delete a notification
 */
router.delete('/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notificationDoc = await db.collection('notifications').doc(notificationId).get();
    if (!notificationDoc.exists) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const notificationData = notificationDoc.data();
    if (notificationData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.collection('notifications').doc(notificationId).delete();

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

/**
 * DELETE /notifications/clear-all
 * Clear all notifications
 */
router.delete('/clear-all', async (req, res) => {
  try {
    const batch = db.batch();

    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', req.user.uid)
      .get();

    notificationsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).json({
      success: true,
      message: `${notificationsSnapshot.size} notifications deleted`,
    });
  } catch (error) {
    console.error('Clear all error:', error);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

// ============================================
// FCM TOKEN MANAGEMENT
// ============================================

/**
 * POST /notifications/fcm-token
 * Register FCM token
 */
router.post('/fcm-token', async (req, res) => {
  try {
    const { token, deviceId, platform } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Check if token already exists
    const existingSnapshot = await db.collection('fcmTokens')
      .where('token', '==', token)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      // Update existing token
      await existingSnapshot.docs[0].ref.update({
        userId: req.user.uid,
        platform: platform || 'web',
        lastUsed: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Create new token record
      await db.collection('fcmTokens').add({
        userId: req.user.uid,
        token,
        deviceId: deviceId || null,
        platform: platform || 'web',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUsed: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'FCM token registered',
    });
  } catch (error) {
    console.error('Register FCM token error:', error);
    res.status(500).json({ error: 'Failed to register token' });
  }
});

/**
 * DELETE /notifications/fcm-token
 * Remove FCM token
 */
router.delete('/fcm-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const tokenSnapshot = await db.collection('fcmTokens')
      .where('token', '==', token)
      .where('userId', '==', req.user.uid)
      .get();

    const batch = db.batch();
    tokenSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.status(200).json({
      success: true,
      message: 'FCM token removed',
    });
  } catch (error) {
    console.error('Remove FCM token error:', error);
    res.status(500).json({ error: 'Failed to remove token' });
  }
});

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

/**
 * GET /notifications/preferences
 * Get notification preferences
 */
router.get('/preferences', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    const defaultPreferences = {
      push: {
        bookingUpdates: true,
        promotions: true,
        reminders: true,
        workerArrival: true,
        paymentAlerts: true,
      },
      email: {
        bookingConfirmation: true,
        invoices: true,
        promotions: false,
        newsletter: false,
      },
      sms: {
        otp: true,
        bookingUpdates: true,
        reminders: true,
      },
    };

    const preferences = userDoc.exists && userDoc.data().notificationPreferences
      ? userDoc.data().notificationPreferences
      : defaultPreferences;

    res.status(200).json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

/**
 * PUT /notifications/preferences
 * Update notification preferences
 */
router.put('/preferences', async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ error: 'Preferences are required' });
    }

    await db.collection('users').doc(req.user.uid).update({
      notificationPreferences: preferences,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Preferences updated',
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// ============================================
// SEND NOTIFICATIONS (Internal/Admin use)
// ============================================

/**
 * Send push notification to a user
 */
async function sendPushNotification(userId, title, body, data = {}) {
  try {
    // Get user's FCM tokens
    const tokensSnapshot = await db.collection('fcmTokens')
      .where('userId', '==', userId)
      .get();

    if (tokensSnapshot.empty) {
      console.log(`No FCM tokens found for user ${userId}`);
      return { success: false, error: 'No tokens' };
    }

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    const message = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    // Remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });

      // Delete invalid tokens
      const batch = db.batch();
      const invalidSnapshot = await db.collection('fcmTokens')
        .where('token', 'in', failedTokens)
        .get();
      
      invalidSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    return { success: true, successCount: response.successCount };
  } catch (error) {
    console.error('Send push notification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification to topic subscribers
 */
async function sendTopicNotification(topic, title, body, data = {}) {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      topic,
    };

    await admin.messaging().send(message);
    return { success: true };
  } catch (error) {
    console.error('Send topic notification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create in-app notification
 */
async function createNotification(userId, type, title, body, data = {}) {
  try {
    await db.collection('notifications').add({
      userId,
      type,
      title,
      body,
      data,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Create notification error:', error);
    return { success: false, error: error.message };
  }
}

// Export helper functions for use in other modules
router.sendPushNotification = sendPushNotification;
router.sendTopicNotification = sendTopicNotification;
router.createNotification = createNotification;

module.exports = router;
