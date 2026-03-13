import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiDownload, FiCalendar, FiCheck, FiX,
  FiCreditCard, FiDollarSign, FiTrendingUp
} from 'react-icons/fi';
import { BsWallet2, BsCurrencyRupee, BsBank } from 'react-icons/bs';

const AdminPayments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  // Mock Data
  const stats = [
    { label: 'Total Revenue', value: '₹12.5L', change: '+18%', icon: BsCurrencyRupee, color: 'bg-green-500' },
    { label: 'Pending Payouts', value: '₹2.8L', change: '45 workers', icon: BsWallet2, color: 'bg-yellow-500' },
    { label: 'Completed Payouts', value: '₹8.2L', change: 'This month', icon: BsBank, color: 'bg-blue-500' },
    { label: 'Refunds', value: '₹45K', change: '12 requests', icon: FiX, color: 'bg-red-500' },
  ];

  const transactions = [
    {
      id: 'TXN001',
      type: 'payment',
      bookingId: 'FK125001',
      customer: 'Amit Sharma',
      amount: 549,
      method: 'UPI',
      status: 'completed',
      date: 'Dec 15, 2024',
      time: '10:45 AM',
    },
    {
      id: 'TXN002',
      type: 'payout',
      worker: 'Rajesh Kumar',
      amount: 450,
      method: 'Bank Transfer',
      status: 'completed',
      date: 'Dec 15, 2024',
      time: '11:30 AM',
    },
    {
      id: 'TXN003',
      type: 'payment',
      bookingId: 'FK125003',
      customer: 'Rahul Patel',
      amount: 699,
      method: 'Card',
      status: 'pending',
      date: 'Dec 15, 2024',
      time: '12:15 PM',
    },
    {
      id: 'TXN004',
      type: 'refund',
      bookingId: 'FK125006',
      customer: 'Sneha K.',
      amount: 899,
      method: 'UPI',
      status: 'processing',
      date: 'Dec 14, 2024',
      time: '3:00 PM',
    },
    {
      id: 'TXN005',
      type: 'payout',
      worker: 'Suresh Patel',
      amount: 2500,
      method: 'Bank Transfer',
      status: 'pending',
      date: 'Dec 14, 2024',
      time: '5:00 PM',
    },
    {
      id: 'TXN006',
      type: 'payment',
      bookingId: 'FK125004',
      customer: 'Kavitha Reddy',
      amount: 299,
      method: 'Wallet',
      status: 'completed',
      date: 'Dec 14, 2024',
      time: '4:20 PM',
    },
  ];

  const pendingPayouts = [
    { worker: 'Rajesh Kumar', amount: 12450, jobs: 15, avatar: 'https://i.pravatar.cc/150?img=12' },
    { worker: 'Suresh Patel', amount: 8200, jobs: 10, avatar: 'https://i.pravatar.cc/150?img=15' },
    { worker: 'Mohan Verma', amount: 5600, jobs: 7, avatar: 'https://i.pravatar.cc/150?img=18' },
    { worker: 'Anil Sharma', amount: 9800, jobs: 12, avatar: 'https://i.pravatar.cc/150?img=20' },
  ];

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.customer && txn.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.worker && txn.worker.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    const matchesType = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeBadge = (type) => {
    const styles = {
      payment: 'bg-green-100 text-green-700',
      payout: 'bg-blue-100 text-blue-700',
      refund: 'bg-red-100 text-red-700',
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-500">Manage transactions and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 border dark:border-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700"
              >
                <option value="all">All Types</option>
                <option value="payment">Payments</option>
                <option value="payout">Payouts</option>
                <option value="refund">Refunds</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm font-medium text-primary-600">{txn.id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadge(txn.type)}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {txn.type === 'payout' ? (
                        <span className="text-sm text-gray-900 dark:text-white">{txn.worker}</span>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{txn.customer}</p>
                          <p className="text-xs text-gray-500">{txn.bookingId}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{txn.method}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        txn.type === 'refund' ? 'text-red-600' : txn.type === 'payout' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {txn.type === 'refund' ? '-' : txn.type === 'payout' ? '-' : '+'}₹{txn.amount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">{txn.date}</p>
                      <p className="text-xs text-gray-500">{txn.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pending Payouts</h2>
            <button className="text-primary-600 text-sm font-medium">Process All</button>
          </div>

          <div className="p-4 space-y-4">
            {pendingPayouts.map((payout, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img src={payout.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{payout.worker}</p>
                    <p className="text-xs text-gray-500">{payout.jobs} jobs completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">₹{payout.amount.toLocaleString()}</p>
                  <button className="text-xs text-primary-600 hover:underline">Process</button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t dark:border-gray-700">
            <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium">
              View All Payouts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
