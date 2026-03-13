/**
 * Admin Routes
 * Handles admin dashboard, user/worker management, analytics
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const moment = require('moment-timezone');

const db = admin.firestore();

// Middleware to verify admin authentication
const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if user is admin
    const userDoc = await db.collection('admins').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = decodedToken;
    req.adminData = userDoc.data();
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply admin middleware to all routes
router.use(verifyAdmin);

// ============================================
// DASHBOARD ANALYTICS
// ============================================

/**
 * GET /admin/dashboard
 * Get dashboard overview stats
 */
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = moment().startOf('week').toDate();
    const startOfMonth = moment().startOf('month').toDate();

    // Today's stats
    const [
      todayBookings,
      todayRevenue,
      totalUsers,
      totalWorkers,
      activeWorkers,
      pendingBookings,
      completedToday,
      cancelledToday,
    ] = await Promise.all([
      db.collection('bookings')
        .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startOfDay))
        .count()
        .get(),
      db.collection('bookings')
        .where('paymentStatus', '==', 'paid')
        .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startOfDay))
        .get(),
      db.collection('users').count().get(),
      db.collection('workers').count().get(),
      db.collection('workers')
        .where('isAvailable', '==', true)
        .where('status', '==', 'active')
        .count()
        .get(),
      db.collection('bookings')
        .where('status', '==', 'pending')
        .count()
        .get(),
      db.collection('bookings')
        .where('status', '==', 'completed')
        .where('completedAt', '>=', admin.firestore.Timestamp.fromDate(startOfDay))
        .count()
        .get(),
      db.collection('bookings')
        .where('status', '==', 'cancelled')
        .where('cancelledAt', '>=', admin.firestore.Timestamp.fromDate(startOfDay))
        .count()
        .get(),
    ]);

    // Calculate today's revenue
    let todayRevenueAmount = 0;
    todayRevenue.docs.forEach(doc => {
      todayRevenueAmount += doc.data().finalAmount || 0;
    });

    // Weekly stats
    const weeklyBookings = await db.collection('bookings')
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startOfWeek))
      .get();

    const weeklyRevenueAmount = weeklyBookings.docs.reduce((sum, doc) => {
      if (doc.data().paymentStatus === 'paid') {
        return sum + (doc.data().finalAmount || 0);
      }
      return sum;
    }, 0);

    // Recent activities
    const recentActivities = await db.collection('activities')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const activities = recentActivities.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      stats: {
        today: {
          bookings: todayBookings.data().count,
          revenue: todayRevenueAmount,
          completed: completedToday.data().count,
          cancelled: cancelledToday.data().count,
        },
        weekly: {
          bookings: weeklyBookings.size,
          revenue: weeklyRevenueAmount,
        },
        totals: {
          users: totalUsers.data().count,
          workers: totalWorkers.data().count,
          activeWorkers: activeWorkers.data().count,
          pendingBookings: pendingBookings.data().count,
        },
      },
      recentActivities: activities,
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

/**
 * GET /admin/analytics
 * Get detailed analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    // Calculate date range
    let startDate;
    switch (period) {
      case '24h':
        startDate = moment().subtract(24, 'hours').toDate();
        break;
      case '7d':
        startDate = moment().subtract(7, 'days').toDate();
        break;
      case '30d':
        startDate = moment().subtract(30, 'days').toDate();
        break;
      case '90d':
        startDate = moment().subtract(90, 'days').toDate();
        break;
      default:
        startDate = moment().subtract(7, 'days').toDate();
    }

    // Get bookings in range
    const bookingsSnapshot = await db.collection('bookings')
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
      .get();

    // Process booking data
    const dailyStats = {};
    const categoryStats = {};
    const statusStats = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    let totalRevenue = 0;
    let paidBookings = 0;

    bookingsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const date = moment(data.createdAt.toDate()).format('YYYY-MM-DD');

      // Daily breakdown
      if (!dailyStats[date]) {
        dailyStats[date] = { bookings: 0, revenue: 0 };
      }
      dailyStats[date].bookings++;
      if (data.paymentStatus === 'paid') {
        dailyStats[date].revenue += data.finalAmount || 0;
        totalRevenue += data.finalAmount || 0;
        paidBookings++;
      }

      // Category breakdown
      const category = data.category || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = { bookings: 0, revenue: 0 };
      }
      categoryStats[category].bookings++;
      if (data.paymentStatus === 'paid') {
        categoryStats[category].revenue += data.finalAmount || 0;
      }

      // Status breakdown
      if (statusStats[data.status] !== undefined) {
        statusStats[data.status]++;
      }
    });

    // Get new users in range
    const newUsersSnapshot = await db.collection('users')
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
      .count()
      .get();

    // Get top services
    const topServicesSnapshot = await db.collection('services')
      .orderBy('bookingCount', 'desc')
      .limit(10)
      .get();

    const topServices = topServicesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      category: doc.data().category,
      bookings: doc.data().bookingCount || 0,
      revenue: doc.data().totalRevenue || 0,
    }));

    // Get top workers
    const topWorkersSnapshot = await db.collection('workers')
      .orderBy('completedJobs', 'desc')
      .limit(10)
      .get();

    const topWorkers = topWorkersSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().displayName,
      completedJobs: doc.data().completedJobs || 0,
      rating: doc.data().rating || 0,
      earnings: doc.data().totalEarnings || 0,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        summary: {
          totalBookings: bookingsSnapshot.size,
          paidBookings,
          totalRevenue,
          avgOrderValue: paidBookings > 0 ? totalRevenue / paidBookings : 0,
          newUsers: newUsersSnapshot.data().count,
        },
        dailyStats,
        categoryStats,
        statusStats,
        topServices,
        topWorkers,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * GET /admin/users
 * Get all users with filters
 */
router.get('/users', async (req, res) => {
  try {
    const { status, search, limit = 20, startAfter } = req.query;

    let query = db.collection('users').orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('users').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const usersSnapshot = await query.get();

    let users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side search
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(u =>
        u.displayName?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        u.phone?.includes(search)
      );
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

/**
 * GET /admin/users/:userId
 * Get user details
 */
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's bookings
    const bookingsSnapshot = await db.collection('bookings')
      .where('customerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      user: { id: userDoc.id, ...userDoc.data() },
      bookings,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * PUT /admin/users/:userId
 * Update user status
 */
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, notes } = req.body;

    await db.collection('users').doc(userId).update({
      status,
      adminNotes: notes || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid,
    });

    // Log activity
    await db.collection('activities').add({
      type: 'user_status_change',
      targetId: userId,
      targetType: 'user',
      action: `Status changed to ${status}`,
      performedBy: req.user.uid,
      performedByName: req.adminData.displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'User updated',
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ============================================
// WORKER MANAGEMENT
// ============================================

/**
 * GET /admin/workers
 * Get all workers
 */
router.get('/workers', async (req, res) => {
  try {
    const { status, category, verified, limit = 20, startAfter } = req.query;

    let query = db.collection('workers').orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    if (verified !== undefined) {
      query = query.where('isVerified', '==', verified === 'true');
    }

    query = query.limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('workers').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const workersSnapshot = await query.get();

    let workers = workersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by category
    if (category) {
      workers = workers.filter(w => w.categories?.includes(category));
    }

    res.status(200).json({
      success: true,
      workers,
    });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({ error: 'Failed to get workers' });
  }
});

/**
 * GET /admin/workers/:workerId
 * Get worker details
 */
router.get('/workers/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;

    const workerDoc = await db.collection('workers').doc(workerId).get();
    if (!workerDoc.exists) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Get worker's documents
    const documentsSnapshot = await db.collection('workerDocuments')
      .where('workerId', '==', workerId)
      .get();

    const documents = documentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get recent jobs
    const jobsSnapshot = await db.collection('bookings')
      .where('workerId', '==', workerId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const jobs = jobsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      worker: { id: workerDoc.id, ...workerDoc.data() },
      documents,
      recentJobs: jobs,
    });
  } catch (error) {
    console.error('Get worker error:', error);
    res.status(500).json({ error: 'Failed to get worker' });
  }
});

/**
 * PUT /admin/workers/:workerId
 * Update worker status (approve/suspend/verify)
 */
router.put('/workers/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;
    const { status, isVerified, notes, commissionRate } = req.body;

    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid,
    };

    if (status) updates.status = status;
    if (isVerified !== undefined) updates.isVerified = isVerified;
    if (notes) updates.adminNotes = notes;
    if (commissionRate) updates.commissionRate = commissionRate;

    await db.collection('workers').doc(workerId).update(updates);

    // Log activity
    await db.collection('activities').add({
      type: 'worker_update',
      targetId: workerId,
      targetType: 'worker',
      action: status ? `Status changed to ${status}` : 'Worker updated',
      performedBy: req.user.uid,
      performedByName: req.adminData.displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Worker updated',
    });
  } catch (error) {
    console.error('Update worker error:', error);
    res.status(500).json({ error: 'Failed to update worker' });
  }
});

/**
 * POST /admin/workers/:workerId/verify-document
 * Verify worker document
 */
router.post('/workers/:workerId/verify-document', async (req, res) => {
  try {
    const { workerId } = req.params;
    const { documentId, verified, rejection_reason } = req.body;

    await db.collection('workerDocuments').doc(documentId).update({
      verified,
      rejectionReason: rejection_reason || null,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      verifiedBy: req.user.uid,
    });

    // Check if all documents are verified
    const documentsSnapshot = await db.collection('workerDocuments')
      .where('workerId', '==', workerId)
      .get();

    const allVerified = documentsSnapshot.docs.every(doc => doc.data().verified === true);

    if (allVerified) {
      await db.collection('workers').doc(workerId).update({
        isVerified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(200).json({
      success: true,
      message: verified ? 'Document verified' : 'Document rejected',
      allVerified,
    });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({ error: 'Failed to verify document' });
  }
});

// ============================================
// BOOKING MANAGEMENT
// ============================================

/**
 * GET /admin/bookings
 * Get all bookings
 */
router.get('/bookings', async (req, res) => {
  try {
    const { status, date, category, limit = 20, startAfter } = req.query;

    let query = db.collection('bookings').orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    if (date) {
      const startOfDay = moment(date).startOf('day').toDate();
      const endOfDay = moment(date).endOf('day').toDate();
      query = query
        .where('scheduledAt', '>=', admin.firestore.Timestamp.fromDate(startOfDay))
        .where('scheduledAt', '<=', admin.firestore.Timestamp.fromDate(endOfDay));
    }

    query = query.limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('bookings').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    const bookingsSnapshot = await query.get();

    let bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (category) {
      bookings = bookings.filter(b => b.category === category);
    }

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
 * PUT /admin/bookings/:bookingId/assign
 * Assign worker to booking
 */
router.put('/bookings/:bookingId/assign', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { workerId } = req.body;

    const [bookingDoc, workerDoc] = await Promise.all([
      db.collection('bookings').doc(bookingId).get(),
      db.collection('workers').doc(workerId).get(),
    ]);

    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!workerDoc.exists) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const workerData = workerDoc.data();

    await db.collection('bookings').doc(bookingId).update({
      workerId,
      workerName: workerData.displayName,
      workerPhone: workerData.phone,
      workerPhoto: workerData.photoURL,
      status: 'assigned',
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      assignedBy: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Notify worker
    await db.collection('notifications').add({
      userId: workerId,
      type: 'job_assigned',
      title: 'New Job Assigned',
      body: `You have been assigned a new ${bookingDoc.data().serviceName} job`,
      data: { bookingId },
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Worker assigned successfully',
    });
  } catch (error) {
    console.error('Assign worker error:', error);
    res.status(500).json({ error: 'Failed to assign worker' });
  }
});

// ============================================
// SERVICE MANAGEMENT
// ============================================

/**
 * POST /admin/services
 * Create a new service
 */
router.post('/services', async (req, res) => {
  try {
    const serviceData = req.body;

    const serviceRef = await db.collection('services').add({
      ...serviceData,
      status: 'active',
      bookingCount: 0,
      totalRevenue: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      serviceId: serviceRef.id,
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

/**
 * PUT /admin/services/:serviceId
 * Update a service
 */
router.put('/services/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updates = req.body;

    await db.collection('services').doc(serviceId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid,
    });

    res.status(200).json({
      success: true,
      message: 'Service updated',
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

/**
 * DELETE /admin/services/:serviceId
 * Delete a service (soft delete)
 */
router.delete('/services/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;

    await db.collection('services').doc(serviceId).update({
      status: 'deleted',
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      deletedBy: req.user.uid,
    });

    res.status(200).json({
      success: true,
      message: 'Service deleted',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ============================================
// CATEGORY MANAGEMENT
// ============================================

/**
 * POST /admin/categories
 * Create a new category
 */
router.post('/categories', async (req, res) => {
  try {
    const categoryData = req.body;

    const categoryRef = await db.collection('categories').add({
      ...categoryData,
      status: 'active',
      serviceCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid,
    });

    res.status(201).json({
      success: true,
      categoryId: categoryRef.id,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

/**
 * PUT /admin/categories/:categoryId
 * Update a category
 */
router.put('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updates = req.body;

    await db.collection('categories').doc(categoryId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated',
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// ============================================
// COUPON MANAGEMENT
// ============================================

/**
 * GET /admin/coupons
 * Get all coupons
 */
router.get('/coupons', async (req, res) => {
  try {
    const couponsSnapshot = await db.collection('coupons')
      .orderBy('createdAt', 'desc')
      .get();

    const coupons = couponsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Failed to get coupons' });
  }
});

/**
 * POST /admin/coupons
 * Create a coupon
 */
router.post('/coupons', async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minAmount,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      perUserLimit,
      categories,
      description,
    } = req.body;

    // Check if code already exists
    const existingCoupon = await db.collection('coupons').doc(code.toUpperCase()).get();
    if (existingCoupon.exists) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    await db.collection('coupons').doc(code.toUpperCase()).set({
      code: code.toUpperCase(),
      type, // 'percentage' or 'fixed'
      value,
      minAmount: minAmount || 0,
      maxDiscount: maxDiscount || null,
      validFrom: admin.firestore.Timestamp.fromDate(new Date(validFrom)),
      validUntil: admin.firestore.Timestamp.fromDate(new Date(validUntil)),
      usageLimit: usageLimit || null,
      perUserLimit: perUserLimit || 1,
      usedCount: 0,
      categories: categories || [],
      description: description || '',
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid,
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created',
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

/**
 * PUT /admin/coupons/:couponCode
 * Update a coupon
 */
router.put('/coupons/:couponCode', async (req, res) => {
  try {
    const { couponCode } = req.params;
    const updates = req.body;

    if (updates.validFrom) {
      updates.validFrom = admin.firestore.Timestamp.fromDate(new Date(updates.validFrom));
    }
    if (updates.validUntil) {
      updates.validUntil = admin.firestore.Timestamp.fromDate(new Date(updates.validUntil));
    }

    await db.collection('coupons').doc(couponCode.toUpperCase()).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid,
    });

    res.status(200).json({
      success: true,
      message: 'Coupon updated',
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

// ============================================
// REVIEW MODERATION
// ============================================

/**
 * GET /admin/reviews/pending
 * Get pending reviews
 */
router.get('/reviews/pending', async (req, res) => {
  try {
    const reviewsSnapshot = await db.collection('reviews')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'asc')
      .limit(50)
      .get();

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

/**
 * PUT /admin/reviews/:reviewId/moderate
 * Moderate a review
 */
router.put('/reviews/:reviewId/moderate', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action, reason } = req.body; // approve, reject

    await db.collection('reviews').doc(reviewId).update({
      status: action === 'approve' ? 'approved' : 'rejected',
      moderatedAt: admin.firestore.FieldValue.serverTimestamp(),
      moderatedBy: req.user.uid,
      moderationReason: reason || null,
    });

    res.status(200).json({
      success: true,
      message: `Review ${action}d`,
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({ error: 'Failed to moderate review' });
  }
});

// ============================================
// SETTINGS
// ============================================

/**
 * GET /admin/settings
 * Get platform settings
 */
router.get('/settings', async (req, res) => {
  try {
    const settingsDoc = await db.collection('settings').doc('platform').get();

    const defaultSettings = {
      platformName: 'FixKart',
      supportEmail: 'support@fixkart.com',
      supportPhone: '1800-123-4567',
      commissionRate: 20,
      cancellationFee: 50,
      minBookingAmount: 149,
      maxAdvanceBookingDays: 30,
      operatingHours: { start: '08:00', end: '21:00' },
      servicableRadius: 25,
    };

    const settings = settingsDoc.exists
      ? { ...defaultSettings, ...settingsDoc.data() }
      : defaultSettings;

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
 * PUT /admin/settings
 * Update platform settings
 */
router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;

    await db.collection('settings').doc('platform').set({
      ...settings,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid,
    }, { merge: true });

    res.status(200).json({
      success: true,
      message: 'Settings updated',
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
