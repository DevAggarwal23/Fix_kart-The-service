/**
 * Service Management (Categories & Services)
 */
import api, { endpoints } from './api';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

export const serviceService = {
  // Get all categories
  async getCategories() {
    return api.get(endpoints.services.categories);
  },

  // Get all services
  async getServices(filters = {}) {
    const params = new URLSearchParams(filters);
    return api.get(`${endpoints.services.list}?${params}`);
  },

  // Get services by category
  async getServicesByCategory(categorySlug) {
    return api.get(endpoints.services.byCategory(categorySlug));
  },

  // Get service details
  async getServiceById(serviceId) {
    return api.get(endpoints.services.detail(serviceId));
  },

  // Get popular services
  async getPopularServices(limit = 8) {
    return api.get(`${endpoints.services.popular}?limit=${limit}`);
  },

  // Search services
  async searchServices(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters });
    return api.get(`${endpoints.services.search}?${params}`);
  },

  // Get service reviews
  async getServiceReviews(serviceId, page = 1, limit = 10) {
    const params = new URLSearchParams({ page, limit });
    return api.get(`${endpoints.reviews.byService(serviceId)}?${params}`);
  },

  // Get categories from Firestore (offline support)
  async getCategoriesLocal() {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('isActive', '==', true), orderBy('displayOrder'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get services from Firestore (offline support)
  async getServicesLocal(categoryId = null) {
    const servicesRef = collection(db, 'services');
    let q;
    
    if (categoryId) {
      q = query(
        servicesRef,
        where('categoryId', '==', categoryId),
        where('isActive', '==', true),
        orderBy('bookingsCount', 'desc')
      );
    } else {
      q = query(
        servicesRef,
        where('isActive', '==', true),
        orderBy('bookingsCount', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get service detail from Firestore
  async getServiceLocal(serviceId) {
    const docRef = doc(db, 'services', serviceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    return null;
  },
};

export default serviceService;
