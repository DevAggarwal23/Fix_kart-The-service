import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiTrendingUp, FiTrendingDown, FiDownload, FiFilter,
  FiDollarSign, FiPercent, FiClock, FiCheck
} from 'react-icons/fi';
import { BsWallet2, BsBank, BsArrowRight } from 'react-icons/bs';

const WorkerEarnings = () => {
  const [period, setPeriod] = useState('week');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Mock Data
  const earnings = {
    available: 12450,
    pending: 2150,
    withdrawn: 45000,
    totalEarned: 59600,
  };

  const weeklyData = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 2450 },
    { day: 'Wed', amount: 1800 },
    { day: 'Thu', amount: 2100 },
    { day: 'Fri', amount: 3200 },
    { day: 'Sat', amount: 2800 },
    { day: 'Sun', amount: 1450 },
  ];

  const stats = [
    { label: 'Jobs Completed', value: '28', change: '+12%', up: true, icon: FiCheck },
    { label: 'Avg. per Job', value: '₹456', change: '+8%', up: true, icon: FiDollarSign },
    { label: 'Hours Worked', value: '42h', change: '-5%', up: false, icon: FiClock },
    { label: 'Tips Received', value: '₹850', change: '+15%', up: true, icon: FiPercent },
  ];

  const transactions = [
    { id: 1, type: 'earning', service: 'AC Repair', customer: 'Amit S.', amount: 549, time: '2 hours ago' },
    { id: 2, type: 'earning', service: 'Fan Installation', customer: 'Priya M.', amount: 299, time: '5 hours ago' },
    { id: 3, type: 'tip', service: 'Electrical Work', customer: 'Suresh K.', amount: 100, time: 'Yesterday' },
    { id: 4, type: 'withdrawal', amount: 5000, time: 'Dec 12, 2024', status: 'completed' },
    { id: 5, type: 'earning', service: 'AC Service', customer: 'Ramesh T.', amount: 699, time: 'Dec 11, 2024' },
  ];

  const maxEarning = Math.max(...weeklyData.map(d => d.amount));

  const handleWithdraw = () => {
    console.log('Withdrawing:', withdrawAmount);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    // In real app: API call
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 pt-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Earnings</h1>
          <button className="p-2 hover:bg-white/10 rounded-full">
            <FiFilter className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-green-200 text-sm">Available Balance</p>
              <h2 className="text-3xl font-bold">₹{earnings.available.toLocaleString()}</h2>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium flex items-center gap-2"
            >
              <BsWallet2 /> Withdraw
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-green-200 text-sm">Pending</p>
              <p className="text-xl font-semibold">₹{earnings.pending.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Total Earned</p>
              <p className="text-xl font-semibold">₹{earnings.totalEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 -mt-12">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-600" />
                </div>
                <span className={`text-sm flex items-center gap-1 ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.up ? <FiTrendingUp /> : <FiTrendingDown />} {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">This Week</h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['week', 'month'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    period === p ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {p === 'week' ? 'Week' : 'Month'}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.amount / maxEarning) * 100}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`w-full rounded-t-lg ${
                    idx === weeklyData.length - 2 ? 'bg-primary-500' : 'bg-primary-200 dark:bg-primary-800'
                  }`}
                  style={{ minHeight: '8px' }}
                />
                <span className="text-xs text-gray-500 mt-2">{data.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">Total This Week</span>
              <span className="font-bold text-primary-600">
                ₹{weeklyData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
          <button className="text-primary-600 text-sm font-medium flex items-center gap-1">
            <FiDownload /> Export
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((txn, idx) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  txn.type === 'earning' ? 'bg-green-100 text-green-600' :
                  txn.type === 'tip' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {txn.type === 'withdrawal' ? <BsArrowRight /> : <FiDollarSign />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {txn.type === 'withdrawal' ? 'Withdrawal' : txn.service}
                  </p>
                  <p className="text-sm text-gray-500">
                    {txn.type === 'withdrawal' ? txn.status : txn.customer} • {txn.time}
                  </p>
                </div>
              </div>
              <span className={`font-bold ${
                txn.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
              }`}>
                {txn.type === 'withdrawal' ? '-' : '+'}₹{txn.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm"
          >
            <h3 className="text-xl font-bold mb-4">Withdraw Funds</h3>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-4">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">₹{earnings.available.toLocaleString()}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 text-xl border dark:border-gray-700 rounded-xl"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setWithdrawAmount(amt.toString())}
                    className="flex-1 py-2 border dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <BsBank className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">HDFC Bank ****4521</p>
                  <p className="text-sm text-gray-500">Rajesh Kumar</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 border dark:border-gray-700 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || Number(withdrawAmount) > earnings.available}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                Withdraw
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default WorkerEarnings;
