import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiArrowLeft, FiHelpCircle } from 'react-icons/fi';

const NotFound = () => {
  const popularLinks = [
    { label: 'Home', path: '/', icon: FiHome },
    { label: 'Services', path: '/services', icon: FiSearch },
    { label: 'My Bookings', path: '/dashboard/bookings', icon: FiSearch },
    { label: 'Help & Support', path: '/help', icon: FiHelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="text-[150px] md:text-[200px] font-bold text-gray-200 dark:text-gray-800 leading-none">
            404
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-6xl">🔧</div>
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, even our best professionals can't fix this one! 
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link
            to="/"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-700"
          >
            <FiHome /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border dark:border-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FiArrowLeft /> Go Back
          </button>
        </motion.div>

        {/* Popular Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
        >
          <p className="text-gray-500 mb-4">Popular pages you might be looking for:</p>
          <div className="grid grid-cols-2 gap-3">
            {popularLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <link.icon className="w-4 h-4 text-primary-600" />
                <span className="text-gray-900 dark:text-white">{link.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Fun Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm text-gray-400"
        >
          Need help? <Link to="/contact" className="text-primary-600 hover:underline">Contact our support team</Link>
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
