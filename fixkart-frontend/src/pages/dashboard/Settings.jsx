import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiChevronRight, FiUser, FiBell, FiLock, FiGlobe, FiMoon, 
  FiSmartphone, FiMail, FiShield, FiHelpCircle, FiLogOut,
  FiCreditCard, FiMapPin, FiStar, FiGift, FiInfo
} from 'react-icons/fi';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    promotional: true,
  });

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: FiUser, label: 'Edit Profile', path: '/dashboard/profile', description: 'Name, phone, email' },
        { icon: FiLock, label: 'Change Password', path: '/dashboard/change-password', description: 'Update your password' },
        { icon: FiShield, label: 'Privacy & Security', path: '/dashboard/privacy', description: 'Two-factor, data' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: FiMapPin, label: 'Saved Addresses', path: '/dashboard/addresses', description: 'Manage delivery locations' },
        { icon: FiCreditCard, label: 'Payment Methods', path: '/dashboard/payments', description: 'Cards, UPI, wallets' },
        { icon: FiGlobe, label: 'Language', path: '/dashboard/language', description: 'English' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: FiHelpCircle, label: 'Help & Support', path: '/help', description: 'FAQs, contact us' },
        { icon: FiStar, label: 'Rate App', path: '#', description: 'Rate us on Play Store' },
        { icon: FiGift, label: 'Refer & Earn', path: '/dashboard/referral', description: 'Invite friends, earn rewards' },
        { icon: FiInfo, label: 'About', path: '/about', description: 'Version 1.0.0' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Link to="/dashboard/profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
              {user?.avatar || '👤'}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white">{user?.name || 'User Name'}</p>
              <p className="text-sm text-gray-500">{user?.phone || '+91 98765 43210'}</p>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </Link>

        {/* Dark Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500">Switch to dark theme</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow ${
                  darkMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                <p className="text-sm text-gray-500">Manage notification preferences</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y dark:divide-gray-700">
            {[
              { key: 'push', label: 'Push Notifications', icon: FiSmartphone },
              { key: 'email', label: 'Email Notifications', icon: FiMail },
              { key: 'sms', label: 'SMS Notifications', icon: FiSmartphone },
              { key: 'promotional', label: 'Promotional Offers', icon: FiGift },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications[item.key] ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                      notifications[item.key] ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIdx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIdx * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {section.title}
              </h3>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={logout}
          className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          Log Out
        </motion.button>

        {/* App Version */}
        <p className="text-center text-sm text-gray-400">
          FixKart v1.0.0 • Made with ❤️ in India
        </p>
      </div>
    </div>
  );
};

export default Settings;
