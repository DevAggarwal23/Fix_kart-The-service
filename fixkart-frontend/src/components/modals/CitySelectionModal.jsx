import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiSearch, FiNavigation } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { cities } from '../../data/dummyData';

const CitySelectionModal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);
  const [detectingLocation, setDetectingLocation] = useState(false);
  
  const { setSelectedCity, toggleCityModal } = useAuthStore();

  useEffect(() => {
    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchQuery]);

  const handleAutoDetect = () => {
    setDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, reverse geocode to get city
          // For demo, we'll select Delhi
          setTimeout(() => {
            setSelectedCity(cities[0]);
            setDetectingLocation(false);
          }, 1500);
        },
        (error) => {
          console.error('Location error:', error);
          setDetectingLocation(false);
        }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={toggleCityModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-content"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Your City
              </h2>
              <button
                onClick={toggleCityModal}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your city..."
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Auto-detect Location */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <button
              onClick={handleAutoDetect}
              disabled={detectingLocation}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-70"
            >
              {detectingLocation ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <FiNavigation className="w-5 h-5" />
                  </motion.div>
                  Detecting Location...
                </>
              ) : (
                <>
                  <FiNavigation className="w-5 h-5" />
                  Detect My Location
                </>
              )}
            </button>
          </div>

          {/* Cities Grid */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-500 mb-4">Popular Cities</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredCities.map((city) => (
                <motion.button
                  key={city.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCity(city)}
                  className="group relative overflow-hidden rounded-xl aspect-[4/3]"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                    <p className="text-white font-semibold">{city.name}</p>
                    <p className="text-white/70 text-xs">{city.state}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {filteredCities.length === 0 && (
              <div className="text-center py-8">
                <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No cities found</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CitySelectionModal;
