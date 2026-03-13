import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiClock, FiMapPin, FiCreditCard, FiBell, 
  FiSettings, FiStar, FiTrendingUp, FiGift, FiChevronRight,
  FiCheckCircle, FiAlertCircle, FiCoffee
} from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { sampleBookings } from '../../data/dummyData';

const Dashboard = () => {
  const { user } = useAuthStore();

  // Stats
  const stats = [
    { label: 'Total Bookings', value: '12', icon: FiCalendar, color: 'bg-blue-500' },
    { label: 'Completed', value: '10', icon: FiCheckCircle, color: 'bg-green-500' },
    { label: 'Pending', value: '2', icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Saved', value: '₹850', icon: FiGift, color: 'bg-purple-500' },
  ];

  // Quick Actions
  const quickActions = [
    { label: 'My Bookings', icon: '📋', path: '/dashboard/bookings', color: 'from-blue-500 to-blue-600' },
    { label: 'Addresses', icon: '📍', path: '/dashboard/addresses', color: 'from-green-500 to-green-600' },
    { label: 'Wallet', icon: '💰', path: '/dashboard/wallet', color: 'from-purple-500 to-purple-600' },
    { label: 'Help', icon: '💬', path: '/dashboard/help', color: 'from-orange-500 to-orange-600' },
  ];

  // Recent Bookings
  const recentBookings = sampleBookings.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 pt-8 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
                {user?.avatar || '👤'}
              </div>
              <div className="text-white">
                <p className="text-sm opacity-80">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!</p>
                <h1 className="text-xl font-bold">{user?.name || 'User'}</h1>
              </div>
            </div>
            <Link to="/dashboard/notifications" className="relative p-2 bg-white/20 rounded-full">
              <FiBell className="w-6 h-6 text-white" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Link>
          </div>

          {/* Welcome Banner */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-semibold">Welcome back!</p>
                <p className="text-sm opacity-80">You have 2 upcoming bookings this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Overlapping */}
      <div className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 text-2xl group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Booking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Booking</h2>
            <Link to="/dashboard/bookings" className="text-primary-600 text-sm font-medium">View All</Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">AC Repair Service</h3>
                  <p className="text-sm text-gray-500">Booking #FX12345678</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm rounded-full">
                Tomorrow
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FiCalendar className="w-4 h-4" />
                <span>25 Dec 2024</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FiClock className="w-4 h-4" />
                <span>10:00 - 12:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FiMapPin className="w-4 h-4" />
                <span>Home</span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                to="/track/FX12345678"
                className="flex-1 py-2 bg-primary-600 text-white rounded-xl text-center font-medium hover:bg-primary-700 transition-colors"
              >
                Track
              </Link>
              <button className="flex-1 py-2 border border-red-300 dark:border-red-800 text-red-600 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
            <Link to="/dashboard/bookings" className="text-primary-600 text-sm font-medium">View All</Link>
          </div>
          
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/dashboard/bookings/${booking.id}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{booking.icon || '🔧'}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{booking.service}</h3>
                  <p className="text-sm text-gray-500">{booking.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : booking.status === 'cancelled'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">₹{booking.amount}</p>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Offers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Exclusive Offers</h2>
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🎁</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold">Get 20% OFF</h3>
                <p className="text-sm opacity-90">On your next AC service booking</p>
              </div>
              <button className="px-4 py-2 bg-white text-secondary-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Claim Now
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full">Code: AC20OFF</span>
              <span>Valid till 31 Dec</span>
            </div>
          </div>
        </motion.div>

        {/* Account Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {[
              { icon: FiCreditCard, label: 'Payment Methods', path: '/dashboard/payments' },
              { icon: FiStar, label: 'My Reviews', path: '/dashboard/reviews' },
              { icon: FiGift, label: 'Refer & Earn', path: '/dashboard/referral' },
              { icon: FiSettings, label: 'Settings', path: '/dashboard/settings' },
            ].map((item, idx) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  idx !== 0 ? 'border-t dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900 dark:text-white">{item.label}</span>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
