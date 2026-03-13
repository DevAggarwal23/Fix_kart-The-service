import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiMapPin, FiClock, FiChevronRight, 
  FiCheck, FiX, FiNavigation 
} from 'react-icons/fi';
import { BsCurrencyRupee } from 'react-icons/bs';

const tabs = ['New Requests', 'Scheduled', 'History'];

const WorkerJobs = () => {
  const [activeTab, setActiveTab] = useState('New Requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDistance, setFilterDistance] = useState('all');

  // Mock Data
  const newRequests = [
    {
      id: 'FK124001',
      service: 'AC Deep Cleaning',
      category: 'AC Services',
      customer: 'Rahul M.',
      address: '245, Koramangala 4th Block, Bangalore',
      distance: '2.3 km',
      time: 'Today, 4:00 PM',
      amount: '₹699',
      estimatedTime: '45 min',
      isUrgent: true,
    },
    {
      id: 'FK124002',
      service: 'TV Installation',
      category: 'Appliance Repair',
      customer: 'Sneha K.',
      address: 'HSR Layout Sector 7, Bangalore',
      distance: '4.1 km',
      time: 'Today, 5:30 PM',
      amount: '₹349',
      estimatedTime: '30 min',
    },
    {
      id: 'FK124003',
      service: 'Electrical Wiring',
      category: 'Electrical',
      customer: 'Vikram P.',
      address: 'JP Nagar 6th Phase, Bangalore',
      distance: '5.8 km',
      time: 'Tomorrow, 10:00 AM',
      amount: '₹1,299',
      estimatedTime: '2 hrs',
    },
  ];

  const scheduledJobs = [
    {
      id: 'FK123001',
      service: 'AC Repair',
      customer: 'Amit S.',
      address: 'Koramangala, Bangalore',
      date: 'Today',
      time: '10:30 AM',
      amount: '₹549',
      status: 'upcoming',
    },
    {
      id: 'FK123002',
      service: 'Fan Installation',
      customer: 'Priya M.',
      address: 'HSR Layout, Bangalore',
      date: 'Today',
      time: '12:00 PM',
      amount: '₹299',
      status: 'upcoming',
    },
    {
      id: 'FK123003',
      service: 'Electrical Wiring',
      customer: 'Suresh K.',
      address: 'Indiranagar, Bangalore',
      date: 'Tomorrow',
      time: '3:30 PM',
      amount: '₹899',
      status: 'upcoming',
    },
  ];

  const history = [
    {
      id: 'FK122001',
      service: 'AC Service',
      customer: 'Ramesh T.',
      date: 'Dec 12, 2024',
      amount: '₹549',
      status: 'completed',
      rating: 5,
    },
    {
      id: 'FK122002',
      service: 'Washing Machine Repair',
      customer: 'Kavitha R.',
      date: 'Dec 11, 2024',
      amount: '₹699',
      status: 'completed',
      rating: 4,
    },
    {
      id: 'FK122003',
      service: 'RO Installation',
      customer: 'Deepak N.',
      date: 'Dec 10, 2024',
      amount: '₹399',
      status: 'cancelled',
    },
  ];

  const handleAccept = (jobId) => {
    console.log('Accepted job:', jobId);
    // In real app: API call to accept job
  };

  const handleReject = (jobId) => {
    console.log('Rejected job:', jobId);
    // In real app: API call to reject job
  };

  const renderNewRequests = () => (
    <div className="space-y-4">
      {newRequests.map((job, idx) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
        >
          {job.isUrgent && (
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">
              🔥 Urgent Request
            </span>
          )}
          
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{job.service}</h3>
              <p className="text-sm text-gray-500">{job.category}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">{job.amount}</span>
              <p className="text-xs text-gray-500">Est. {job.estimatedTime}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiMapPin className="w-4 h-4" />
              <span>{job.address}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FiNavigation className="w-4 h-4" /> {job.distance}
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" /> {job.time}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleReject(job.id)}
              className="flex-1 py-3 border border-red-500 text-red-500 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <FiX /> Decline
            </button>
            <button
              onClick={() => handleAccept(job.id)}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600"
            >
              <FiCheck /> Accept
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderScheduled = () => (
    <div className="space-y-4">
      {scheduledJobs.map((job, idx) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{job.service}</h3>
              <p className="text-sm text-gray-500">{job.customer}</p>
            </div>
            <span className="text-lg font-bold text-primary-600">{job.amount}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <FiClock className="w-4 h-4" /> {job.date}, {job.time}
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4" /> {job.address}
            </span>
          </div>

          <Link
            to={`/worker/job/${job.id}`}
            className="flex items-center justify-between w-full py-3 px-4 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl font-medium"
          >
            <span>View Details</span>
            <FiChevronRight />
          </Link>
        </motion.div>
      ))}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {history.map((job, idx) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{job.service}</h3>
              <p className="text-sm text-gray-500">{job.customer}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-900 dark:text-white">{job.amount}</span>
              {job.rating && (
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  {'★'.repeat(job.rating)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{job.date}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              job.status === 'completed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {job.status === 'completed' ? 'Completed' : 'Cancelled'}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Jobs</h1>
        </div>

        {/* Search & Filter */}
        <div className="px-4 pb-4 flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FiFilter className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 border-t dark:border-gray-700 overflow-hidden"
            >
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full mt-1 p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  >
                    <option value="all">All Categories</option>
                    <option value="ac">AC Services</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Distance</label>
                  <select
                    value={filterDistance}
                    onChange={(e) => setFilterDistance(e.target.value)}
                    className="w-full mt-1 p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  >
                    <option value="all">Any Distance</option>
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                    <option value="20">Within 20 km</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeJobTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeTab === 'New Requests' && renderNewRequests()}
        {activeTab === 'Scheduled' && renderScheduled()}
        {activeTab === 'History' && renderHistory()}
      </div>
    </div>
  );
};

export default WorkerJobs;
