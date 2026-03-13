import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiCalendar, FiClock, FiMapPin, 
  FiChevronRight, FiX, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { sampleBookings } from '../../data/dummyData';

const statusColors = {
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  'in-progress': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter bookings
  const filteredBookings = sampleBookings.filter(booking => {
    if (activeTab !== 'all' && booking.status !== activeTab) return false;
    if (searchQuery && !booking.service.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Bookings</h1>
          
          {/* Search */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-primary-600 text-white border-primary-600' : 'dark:border-gray-700'
              }`}
            >
              <FiFilter className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Date Range</label>
                <div className="flex gap-2">
                  <input type="date" className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                  <span className="flex items-center text-gray-400">to</span>
                  <input type="date" className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 border dark:border-gray-600 rounded-lg">Reset</button>
                <button className="flex-1 py-2 bg-primary-600 text-white rounded-lg">Apply Filters</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookings List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Bookings Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {activeTab === 'all' 
                ? "You haven't made any bookings yet"
                : `No ${activeTab} bookings`}
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium"
            >
              Book a Service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/dashboard/bookings/${booking.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{booking.icon || '🔧'}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{booking.service}</h3>
                          <p className="text-sm text-gray-500">#{booking.id}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FiCalendar className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FiClock className="w-4 h-4" />
                        <span>{booking.time || '10:00 AM'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FiMapPin className="w-4 h-4" />
                        <span>Home</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹{booking.amount}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === 'completed' && !booking.rated && (
                          <Link
                            to={`/rate/${booking.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm font-medium"
                          >
                            ⭐ Rate
                          </Link>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <Link
                            to={`/track/${booking.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium"
                          >
                            Track
                          </Link>
                        )}
                        <FiChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Worker Info */}
                  {booking.worker && (
                    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Serviced by <strong className="text-gray-900 dark:text-white">{booking.worker}</strong>
                        </span>
                      </div>
                      {booking.workerRating && (
                        <span className="text-sm text-yellow-600">⭐ {booking.workerRating}</span>
                      )}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
