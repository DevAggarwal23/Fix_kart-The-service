/**
 * Constants
 */

export const APP_NAME = 'FixKart';
export const APP_TAGLINE = 'AI-Powered Home Services';

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ASSIGNED: 'assigned',
  ON_THE_WAY: 'on_the_way',
  ARRIVED: 'arrived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
};

// Payment methods
export const PAYMENT_METHODS = {
  RAZORPAY: 'razorpay',
  WALLET: 'wallet',
  CASH: 'cash',
};

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  ADMIN: 'admin',
};

// Service categories
export const CATEGORIES = [
  { id: 'home-cleaning', name: 'Home Cleaning', icon: '🧹', color: '#10B981' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', color: '#F59E0B' },
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', color: '#3B82F6' },
  { id: 'ac-appliance', name: 'AC & Appliance', icon: '❄️', color: '#6366F1' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪵', color: '#78350F' },
  { id: 'painting', name: 'Painting', icon: '🎨', color: '#EC4899' },
  { id: 'pest-control', name: 'Pest Control', icon: '🐜', color: '#059669' },
  { id: 'salon-spa', name: 'Salon & Spa', icon: '💆', color: '#DB2777' },
];

// Cities
export const CITIES = [
  { id: 'delhi', name: 'New Delhi', state: 'Delhi' },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh' },
  { id: 'gurgaon', name: 'Gurgaon', state: 'Haryana' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra' },
];

// Address types
export const ADDRESS_TYPES = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'office', label: 'Office', icon: '🏢' },
  { id: 'other', label: 'Other', icon: '📍' },
];

// Notification types
export const NOTIFICATION_TYPES = {
  BOOKING: 'booking',
  PAYMENT: 'payment',
  PROMOTION: 'promotion',
  REVIEW: 'review',
  SYSTEM: 'system',
  WORKER: 'worker',
};

// Rating labels
export const RATING_LABELS = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

// Cancel reasons
export const CANCEL_REASONS = [
  { id: 'changed_mind', label: 'Changed my mind' },
  { id: 'found_alternative', label: 'Found alternative service' },
  { id: 'price_issue', label: 'Price too high' },
  { id: 'scheduling_conflict', label: 'Scheduling conflict' },
  { id: 'emergency', label: 'Emergency/Urgent work' },
  { id: 'other', label: 'Other reason' },
];

// Time slots display
export const TIME_SLOTS_CONFIG = {
  startHour: 8,
  endHour: 20,
  slotDuration: 60, // minutes
};

// Wallet limits
export const WALLET_LIMITS = {
  MIN_RECHARGE: 100,
  MAX_BALANCE: 10000,
  RECHARGE_OPTIONS: [100, 200, 500, 1000, 2000, 5000],
};

// Referral config
export const REFERRAL_CONFIG = {
  REFERRER_BONUS: 100,
  REFEREE_DISCOUNT: 50,
};

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AADHAAR: /^[2-9]{1}[0-9]{11}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
};

// Animation variants for Framer Motion
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Page transition
export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Something went wrong. Please try again.',
  VALIDATION: 'Please check your input and try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking confirmed successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully.',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully.',
  ADDRESS_SAVED: 'Address saved successfully.',
  REVIEW_SUBMITTED: 'Thank you for your review!',
};

// API endpoints base
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/fixkart/us-central1/api';

// Google Maps config
export const GOOGLE_MAPS_CONFIG = {
  defaultCenter: { lat: 28.6139, lng: 77.2090 }, // Delhi
  defaultZoom: 12,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

// Support info
export const SUPPORT = {
  email: 'support@fixkart.com',
  phone: '+91-1800-123-4567',
  whatsapp: '+919876543200',
  hours: '9 AM - 9 PM, 7 days a week',
};

// Social links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/fixkart',
  twitter: 'https://twitter.com/fixkart',
  instagram: 'https://instagram.com/fixkart',
  linkedin: 'https://linkedin.com/company/fixkart',
  youtube: 'https://youtube.com/fixkart',
};

// App links
export const APP_LINKS = {
  playStore: 'https://play.google.com/store/apps/details?id=com.fixkart',
  appStore: 'https://apps.apple.com/app/fixkart',
};
