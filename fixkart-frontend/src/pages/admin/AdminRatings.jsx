import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiStar, FiThumbsUp, FiThumbsDown, 
  FiMessageSquare, FiAlertTriangle, FiCheckCircle
} from 'react-icons/fi';
import { BsStarFill, BsEmojiSmile, BsEmojiFrown, BsEmojiNeutral } from 'react-icons/bs';

const AdminRatings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock Data
  const stats = {
    avgServiceRating: 4.6,
    avgWorkerRating: 4.7,
    totalReviews: 12845,
    positivePercentage: 92,
  };

  const ratingDistribution = [
    { stars: 5, percentage: 68, count: 8734 },
    { stars: 4, percentage: 20, count: 2569 },
    { stars: 3, percentage: 7, count: 899 },
    { stars: 2, percentage: 3, count: 385 },
    { stars: 1, percentage: 2, count: 258 },
  ];

  const reviews = [
    {
      id: 'REV001',
      customer: { name: 'Amit Sharma', avatar: 'https://i.pravatar.cc/150?img=8' },
      worker: { name: 'Rajesh Kumar', avatar: 'https://i.pravatar.cc/150?img=12' },
      service: 'AC Repair',
      bookingId: 'FK125001',
      rating: 5,
      comment: 'Excellent service! Rajesh was very professional and fixed my AC quickly. Highly recommended!',
      tags: ['Professional', 'Punctual', 'Expert'],
      date: 'Dec 15, 2024',
      status: 'published',
    },
    {
      id: 'REV002',
      customer: { name: 'Priya Mehta', avatar: 'https://i.pravatar.cc/150?img=5' },
      worker: { name: 'Suresh Patel', avatar: 'https://i.pravatar.cc/150?img=15' },
      service: 'Bathroom Cleaning',
      bookingId: 'FK125002',
      rating: 4,
      comment: 'Good service overall. Work was done well but arrived a bit late.',
      tags: ['Clean Work', 'Friendly'],
      date: 'Dec 14, 2024',
      status: 'published',
    },
    {
      id: 'REV003',
      customer: { name: 'Rahul Patel', avatar: 'https://i.pravatar.cc/150?img=9' },
      worker: { name: 'Mohan Verma', avatar: 'https://i.pravatar.cc/150?img=18' },
      service: 'Plumbing Repair',
      bookingId: 'FK125003',
      rating: 2,
      comment: 'Not satisfied. The issue was not properly fixed and had to call again.',
      tags: [],
      date: 'Dec 13, 2024',
      status: 'flagged',
      flagReason: 'Negative review - needs follow-up',
    },
    {
      id: 'REV004',
      customer: { name: 'Kavitha Reddy', avatar: 'https://i.pravatar.cc/150?img=25' },
      worker: { name: 'Anil Sharma', avatar: 'https://i.pravatar.cc/150?img=20' },
      service: 'Electrical Wiring',
      bookingId: 'FK125004',
      rating: 5,
      comment: 'Amazing work! Very professional and explained everything clearly.',
      tags: ['Professional', 'Expert', 'Value for Money'],
      date: 'Dec 12, 2024',
      status: 'published',
    },
    {
      id: 'REV005',
      customer: { name: 'Deepak Nair', avatar: 'https://i.pravatar.cc/150?img=22' },
      worker: { name: 'Ravi Teja', avatar: 'https://i.pravatar.cc/150?img=28' },
      service: 'Wall Painting',
      bookingId: 'FK125005',
      rating: 1,
      comment: 'Terrible experience. Worker was rude and work quality was poor.',
      tags: [],
      date: 'Dec 11, 2024',
      status: 'pending',
    },
  ];

  const topPositiveTags = [
    { tag: 'Professional', count: 4521 },
    { tag: 'Punctual', count: 3892 },
    { tag: 'Expert', count: 3456 },
    { tag: 'Clean Work', count: 2987 },
    { tag: 'Friendly', count: 2654 },
  ];

  const topNegativeTags = [
    { tag: 'Late Arrival', count: 234 },
    { tag: 'Incomplete Work', count: 189 },
    { tag: 'Unprofessional', count: 156 },
    { tag: 'Poor Quality', count: 123 },
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === 'all' || review.rating === Number(filterRating);
    const matchesType = filterType === 'all' || review.status === filterType;
    return matchesSearch && matchesRating && matchesType;
  });

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      flagged: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ratings & Reviews</h1>
          <p className="text-gray-500">Monitor customer feedback and ratings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
              <BsStarFill className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgServiceRating}</p>
              <p className="text-gray-500 text-sm">Avg. Service Rating</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <BsStarFill className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgWorkerRating}</p>
              <p className="text-gray-500 text-sm">Avg. Worker Rating</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <FiMessageSquare className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalReviews.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Total Reviews</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <BsEmojiSmile className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.positivePercentage}%</p>
              <p className="text-gray-500 text-sm">Positive Reviews</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-12 text-sm flex items-center gap-1">
                  {item.stars} <FiStar className="fill-current text-yellow-500" />
                </span>
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      item.stars >= 4 ? 'bg-green-500' :
                      item.stars === 3 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <span className="w-16 text-sm text-gray-500 text-right">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Feedback Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiThumbsUp className="text-green-500" /> Positive Feedback
          </h3>
          <div className="space-y-2">
            {topPositiveTags.map((item, idx) => (
              <div key={item.tag} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-gray-700 dark:text-gray-300">{item.tag}</span>
                <span className="text-sm text-green-600 font-medium">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiThumbsDown className="text-red-500" /> Areas to Improve
          </h3>
          <div className="space-y-2">
            {topNegativeTags.map((item, idx) => (
              <div key={item.tag} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-gray-700 dark:text-gray-300">{item.tag}</span>
                <span className="text-sm text-red-600 font-medium">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Reviews</h2>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700"
              />
            </div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </div>

        <div className="divide-y dark:divide-gray-700">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={review.customer.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{review.customer.name}</p>
                    <p className="text-xs text-gray-500">{review.service} • {review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 ${getRatingColor(review.rating)}`}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(review.status)}`}>
                    {review.status}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3">"{review.comment}"</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Worker:</span>
                  <img src={review.worker.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{review.worker.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg text-green-600">
                        <FiCheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600">
                        <FiAlertTriangle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {review.status === 'flagged' && (
                    <span className="text-xs text-red-600">{review.flagReason}</span>
                  )}
                </div>
              </div>

              {review.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {review.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRatings;
