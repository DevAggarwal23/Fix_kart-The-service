import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiChevronDown, FiChevronRight, FiMessageSquare, 
  FiPhone, FiMail, FiHelpCircle, FiFileText, FiShield
} from 'react-icons/fi';
import { faqs } from '../../data/dummyData';

const helpCategories = [
  { id: 'booking', label: 'Booking Issues', icon: '📋' },
  { id: 'payment', label: 'Payment & Refunds', icon: '💳' },
  { id: 'service', label: 'Service Quality', icon: '⭐' },
  { id: 'account', label: 'Account & Profile', icon: '👤' },
  { id: 'other', label: 'Other Issues', icon: '❓' },
];

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 pt-8 pb-20 px-4">
        <div className="max-w-lg mx-auto text-white text-center">
          <h1 className="text-2xl font-bold mb-2">How can we help you?</h1>
          <p className="text-white/80 mb-6">Search for answers or browse categories</p>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Help Categories */}
      <div className="max-w-lg mx-auto px-4 -mt-8">
        <div className="grid grid-cols-5 gap-2">
          {helpCategories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow ${
                selectedCategory === cat.id ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center">{cat.label.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiHelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  <FiChevronDown
                    className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
            </div>
          )}
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Live Chat */}
            <Link
              to="/chat"
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">Live Chat</p>
                <p className="text-sm text-gray-500">Chat with our support team</p>
              </div>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">Online</span>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </Link>

            {/* Call Support */}
            <a
              href="tel:1800123456"
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FiPhone className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">Call Us</p>
                <p className="text-sm text-gray-500">1800-123-4567 (24x7)</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </a>

            {/* Email */}
            <a
              href="mailto:support@fixkart.com"
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FiMail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">Email Support</p>
                <p className="text-sm text-gray-500">support@fixkart.com</p>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            {[
              { icon: FiFileText, label: 'Terms & Conditions', path: '/terms' },
              { icon: FiShield, label: 'Privacy Policy', path: '/privacy' },
              { icon: FiHelpCircle, label: 'Refund Policy', path: '/refund-policy' },
            ].map((item, idx) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  idx > 0 ? 'border-t dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{item.label}</span>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Raise Complaint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/complaint"
            className="block w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow"
          >
            🚨 Raise a Complaint
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpSupport;
