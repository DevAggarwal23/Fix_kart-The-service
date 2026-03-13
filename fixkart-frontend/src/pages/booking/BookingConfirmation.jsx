import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiCalendar, FiClock, FiMapPin, FiUser, FiShare2, FiDownload, FiPhone } from 'react-icons/fi';
import Confetti from 'react-confetti';
import { useBookingStore } from '../../store/bookingStore';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const {
    selectedCategory,
    selectedSubCategory,
    selectedAddress,
    selectedDate,
    selectedTimeSlot,
    selectedWorker,
    resetBooking,
  } = useBookingStore();

  // Generate booking ID
  const bookingId = `FX${Date.now().toString().slice(-8)}`;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleTrackBooking = () => {
    navigate(`/track/${bookingId}`);
  };

  const handleNewBooking = () => {
    resetBooking();
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#2563eb', '#f97316', '#22c55e', '#eab308', '#ec4899']}
        />
      )}

      <div className="max-w-lg mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <FiCheck className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Your service has been booked successfully
          </motion.p>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm opacity-80">Booking ID</p>
                <p className="text-2xl font-bold">{bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Status</p>
                <p className="text-lg font-semibold">Confirmed ✓</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="p-6 space-y-4">
            {/* Service */}
            <div className="flex items-center gap-4 pb-4 border-b dark:border-gray-700">
              <span className="text-4xl">{selectedCategory?.icon || '🔧'}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {selectedSubCategory?.name || 'Home Service'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCategory?.name || 'General'}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Today'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedTimeSlot?.time || '10:00 AM - 12:00 PM'}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center">
                <FiMapPin className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedAddress?.label || 'Home'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedAddress?.address || '123 Main Street'}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedAddress?.city || 'City'} - {selectedAddress?.pincode || '123456'}
                </p>
              </div>
            </div>

            {/* Worker */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <FiUser className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedWorker === 'auto'
                    ? 'Auto-assigned Professional'
                    : selectedWorker?.name || 'Professional'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedWorker === 'auto'
                    ? 'Best available will be assigned'
                    : `⭐ ${selectedWorker?.rating || 4.8} rating`}
                </p>
              </div>
              {selectedWorker !== 'auto' && selectedWorker && (
                <button className="p-2 bg-green-500 text-white rounded-full">
                  <FiPhone className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">
                ₹{(selectedSubCategory?.price || 499) - 1}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Payment will be collected after service</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 space-y-3"
        >
          <button
            onClick={handleTrackBooking}
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Track Booking
          </button>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <FiShare2 className="w-5 h-5" />
              Share
            </button>
            <button className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <FiDownload className="w-5 h-5" />
              Download
            </button>
          </div>

          <button
            onClick={handleNewBooking}
            className="w-full py-3 text-primary-600 font-medium"
          >
            Book Another Service
          </button>
        </motion.div>

        {/* Help Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Need help?{' '}
            <Link to="/help" className="text-primary-600 font-medium">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
