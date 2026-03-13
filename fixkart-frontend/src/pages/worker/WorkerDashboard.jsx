import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiBell, FiCalendar, FiDollarSign, FiStar, FiMapPin, FiClock, 
  FiTrendingUp, FiTrendingDown, FiCheck, FiChevronRight 
} from 'react-icons/fi';
import { 
  BsGraphUpArrow, BsWallet2, BsTicketPerforated, BsShieldCheck 
} from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const WorkerDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);

  // Mock Data
  const worker = {
    name: 'Rajesh Kumar',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4.8,
    totalJobs: 245,
    level: 'Gold Partner',
    verified: true,
  };

  const stats = [
    { label: 'Today\'s Earnings', value: '₹2,450', icon: FiDollarSign, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Jobs Completed', value: '5', icon: FiCheck, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Pending Jobs', value: '2', icon: FiClock, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { label: 'Rating', value: '4.8', icon: FiStar, color: 'text-orange-500', bg: 'bg-orange-100' },
  ];

  const weeklyStats = {
    earnings: '₹18,450',
    earningsChange: '+12%',
    jobs: 28,
    jobsChange: '+8%',
  };

  const upcomingJobs = [
    {
      id: 'FK123001',
      service: 'AC Repair',
      customer: 'Amit S.',
      address: 'Koramangala, Bangalore',
      time: '10:30 AM',
      amount: '₹549',
      isNext: true,
    },
    {
      id: 'FK123002',
      service: 'Fan Installation',
      customer: 'Priya M.',
      address: 'HSR Layout, Bangalore',
      time: '12:00 PM',
      amount: '₹299',
    },
    {
      id: 'FK123003',
      service: 'Electrical Wiring',
      customer: 'Suresh K.',
      address: 'Indiranagar, Bangalore',
      time: '3:30 PM',
      amount: '₹899',
    },
  ];

  const quickActions = [
    { icon: BsGraphUpArrow, label: 'Analytics', link: '/worker/earnings' },
    { icon: BsWallet2, label: 'Wallet', link: '/worker/earnings' },
    { icon: BsTicketPerforated, label: 'My Jobs', link: '/worker/jobs' },
    { icon: BsShieldCheck, label: 'Profile', link: '/worker/profile' },
  ];

  const notifications = [
    { id: 1, text: 'New booking request nearby!', time: '2 min ago', unread: true },
    { id: 2, text: 'Payment of ₹549 received', time: '1 hour ago' },
    { id: 3, text: 'Great review from Amit S.!', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 pt-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full border-2 border-white" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold">Hi, {worker.name.split(' ')[0]}</h1>
                {worker.verified && <BsShieldCheck className="text-green-400" />}
              </div>
              <p className="text-sm text-primary-200">{worker.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2">
              <FiBell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* Online/Offline Toggle */}
        <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
          <div>
            <h3 className="font-semibold">{isOnline ? 'You\'re Online' : 'You\'re Offline'}</h3>
            <p className="text-sm text-primary-200">
              {isOnline ? 'Accepting new bookings' : 'Not visible to customers'}
            </p>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`w-14 h-7 rounded-full transition-colors relative ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}
          >
            <motion.div
              animate={{ x: isOnline ? 28 : 4 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full"
            />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-16">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
            >
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white"
        >
          <h3 className="font-semibold mb-4">This Week's Summary</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-orange-200 text-sm">Total Earnings</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{weeklyStats.earnings}</span>
                <span className="text-green-300 text-sm flex items-center">
                  <FiTrendingUp /> {weeklyStats.earningsChange}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-200 text-sm">Jobs Done</p>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-2xl font-bold">{weeklyStats.jobs}</span>
                <span className="text-green-300 text-sm flex items-center">
                  <FiTrendingUp /> {weeklyStats.jobsChange}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <action.icon className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Jobs</h2>
          <Link to="/worker/jobs" className="text-primary-600 text-sm font-medium flex items-center gap-1">
            View All <FiChevronRight />
          </Link>
        </div>

        <div className="space-y-3">
          {upcomingJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow ${
                job.isNext ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {job.isNext && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">
                  Next Job
                </span>
              )}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{job.service}</h3>
                  <p className="text-sm text-gray-500">{job.customer}</p>
                </div>
                <span className="font-bold text-primary-600">{job.amount}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><FiClock /> {job.time}</span>
                <span className="flex items-center gap-1"><FiMapPin /> {job.address}</span>
              </div>
              {job.isNext && (
                <Link
                  to={`/worker/job/${job.id}`}
                  className="mt-3 block w-full py-2 bg-green-500 text-white text-center rounded-lg font-medium"
                >
                  Start Job
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="px-4 mt-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                notif.unread 
                  ? 'bg-primary-50 dark:bg-primary-900/20' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              {notif.unread && <div className="w-2 h-2 bg-primary-500 rounded-full" />}
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">{notif.text}</p>
                <p className="text-xs text-gray-500">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
