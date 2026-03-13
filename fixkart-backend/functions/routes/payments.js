/**
 * Payment Routes
 * Handles Razorpay integration, payment processing
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const db = admin.firestore();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

// Apply auth middleware to most routes
router.use((req, res, next) => {
  // Webhook doesn't need auth
  if (req.path === '/webhook') {
    return next();
  }
  verifyAuth(req, res, next);
});

// ============================================
// ORDER CREATION
// ============================================

/**
 * POST /payments/create-order
 * Create a Razorpay order
 */
router.post('/create-order', async (req, res) => {
  try {
    const { bookingId, amount, currency = 'INR' } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify booking
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Verify ownership
    if (bookingData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId,
        customerId: req.user.uid,
        serviceName: bookingData.serviceName,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Store order in Firestore
    await db.collection('payments').add({
      orderId: order.id,
      bookingId,
      customerId: req.user.uid,
      amount,
      currency,
      status: 'created',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

/**
 * POST /payments/verify
 * Verify Razorpay payment
 */
router.post('/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingId } = req.body;

    if (!orderId || !paymentId || !signature || !bookingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    // Update payment record
    const paymentSnapshot = await db.collection('payments')
      .where('orderId', '==', orderId)
      .limit(1)
      .get();

    if (!paymentSnapshot.empty) {
      await paymentSnapshot.docs[0].ref.update({
        paymentId,
        signature,
        status: 'completed',
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Update booking payment status
    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: 'paid',
      paymentId,
      paymentMethod: payment.method,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

/**
 * POST /payments/webhook
 * Razorpay webhook handler
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    const eventType = event.event;
    const payload = event.payload;

    switch (eventType) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;

      case 'refund.processed':
        await handleRefundProcessed(payload.refund.entity);
        break;

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook handlers
async function handlePaymentCaptured(payment) {
  const bookingId = payment.notes?.bookingId;
  if (!bookingId) return;

  await db.collection('bookings').doc(bookingId).update({
    paymentStatus: 'paid',
    paymentId: payment.id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function handlePaymentFailed(payment) {
  const bookingId = payment.notes?.bookingId;
  if (!bookingId) return;

  await db.collection('payments')
    .where('orderId', '==', payment.order_id)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        doc.ref.update({
          status: 'failed',
          errorCode: payment.error_code,
          errorDescription: payment.error_description,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
    });
}

async function handleRefundProcessed(refund) {
  const paymentId = refund.payment_id;

  await db.collection('refunds').add({
    refundId: refund.id,
    paymentId,
    amount: refund.amount / 100,
    status: refund.status,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ============================================
// REFUNDS
// ============================================

/**
 * POST /payments/:paymentId/refund
 * Initiate a refund
 */
router.post('/:paymentId/refund', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    // Get payment record
    const paymentSnapshot = await db.collection('payments')
      .where('paymentId', '==', paymentId)
      .limit(1)
      .get();

    if (paymentSnapshot.empty) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const paymentData = paymentSnapshot.docs[0].data();

    // Verify ownership
    if (paymentData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create refund with Razorpay
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined, // Full refund if no amount
      notes: {
        reason: reason || 'Customer request',
        initiatedBy: 'customer',
      },
    });

    // Store refund record
    await db.collection('refunds').add({
      refundId: refund.id,
      paymentId,
      bookingId: paymentData.bookingId,
      customerId: req.user.uid,
      amount: refund.amount / 100,
      status: refund.status,
      reason: reason || 'Customer request',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// ============================================
// WALLET
// ============================================

/**
 * POST /payments/wallet/add
 * Add money to wallet
 */
router.post('/wallet/add', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Minimum amount is ₹100' });
    }

    // Create Razorpay order for wallet recharge
    const orderOptions = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `wallet_${req.user.uid}_${Date.now()}`,
      notes: {
        customerId: req.user.uid,
        type: 'wallet_recharge',
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Store order
    await db.collection('payments').add({
      orderId: order.id,
      customerId: req.user.uid,
      type: 'wallet_recharge',
      amount,
      currency: 'INR',
      status: 'created',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Add to wallet error:', error);
    res.status(500).json({ error: 'Failed to create wallet recharge order' });
  }
});

/**
 * POST /payments/wallet/verify
 * Verify wallet recharge payment
 */
router.post('/wallet/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Get payment details
    const paymentSnapshot = await db.collection('payments')
      .where('orderId', '==', orderId)
      .limit(1)
      .get();

    if (paymentSnapshot.empty) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const paymentData = paymentSnapshot.docs[0].data();

    // Update user wallet
    await db.collection('users').doc(req.user.uid).update({
      walletBalance: admin.firestore.FieldValue.increment(paymentData.amount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create wallet transaction
    await db.collection('walletTransactions').add({
      userId: req.user.uid,
      type: 'credit',
      amount: paymentData.amount,
      description: 'Wallet recharge',
      paymentId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update payment record
    await paymentSnapshot.docs[0].ref.update({
      paymentId,
      signature,
      status: 'completed',
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Wallet recharged successfully',
    });
  } catch (error) {
    console.error('Verify wallet payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

/**
 * POST /payments/wallet/pay
 * Pay for booking using wallet
 */
router.post('/wallet/pay', async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user wallet balance
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const walletBalance = userData.walletBalance || 0;

    if (walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Deduct from wallet
    await db.collection('users').doc(req.user.uid).update({
      walletBalance: admin.firestore.FieldValue.increment(-amount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create wallet transaction
    await db.collection('walletTransactions').add({
      userId: req.user.uid,
      type: 'debit',
      amount,
      description: `Payment for booking`,
      bookingId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update booking payment status
    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: 'paid',
      paymentMethod: 'wallet',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      newBalance: walletBalance - amount,
    });
  } catch (error) {
    console.error('Wallet payment error:', error);
    res.status(500).json({ error: 'Failed to process wallet payment' });
  }
});

// ============================================
// PAYMENT HISTORY
// ============================================

/**
 * GET /payments/history
 * Get payment history
 */
router.get('/history', async (req, res) => {
  try {
    const { limit = 20, startAfter } = req.query;

    let query = db.collection('payments')
      .where('customerId', '==', req.user.uid)
      .where('status', '==', 'completed')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('payments').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const paymentsSnapshot = await query.get();

    const payments = paymentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

/**
 * GET /payments/:paymentId
 * Get payment details
 */
router.get('/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentSnapshot = await db.collection('payments')
      .where('paymentId', '==', paymentId)
      .limit(1)
      .get();

    if (paymentSnapshot.empty) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const paymentData = paymentSnapshot.docs[0].data();

    // Verify ownership
    if (paymentData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      payment: {
        id: paymentSnapshot.docs[0].id,
        ...paymentData,
      },
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to get payment' });
  }
});

module.exports = router;
