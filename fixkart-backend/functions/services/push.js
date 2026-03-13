/**
 * Push Notification Service
 * Handles FCM push notifications
 */

const admin = require('firebase-admin');

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Send push notification to a single user
 */
const sendToUser = async (userId, notification, data = {}) => {
  try {
    // Get user's FCM tokens
    const tokensSnapshot = await db.collection('fcmTokens')
      .where('userId', '==', userId)
      .get();

    if (tokensSnapshot.empty) {
      console.log(`No FCM tokens found for user ${userId}`);
      return { success: false, reason: 'No tokens' };
    }

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        timestamp: Date.now().toString(),
      },
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#2563eb',
          sound: 'default',
          priority: 'high',
          channelId: data.channelId || 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
      webpush: {
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge.png',
        },
        fcmOptions: {
          link: data.link || 'https://fixkart.com',
        },
      },
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);

    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.log(`Token failed: ${resp.error?.code}`);
        }
      });

      // Remove invalid tokens
      if (failedTokens.length > 0) {
        const batch = db.batch();
        const invalidSnapshot = await db.collection('fcmTokens')
          .where('token', 'in', failedTokens.slice(0, 10)) // Firestore limit
          .get();
        
        invalidSnapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
      }
    }

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('Send push notification error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send to multiple users
 */
const sendToUsers = async (userIds, notification, data = {}) => {
  const results = {
    success: 0,
    failed: 0,
  };

  for (const userId of userIds) {
    const result = await sendToUser(userId, notification, data);
    if (result.success) {
      results.success += result.successCount || 1;
    } else {
      results.failed++;
    }
  }

  return results;
};

/**
 * Send to topic subscribers
 */
const sendToTopic = async (topic, notification, data = {}) => {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: {
        ...data,
        timestamp: Date.now().toString(),
      },
      topic,
    };

    const response = await messaging.send(message);
    console.log('Topic notification sent:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Send topic notification error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe user to topic
 */
const subscribeToTopic = async (userId, topic) => {
  try {
    const tokensSnapshot = await db.collection('fcmTokens')
      .where('userId', '==', userId)
      .get();

    if (tokensSnapshot.empty) return { success: false, reason: 'No tokens' };

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
    await messaging.subscribeToTopic(tokens, topic);
    
    return { success: true };
  } catch (error) {
    console.error('Subscribe to topic error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Unsubscribe user from topic
 */
const unsubscribeFromTopic = async (userId, topic) => {
  try {
    const tokensSnapshot = await db.collection('fcmTokens')
      .where('userId', '==', userId)
      .get();

    if (tokensSnapshot.empty) return { success: false, reason: 'No tokens' };

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
    await messaging.unsubscribeFromTopic(tokens, topic);
    
    return { success: true };
  } catch (error) {
    console.error('Unsubscribe from topic error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Notification Templates
 */
const templates = {
  // Booking notifications
  bookingConfirmed: (booking) => ({
    notification: {
      title: 'Booking Confirmed! ✓',
      body: `Your ${booking.serviceName} is scheduled for ${booking.scheduledDate} at ${booking.scheduledTime}`,
    },
    data: {
      type: 'booking_confirmed',
      bookingId: booking.id,
      channelId: 'bookings',
    },
  }),

  workerAssigned: (booking, worker) => ({
    notification: {
      title: 'Professional Assigned',
      body: `${worker.name} will handle your ${booking.serviceName}`,
    },
    data: {
      type: 'worker_assigned',
      bookingId: booking.id,
      workerId: worker.id,
      channelId: 'bookings',
    },
  }),

  workerOnWay: (booking, eta) => ({
    notification: {
      title: 'On the way! 🚗',
      body: `Your professional is heading to your location. ETA: ${eta} mins`,
    },
    data: {
      type: 'worker_on_way',
      bookingId: booking.id,
      channelId: 'tracking',
    },
  }),

  workerArrived: (booking) => ({
    notification: {
      title: 'Professional Arrived! 📍',
      body: `Share OTP: ${booking.otp} to start the service`,
    },
    data: {
      type: 'worker_arrived',
      bookingId: booking.id,
      otp: booking.otp,
      channelId: 'tracking',
    },
  }),

  serviceStarted: (booking) => ({
    notification: {
      title: 'Service Started',
      body: `Your ${booking.serviceName} is in progress`,
    },
    data: {
      type: 'service_started',
      bookingId: booking.id,
      channelId: 'bookings',
    },
  }),

  serviceCompleted: (booking) => ({
    notification: {
      title: 'Service Completed! 🎉',
      body: `Your ${booking.serviceName} is done. Rate your experience!`,
    },
    data: {
      type: 'service_completed',
      bookingId: booking.id,
      channelId: 'bookings',
    },
  }),

  bookingCancelled: (booking) => ({
    notification: {
      title: 'Booking Cancelled',
      body: `Your booking #${booking.bookingNumber} has been cancelled`,
    },
    data: {
      type: 'booking_cancelled',
      bookingId: booking.id,
      channelId: 'bookings',
    },
  }),

  bookingReminder: (booking) => ({
    notification: {
      title: 'Service Tomorrow ⏰',
      body: `Your ${booking.serviceName} is scheduled for tomorrow at ${booking.scheduledTime}`,
    },
    data: {
      type: 'booking_reminder',
      bookingId: booking.id,
      channelId: 'reminders',
    },
  }),

  // Payment notifications
  paymentSuccess: (amount, bookingNumber) => ({
    notification: {
      title: 'Payment Successful ✓',
      body: `₹${amount} paid for booking #${bookingNumber}`,
    },
    data: {
      type: 'payment_success',
      amount: amount.toString(),
      channelId: 'payments',
    },
  }),

  refundProcessed: (amount) => ({
    notification: {
      title: 'Refund Processed',
      body: `₹${amount} will be credited to your account within 5-7 days`,
    },
    data: {
      type: 'refund_processed',
      amount: amount.toString(),
      channelId: 'payments',
    },
  }),

  // Worker notifications
  newJobAlert: (job) => ({
    notification: {
      title: 'New Job Available! 🔔',
      body: `${job.serviceName} • Earn ₹${job.earnings}`,
    },
    data: {
      type: 'new_job',
      jobId: job.id,
      channelId: 'jobs',
    },
  }),

  jobAssigned: (job) => ({
    notification: {
      title: 'Job Assigned',
      body: `${job.serviceName} at ${job.address}`,
    },
    data: {
      type: 'job_assigned',
      jobId: job.id,
      channelId: 'jobs',
    },
  }),

  // Promotional
  promotional: (promo) => ({
    notification: {
      title: promo.title,
      body: promo.body,
      imageUrl: promo.imageUrl,
    },
    data: {
      type: 'promotional',
      promoId: promo.id,
      link: promo.link,
      channelId: 'promotions',
    },
  }),
};

/**
 * Send templated notification
 */
const sendTemplatedNotification = async (userId, templateName, templateData) => {
  if (!templates[templateName]) {
    throw new Error(`Template '${templateName}' not found`);
  }

  const { notification, data } = templates[templateName](templateData);
  return sendToUser(userId, notification, data);
};

/**
 * Create in-app notification alongside push
 */
const sendWithInApp = async (userId, notification, data = {}) => {
  // Send push notification
  const pushResult = await sendToUser(userId, notification, data);

  // Create in-app notification
  await db.collection('notifications').add({
    userId,
    type: data.type || 'general',
    title: notification.title,
    body: notification.body,
    data,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return pushResult;
};

module.exports = {
  sendToUser,
  sendToUsers,
  sendToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendTemplatedNotification,
  sendWithInApp,
  templates,
};
