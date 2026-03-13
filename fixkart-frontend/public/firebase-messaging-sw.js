/**
 * Firebase Cloud Messaging Service Worker
 * This file handles background push notifications
 */

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase config - these should match your .env values
// This is loaded dynamically, but we need defaults for the service worker
const firebaseConfig = {
  apiKey: self.FIREBASE_CONFIG?.apiKey || 'YOUR_API_KEY',
  authDomain: self.FIREBASE_CONFIG?.authDomain || 'YOUR_AUTH_DOMAIN',
  projectId: self.FIREBASE_CONFIG?.projectId || 'YOUR_PROJECT_ID',
  storageBucket: self.FIREBASE_CONFIG?.storageBucket || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: self.FIREBASE_CONFIG?.messagingSenderId || 'YOUR_SENDER_ID',
  appId: self.FIREBASE_CONFIG?.appId || 'YOUR_APP_ID',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'FixKart';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: payload.notification?.image || payload.data?.image,
    data: payload.data || {},
    vibrate: [100, 50, 100],
    tag: payload.data?.tag || 'default',
    renotify: true,
    requireInteraction: payload.data?.requireInteraction === 'true',
    actions: getActionsForType(payload.data?.type),
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Get notification actions based on type
function getActionsForType(type) {
  const actionSets = {
    booking_confirmed: [
      { action: 'view', title: 'View Booking' },
      { action: 'track', title: 'Track' },
    ],
    worker_assigned: [
      { action: 'view', title: 'View Details' },
      { action: 'call', title: 'Call Worker' },
    ],
    worker_on_way: [
      { action: 'track', title: 'Track Live' },
      { action: 'call', title: 'Call' },
    ],
    worker_arrived: [
      { action: 'view_otp', title: 'View OTP' },
    ],
    service_completed: [
      { action: 'rate', title: 'Rate Service' },
      { action: 'invoice', title: 'View Invoice' },
    ],
    payment_received: [
      { action: 'view', title: 'View Details' },
    ],
    promotional: [
      { action: 'view', title: 'Book Now' },
    ],
  };

  return actionSets[type] || [];
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event.notification.tag);
  
  event.notification.close();

  const data = event.notification.data || {};
  let url = '/';

  // Handle different action types
  switch (event.action) {
    case 'view':
    case 'view_booking':
      url = data.bookingId ? `/booking/${data.bookingId}` : '/dashboard/bookings';
      break;
    case 'track':
      url = data.bookingId ? `/track/${data.bookingId}` : '/dashboard/bookings';
      break;
    case 'rate':
      url = data.bookingId ? `/rate/${data.bookingId}` : '/dashboard/bookings';
      break;
    case 'invoice':
      url = data.bookingId ? `/invoice/${data.bookingId}` : '/dashboard/bookings';
      break;
    case 'call':
      // Can't make calls from service worker - open booking details
      url = data.bookingId ? `/booking/${data.bookingId}` : '/dashboard/bookings';
      break;
    case 'view_otp':
      url = data.bookingId ? `/track/${data.bookingId}` : '/dashboard/bookings';
      break;
    default:
      // Use URL from data if available
      if (data.url) {
        url = data.url;
      } else if (data.type) {
        switch (data.type) {
          case 'booking_confirmed':
          case 'booking_cancelled':
          case 'worker_assigned':
          case 'worker_on_way':
          case 'worker_arrived':
          case 'service_started':
          case 'service_completed':
            url = data.bookingId ? `/booking/${data.bookingId}` : '/dashboard/bookings';
            break;
          case 'payment_received':
          case 'refund_processed':
            url = '/wallet';
            break;
          case 'promotional':
            url = '/services';
            break;
          default:
            url = '/notifications';
        }
      }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // Open new window
        return clients.openWindow(url);
      })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event.notification.tag);
});

console.log('[firebase-messaging-sw.js] Service worker loaded');
