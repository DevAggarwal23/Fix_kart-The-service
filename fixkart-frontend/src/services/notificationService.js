/**
 * Notification Service
 */
import api, { endpoints } from './api';
import { initMessaging } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export const notificationService = {
  // Get notifications
  async getNotifications(page = 1, limit = 20) {
    const params = new URLSearchParams({ page, limit });
    return api.get(`${endpoints.notifications.list}?${params}`);
  },

  // Mark as read
  async markAsRead(notificationId) {
    return api.put(endpoints.notifications.read(notificationId));
  },

  // Mark all as read
  async markAllAsRead() {
    return api.put(endpoints.notifications.readAll);
  },

  // Delete notification
  async deleteNotification(notificationId) {
    return api.delete(endpoints.notifications.delete(notificationId));
  },

  // Clear all notifications
  async clearAll() {
    return api.delete(endpoints.notifications.clearAll);
  },

  // Get notification preferences
  async getPreferences() {
    return api.get(endpoints.notifications.preferences);
  },

  // Update preferences
  async updatePreferences(preferences) {
    return api.put(endpoints.notifications.preferences, preferences);
  },

  // FCM Token Management
  async registerFCMToken() {
    try {
      const messaging = await initMessaging();
      if (!messaging) {
        console.log('FCM not supported');
        return null;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        // Register token with backend
        await api.post(endpoints.notifications.fcmToken, {
          token,
          device: this.getDeviceInfo(),
        });
        return token;
      }
    } catch (error) {
      console.error('Error registering FCM token:', error);
    }
    return null;
  },

  // Remove FCM token
  async removeFCMToken(token) {
    return api.delete(endpoints.notifications.fcmToken, { data: { token } });
  },

  // Listen for foreground messages
  async onForegroundMessage(callback) {
    const messaging = await initMessaging();
    if (!messaging) return () => {};

    return onMessage(messaging, (payload) => {
      console.log('Foreground message:', payload);
      callback(payload);
    });
  },

  // Get device info
  getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'web';
    let platform = 'unknown';

    if (/android/i.test(ua)) {
      platform = 'android';
    } else if (/iPad|iPhone|iPod/.test(ua)) {
      platform = 'ios';
    } else if (/Win/.test(ua)) {
      platform = 'windows';
    } else if (/Mac/.test(ua)) {
      platform = 'mac';
    } else if (/Linux/.test(ua)) {
      platform = 'linux';
    }

    return {
      device,
      platform,
      userAgent: ua,
    };
  },

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  },

  // Check notification permission
  checkPermission() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  },

  // Show local notification
  showLocalNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge.png',
        ...options,
      });
    }
  },
};

export default notificationService;
