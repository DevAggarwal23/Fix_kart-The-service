import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, FiCreditCard, FiGift, FiArrowUpRight, FiArrowDownLeft, 
  FiClock, FiCheck, FiPercent
} from 'react-icons/fi';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('transactions');

  const walletBalance = 250;
  const cashbackEarned = 850;

  const transactions = [
    { id: 1, type: 'credit', amount: 50, description: 'Cashback on AC Service', date: '24 Dec 2024', icon: '🎁' },
    { id: 2, type: 'debit', amount: 100, description: 'Used in Booking #FX123', date: '20 Dec 2024', icon: '🔧' },
    { id: 3, type: 'credit', amount: 200, description: 'Referral Bonus', date: '15 Dec 2024', icon: '👥' },
    { id: 4, type: 'credit', amount: 100, description: 'Welcome Bonus', date: '10 Dec 2024', icon: '🎉' },
  ];

  const offers = [
    { id: 1, title: '10% Cashback', description: 'On plumbing services', max: '₹100', validTill: '31 Dec', code: 'PLUMB10' },
    { id: 2, title: '₹50 OFF', description: 'On orders above ₹499', max: '₹50', validTill: '25 Dec', code: 'SAVE50' },
    { id: 3, title: 'Flat 20% OFF', description: 'First AC service', max: '₹200', validTill: '31 Dec', code: 'AC20OFF' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 pt-8 pb-32 px-4">
        <div className="max-w-lg mx-auto text-white text-center">
          <h1 className="text-lg font-medium opacity-80 mb-2">Wallet Balance</h1>
          <div className="text-5xl font-bold mb-4">₹{walletBalance}</div>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 rounded-xl font-medium backdrop-blur-sm hover:bg-white/30 transition-colors">
              <FiPlus className="w-5 h-5" />
              Add Money
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-100 transition-colors">
              <FiCreditCard className="w-5 h-5" />
              Pay
            </button>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="max-w-lg mx-auto px-4 -mt-20">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
              <FiArrowDownLeft className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{cashbackEarned}</p>
            <p className="text-sm text-gray-500">Total Cashback</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg"
          >
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-3">
              <FiGift className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
            <p className="text-sm text-gray-500">Active Offers</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'transactions'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-500'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'offers'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-500'
            }`}
          >
            Offers
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {activeTab === 'transactions' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {transactions.map((txn, idx) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                  {txn.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{txn.description}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {txn.date}
                  </p>
                </div>
                <div className={`text-lg font-bold ${
                  txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                </div>
              </motion.div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {offers.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{offer.title}</p>
                      <p className="text-sm opacity-90">{offer.description}</p>
                    </div>
                    <FiPercent className="w-8 h-8 opacity-50" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Max: {offer.max}</span>
                      <span>•</span>
                      <span>Valid till {offer.validTill}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <span className="font-mono font-bold text-primary-600">{offer.code}</span>
                    </div>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Refer & Earn Banner */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎁</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold">Refer & Earn ₹200</h3>
              <p className="text-sm opacity-90">Invite friends & earn wallet cash</p>
            </div>
            <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-bold">
              Share
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wallet;
