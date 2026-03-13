import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiStar, FiCamera, FiX, FiCheck } from 'react-icons/fi';
import { Star, Sparkles, Heart, ThumbsUp } from 'lucide-react';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';

const ratingLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];
const ratingEmojis = ['😞', '😕', '😐', '😊', '🤩'];
const ratingColors = [
  'from-red-400 to-red-500',
  'from-orange-400 to-orange-500',
  'from-yellow-400 to-yellow-500',
  'from-green-400 to-green-500',
  'from-emerald-400 to-emerald-500',
];

const feedbackTags = [
  { label: 'On time', emoji: '⏰' },
  { label: 'Professional', emoji: '👔' },
  { label: 'Skilled work', emoji: '🔧' },
  { label: 'Good communication', emoji: '💬' },
  { label: 'Clean & tidy', emoji: '✨' },
  { label: 'Fair pricing', emoji: '💰' },
  { label: 'Friendly', emoji: '😊' },
  { label: 'Would recommend', emoji: '👍' },
];

// Animated Star Component
const AnimatedStar = ({ filled, onClick, index, total }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.2, y: -4 }}
    whileTap={{ scale: 0.85 }}
    className="relative p-1"
  >
    <motion.div
      initial={false}
      animate={filled ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Star
        className={`w-11 h-11 transition-all duration-300 ${
          filled
            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    </motion.div>
    {/* Sparkle effect on fill */}
    <AnimatePresence>
      {filled && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

const RateService = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [serviceRating, setServiceRating] = useState(0);
  const [workerRating, setWorkerRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [review, setReview] = useState('');
  const [images, setImages] = useState([]);
  const [tip, setTip] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMiniConfetti, setShowMiniConfetti] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleServiceRating = (star) => {
    setServiceRating(star);
    if (star === 5) {
      setShowMiniConfetti(true);
      setTimeout(() => setShowMiniConfetti(false), 3000);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (serviceRating === 0) { toast.error('Please rate the service'); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 3000);
    }, 1000);
  };

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4
                      bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50
                      dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <Confetti recycle={false} numberOfPieces={250}
          colors={['#22c55e', '#10b981', '#6366f1', '#f97316', '#eab308']} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: 3, duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 
                       flex items-center justify-center shadow-xl shadow-green-500/30">
            <FiCheck className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Thank You! 🎉</h1>
          <p className="text-gray-500 dark:text-gray-400">Your feedback helps us improve</p>
          {tip > 0 && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-green-600 mt-4 font-semibold flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-green-500" /> ₹{tip} tip sent to the professional
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-28">
      {showMiniConfetti && (
        <Confetti recycle={false} numberOfPieces={100} gravity={0.3}
          colors={['#eab308', '#f59e0b', '#fbbf24']} />
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl 
                      border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <FiArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Rate Your Experience</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Service Rating */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800/80 rounded-3xl p-6 text-center
                     shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">How was the service?</h2>
          <p className="text-sm text-gray-400 mb-5">Tap to rate</p>

          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <AnimatedStar key={star} filled={star <= serviceRating}
                onClick={() => handleServiceRating(star)} index={star} total={5} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {serviceRating > 0 && (
              <motion.div key={serviceRating}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center">
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}
                  className="text-5xl mb-2">{ratingEmojis[serviceRating - 1]}</motion.span>
                <span className={`text-lg font-bold bg-gradient-to-r ${ratingColors[serviceRating - 1]} bg-clip-text text-transparent`}>
                  {ratingLabels[serviceRating - 1]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Worker Rating */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800/80 rounded-3xl p-6
                     shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Rate the Professional</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 
                            flex items-center justify-center text-white text-xl font-bold shadow-lg">
              R
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">Rajesh Kumar</p>
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button key={star} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setWorkerRating(star)}>
                    <Star className={`w-7 h-7 transition-all ${
                      star <= workerRating
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]'
                        : 'text-gray-300 dark:text-gray-600'
                    }`} />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feedback Tags */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800/80 rounded-3xl p-6
                     shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">What did you like?</h2>
          <div className="flex flex-wrap gap-2">
            {feedbackTags.map((tag) => (
              <motion.button key={tag.label}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => toggleTag(tag.label)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedTags.includes(tag.label)
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600/50'
                }`}>
                <span>{tag.emoji}</span>{tag.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Written Review */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800/80 rounded-3xl p-6
                     shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Write a Review</h2>
          <textarea value={review} onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            className="w-full p-4 rounded-xl text-sm resize-none
                       bg-gray-50 dark:bg-gray-700/50 
                       border border-gray-200 dark:border-gray-600/50
                       focus:border-primary-400 dark:focus:border-primary-500
                       focus:ring-2 focus:ring-primary-400/20 outline-none transition-all
                       text-gray-800 dark:text-gray-200 placeholder-gray-400" />

          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2 font-medium">Add Photos</p>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <motion.div key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full 
                               flex items-center justify-center shadow-md">
                    <FiX className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
              <label className="w-20 h-20 rounded-xl flex items-center justify-center cursor-pointer
                                border-2 border-dashed border-gray-300 dark:border-gray-600 
                                hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
                <FiCamera className="w-5 h-5 text-gray-400" />
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </motion.div>

        {/* Tip Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-3xl p-6 text-white
                     bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
                     shadow-lg shadow-green-500/20">
          <div className="absolute inset-0 opacity-10"
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          <div className="relative">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Heart className="w-5 h-5" /> Show Appreciation
            </h2>
            <p className="text-sm opacity-80 mb-4">Add a tip — 100% goes to the professional</p>
            <div className="flex gap-2">
              {[0, 20, 50, 100].map((amount) => (
                <motion.button key={amount}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setTip(amount)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    tip === amount
                      ? 'bg-white text-green-600 shadow-lg'
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                  }`}>
                  {amount === 0 ? 'Skip' : `₹${amount}`}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Submit */}
      <div className="fixed bottom-0 left-0 right-0 z-40
                      bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
                      border-t border-gray-200/50 dark:border-gray-700/50 p-4">
        <div className="max-w-lg mx-auto">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} disabled={isSubmitting || serviceRating === 0}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              serviceRating > 0
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}>
            {isSubmitting ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
            ) : (
              <><ThumbsUp className="w-5 h-5" />Submit Review</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default RateService;
