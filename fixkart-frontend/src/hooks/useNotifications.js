/**
 * Custom Notifications Hook
 */
import { useState, useCallback, useEffect } from 'react';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

  // Initialize FCM and listen for messages
  useEffect(() => {
    const initFCM = async () => {
      try {
        const token = await notificationService.registerFCMToken();
        setFcmToken(token);

        // Listen for foreground messages
        await notificationService.onForegroundMessage((payload) => {
          const { title, body } = payload.notification || {};
          if (title) {
            toast(body, {
              icon: '🔔',
              duration: 5000,
            });
            // Refresh notifications
            fetchNotifications();
          }
        });
      } catch (err) {
        console.log('FCM initialization failed:', err);
      }
    };

    initFCM();
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await notificationService.getNotifications(page, limit);
      setNotifications(result.notifications || result);
      setUnreadCount(result.unreadCount || result.filter(n => !n.read).length);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  }, []);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch (err) {
      toast.error('Failed to clear notifications');
    }
  }, []);

  // Get preferences
  const fetchPreferences = useCallback(async () => {
    try {
      const prefs = await notificationService.getPreferences();
      setPreferences(prefs);
      return prefs;
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (newPrefs) => {
    try {
      await notificationService.updatePreferences(newPrefs);
      setPreferences(newPrefs);
      toast.success('Preferences updated');
    } catch (err) {
      toast.error('Failed to update preferences');
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async () => {
    const status = await notificationService.requestPermission();
    if (status === 'granted') {
      const token = await notificationService.registerFCMToken();
      setFcmToken(token);
      toast.success('Notifications enabled!');
    } else if (status === 'denied') {
      toast.error('Notification permission was denied');
    }
    return status;
  }, []);

  // Check permission
  const checkPermission = useCallback(() => {
    return notificationService.checkPermission();
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    error,
    fcmToken,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    fetchPreferences,
    updatePreferences,
    requestPermission,
    checkPermission,
    clearError: () => setError(null),
  };
};

export default useNotifications;
