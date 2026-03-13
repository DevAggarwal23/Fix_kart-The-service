/**
 * Worker Routes
 * Handles worker profiles, jobs, earnings, availability
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
// WORKER PROFILE
// ============================================

/**
 * GET /workers/profile
 * Get current worker's profile
 */
router.get('/profile', async (req, res) => {
  try {
    const workerDoc = await db.collection('workers').doc(req.user.uid).get();

    if (!workerDoc.exists) {
      return res.status(404).json({ error: 'Worker profile not found' });
    }

    res.status(200).json({
      success: true,
      worker: workerDoc.data(),
    });
  } catch (error) {
    console.error('Get worker profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * PUT /workers/profile
 * Update worker profile
 */
router.put('/profile', async (req, res) => {
  try {
    const { 
      displayName, 
      phone, 
      photoURL, 
      experience,
      bio,
      categories,
      specializations,
    } = req.body;

    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (displayName) updates.displayName = displayName;
    if (phone) updates.phone = phone;
    if (photoURL) updates.photoURL = photoURL;
    if (experience !== undefined) updates.experience = experience;
    if (bio) updates.bio = bio;
    if (categories) updates.categories = categories;
    if (specializations) updates.specializations = specializations;

    await db.collection('workers').doc(req.user.uid).update(updates);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============================================
// ONLINE STATUS & LOCATION
// ============================================

/**
 * PUT /workers/status
 * Toggle online/offline status
 */
router.put('/status', async (req, res) => {
  try {
    const { isOnline } = req.body;

    await db.collection('workers').doc(req.user.uid).update({
      isOnline,
      statusUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      isOnline,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

/**
 * PUT /workers/location
 * Update current location
 */
router.put('/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    await db.collection('workers').doc(req.user.uid).update({
      currentLocation: new admin.firestore.GeoPoint(latitude, longitude),
      locationUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Location updated',
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// ============================================
// AVAILABILITY
// ============================================

/**
 * GET /workers/availability
 * Get worker's availability schedule
 */
router.get('/availability', async (req, res) => {
  try {
    const workerDoc = await db.collection('workers').doc(req.user.uid).get();
    const availability = workerDoc.data()?.availability || {};

    res.status(200).json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to get availability' });
  }
});

/**
 * PUT /workers/availability
 * Update availability schedule
 */
router.put('/availability', async (req, res) => {
  try {
    const { availability } = req.body;

    await db.collection('workers').doc(req.user.uid).update({
      availability,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Availability updated',
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// ============================================
// JOBS
// ============================================

/**
 * GET /workers/jobs/new
 * Get new job requests for worker
 */
router.get('/jobs/new', async (req, res) => {
  try {
    const workerDoc = await db.collection('workers').doc(req.user.uid).get();
    const workerData = workerDoc.data();

    const jobsSnapshot = await db.collection('bookings')
      .where('status', '==', 'pending')
      .where('category', 'in', workerData.categories)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const jobs = jobsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error('Get new jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
});

/**
 * GET /workers/jobs/scheduled
 * Get worker's scheduled jobs
 */
router.get('/jobs/scheduled', async (req, res) => {
  try {
    const jobsSnapshot = await db.collection('bookings')
      .where('workerId', '==', req.user.uid)
      .where('status', 'in', ['assigned', 'confirmed', 'on_way', 'arrived'])
      .orderBy('scheduledAt', 'asc')
      .get();

    const jobs = jobsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error('Get scheduled jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
});

/**
 * GET /workers/jobs/history
 * Get worker's completed jobs
 */
router.get('/jobs/history', async (req, res) => {
  try {
    const { limit = 20, startAfter } = req.query;

    let query = db.collection('bookings')
      .where('workerId', '==', req.user.uid)
      .where('status', 'in', ['completed', 'cancelled'])
      .orderBy('completedAt', 'desc')
      .limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('bookings').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const jobsSnapshot = await query.get();

    const jobs = jobsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error('Get job history error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
});

/**
 * POST /workers/jobs/:jobId/accept
 * Accept a job
 */
router.post('/jobs/:jobId/accept', async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobDoc = await db.collection('bookings').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const jobData = jobDoc.data();
    if (jobData.status !== 'pending') {
      return res.status(400).json({ error: 'Job is no longer available' });
    }

    // Update job
    await db.collection('bookings').doc(jobId).update({
      workerId: req.user.uid,
      status: 'assigned',
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update worker's job count
    await db.collection('workers').doc(req.user.uid).update({
      totalJobs: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Job accepted successfully',
    });
  } catch (error) {
    console.error('Accept job error:', error);
    res.status(500).json({ error: 'Failed to accept job' });
  }
});

/**
 * POST /workers/jobs/:jobId/decline
 * Decline a job
 */
router.post('/jobs/:jobId/decline', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { reason } = req.body;

    // Log decline for analytics
    await db.collection('jobDeclines').add({
      jobId,
      workerId: req.user.uid,
      reason: reason || 'Not specified',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Job declined',
    });
  } catch (error) {
    console.error('Decline job error:', error);
    res.status(500).json({ error: 'Failed to decline job' });
  }
});

/**
 * PUT /workers/jobs/:jobId/status
 * Update job status (on_way, arrived, in_progress, completed)
 */
router.put('/jobs/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, otp, additionalItems, notes } = req.body;

    const validStatuses = ['on_way', 'arrived', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const jobDoc = await db.collection('bookings').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const jobData = jobDoc.data();

    // Verify worker owns this job
    if (jobData.workerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Status-specific updates
    switch (status) {
      case 'on_way':
        updates.onWayAt = admin.firestore.FieldValue.serverTimestamp();
        break;
      case 'arrived':
        updates.arrivedAt = admin.firestore.FieldValue.serverTimestamp();
        break;
      case 'in_progress':
        // Verify OTP
        if (jobData.otp !== otp) {
          return res.status(400).json({ error: 'Invalid OTP' });
        }
        updates.otpVerified = true;
        updates.startedAt = admin.firestore.FieldValue.serverTimestamp();
        break;
      case 'completed':
        updates.completedAt = admin.firestore.FieldValue.serverTimestamp();
        if (additionalItems) updates.additionalItems = additionalItems;
        if (notes) updates.completionNotes = notes;
        
        // Update worker stats
        await db.collection('workers').doc(req.user.uid).update({
          completedJobs: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        break;
    }

    await db.collection('bookings').doc(jobId).update(updates);

    res.status(200).json({
      success: true,
      message: `Job status updated to ${status}`,
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

// ============================================
// EARNINGS
// ============================================

/**
 * GET /workers/earnings
 * Get earnings summary and transactions
 */
router.get('/earnings', async (req, res) => {
  try {
    const workerDoc = await db.collection('workers').doc(req.user.uid).get();
    const workerData = workerDoc.data();

    // Get recent earnings
    const earningsSnapshot = await db.collection('earnings')
      .where('workerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const transactions = earningsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate weekly earnings
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyEarnings = transactions
      .filter(t => t.createdAt?.toDate() > oneWeekAgo && t.type === 'service')
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      balance: workerData.walletBalance || 0,
      totalEarnings: workerData.totalEarnings || 0,
      weeklyEarnings,
      completedJobs: workerData.completedJobs || 0,
      transactions,
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ error: 'Failed to get earnings' });
  }
});

/**
 * POST /workers/withdraw
 * Request withdrawal
 */
router.post('/withdraw', async (req, res) => {
  try {
    const { amount, bankAccount } = req.body;

    const workerDoc = await db.collection('workers').doc(req.user.uid).get();
    const workerData = workerDoc.data();

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    if (amount > workerData.walletBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create withdrawal request
    const withdrawalRef = await db.collection('withdrawals').add({
      workerId: req.user.uid,
      amount,
      bankAccount,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Deduct from wallet
    await db.collection('workers').doc(req.user.uid).update({
      walletBalance: admin.firestore.FieldValue.increment(-amount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create earning record
    await db.collection('earnings').add({
      workerId: req.user.uid,
      type: 'withdrawal',
      amount: -amount,
      withdrawalId: withdrawalRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted',
      withdrawalId: withdrawalRef.id,
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

// ============================================
// REVIEWS
// ============================================

/**
 * GET /workers/reviews
 * Get worker's reviews
 */
router.get('/reviews', async (req, res) => {
  try {
    const { limit = 20, startAfter } = req.query;

    let query = db.collection('reviews')
      .where('workerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('reviews').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const reviewsSnapshot = await query.get();

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get rating breakdown
    const allReviewsSnapshot = await db.collection('reviews')
      .where('workerId', '==', req.user.uid)
      .get();

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviewsSnapshot.docs.forEach(doc => {
      const rating = doc.data().rating;
      if (ratingBreakdown[rating] !== undefined) {
        ratingBreakdown[rating]++;
      }
    });

    res.status(200).json({
      success: true,
      reviews,
      ratingBreakdown,
      totalReviews: allReviewsSnapshot.size,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// ============================================
// DOCUMENTS
// ============================================

/**
 * GET /workers/documents
 * Get worker's documents status
 */
router.get('/documents', async (req, res) => {
  try {
    const documentsSnapshot = await db.collection('workerDocuments')
      .where('workerId', '==', req.user.uid)
      .get();

    const documents = documentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to get documents' });
  }
});

/**
 * POST /workers/documents
 * Upload a document
 */
router.post('/documents', async (req, res) => {
  try {
    const { type, documentUrl, documentNumber, expiryDate } = req.body;

    const validTypes = ['id_proof', 'address_proof', 'certificate', 'photo'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    if (!documentUrl) {
      return res.status(400).json({ error: 'Document URL is required' });
    }

    const docRef = await db.collection('workerDocuments').add({
      workerId: req.user.uid,
      type,
      documentUrl,
      documentNumber: documentNumber || null,
      expiryDate: expiryDate || null,
      status: 'pending',
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update worker's document status
    await db.collection('workers').doc(req.user.uid).update({
      documentsSubmitted: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      documentId: docRef.id,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

module.exports = router;
