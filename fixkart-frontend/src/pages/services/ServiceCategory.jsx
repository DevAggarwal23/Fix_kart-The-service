import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiStar, FiClock, FiShield, FiChevronRight } from 'react-icons/fi';
import { serviceCategories } from '../../data/dummyData';
import { useBookingStore } from '../../store/bookingStore';

const ServiceCategory = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { setSelectedCategory, setSelectedSubCategory } = useBookingStore();

  const category = serviceCategories.find(c => c.slug === categorySlug);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Link to="/services" className="text-primary-600 mt-4 inline-block">Go back to services</Link>
        </div>
      </div>
    );
  }

  const handleSelectService = (subCategory) => {
    setSelectedCategory(category);
    setSelectedSubCategory(subCategory);
    navigate('/book');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero */}
      <div className={`relative py-16 px-4 bg-gradient-to-r ${category.color}`}>
        <div className="max-w-7xl mx-auto">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <FiArrowLeft className="w-5 h-5" />
            Back to Services
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <span className="text-6xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">{category.name}</h1>
              <p className="text-white/80 text-lg">{category.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="flex items-center gap-1 text-white/90">
                  <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  4.8 Rating
                </span>
                <span className="flex items-center gap-1 text-white/90">
                  <FiClock className="w-5 h-5" />
                  Same Day Service
                </span>
                <span className="flex items-center gap-1 text-white/90">
                  <FiShield className="w-5 h-5" />
                  Verified Pros
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subCategories.map((subCategory, index) => (
            <motion.div
              key={subCategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSelectService(subCategory)}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transition-all"
            >
              <div className="relative h-40">
                <img
                  src={subCategory.image}
                  alt={subCategory.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{subCategory.name}</h3>
                  <FiChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{subCategory.price}
                    {subCategory.unit && <span className="text-sm font-normal text-gray-500"> {subCategory.unit}</span>}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    4.8
                  </span>
                </div>
                <button
                  className="w-full mt-4 py-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 font-semibold rounded-xl hover:bg-primary-100 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Choose Our {category.name} Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '✅', title: 'Verified Experts', desc: 'All professionals are background-checked and trained' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'Know the cost upfront, no hidden charges' },
              { icon: '⚡', title: 'Quick Service', desc: 'Same-day and emergency service available' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategory;
