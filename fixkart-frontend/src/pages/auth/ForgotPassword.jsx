import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            No worries! Enter your phone number and we'll send you a reset link.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your registered phone"
              className="input-field"
            />
          </div>

          <button type="submit" className="w-full btn-primary py-4">
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
