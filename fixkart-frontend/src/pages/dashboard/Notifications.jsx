import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2, FiSettings, FiFilter, FiCheckCircle } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

const notificationTypes = {
  booking: { icon: '📋', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
  offer: { icon: '🎁', color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
  payment: { icon: '💳', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
  alert: { icon: '⚠️', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' },
  system: { icon: '🔔', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600' },
};

const Notifications = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['all', 'unread', 'booking', 'offer', 'payment'];

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-primary-600 text-sm font-medium flex items-center gap-1"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔔</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Notifications</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeFilter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification, idx) => {
                const typeConfig = notificationTypes[notification.type] || notificationTypes.system;
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow ${
                      !notification.read ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''
                    }`}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-primary-500 rounded-full" />
                    )}

                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${typeConfig.color}`}>
                        {typeConfig.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-3 pt-3 border-t dark:border-gray-700">
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationRead(notification.id)}
                          className="text-sm text-primary-600 font-medium flex items-center gap-1"
                        >
                          <FiCheck className="w-4 h-4" />
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => clearNotification(notification.id)}
                        className="text-sm text-red-500 font-medium flex items-center gap-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiSettings className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
                <p className="text-sm text-gray-500">Manage your preferences</p>
              </div>
            </div>
            <button className="text-primary-600 font-medium">Manage</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
