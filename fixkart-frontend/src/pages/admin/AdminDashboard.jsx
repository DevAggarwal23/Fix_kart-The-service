import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiDollarSign, FiTrendingUp, FiTrendingDown, FiCalendar,
  FiChevronRight, FiAlertCircle, FiCheckCircle, FiClock, FiMapPin
} from 'react-icons/fi';
import { 
  BsGraphUpArrow, BsPeople, BsTicketPerforated, BsCurrencyRupee,
  BsStarFill, BsExclamationTriangle
} from 'react-icons/bs';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('today');

  // Mock Data
  const stats = [
    { 
      label: 'Total Revenue', 
      value: '₹12.5L', 
      change: '+18%', 
      up: true, 
      icon: BsCurrencyRupee,
      color: 'bg-green-500',
    },
    { 
      label: 'Total Bookings', 
      value: '2,845', 
      change: '+12%', 
      up: true, 
      icon: BsTicketPerforated,
      color: 'bg-blue-500',
    },
    { 
      label: 'Active Workers', 
      value: '345', 
      change: '+8%', 
      up: true, 
      icon: BsPeople,
      color: 'bg-purple-500',
    },
    { 
      label: 'Active Users', 
      value: '8,932', 
      change: '+25%', 
      up: true, 
      icon: FiUsers,
      color: 'bg-orange-500',
    },
  ];

  const quickStats = [
    { label: 'Pending Bookings', value: 45, icon: FiClock, color: 'text-yellow-500' },
    { label: 'In Progress', value: 128, icon: FiAlertCircle, color: 'text-blue-500' },
    { label: 'Completed Today', value: 312, icon: FiCheckCircle, color: 'text-green-500' },
    { label: 'Cancelled', value: 15, icon: BsExclamationTriangle, color: 'text-red-500' },
  ];

  const recentBookings = [
    { id: 'FK125001', customer: 'Amit S.', service: 'AC Repair', worker: 'Rajesh K.', amount: '₹549', status: 'in_progress' },
    { id: 'FK125002', customer: 'Priya M.', service: 'Plumbing', worker: 'Suresh T.', amount: '₹399', status: 'completed' },
    { id: 'FK125003', customer: 'Rahul P.', service: 'Cleaning', worker: 'Pending', amount: '₹699', status: 'pending' },
    { id: 'FK125004', customer: 'Kavitha R.', service: 'Electrical', worker: 'Mohan V.', amount: '₹299', status: 'completed' },
    { id: 'FK125005', customer: 'Deepak N.', service: 'Painting', worker: 'Assigned', amount: '₹1,999', status: 'scheduled' },
  ];

  const topServices = [
    { name: 'AC Repair', bookings: 456, revenue: '₹2.5L', growth: '+15%' },
    { name: 'Home Cleaning', bookings: 389, revenue: '₹1.9L', growth: '+22%' },
    { name: 'Plumbing', bookings: 312, revenue: '₹1.2L', growth: '+8%' },
    { name: 'Electrical', bookings: 278, revenue: '₹98K', growth: '+12%' },
  ];

  const topWorkers = [
    { name: 'Rajesh Kumar', jobs: 45, rating: 4.9, earnings: '₹24,500' },
    { name: 'Suresh Patel', jobs: 42, rating: 4.8, earnings: '₹22,100' },
    { name: 'Mohan Verma', jobs: 38, rating: 4.9, earnings: '₹19,800' },
    { name: 'Anil Sharma', jobs: 35, rating: 4.7, earnings: '₹18,200' },
  ];

  const alerts = [
    { type: 'warning', message: '12 workers have incomplete profiles', action: 'View' },
    { type: 'error', message: '5 bookings have payment issues', action: 'Resolve' },
    { type: 'info', message: 'New service category pending approval', action: 'Review' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      scheduled: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
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
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-xl ${
                alert.type === 'error' ? 'bg-red-50 dark:bg-red-900/20' :
                alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <BsExclamationTriangle className={`w-5 h-5 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <span className="text-gray-700 dark:text-gray-300">{alert.message}</span>
              </div>
              <button className="text-primary-600 font-medium text-sm">{alert.action}</button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                {stat.up ? <FiTrendingUp /> : <FiTrendingDown />} {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex items-center gap-4"
          >
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-primary-600 text-sm font-medium flex items-center gap-1">
              View All <FiChevronRight />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-medium text-primary-600">{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{booking.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.worker}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Workers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Workers</h2>
            <Link to="/admin/workers" className="text-primary-600 text-sm font-medium flex items-center gap-1">
              View All <FiChevronRight />
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {topWorkers.map((worker, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{worker.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{worker.jobs} jobs</span>
                      <span className="flex items-center gap-1">
                        <BsStarFill className="text-yellow-500" /> {worker.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="font-medium text-green-600">{worker.earnings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Services</h2>
          <Link to="/admin/services" className="text-primary-600 text-sm font-medium flex items-center gap-1">
            Manage Services <FiChevronRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {topServices.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 border dark:border-gray-700 rounded-xl"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{service.name}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{service.bookings} bookings</span>
                <span className="text-green-500">{service.growth}</span>
              </div>
              <p className="text-lg font-bold text-primary-600 mt-2">{service.revenue}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
