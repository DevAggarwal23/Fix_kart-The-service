/**
 * API Client Configuration
 */
import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/fixkart/us-central1/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Token expired or invalid - sign out
      auth.signOut();
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Access denied');
    }
    
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    sendOTP: '/auth/send-otp',
    verifyOTP: '/auth/verify-otp',
    me: '/auth/me',
    updateProfile: '/auth/profile',
  },
  
  // Users
  users: {
    profile: '/users/profile',
    addresses: '/users/addresses',
    favorites: '/users/favorites',
  },
  
  // Services
  services: {
    list: '/services',
    categories: '/services/categories',
    popular: '/services/popular',
    search: '/services/search',
    detail: (id) => `/services/${id}`,
    byCategory: (slug) => `/services/category/${slug}`,
  },
  
  // Bookings
  bookings: {
    list: '/bookings',
    create: '/bookings',
    detail: (id) => `/bookings/${id}`,
    cancel: (id) => `/bookings/${id}/cancel`,
    track: (id) => `/bookings/${id}/track`,
    invoice: (id) => `/bookings/${id}/invoice`,
    upcoming: '/bookings/list/upcoming',
    active: '/bookings/list/active',
  },
  
  // Payments
  payments: {
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
    history: '/payments/history',
    refund: (id) => `/payments/${id}/refund`,
    wallet: {
      add: '/payments/wallet/add',
      verify: '/payments/wallet/verify',
      pay: '/payments/wallet/pay',
    },
  },
  
  // Reviews
  reviews: {
    submit: '/reviews',
    byService: (id) => `/reviews/service/${id}`,
    byWorker: (id) => `/reviews/worker/${id}`,
    my: '/reviews/my',
    helpful: (id) => `/reviews/${id}/helpful`,
    report: (id) => `/reviews/${id}/report`,
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    read: (id) => `/notifications/${id}/read`,
    readAll: '/notifications/read-all',
    delete: (id) => `/notifications/${id}`,
    clearAll: '/notifications/clear-all',
    fcmToken: '/notifications/fcm-token',
    preferences: '/notifications/preferences',
  },
  
  // AI
  ai: {
    chat: '/ai/chat',
    search: '/ai/smart-search',
    analyzeImage: '/ai/analyze-image',
    estimate: '/ai/estimate',
    troubleshoot: '/ai/troubleshoot',
  },
  
  // Workers
  workers: {
    nearby: '/workers/nearby',
    detail: (id) => `/workers/${id}`,
    availability: (id) => `/workers/${id}/availability`,
  },
};
