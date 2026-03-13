/**
 * FixKart - AI-Powered Home Service Platform
 * Cloud Functions Entry Point
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// Express App
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Import route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workerRoutes = require('./routes/workers');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

// Mount routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/workers', workerRoutes);
app.use('/services', serviceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/reviews', reviewRoutes);
app.use('/notifications', notificationRoutes);
app.use('/ai', aiRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);

// ============================================
// FIRESTORE TRIGGERS
// ============================================

/**
 * Trigger: When a new user is created in Auth
 * Action: Create user profile document in Firestore
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  try {
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email || null,
      phone: user.phoneNumber || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
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
    console.log(`User profile created for ${user.uid}`);
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
});

/**
 * Trigger: When a user is deleted from Auth
 * Action: Mark user as deleted in Firestore (soft delete)
 */
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
  try {
    await db.collection('users').doc(user.uid).update({
      status: 'deleted',
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`User ${user.uid} marked as deleted`);
  } catch (error) {
    console.error('Error handling user deletion:', error);
  }
});

/**
 * Trigger: When a booking status changes
 * Action: Send notifications to relevant parties
 */
exports.onBookingStatusChange = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const bookingId = context.params.bookingId;

    if (before.status !== after.status) {
      const notifications = [];

      // Notify customer
      if (after.customerId) {
        notifications.push(createNotification({
          userId: after.customerId,
          type: 'booking_update',
          title: `Booking ${getStatusText(after.status)}`,
          body: `Your booking #${bookingId.slice(-6).toUpperCase()} is now ${after.status}`,
          data: { bookingId, status: after.status },
        }));
      }

      // Notify worker
      if (after.workerId && after.status !== 'pending') {
        notifications.push(createNotification({
          userId: after.workerId,
          type: 'booking_update',
          title: `Job ${getStatusText(after.status)}`,
          body: `Job #${bookingId.slice(-6).toUpperCase()} status changed to ${after.status}`,
          data: { bookingId, status: after.status },
        }));
      }

      await Promise.all(notifications);

      // Update analytics
      await updateBookingAnalytics(after.status, before.status);
    }
  });

/**
 * Trigger: When a new review is created
 * Action: Update worker rating and send notification
 */
exports.onReviewCreated = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snapshot, context) => {
    const review = snapshot.data();
    const workerId = review.workerId;

    try {
      // Get all reviews for this worker
      const reviewsSnapshot = await db.collection('reviews')
        .where('workerId', '==', workerId)
        .get();

      const reviews = reviewsSnapshot.docs.map(doc => doc.data());
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / reviews.length;

      // Update worker profile
      await db.collection('workers').doc(workerId).update({
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Notify worker
      await createNotification({
        userId: workerId,
        type: 'new_review',
        title: 'New Review Received',
        body: `You received a ${review.rating}-star review`,
        data: { reviewId: context.params.reviewId },
      });

      console.log(`Worker ${workerId} rating updated to ${avgRating}`);
    } catch (error) {
      console.error('Error updating worker rating:', error);
    }
  });

/**
 * Trigger: When a payment is completed
 * Action: Update booking status and worker earnings
 */
exports.onPaymentComplete = functions.firestore
  .document('payments/{paymentId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== 'completed' && after.status === 'completed') {
      const bookingId = after.bookingId;
      const workerId = after.workerId;
      const amount = after.amount;
      const commission = amount * 0.2; // 20% platform commission
      const workerEarnings = amount - commission;

      try {
        // Update booking payment status
        await db.collection('bookings').doc(bookingId).update({
          paymentStatus: 'paid',
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update worker earnings
        await db.collection('workers').doc(workerId).update({
          walletBalance: admin.firestore.FieldValue.increment(workerEarnings),
          totalEarnings: admin.firestore.FieldValue.increment(workerEarnings),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create earning record
        await db.collection('earnings').add({
          workerId,
          bookingId,
          paymentId: context.params.paymentId,
          amount: workerEarnings,
          commission,
          type: 'service',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Payment processed: Worker ${workerId} earned ${workerEarnings}`);
      } catch (error) {
        console.error('Error processing payment completion:', error);
      }
    }
  });

// ============================================
// SCHEDULED FUNCTIONS
// ============================================

/**
 * Scheduled: Every hour
 * Action: Send booking reminders
 */
exports.sendBookingReminders = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const oneHourLater = new Date(now.toDate().getTime() + 60 * 60 * 1000);

    try {
      const bookingsSnapshot = await db.collection('bookings')
        .where('status', '==', 'confirmed')
        .where('scheduledAt', '>=', now)
        .where('scheduledAt', '<=', admin.firestore.Timestamp.fromDate(oneHourLater))
        .where('reminderSent', '==', false)
        .get();

      const batch = db.batch();
      const notifications = [];

      bookingsSnapshot.forEach((doc) => {
        const booking = doc.data();
        
        // Notify customer
        notifications.push(createNotification({
          userId: booking.customerId,
          type: 'booking_reminder',
          title: 'Upcoming Service Reminder',
          body: `Your ${booking.serviceName} is scheduled in 1 hour`,
          data: { bookingId: doc.id },
        }));

        // Notify worker
        if (booking.workerId) {
          notifications.push(createNotification({
            userId: booking.workerId,
            type: 'job_reminder',
            title: 'Upcoming Job Reminder',
            body: `You have a ${booking.serviceName} job in 1 hour`,
            data: { bookingId: doc.id },
          }));
        }

        batch.update(doc.ref, { reminderSent: true });
      });

      await Promise.all([batch.commit(), ...notifications]);
      console.log(`Sent ${notifications.length} booking reminders`);
    } catch (error) {
      console.error('Error sending booking reminders:', error);
    }
  });

/**
 * Scheduled: Daily at midnight
 * Action: Generate daily analytics report
 */
exports.generateDailyReport = functions.pubsub
  .schedule('every day 00:00')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const [bookings, payments, users] = await Promise.all([
        db.collection('bookings')
          .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(yesterday))
          .where('createdAt', '<', admin.firestore.Timestamp.fromDate(today))
          .get(),
        db.collection('payments')
          .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(yesterday))
          .where('createdAt', '<', admin.firestore.Timestamp.fromDate(today))
          .where('status', '==', 'completed')
          .get(),
        db.collection('users')
          .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(yesterday))
          .where('createdAt', '<', admin.firestore.Timestamp.fromDate(today))
          .get(),
      ]);

      const totalRevenue = payments.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
      const completedBookings = bookings.docs.filter(doc => doc.data().status === 'completed').length;
      const cancelledBookings = bookings.docs.filter(doc => doc.data().status === 'cancelled').length;

      await db.collection('analytics').doc(yesterday.toISOString().split('T')[0]).set({
        date: admin.firestore.Timestamp.fromDate(yesterday),
        totalBookings: bookings.size,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        newUsers: users.size,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Daily report generated for ${yesterday.toISOString().split('T')[0]}`);
    } catch (error) {
      console.error('Error generating daily report:', error);
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

async function createNotification({ userId, type, title, body, data }) {
  try {
    await db.collection('notifications').add({
      userId,
      type,
      title,
      body,
      data: data || {},
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Get user's FCM token for push notification
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists && userDoc.data().fcmToken) {
      await admin.messaging().send({
        token: userDoc.data().fcmToken,
        notification: { title, body },
        data: { ...data, type },
      });
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

function getStatusText(status) {
  const texts = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    assigned: 'Worker Assigned',
    on_way: 'Worker On The Way',
    arrived: 'Worker Arrived',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return texts[status] || status;
}

async function updateBookingAnalytics(newStatus, oldStatus) {
  const today = new Date().toISOString().split('T')[0];
  const analyticsRef = db.collection('analytics').doc(`realtime_${today}`);

  const updates = {};
  
  if (newStatus === 'completed') {
    updates['completed'] = admin.firestore.FieldValue.increment(1);
  } else if (newStatus === 'cancelled') {
    updates['cancelled'] = admin.firestore.FieldValue.increment(1);
  }

  if (Object.keys(updates).length > 0) {
    await analyticsRef.set(updates, { merge: true });
  }
}

// Export admin and db for use in route files
module.exports.admin = admin;
module.exports.db = db;
module.exports.auth = auth;
module.exports.storage = storage;
