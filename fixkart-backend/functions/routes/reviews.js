/**
 * Review Routes
 * Handles review submission, moderation, responses
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

// ============================================
// PUBLIC ROUTES (No auth required)
// ============================================

/**
 * GET /reviews/service/:serviceId
 * Get reviews for a service
 */
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { rating, limit = 10, startAfter, sortBy = 'createdAt' } = req.query;

    let query = db.collection('reviews')
      .where('serviceId', '==', serviceId)
      .where('status', '==', 'approved');

    if (rating) {
      query = query.where('rating', '==', parseInt(rating));
    }

    // Sort
    switch (sortBy) {
      case 'rating_high':
        query = query.orderBy('rating', 'desc');
        break;
      case 'rating_low':
        query = query.orderBy('rating', 'asc');
        break;
      case 'helpful':
        query = query.orderBy('helpfulCount', 'desc');
        break;
      default:
        query = query.orderBy('createdAt', 'desc');
    }

    query = query.limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('reviews').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const reviewsSnapshot = await query.get();

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get rating distribution
    const allReviewsSnapshot = await db.collection('reviews')
      .where('serviceId', '==', serviceId)
      .where('status', '==', 'approved')
      .get();

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    allReviewsSnapshot.docs.forEach(doc => {
      const r = doc.data().rating;
      ratingDistribution[r]++;
      totalRating += r;
    });

    const avgRating = allReviewsSnapshot.size > 0 
      ? (totalRating / allReviewsSnapshot.size).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      reviews,
      stats: {
        averageRating: parseFloat(avgRating),
        totalReviews: allReviewsSnapshot.size,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error('Get service reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

/**
 * GET /reviews/worker/:workerId
 * Get reviews for a worker
 */
router.get('/worker/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;
    const { limit = 10, startAfter } = req.query;

    let query = db.collection('reviews')
      .where('workerId', '==', workerId)
      .where('status', '==', 'approved')
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

    // Get worker stats
    const workerDoc = await db.collection('workers').doc(workerId).get();
    const workerData = workerDoc.exists ? workerDoc.data() : {};

    res.status(200).json({
      success: true,
      reviews,
      stats: {
        averageRating: workerData.rating || 0,
        totalReviews: workerData.totalReviews || 0,
      },
    });
  } catch (error) {
    console.error('Get worker reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// ============================================
// PROTECTED ROUTES
// ============================================

router.use(verifyAuth);

/**
 * POST /reviews
 * Submit a review
 */
router.post('/', async (req, res) => {
  try {
    const {
      bookingId,
      serviceId,
      serviceName,
      workerId,
      workerName,
      rating,
      comment,
      images,
      aspects,
    } = req.body;

    // Validate required fields
    if (!bookingId || !serviceId || !workerId || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify booking exists and belongs to user
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();
    if (bookingData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (bookingData.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    // Check if already reviewed
    const existingReview = await db.collection('reviews')
      .where('bookingId', '==', bookingId)
      .limit(1)
      .get();

    if (!existingReview.empty) {
      return res.status(400).json({ error: 'You have already reviewed this booking' });
    }

    // Get user info
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // Create review
    const reviewRef = await db.collection('reviews').add({
      bookingId,
      serviceId,
      serviceName,
      workerId,
      workerName,
      customerId: req.user.uid,
      customerName: userData.displayName || 'Customer',
      customerPhoto: userData.photoURL || null,
      rating,
      comment: comment || '',
      images: images || [],
      aspects: aspects || {}, // { punctuality: 5, quality: 4, communication: 5 }
      helpfulCount: 0,
      status: 'pending', // pending, approved, rejected
      response: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update booking
    await db.collection('bookings').doc(bookingId).update({
      isReviewed: true,
      reviewId: reviewRef.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Auto-approve reviews with rating >= 3 and no profanity
    const shouldAutoApprove = rating >= 3 && !containsProfanity(comment);
    if (shouldAutoApprove) {
      await reviewRef.update({ status: 'approved' });
      
      // Update service and worker ratings
      await updateServiceRating(serviceId);
      await updateWorkerRating(workerId);
    }

    res.status(201).json({
      success: true,
      reviewId: reviewRef.id,
      message: shouldAutoApprove 
        ? 'Review submitted successfully'
        : 'Review submitted and pending moderation',
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

/**
 * PUT /reviews/:reviewId
 * Update a review
 */
router.put('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, images, aspects } = req.body;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const reviewData = reviewDoc.data();

    // Verify ownership
    if (reviewData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Can only edit within 24 hours
    const createdAt = reviewData.createdAt.toDate();
    const hoursSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      return res.status(400).json({ error: 'Reviews can only be edited within 24 hours' });
    }

    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (rating) updates.rating = rating;
    if (comment !== undefined) updates.comment = comment;
    if (images) updates.images = images;
    if (aspects) updates.aspects = aspects;

    await db.collection('reviews').doc(reviewId).update(updates);

    // Update ratings if rating changed
    if (rating && rating !== reviewData.rating) {
      await updateServiceRating(reviewData.serviceId);
      await updateWorkerRating(reviewData.workerId);
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

/**
 * DELETE /reviews/:reviewId
 * Delete a review
 */
router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const reviewData = reviewDoc.data();

    // Verify ownership
    if (reviewData.customerId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.collection('reviews').doc(reviewId).delete();

    // Update booking
    await db.collection('bookings').doc(reviewData.bookingId).update({
      isReviewed: false,
      reviewId: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update ratings
    await updateServiceRating(reviewData.serviceId);
    await updateWorkerRating(reviewData.workerId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

/**
 * POST /reviews/:reviewId/helpful
 * Mark review as helpful
 */
router.post('/:reviewId/helpful', async (req, res) => {
  try {
    const { reviewId } = req.params;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user already marked as helpful
    const helpfulRef = db.collection('reviewHelpful')
      .doc(`${reviewId}_${req.user.uid}`);
    
    const helpfulDoc = await helpfulRef.get();
    
    if (helpfulDoc.exists) {
      // Remove helpful
      await helpfulRef.delete();
      await db.collection('reviews').doc(reviewId).update({
        helpfulCount: admin.firestore.FieldValue.increment(-1),
      });

      res.status(200).json({
        success: true,
        action: 'removed',
      });
    } else {
      // Add helpful
      await helpfulRef.set({
        reviewId,
        userId: req.user.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await db.collection('reviews').doc(reviewId).update({
        helpfulCount: admin.firestore.FieldValue.increment(1),
      });

      res.status(200).json({
        success: true,
        action: 'added',
      });
    }
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ error: 'Failed to mark as helpful' });
  }
});

/**
 * POST /reviews/:reviewId/report
 * Report a review
 */
router.post('/:reviewId/report', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason, details } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Reason is required' });
    }

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check for duplicate reports
    const existingReport = await db.collection('reviewReports')
      .where('reviewId', '==', reviewId)
      .where('reportedBy', '==', req.user.uid)
      .limit(1)
      .get();

    if (!existingReport.empty) {
      return res.status(400).json({ error: 'You have already reported this review' });
    }

    await db.collection('reviewReports').add({
      reviewId,
      reportedBy: req.user.uid,
      reason,
      details: details || '',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Review reported successfully',
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({ error: 'Failed to report review' });
  }
});

/**
 * GET /reviews/my
 * Get user's reviews
 */
router.get('/my', async (req, res) => {
  try {
    const { limit = 20, startAfter } = req.query;

    let query = db.collection('reviews')
      .where('customerId', '==', req.user.uid)
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

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Simple profanity check
 */
function containsProfanity(text) {
  if (!text) return false;
  const profanityList = ['badword1', 'badword2']; // Add actual profanity list
  const lowerText = text.toLowerCase();
  return profanityList.some(word => lowerText.includes(word));
}

/**
 * Update service average rating
 */
async function updateServiceRating(serviceId) {
  const reviewsSnapshot = await db.collection('reviews')
    .where('serviceId', '==', serviceId)
    .where('status', '==', 'approved')
    .get();

  if (reviewsSnapshot.empty) {
    await db.collection('services').doc(serviceId).update({
      rating: 0,
      reviewCount: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return;
  }

  let totalRating = 0;
  reviewsSnapshot.docs.forEach(doc => {
    totalRating += doc.data().rating;
  });

  const avgRating = totalRating / reviewsSnapshot.size;

  await db.collection('services').doc(serviceId).update({
    rating: parseFloat(avgRating.toFixed(1)),
    reviewCount: reviewsSnapshot.size,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Update worker average rating
 */
async function updateWorkerRating(workerId) {
  const reviewsSnapshot = await db.collection('reviews')
    .where('workerId', '==', workerId)
    .where('status', '==', 'approved')
    .get();

  if (reviewsSnapshot.empty) {
    await db.collection('workers').doc(workerId).update({
      rating: 0,
      totalReviews: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return;
  }

  let totalRating = 0;
  reviewsSnapshot.docs.forEach(doc => {
    totalRating += doc.data().rating;
  });

  const avgRating = totalRating / reviewsSnapshot.size;

  await db.collection('workers').doc(workerId).update({
    rating: parseFloat(avgRating.toFixed(1)),
    totalReviews: reviewsSnapshot.size,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

module.exports = router;
