import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiDownload, FiShare2, FiHome, FiFileText } from 'react-icons/fi';
import { Sparkles, PartyPopper, CheckCircle2, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';

// Animated checkmark circle
const AnimatedCheckmark = () => (
  <div className="relative w-28 h-28 mx-auto mb-6">
    {/* Outer glow ring */}
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 1], opacity: [0, 0.5, 0.3] }}
      transition={{ duration: 1, times: [0, 0.6, 1] }}
      className="absolute inset-0 rounded-full bg-green-400/20 blur-xl"
    />
    {/* Ring animation */}
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      className="absolute inset-0 rounded-full border-4 border-green-400/30"
    />
    {/* Main circle */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
      className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 
                 shadow-xl shadow-green-500/30 flex items-center justify-center"
    >
      {/* Checkmark with draw animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.4, type: 'spring', damping: 10 }}
      >
        <FiCheck className="w-12 h-12 text-white" strokeWidth={3} />
      </motion.div>
    </motion.div>
    {/* Sparkle particles */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
        animate={{
          scale: [0, 1, 0],
          x: Math.cos((i * 60 * Math.PI) / 180) * 60,
          y: Math.sin((i * 60 * Math.PI) / 180) * 60,
          opacity: [0, 1, 0],
        }}
        transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-green-400"
        style={{ marginTop: -4, marginLeft: -4 }}
      />
    ))}
  </div>
);

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const { amount = 499, method = 'upi', transactionId = 'TXN12345678' } = location.state || {};

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => { window.removeEventListener('resize', handleResize); clearTimeout(timer); };
  }, []);

  const paymentDetails = {
    transactionId,
    amount,
    method: method === 'upi' ? 'UPI' : method === 'card' ? 'Card' : method === 'netbanking' ? 'Net Banking' : 'Wallet',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4
                    bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 
                    dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300}
          colors={['#22c55e', '#10b981', '#6366f1', '#f97316', '#eab308', '#ec4899']} />
      )}

      <div className="w-full max-w-md">
        {/* Success Header */}
        <div className="text-center mb-6">
          <AnimatedCheckmark />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="text-gray-500 dark:text-gray-400">
            Your payment has been processed 🎉
          </motion.p>
        </div>

        {/* Payment Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden
                     border border-gray-100 dark:border-gray-700/50">
          {/* Amount Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-6 text-center text-white">
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="text-sm opacity-80 mb-1">Amount Paid</motion.p>
            <motion.p initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.1, type: 'spring' }}
              className="text-5xl font-bold font-display">₹{amount}</motion.p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-0">
            {[
              { label: 'Transaction ID', value: paymentDetails.transactionId, mono: true },
              { label: 'Payment Method', value: paymentDetails.method },
              { label: 'Date & Time', value: paymentDetails.date },
              { label: 'Status', value: 'Completed', isStatus: true },
            ].map((item, i) => (
              <motion.div key={item.label}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className={`flex justify-between items-center py-3.5 ${
                  i < 3 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''
                }`}>
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                {item.isStatus ? (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                    <CheckCircle2 className="w-4 h-4" />Completed
                  </span>
                ) : (
                  <span className={`text-sm font-medium text-gray-900 dark:text-white ${item.mono ? 'font-mono' : ''}`}>
                    {item.value}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            <Link to={`/invoice/${transactionId}`}
              className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2
                         border-2 border-primary-500 text-primary-600 dark:text-primary-400
                         hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
              <FiFileText className="w-4 h-4" />View Invoice
            </Link>
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2
                           bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FiDownload className="w-4 h-4" />Download
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2
                           bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FiShare2 className="w-4 h-4" />Share
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-6">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white
                       bg-gradient-to-r from-primary-500 to-primary-600 
                       shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30
                       flex items-center justify-center gap-2 transition-all">
            <FiHome className="w-5 h-5" />Back to Home
          </motion.button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
          className="text-center mt-5 text-sm text-gray-400">
          Having issues? <Link to="/help" className="text-primary-500 font-medium hover:underline">Contact Support</Link>
        </motion.p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
