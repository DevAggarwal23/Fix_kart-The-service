import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiX, FiPackage, FiTool, FiDollarSign, FiStar } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAuthStore();
  
  // Mock notifications if empty
  const displayNotifications = notifications.length > 0 ? notifications : [
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your AC service booking is confirmed for tomorrow at 10 AM',
      time: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: 2,
      type: 'worker',
      title: 'Worker Assigned',
      message: 'Rajesh Kumar has been assigned to your plumbing job',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Successful',
      message: '₹599 paid successfully for AC service',
      time: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
    {
      id: 4,
      type: 'rating',
      title: 'Rate Your Service',
      message: 'How was your experience with the electrician?',
      time: new Date(Date.now() - 1000 * 60 * 60 * 48),
      read: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return <FiPackage className="w-5 h-5 text-primary-500" />;
      case 'worker': return <FiTool className="w-5 h-5 text-green-500" />;
      case 'payment': return <FiDollarSign className="w-5 h-5 text-secondary-500" />;
      case 'rating': return <FiStar className="w-5 h-5 text-yellow-500" />;
      default: return <FiBell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return format(date, 'MMM d');
  };

  const unreadDisplayCount = displayNotifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <FiBell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {unreadDisplayCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadDisplayCount > 9 ? '9+' : unreadDisplayCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadDisplayCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs px-2 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {displayNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiBell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                displayNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => markNotificationRead(notification.id)}
                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.time)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-center">
              <a
                href="/notifications"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                View all notifications
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
