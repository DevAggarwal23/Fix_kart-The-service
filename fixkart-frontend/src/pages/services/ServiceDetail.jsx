import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiStar, FiClock, FiShield, FiCheck, FiPlus, FiMinus, FiChevronDown, FiHeart } from 'react-icons/fi';
import { serviceCategories, sampleWorkers, faqs } from '../../data/dummyData';
import { useBookingStore } from '../../store/bookingStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

const ServiceDetail = () => {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const { setSelectedCategory, setSelectedSubCategory } = useBookingStore();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Find service across categories
  let service = null;
  let parentCategory = null;
  
  for (const cat of serviceCategories) {
    const found = cat.subCategories.find(s => s.slug === serviceSlug);
    if (found) {
      service = found;
      parentCategory = cat;
      break;
    }
  }

  if (!service || !parentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Service not found</h1>
          <Link to="/services" className="text-primary-600 mt-4 inline-block">Go back to services</Link>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    setSelectedCategory(parentCategory);
    setSelectedSubCategory(service);
    navigate('/book');
  };

  const relatedWorkers = sampleWorkers.filter(w => w.services.includes(parentCategory.name)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Link to={`/services/${parentCategory.slug}`} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
          >
            <FiHeart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 bg-primary-500 text-white text-sm rounded-full mb-3">
              {parentCategory.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{service.name}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-1">
                <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                4.8 (2.5k reviews)
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="w-5 h-5" />
                30-60 mins
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this Service</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Get professional {service.name.toLowerCase()} service at your doorstep. Our verified experts 
                ensure quality work with a satisfaction guarantee. Whether it's a quick fix or a complete 
                overhaul, we've got you covered with transparent pricing and reliable service.
              </p>
            </motion.div>

            {/* What's Included */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Professional inspection',
                  'Quality parts & materials',
                  'Expert workmanship',
                  'Post-service cleanup',
                  '30-day service warranty',
                  '24/7 support',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Professionals */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Professionals</h2>
              <div className="space-y-4">
                {relatedWorkers.map((worker) => (
                  <div key={worker.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <img 
                      src={worker.image} 
                      alt={worker.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{worker.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{worker.experience} experience</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FiStar className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{worker.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{worker.jobsCompleted}+ jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">FAQs</h2>
              <div className="space-y-3">
                {faqs.slice(0, 4).map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                      <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedFaq === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting at</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{service.price}</span>
                    {service.unit && <span className="text-gray-500">{service.unit}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                  <FiShield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Warranty</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity / Units
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <FiMinus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-6">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="text-2xl font-bold text-primary-600">₹{service.price * quantity}</span>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBook}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                Book Now
              </button>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { icon: '🛡️', label: '100% Safe' },
                  { icon: '💳', label: 'Easy Pay' },
                  { icon: '⭐', label: 'Top Rated' },
                ].map((badge, idx) => (
                  <div key={idx} className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-xl">{badge.icon}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Services</h2>
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            navigation
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-4"
          >
            {parentCategory.subCategories
              .filter(s => s.id !== service.id)
              .map((related) => (
                <SwiperSlide key={related.id}>
                  <Link 
                    to={`/service/${related.slug}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="h-32 relative">
                      <img src={related.image} alt={related.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{related.name}</h3>
                      <p className="text-primary-600 font-bold mt-1">₹{related.price}</p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceDetail;
