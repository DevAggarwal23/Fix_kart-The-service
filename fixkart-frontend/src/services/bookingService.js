/**
 * Booking Service
 */
import api, { endpoints } from './api';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export const bookingService = {
  // Create booking
  async create(bookingData) {
    return api.post(endpoints.bookings.create, bookingData);
  },

  // Get user's bookings
  async getMyBookings(filters = {}) {
    const params = new URLSearchParams(filters);
    return api.get(`${endpoints.bookings.list}?${params}`);
  },

  // Get booking details
  async getBookingById(bookingId) {
    return api.get(endpoints.bookings.detail(bookingId));
  },

  // Cancel booking
  async cancelBooking(bookingId, reason) {
    return api.post(endpoints.bookings.cancel(bookingId), { reason });
  },

  // Get booking tracking
  async trackBooking(bookingId) {
    return api.get(endpoints.bookings.track(bookingId));
  },

  // Get invoice
  async getInvoice(bookingId) {
    return api.get(endpoints.bookings.invoice(bookingId));
  },

  // Get upcoming bookings
  async getUpcoming() {
    return api.get(endpoints.bookings.upcoming);
  },

  // Get active bookings
  async getActive() {
    return api.get(endpoints.bookings.active);
  },

  // Real-time booking updates (Firestore)
  subscribeToBooking(bookingId, callback) {
    const bookingRef = doc(db, 'bookings', bookingId);
    return onSnapshot(bookingRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
  },

  // Real-time worker location (Firestore)
  subscribeToWorkerLocation(workerId, callback) {
    const workerRef = doc(db, 'workerLocations', workerId);
    return onSnapshot(workerRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  },

  // Calculate estimated price
  calculatePrice(service, options = {}) {
    let basePrice = service.discountedPrice || service.basePrice;
    let total = basePrice;
    
    // Add quantity multiplier
    if (options.quantity && options.quantity > 1) {
      total *= options.quantity;
    }
    
    // Add addon prices
    if (options.addons && options.addons.length > 0) {
      options.addons.forEach(addon => {
        total += addon.price;
      });
    }
    
    // Apply coupon
    let discount = 0;
    if (options.coupon) {
      if (options.coupon.type === 'percentage') {
        discount = Math.min(
          (total * options.coupon.value) / 100,
          options.coupon.maxDiscount || Infinity
        );
      } else {
        discount = options.coupon.value;
      }
    }
    
    const subtotal = total - discount;
    const tax = subtotal * 0.18; // 18% GST
    const grandTotal = subtotal + tax;
    
    return {
      basePrice,
      quantity: options.quantity || 1,
      addonsTotal: options.addons?.reduce((sum, a) => sum + a.price, 0) || 0,
      subtotal: total,
      discount,
      taxAmount: tax,
      taxRate: 18,
      total: grandTotal,
    };
  },

  // Get available time slots
  getTimeSlots(date) {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const displayStart = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
      const displayEnd = (hour + 1) > 12 ? `${(hour + 1) - 12}:00 PM` : `${hour + 1}:00 AM`;
      
      slots.push({
        id: `${start}-${end}`,
        start,
        end,
        display: `${displayStart} - ${displayEnd}`,
        available: true,
      });
    }
    
    return slots;
  },
};

export default bookingService;
