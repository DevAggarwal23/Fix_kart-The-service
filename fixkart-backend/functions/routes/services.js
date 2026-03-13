/**
 * Services Routes
 * Handles service categories, service details, search
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

// ============================================
// PUBLIC ROUTES (No auth required)
// ============================================

/**
 * GET /services/categories
 * Get all service categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categoriesSnapshot = await db.collection('serviceCategories')
      .where('status', '==', 'active')
      .orderBy('order', 'asc')
      .get();

    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

/**
 * GET /services/categories/:categoryId
 * Get category details with services
 */
router.get('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    const categoryDoc = await db.collection('serviceCategories').doc(categoryId).get();
    if (!categoryDoc.exists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get services in this category
    const servicesSnapshot = await db.collection('services')
      .where('categoryId', '==', categoryId)
      .where('status', '==', 'active')
      .orderBy('popularity', 'desc')
      .get();

    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      category: {
        id: categoryDoc.id,
        ...categoryDoc.data(),
      },
      services,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to get category' });
  }
});

/**
 * GET /services
 * Get all services (with optional filters)
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, startAfter } = req.query;

    let query = db.collection('services')
      .where('status', '==', 'active')
      .orderBy('popularity', 'desc');

    if (category) {
      query = query.where('categoryId', '==', category);
    }

    query = query.limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection('services').doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    let servicesSnapshot = await query.get();
    let services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side search filter if search query provided
    if (search) {
      const searchLower = search.toLowerCase();
      services = services.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

/**
 * GET /services/:serviceId
 * Get service details
 */
router.get('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;

    const serviceDoc = await db.collection('services').doc(serviceId).get();
    if (!serviceDoc.exists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const serviceData = serviceDoc.data();

    // Get category info
    let category = null;
    if (serviceData.categoryId) {
      const categoryDoc = await db.collection('serviceCategories').doc(serviceData.categoryId).get();
      if (categoryDoc.exists) {
        category = { id: categoryDoc.id, ...categoryDoc.data() };
      }
    }

    // Get related services
    const relatedSnapshot = await db.collection('services')
      .where('categoryId', '==', serviceData.categoryId)
      .where('status', '==', 'active')
      .limit(5)
      .get();

    const relatedServices = relatedSnapshot.docs
      .filter(doc => doc.id !== serviceId)
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

    // Get service reviews
    const reviewsSnapshot = await db.collection('reviews')
      .where('serviceId', '==', serviceId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      service: {
        id: serviceDoc.id,
        ...serviceData,
      },
      category,
      relatedServices,
      reviews,
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
});

/**
 * GET /services/popular
 * Get popular services
 */
router.get('/list/popular', async (req, res) => {
  try {
    const servicesSnapshot = await db.collection('services')
      .where('status', '==', 'active')
      .orderBy('popularity', 'desc')
      .limit(10)
      .get();

    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

/**
 * GET /services/search/:query
 * Search services
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchLower = query.toLowerCase();

    // Get all active services
    const servicesSnapshot = await db.collection('services')
      .where('status', '==', 'active')
      .get();

    // Filter by search query
    const services = servicesSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
      .slice(0, 20);

    res.status(200).json({
      success: true,
      services,
      query,
    });
  } catch (error) {
    console.error('Search services error:', error);
    res.status(500).json({ error: 'Failed to search services' });
  }
});

/**
 * GET /services/nearby
 * Get services available in user's area
 */
router.get('/list/nearby', async (req, res) => {
  try {
    const { city, lat, lng } = req.query;

    // For now, return all active services
    // TODO: Implement geo-filtering when workers have location data
    const servicesSnapshot = await db.collection('services')
      .where('status', '==', 'active')
      .orderBy('popularity', 'desc')
      .limit(20)
      .get();

    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      services,
      location: { city, lat, lng },
    });
  } catch (error) {
    console.error('Get nearby services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

/**
 * GET /services/:serviceId/time-slots
 * Get available time slots for a service
 */
router.get('/:serviceId/time-slots', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const serviceDoc = await db.collection('services').doc(serviceId).get();
    if (!serviceDoc.exists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Generate time slots (8 AM to 8 PM, hourly)
    const slots = [];
    const serviceDate = new Date(date);
    const now = new Date();

    for (let hour = 8; hour <= 20; hour++) {
      const slotTime = new Date(serviceDate);
      slotTime.setHours(hour, 0, 0, 0);

      // Skip past time slots
      if (slotTime > now) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: true, // TODO: Check worker availability
          workers: Math.floor(Math.random() * 5) + 1, // Mock available workers
        });
      }
    }

    res.status(200).json({
      success: true,
      date,
      slots,
    });
  } catch (error) {
    console.error('Get time slots error:', error);
    res.status(500).json({ error: 'Failed to get time slots' });
  }
});

/**
 * GET /services/:serviceId/pricing
 * Get service pricing with variants
 */
router.get('/:serviceId/pricing', async (req, res) => {
  try {
    const { serviceId } = req.params;

    const serviceDoc = await db.collection('services').doc(serviceId).get();
    if (!serviceDoc.exists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const serviceData = serviceDoc.data();

    // Get pricing variants
    const variantsSnapshot = await db.collection('servicePricing')
      .where('serviceId', '==', serviceId)
      .orderBy('price', 'asc')
      .get();

    const variants = variantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      basePrice: serviceData.price,
      discountPrice: serviceData.discountPrice,
      variants,
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ error: 'Failed to get pricing' });
  }
});

module.exports = router;
