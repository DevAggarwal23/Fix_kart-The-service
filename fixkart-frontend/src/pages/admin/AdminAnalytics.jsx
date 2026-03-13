import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, FiTrendingDown, FiUsers, FiCalendar,
  FiDollarSign, FiStar, FiActivity, FiDownload,
  FiFilter, FiChevronDown
} from 'react-icons/fi';
import { BsBuilding, BsGraphUp, BsPeople, BsGeoAlt } from 'react-icons/bs';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('last30');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock Data
  const overviewStats = [
    { label: 'Total Revenue', value: '₹42.5L', change: '+18%', positive: true, icon: FiDollarSign },
    { label: 'Total Bookings', value: '8,456', change: '+12%', positive: true, icon: FiCalendar },
    { label: 'Active Users', value: '15,890', change: '+24%', positive: true, icon: FiUsers },
    { label: 'Avg Rating', value: '4.7', change: '+0.2', positive: true, icon: FiStar },
  ];

  const revenueData = [
    { month: 'Jan', value: 280000 },
    { month: 'Feb', value: 320000 },
    { month: 'Mar', value: 350000 },
    { month: 'Apr', value: 410000 },
    { month: 'May', value: 380000 },
    { month: 'Jun', value: 450000 },
    { month: 'Jul', value: 520000 },
    { month: 'Aug', value: 580000 },
    { month: 'Sep', value: 510000 },
    { month: 'Oct', value: 620000 },
    { month: 'Nov', value: 680000 },
    { month: 'Dec', value: 750000 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  const bookingStats = [
    { status: 'Completed', count: 6234, percentage: 73.7 },
    { status: 'Cancelled', count: 845, percentage: 10 },
    { status: 'Pending', count: 567, percentage: 6.7 },
    { status: 'In Progress', count: 810, percentage: 9.6 },
  ];

  const topServices = [
    { name: 'AC Deep Cleaning', bookings: 1245, revenue: '₹8.7L', growth: '+15%' },
    { name: 'Full Home Cleaning', bookings: 1123, revenue: '₹11.2L', growth: '+22%' },
    { name: 'Plumbing Repair', bookings: 892, revenue: '₹4.5L', growth: '+8%' },
    { name: 'Electrical Repair', bookings: 756, revenue: '₹3.8L', growth: '+12%' },
    { name: 'Appliance Repair', bookings: 634, revenue: '₹5.1L', growth: '+18%' },
  ];

  const topCities = [
    { name: 'Mumbai', bookings: 2456, percentage: 29 },
    { name: 'Delhi', bookings: 1890, percentage: 22 },
    { name: 'Bangalore', bookings: 1567, percentage: 19 },
    { name: 'Hyderabad', bookings: 1123, percentage: 13 },
    { name: 'Chennai', bookings: 920, percentage: 11 },
    { name: 'Others', bookings: 500, percentage: 6 },
  ];

  const workerPerformance = [
    { name: 'Rajesh Kumar', jobs: 156, rating: 4.9, earnings: '₹1.2L' },
    { name: 'Amit Singh', jobs: 142, rating: 4.8, earnings: '₹1.1L' },
    { name: 'Vikram Patel', jobs: 138, rating: 4.8, earnings: '₹98K' },
    { name: 'Suresh Sharma', jobs: 125, rating: 4.7, earnings: '₹92K' },
    { name: 'Kiran Verma', jobs: 118, rating: 4.7, earnings: '₹85K' },
  ];

  const userGrowth = [
    { month: 'Jan', users: 8500, workers: 450 },
    { month: 'Feb', users: 9200, workers: 480 },
    { month: 'Mar', users: 10100, workers: 520 },
    { month: 'Apr', users: 11200, workers: 560 },
    { month: 'May', users: 12400, workers: 610 },
    { month: 'Jun', users: 13800, workers: 680 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500">Platform performance & insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {overviewStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.positive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <stat.icon className={`w-5 h-5 ${stat.positive ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.positive ? <FiTrendingUp /> : <FiTrendingDown />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart & Booking Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
            <div className="flex gap-2">
              {['revenue', 'bookings', 'users'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 text-sm rounded-lg capitalize ${
                    selectedMetric === metric
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="flex items-end gap-2 h-64">
            {revenueData.map((data, idx) => (
              <motion.div
                key={idx}
                className="flex-1 flex flex-col items-center"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.value / maxRevenue) * 200}px` }}
                  transition={{ delay: idx * 0.05 }}
                  className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg relative group cursor-pointer"
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{(data.value / 100000).toFixed(1)}L
                  </div>
                </motion.div>
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Booking Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Booking Status</h2>
          <div className="space-y-4">
            {bookingStats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{stat.status}</span>
                  <span className="text-sm font-medium">{stat.count}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${
                      stat.status === 'Completed' ? 'bg-green-500' :
                      stat.status === 'Cancelled' ? 'bg-red-500' :
                      stat.status === 'Pending' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Percentage Breakdown */}
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <div className="flex flex-wrap gap-3">
              {bookingStats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    stat.status === 'Completed' ? 'bg-green-500' :
                    stat.status === 'Cancelled' ? 'bg-red-500' :
                    stat.status === 'Pending' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-xs text-gray-500">{stat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Services & Top Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Services</h2>
          <div className="space-y-3">
            {topServices.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm font-bold rounded-full">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                    <p className="text-xs text-gray-500">{service.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{service.revenue}</p>
                  <p className="text-xs text-green-600">{service.growth}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BsGeoAlt className="text-primary-600" /> Top Cities
          </h2>
          <div className="space-y-4">
            {topCities.map((city, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{city.name}</span>
                  <span className="text-sm text-gray-500">{city.bookings} ({city.percentage}%)</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${city.percentage}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-primary-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Worker Performance & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Workers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BsPeople className="text-primary-600" /> Top Workers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="pb-3 text-left text-xs font-medium text-gray-500">Worker</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500">Jobs</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500">Rating</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {workerPerformance.map((worker, idx) => (
                  <tr key={idx}>
                    <td className="py-3 flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                        {idx + 1}
                      </span>
                      <span className="text-gray-900 dark:text-white">{worker.name}</span>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">{worker.jobs}</td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-yellow-500">
                        <FiStar className="fill-current" /> {worker.rating}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-green-600">{worker.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BsGraphUp className="text-primary-600" /> User Growth
          </h2>
          
          {/* Simple Line Chart Representation */}
          <div className="space-y-4">
            {userGrowth.map((data, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-8 text-sm text-gray-500">{data.month}</span>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.users / 15000) * 100}%` }}
                      transition={{ delay: idx * 0.1 }}
                      className="h-full bg-primary-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12">{(data.users / 1000).toFixed(1)}K</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t dark:border-gray-700 flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full" />
              <span className="text-sm text-gray-500">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-sm text-gray-500">Workers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-500 rounded-xl p-6 text-white">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiActivity /> Quick Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm opacity-80">Peak Booking Hours</p>
            <p className="text-xl font-bold">10 AM - 2 PM</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm opacity-80">Most Popular Day</p>
            <p className="text-xl font-bold">Saturday</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm opacity-80">Avg. Completion Time</p>
            <p className="text-xl font-bold">1 hr 45 min</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
