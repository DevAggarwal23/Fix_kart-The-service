import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiTrendingUp, FiTrendingDown, FiFilter, FiMessageSquare } from 'react-icons/fi';
import { BsEmojiSmile, BsEmojiFrown, BsEmojiNeutral } from 'react-icons/bs';

const WorkerRatings = () => {
  const [filterRating, setFilterRating] = useState('all');

  // Mock Data
  const ratingStats = {
    overall: 4.8,
    totalReviews: 245,
    change: '+0.2',
    up: true,
  };

  const ratingBreakdown = [
    { stars: 5, count: 180, percentage: 73 },
    { stars: 4, count: 45, percentage: 18 },
    { stars: 3, count: 12, percentage: 5 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 3, percentage: 1 },
  ];

  const feedbackTags = [
    { tag: 'Professional', count: 156 },
    { tag: 'Punctual', count: 142 },
    { tag: 'Clean Work', count: 128 },
    { tag: 'Expert Skills', count: 98 },
    { tag: 'Friendly', count: 112 },
    { tag: 'Value for Money', count: 87 },
  ];

  const reviews = [
    {
      id: 1,
      customer: 'Amit Sharma',
      avatar: 'https://i.pravatar.cc/150?img=8',
      rating: 5,
      service: 'AC Repair',
      date: 'Dec 13, 2024',
      comment: 'Excellent service! Rajesh was very professional and fixed my AC quickly. Highly recommended!',
      tags: ['Professional', 'Expert Skills'],
    },
    {
      id: 2,
      customer: 'Priya Mehta',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      service: 'Fan Installation',
      date: 'Dec 12, 2024',
      comment: 'Very punctual and did a neat job. Will definitely book again.',
      tags: ['Punctual', 'Clean Work'],
    },
    {
      id: 3,
      customer: 'Suresh Kumar',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 4,
      service: 'Electrical Wiring',
      date: 'Dec 11, 2024',
      comment: 'Good work overall. Could have been a bit faster but quality was great.',
      tags: ['Expert Skills'],
    },
    {
      id: 4,
      customer: 'Kavitha Reddy',
      avatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
      service: 'AC Deep Cleaning',
      date: 'Dec 10, 2024',
      comment: 'Amazing! My AC is working like new now. Thank you!',
      tags: ['Professional', 'Value for Money'],
    },
    {
      id: 5,
      customer: 'Ramesh T.',
      avatar: 'https://i.pravatar.cc/150?img=15',
      rating: 3,
      service: 'TV Installation',
      date: 'Dec 9, 2024',
      comment: 'Service was okay but took longer than expected.',
    },
  ];

  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === Number(filterRating));

  const getRatingEmoji = (rating) => {
    if (rating >= 4.5) return <BsEmojiSmile className="w-6 h-6 text-green-500" />;
    if (rating >= 3.5) return <BsEmojiNeutral className="w-6 h-6 text-yellow-500" />;
    return <BsEmojiFrown className="w-6 h-6 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 pt-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">My Ratings</h1>
          <button className="p-2 hover:bg-white/10 rounded-full">
            <FiFilter className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Rating */}
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2">
              <span className="text-5xl font-bold">{ratingStats.overall}</span>
              <FiStar className="w-8 h-8 fill-current" />
            </div>
            <p className="text-yellow-100 mt-1">{ratingStats.totalReviews} reviews</p>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            ratingStats.up ? 'bg-green-500/30' : 'bg-red-500/30'
          }`}>
            {ratingStats.up ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{ratingStats.change}</span>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Rating Breakdown</h3>
          
          <div className="space-y-3">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-8 text-sm text-gray-500">{item.stars}★</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      item.stars >= 4 ? 'bg-green-500' :
                      item.stars === 3 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <span className="w-12 text-sm text-gray-500 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Feedback Tags */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Feedback</h3>
          
          <div className="flex flex-wrap gap-2">
            {feedbackTags.map((item, idx) => (
              <motion.span
                key={item.tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm"
              >
                {item.tag} ({item.count})
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Reviews</h3>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="p-2 border dark:border-gray-700 rounded-lg text-sm dark:bg-gray-800"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt="" className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{review.customer}</h4>
                    <p className="text-sm text-gray-500">{review.service} • {review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>

              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300 mb-3">"{review.comment}"</p>
              )}

              {review.tags && review.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {review.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="px-4 mt-6 mb-6">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 text-white">
          <h3 className="font-bold mb-2">💡 Tips to Improve Rating</h3>
          <ul className="text-sm space-y-2 text-primary-100">
            <li>• Always arrive on time or inform customer in advance</li>
            <li>• Keep your workspace clean after service</li>
            <li>• Explain the problem and solution clearly</li>
            <li>• Be polite and professional with customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkerRatings;
