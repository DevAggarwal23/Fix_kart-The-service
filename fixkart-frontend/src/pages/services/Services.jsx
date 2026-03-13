import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList, FiStar } from 'react-icons/fi';
import { serviceCategories } from '../../data/dummyData';

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredCategories = serviceCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.subCategories.some(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl font-display font-bold mb-4">Our Services</h1>
            <p className="text-xl text-white/80 mb-8">Find the perfect service for your home</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className="w-full py-4 pl-14 pr-6 rounded-2xl bg-white text-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters & View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['all', 'popular', 'new', 'offers'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedFilter === filter
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/services/${category.slug}`}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-video'}`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-50`} />
                    <span className="absolute top-4 left-4 text-4xl">{category.icon}</span>
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{category.subCategories.length} services</span>
                      <span className="flex items-center gap-1 text-sm text-yellow-500">
                        <FiStar className="w-4 h-4 fill-current" />
                        4.8
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {category.subCategories.slice(0, 3).map((sub) => (
                        <span key={sub.id} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                          {sub.name}
                        </span>
                      ))}
                      {category.subCategories.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600">
                          +{category.subCategories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No services found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
