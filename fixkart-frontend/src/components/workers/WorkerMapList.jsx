/**
 * WorkerMapList Component
 * Displays nearby workers on Google Map with list view
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMapPin, FiStar, FiClock, FiPhone, FiNavigation, FiGrid, FiList,
  FiChevronRight, FiShield, FiAward, FiFilter, FiX
} from 'react-icons/fi';
import { workers as sampleWorkers } from '../../data/dummyData';

// Google Maps container styles
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (Delhi, India)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

// Map styles for clean look
const mapStyles = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] }
];

// Libraries needed for Google Maps
const libraries = ['places', 'geometry'];

const WorkerMapList = ({ 
  category = null, 
  onSelectWorker = () => {},
  selectedWorker = null,
  userLocation = null,
  showCompare = false
}) => {
  const [viewMode, setViewMode] = useState('split'); // map, list, split
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDistance: 10,
    sortBy: 'distance', // distance, rating, price
    available: true
  });

  // Load Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  // Get user's current location
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(newCenter);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, [userLocation]);

  // Filter and sort workers
  useEffect(() => {
    let filteredWorkers = [...sampleWorkers];
    
    // Filter by category
    if (category) {
      filteredWorkers = filteredWorkers.filter(w => 
        w.categories?.includes(category) || w.services?.includes(category)
      );
    }

    // Filter by rating
    if (filters.minRating > 0) {
      filteredWorkers = filteredWorkers.filter(w => w.rating >= filters.minRating);
    }

    // Filter by availability
    if (filters.available) {
      filteredWorkers = filteredWorkers.filter(w => w.available !== false);
    }

    // Sort workers
    switch (filters.sortBy) {
      case 'rating':
        filteredWorkers.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filteredWorkers.sort((a, b) => a.price - b.price);
        break;
      case 'distance':
      default:
        // Already sorted by distance in dummy data
        break;
    }

    setWorkers(filteredWorkers);
  }, [category, filters]);

  // Calculate distance between two points
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Toggle compare
  const toggleCompare = (worker) => {
    setCompareList(prev => {
      if (prev.find(w => w.id === worker.id)) {
        return prev.filter(w => w.id !== worker.id);
      }
      if (prev.length >= 3) return prev; // Max 3 workers to compare
      return [...prev, worker];
    });
  };

  // Map component
  const mapOptions = useMemo(() => ({
    styles: mapStyles,
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true
  }), []);

  // Worker card component
  const WorkerCard = ({ worker, compact = false }) => {
    const isSelected = selectedWorker?.id === worker.id;
    const isComparing = compareList.find(w => w.id === worker.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-2 transition-all cursor-pointer ${
          isSelected ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent hover:border-primary-200'
        }`}
        onClick={() => onSelectWorker(worker)}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            {worker.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <FiShield className="w-3 h-3 text-white" />
              </div>
            )}
            {worker.available && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{worker.name}</h3>
              {worker.badges?.includes('Top Rated') && (
                <FiAward className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {worker.rating} ({worker.totalJobs || 100}+)
              </span>
              <span>•</span>
              <span>{worker.experience}</span>
            </div>

            {!compact && (
              <div className="flex items-center gap-3 text-sm mt-2">
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <FiMapPin className="w-4 h-4 text-primary-500" />
                  {worker.distance}
                </span>
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <FiClock className="w-4 h-4 text-secondary-500" />
                  {worker.eta}
                </span>
              </div>
            )}

            {/* Badges */}
            {!compact && worker.badges && (
              <div className="flex flex-wrap gap-1 mt-2">
                {worker.badges.slice(0, 2).map((badge, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price & Actions */}
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">₹{worker.price}</p>
            <p className="text-xs text-gray-500">onwards</p>
            
            {showCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompare(worker);
                }}
                className={`mt-2 text-xs px-2 py-1 rounded-lg transition-colors ${
                  isComparing 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {isComparing ? '✓ Added' : 'Compare'}
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!compact && (
          <div className="flex gap-2 mt-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelectWorker(worker);
              }}
              className="flex-1 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              Book Now <FiChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Direct call functionality
                if (worker.phone) {
                  window.location.href = `tel:${worker.phone}`;
                }
              }}
              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiPhone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  // Loading state
  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500">Error loading maps. Please check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with view toggle and filters */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            {workers.length} Workers Available
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['map', 'split', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {mode === 'map' && <FiMapPin className="w-4 h-4" />}
                {mode === 'split' && <FiGrid className="w-4 h-4" />}
                {mode === 'list' && <FiList className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`p-2 rounded-lg transition-colors ${
              filterOpen ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters(f => ({ ...f, minRating: Number(e.target.value) }))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value={0}>Any</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="distance">Nearest</option>
                  <option value="rating">Top Rated</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.available}
                    onChange={(e) => setFilters(f => ({ ...f, available: e.target.checked }))}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Available Now</span>
                </label>
              </div>
              <div className="flex items-end justify-end">
                <button
                  onClick={() => setFilters({ minRating: 0, maxDistance: 10, sortBy: 'distance', available: true })}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2 hidden md:block' : 'w-full'} h-full`}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={13}
              options={mapOptions}
            >
              {/* User location marker */}
              <Marker
                position={mapCenter}
                icon={{
                  url: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
                      <circle cx="16" cy="16" r="4" fill="white"/>
                    </svg>
                  `),
                  scaledSize: { width: 32, height: 32 }
                }}
              />

              {/* Search radius circle */}
              <Circle
                center={mapCenter}
                radius={5000}
                options={{
                  fillColor: '#3B82F6',
                  fillOpacity: 0.1,
                  strokeColor: '#3B82F6',
                  strokeOpacity: 0.3,
                  strokeWeight: 2
                }}
              />

              {/* Worker markers */}
              {workers.map((worker) => (
                <Marker
                  key={worker.id}
                  position={worker.location}
                  onClick={() => setSelectedMarker(worker)}
                  icon={{
                    url: worker.avatar,
                    scaledSize: { width: 40, height: 40 }
                  }}
                />
              ))}

              {/* Info Window */}
              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.location}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <img 
                        src={selectedMarker.avatar} 
                        alt={selectedMarker.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{selectedMarker.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FiStar className="fill-yellow-400 text-yellow-400" />
                          {selectedMarker.rating}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold">₹{selectedMarker.price}</span>
                      <button
                        onClick={() => onSelectWorker(selectedMarker)}
                        className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        )}

        {/* List View */}
        {(viewMode === 'list' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'} h-full overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900`}>
            {workers.length === 0 ? (
              <div className="text-center py-12">
                <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No workers found matching your criteria</p>
              </div>
            ) : (
              workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Compare Panel */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Comparing {compareList.length} Workers
              </h3>
              <button
                onClick={() => setCompareList([])}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {compareList.map((worker) => (
                <div key={worker.id} className="flex-shrink-0 w-48">
                  <WorkerCard worker={worker} compact />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkerMapList;
