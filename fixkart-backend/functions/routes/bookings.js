/**
 * Booking Routes
 * Handles booking creation, status updates, tracking
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

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
// BOOKING CRUD
// ============================================

/**
 * POST /bookings
 * Create a new booking
 */
router.post('/', async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      categoryId,
      category,
      price,
      discountPrice,
      scheduledDate,
      scheduledTime,
      address,
      notes,
      couponCode,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!serviceId || !scheduledDate || !scheduledTime || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate OTP for worker verification
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Calculate amounts
    let finalAmount = discountPrice || price;
    let discountAmount = 0;
    let couponDiscount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const couponDoc = await db.collection('coupons').doc(couponCode.toUpperCase()).get();
      if (couponDoc.exists) {
        const coupon = couponDoc.data();
        if (coupon.status === 'active' && coupon.minAmount <= finalAmount) {
          if (coupon.type === 'percentage') {
            couponDiscount = Math.min(finalAmount * (coupon.value / 100), coupon.maxDiscount || Infinity);
          } else {
            couponDiscount = coupon.value;
          }
          finalAmount -= couponDiscount;
        }
      }
    }

    // Parse scheduled datetime
    const [year, month, day] = scheduledDate.split('-');
    const [hours, minutes] = scheduledTime.split(':');
    const scheduledAt = new Date(year, month - 1, day, hours, minutes);

    // Create booking
    const bookingRef = await db.collection('bookings').add({
      bookingNumber: `FIX${Date.now().toString(36).toUpperCase()}`,
      customerId: req.user.uid,
      customerEmail: req.user.email,
      serviceId,
      serviceName,
      categoryId,
      category,
      basePrice: price,
      discountPrice: discountPrice || null,
      couponCode: couponCode || null,
      couponDiscount,
      finalAmount,
      scheduledDate,
      scheduledTime,
      scheduledAt: admin.firestore.Timestamp.fromDate(scheduledAt),
      address,
      notes: notes || '',
      otp,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: paymentMethod || 'online',
      workerId: null,
      workerName: null,
      workerPhone: null,
      workerPhoto: null,
      reminderSent: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user's booking count
    await db.collection('users').doc(req.user.uid).update({
      totalBookings: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create notification
    await db.collection('notifications').add({
      userId: req.user.uid,
      type: 'booking_created',
      title: 'Booking Confirmed',
      body: `Your ${serviceName} booking has been confirmed for ${scheduledDate} at ${scheduledTime}`,
      data: { bookingId: bookingRef.id },
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      bookingId: bookingRef.id,
      otp,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/**
 * GET /bookings
 * Get user's bookings
 */
router.get('/', async (req, res) => {
  try {
    const { status, limit = 20, startAfter } = req.query;

    let query = db.collection('bookings')
      .where('customerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('bookings').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const bookingsSnapshot = await query.get();

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Hide OTP from customer until worker arrives
      otp: doc.data().status === 'arrived' ? doc.data().otp : undefined,
    }));

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

/**
 * GET /bookings/:bookingId
 * Get booking details
 */
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Verify ownership
    if (bookingData.customerId !== req.user.uid && bookingData.workerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Get worker details if assigned
    let worker = null;
    if (bookingData.workerId) {
      const workerDoc = await db.collection('workers').doc(bookingData.workerId).get();
      if (workerDoc.exists) {
        const workerData = workerDoc.data();
        worker = {
          id: workerDoc.id,
          displayName: workerData.displayName,
          phone: workerData.phone,
          photoURL: workerData.photoURL,
          rating: workerData.rating,
          totalJobs: workerData.completedJobs,
          currentLocation: workerData.currentLocation,
        };
      }
    }

    // Hide OTP unless worker has arrived
    const responseData = {
      id: bookingDoc.id,
      ...bookingData,
      otp: bookingData.status === 'arrived' ? bookingData.otp : undefined,
      worker,
    };

    res.status(200).json({
      success: true,
      booking: responseData,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
});

/**
 * PUT /bookings/:bookingId
 * Update booking (reschedule)
 */
router.put('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { scheduledDate, scheduledTime, address, notes } = req.body;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Verify ownership
    if (bookingData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if booking can be modified
    if (!['pending', 'confirmed', 'assigned'].includes(bookingData.status)) {
      return res.status(400).json({ error: 'Booking cannot be modified at this stage' });
    }

    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (scheduledDate && scheduledTime) {
      const [year, month, day] = scheduledDate.split('-');
      const [hours, minutes] = scheduledTime.split(':');
      const scheduledAt = new Date(year, month - 1, day, hours, minutes);

      updates.scheduledDate = scheduledDate;
      updates.scheduledTime = scheduledTime;
      updates.scheduledAt = admin.firestore.Timestamp.fromDate(scheduledAt);
      updates.reminderSent = false;
    }

    if (address) updates.address = address;
    if (notes !== undefined) updates.notes = notes;

    await db.collection('bookings').doc(bookingId).update(updates);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

/**
 * POST /bookings/:bookingId/cancel
 * Cancel a booking
 */
router.post('/:bookingId/cancel', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Verify ownership
    if (bookingData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled', 'in_progress'].includes(bookingData.status)) {
      return res.status(400).json({ error: 'Booking cannot be cancelled at this stage' });
    }

    // Calculate refund
    let refundAmount = bookingData.finalAmount;
    const scheduledAt = bookingData.scheduledAt.toDate();
    const hoursUntilService = (scheduledAt - new Date()) / (1000 * 60 * 60);

    if (hoursUntilService < 2) {
      // Less than 2 hours - 50% refund
      refundAmount = bookingData.finalAmount * 0.5;
    } else if (hoursUntilService < 24) {
      // Less than 24 hours - 80% refund
      refundAmount = bookingData.finalAmount * 0.8;
    }

    await db.collection('bookings').doc(bookingId).update({
      status: 'cancelled',
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      cancellationReason: reason || 'Customer request',
      refundAmount,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Process refund to wallet if payment was made
    if (bookingData.paymentStatus === 'paid') {
      await db.collection('users').doc(req.user.uid).update({
        walletBalance: admin.firestore.FieldValue.increment(refundAmount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await db.collection('walletTransactions').add({
        userId: req.user.uid,
        type: 'refund',
        amount: refundAmount,
        description: `Refund for booking #${bookingData.bookingNumber}`,
        bookingId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled',
      refundAmount,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// ============================================
// TRACKING
// ============================================

/**
 * GET /bookings/:bookingId/track
 * Get real-time tracking info
 */
router.get('/:bookingId/track', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Verify ownership
    if (bookingData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    let workerLocation = null;
    let eta = null;

    if (bookingData.workerId && bookingData.status === 'on_way') {
      const workerDoc = await db.collection('workers').doc(bookingData.workerId).get();
      if (workerDoc.exists) {
        const workerData = workerDoc.data();
        workerLocation = workerData.currentLocation;
        // TODO: Calculate ETA using Google Maps API
        eta = '15 mins';
      }
    }

    res.status(200).json({
      success: true,
      status: bookingData.status,
      workerLocation,
      eta,
      timestamps: {
        created: bookingData.createdAt,
        assigned: bookingData.assignedAt,
        onWay: bookingData.onWayAt,
        arrived: bookingData.arrivedAt,
        started: bookingData.startedAt,
        completed: bookingData.completedAt,
      },
    });
  } catch (error) {
    console.error('Track booking error:', error);
    res.status(500).json({ error: 'Failed to get tracking info' });
  }
});

// ============================================
// INVOICE
// ============================================

/**
 * GET /bookings/:bookingId/invoice
 * Get booking invoice
 */
router.get('/:bookingId/invoice', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Verify ownership
    if (bookingData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Get payment info
    let payment = null;
    const paymentSnapshot = await db.collection('payments')
      .where('bookingId', '==', bookingId)
      .where('status', '==', 'completed')
      .limit(1)
      .get();

    if (!paymentSnapshot.empty) {
      payment = paymentSnapshot.docs[0].data();
    }

    // Get customer info
    const userDoc = await db.collection('users').doc(bookingData.customerId).get();
    const customer = userDoc.exists ? userDoc.data() : {};

    const invoice = {
      invoiceNumber: `INV-${bookingData.bookingNumber}`,
      bookingNumber: bookingData.bookingNumber,
      bookingId,
      customer: {
        name: customer.displayName || 'Customer',
        email: customer.email,
        phone: customer.phone,
      },
      service: {
        name: bookingData.serviceName,
        category: bookingData.category,
      },
      scheduledAt: bookingData.scheduledAt,
      address: bookingData.address,
      billing: {
        basePrice: bookingData.basePrice,
        discount: bookingData.basePrice - (bookingData.discountPrice || bookingData.basePrice),
        couponDiscount: bookingData.couponDiscount || 0,
        additionalCharges: bookingData.additionalItems?.reduce((sum, item) => sum + item.price, 0) || 0,
        total: bookingData.finalAmount + (bookingData.additionalItems?.reduce((sum, item) => sum + item.price, 0) || 0),
      },
      payment: payment ? {
        method: payment.method,
        transactionId: payment.transactionId,
        paidAt: payment.paidAt,
      } : null,
      status: bookingData.status,
      createdAt: bookingData.createdAt,
      completedAt: bookingData.completedAt,
    };

    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to get invoice' });
  }
});

// ============================================
// UPCOMING & ACTIVE
// ============================================

/**
 * GET /bookings/list/upcoming
 * Get upcoming bookings
 */
router.get('/list/upcoming', async (req, res) => {
  try {
    const now = admin.firestore.Timestamp.now();

    const bookingsSnapshot = await db.collection('bookings')
      .where('customerId', '==', req.user.uid)
      .where('status', 'in', ['pending', 'confirmed', 'assigned'])
      .where('scheduledAt', '>=', now)
      .orderBy('scheduledAt', 'asc')
      .limit(10)
      .get();

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('Get upcoming bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

/**
 * GET /bookings/list/active
 * Get active (in-progress) bookings
 */
router.get('/list/active', async (req, res) => {
  try {
    const bookingsSnapshot = await db.collection('bookings')
      .where('customerId', '==', req.user.uid)
      .where('status', 'in', ['on_way', 'arrived', 'in_progress'])
      .orderBy('scheduledAt', 'asc')
      .get();

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      otp: doc.data().status === 'arrived' ? doc.data().otp : undefined,
    }));

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('Get active bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

module.exports = router;
