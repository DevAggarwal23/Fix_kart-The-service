/**
 * Real-time Tracking Service
 * Uses Firebase Realtime Database for live worker location tracking
 */
import { ref, onValue, set, update, off, serverTimestamp, push } from 'firebase/database';
import { realtimeDb } from '../config/firebase';

// Demo mode flag - set to true for demo without Firebase
const DEMO_MODE = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'demo_api_key';

/**
 * Subscribe to worker location updates
 * @param {string} bookingId - Active booking ID
 * @param {Function} callback - Callback with location updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToWorkerLocation = (bookingId, callback) => {
  if (DEMO_MODE) {
    return simulateWorkerMovement(callback);
  }

  const locationRef = ref(realtimeDb, `tracking/${bookingId}/workerLocation`);
  
  const unsubscribe = onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({
        lat: data.lat,
        lng: data.lng,
        heading: data.heading || 0,
        speed: data.speed || 0,
        accuracy: data.accuracy || 10,
        timestamp: data.timestamp
      });
    }
  });

  return () => off(locationRef);
};

/**
 * Subscribe to booking status updates
 * @param {string} bookingId - Booking ID
 * @param {Function} callback - Callback with status updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToBookingStatus = (bookingId, callback) => {
  if (DEMO_MODE) {
    return simulateStatusUpdates(callback);
  }

  const statusRef = ref(realtimeDb, `tracking/${bookingId}/status`);
  
  onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });

  return () => off(statusRef);
};

/**
 * Subscribe to ETA updates
 * @param {string} bookingId - Booking ID
 * @param {Function} callback - Callback with ETA
 * @returns {Function} Unsubscribe function
 */
export const subscribeToETA = (bookingId, callback) => {
  if (DEMO_MODE) {
    return simulateETA(callback);
  }

  const etaRef = ref(realtimeDb, `tracking/${bookingId}/eta`);
  
  onValue(etaRef, (snapshot) => {
    const eta = snapshot.val();
    if (eta) {
      callback(eta);
    }
  });

  return () => off(etaRef);
};

/**
 * Update worker location (called by worker app)
 * @param {string} bookingId - Active booking ID
 * @param {Object} location - Location data
 */
export const updateWorkerLocation = async (bookingId, location) => {
  if (DEMO_MODE) return;

  const locationRef = ref(realtimeDb, `tracking/${bookingId}/workerLocation`);
  
  await set(locationRef, {
    lat: location.lat,
    lng: location.lng,
    heading: location.heading || 0,
    speed: location.speed || 0,
    accuracy: location.accuracy || 10,
    timestamp: serverTimestamp()
  });
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 * @param {Object} additionalData - Extra data
 */
export const updateBookingStatus = async (bookingId, status, additionalData = {}) => {
  if (DEMO_MODE) return;

  const statusRef = ref(realtimeDb, `tracking/${bookingId}/status`);
  
  await set(statusRef, {
    current: status,
    timestamp: serverTimestamp(),
    ...additionalData
  });
};

/**
 * Send chat message
 * @param {string} bookingId - Booking ID  
 * @param {Object} message - Message object
 */
export const sendChatMessage = async (bookingId, message) => {
  if (DEMO_MODE) return { id: 'demo_' + Date.now() };

  const chatRef = ref(realtimeDb, `chats/${bookingId}/messages`);
  const newMessageRef = push(chatRef);
  
  await set(newMessageRef, {
    ...message,
    timestamp: serverTimestamp()
  });

  return { id: newMessageRef.key };
};

/**
 * Subscribe to chat messages
 * @param {string} bookingId - Booking ID
 * @param {Function} callback - Callback with messages
 * @returns {Function} Unsubscribe function
 */
export const subscribeToChatMessages = (bookingId, callback) => {
  if (DEMO_MODE) {
    callback([
      { id: '1', text: 'Hi! I\'m on my way.', sender: 'worker', timestamp: Date.now() - 300000 },
      { id: '2', text: 'Great, please ring the bell when you arrive.', sender: 'user', timestamp: Date.now() - 240000 }
    ]);
    return () => {};
  }

  const chatRef = ref(realtimeDb, `chats/${bookingId}/messages`);
  
  onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messages = Object.entries(data).map(([id, msg]) => ({
        id,
        ...msg
      })).sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    }
  });

  return () => off(chatRef);
};

// ========== DEMO SIMULATION FUNCTIONS ==========

/**
 * Simulate worker movement for demo mode
 */
const simulateWorkerMovement = (callback) => {
  // Starting point (simulated worker location)
  let currentLat = 28.6200;
  let currentLng = 77.2100;
  
  // Destination (user location)
  const destLat = 28.6139;
  const destLng = 77.2090;
  
  const stepLat = (destLat - currentLat) / 30;
  const stepLng = (destLng - currentLng) / 30;
  
  let step = 0;
  
  const interval = setInterval(() => {
    if (step < 30) {
      currentLat += stepLat + (Math.random() - 0.5) * 0.0005;
      currentLng += stepLng + (Math.random() - 0.5) * 0.0005;
      step++;
      
      callback({
        lat: currentLat,
        lng: currentLng,
        heading: Math.atan2(stepLat, stepLng) * 180 / Math.PI,
        speed: 25 + Math.random() * 10,
        accuracy: 5,
        timestamp: Date.now()
      });
    } else {
      // Worker arrived
      callback({
        lat: destLat,
        lng: destLng,
        heading: 0,
        speed: 0,
        accuracy: 5,
        timestamp: Date.now(),
        arrived: true
      });
    }
  }, 2000); // Update every 2 seconds
  
  return () => clearInterval(interval);
};

/**
 * Simulate status updates for demo mode
 */
const simulateStatusUpdates = (callback) => {
  const statuses = [
    { current: 'confirmed', label: 'Booking Confirmed', delay: 0 },
    { current: 'assigned', label: 'Professional Assigned', delay: 3000 },
    { current: 'on_the_way', label: 'On The Way', delay: 6000 },
    { current: 'nearby', label: 'Nearby', delay: 30000 },
    { current: 'arrived', label: 'Arrived', delay: 60000 }
  ];

  let currentIndex = 0;

  const updateStatus = () => {
    if (currentIndex < statuses.length) {
      callback({
        current: statuses[currentIndex].current,
        label: statuses[currentIndex].label,
        timestamp: Date.now()
      });
      currentIndex++;
    }
  };

  // Initial status
  updateStatus();

  // Schedule next updates
  const timeouts = statuses.slice(1).map((status, index) => 
    setTimeout(updateStatus, status.delay)
  );

  return () => timeouts.forEach(t => clearTimeout(t));
};

/**
 * Simulate ETA updates for demo mode
 */
const simulateETA = (callback) => {
  let eta = 15; // Start with 15 minutes
  
  callback({
    minutes: eta,
    distance: '3.2 km',
    traffic: 'moderate'
  });

  const interval = setInterval(() => {
    eta = Math.max(0, eta - 1);
    
    callback({
      minutes: eta,
      distance: `${(eta * 0.2).toFixed(1)} km`,
      traffic: eta > 5 ? 'moderate' : 'light',
      arrived: eta === 0
    });

    if (eta === 0) {
      clearInterval(interval);
    }
  }, 60000); // Update every minute

  return () => clearInterval(interval);
};

/**
 * Booking status steps for UI
 */
export const BOOKING_STATUS_STEPS = [
  { id: 'confirmed', title: 'Booking Confirmed', icon: '✅', description: 'Your booking has been confirmed' },
  { id: 'assigned', title: 'Professional Assigned', icon: '👷', description: 'A professional has been assigned' },
  { id: 'on_the_way', title: 'On The Way', icon: '🚗', description: 'Professional is heading to your location' },
  { id: 'arrived', title: 'Arrived', icon: '📍', description: 'Professional has arrived' },
  { id: 'in_progress', title: 'Work In Progress', icon: '🔧', description: 'Service is being performed' },
  { id: 'completed', title: 'Completed', icon: '🎉', description: 'Service has been completed' }
];

export default {
  subscribeToWorkerLocation,
  subscribeToBookingStatus,
  subscribeToETA,
  subscribeToChatMessages,
  updateWorkerLocation,
  updateBookingStatus,
  sendChatMessage,
  BOOKING_STATUS_STEPS
};
