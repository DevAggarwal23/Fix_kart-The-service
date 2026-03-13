import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiRefreshCw, FiMapPin, FiPhone, FiClock,
  FiZoomIn, FiZoomOut, FiMaximize
} from 'react-icons/fi';
import { BsPersonCircle, BsCircleFill } from 'react-icons/bs';

const AdminLiveMap = () => {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock Workers Data with locations
  const workers = [
    {
      id: 'WRK001',
      name: 'Rajesh Kumar',
      avatar: 'https://i.pravatar.cc/150?img=12',
      phone: '+91 98765 43210',
      status: 'busy',
      currentJob: { id: 'FK125001', service: 'AC Repair', customer: 'Amit S.' },
      location: { lat: 12.9352, lng: 77.6245 },
      lastUpdated: '2 min ago',
    },
    {
      id: 'WRK002',
      name: 'Suresh Patel',
      avatar: 'https://i.pravatar.cc/150?img=15',
      phone: '+91 87654 32109',
      status: 'available',
      currentJob: null,
      location: { lat: 12.9152, lng: 77.6445 },
      lastUpdated: '5 min ago',
    },
    {
      id: 'WRK003',
      name: 'Mohan Verma',
      avatar: 'https://i.pravatar.cc/150?img=18',
      phone: '+91 76543 21098',
      status: 'busy',
      currentJob: { id: 'FK125004', service: 'Electrical Wiring', customer: 'Kavitha R.' },
      location: { lat: 12.9752, lng: 77.6145 },
      lastUpdated: '1 min ago',
    },
    {
      id: 'WRK004',
      name: 'Anil Sharma',
      avatar: 'https://i.pravatar.cc/150?img=20',
      phone: '+91 65432 10987',
      status: 'offline',
      currentJob: null,
      location: { lat: 12.9452, lng: 77.5945 },
      lastUpdated: '1 hour ago',
    },
    {
      id: 'WRK005',
      name: 'Ravi Teja',
      avatar: 'https://i.pravatar.cc/150?img=22',
      phone: '+91 54321 09876',
      status: 'available',
      currentJob: null,
      location: { lat: 12.9252, lng: 77.6345 },
      lastUpdated: '3 min ago',
    },
    {
      id: 'WRK006',
      name: 'Kiran N.',
      avatar: 'https://i.pravatar.cc/150?img=25',
      phone: '+91 43210 98765',
      status: 'en_route',
      currentJob: { id: 'FK125006', service: 'Plumbing', customer: 'Deepak N.' },
      location: { lat: 12.9552, lng: 77.6545 },
      lastUpdated: 'Just now',
    },
  ];

  const stats = {
    total: workers.length,
    available: workers.filter(w => w.status === 'available').length,
    busy: workers.filter(w => w.status === 'busy' || w.status === 'en_route').length,
    offline: workers.filter(w => w.status === 'offline').length,
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || worker.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      available: 'text-green-500',
      busy: 'text-red-500',
      en_route: 'text-blue-500',
      offline: 'text-gray-400',
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusBadge = (status) => {
    const styles = {
      available: 'bg-green-100 text-green-700',
      busy: 'bg-red-100 text-red-700',
      en_route: 'bg-blue-100 text-blue-700',
      offline: 'bg-gray-100 text-gray-500',
    };
    return styles[status] || 'bg-gray-100 text-gray-500';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Map</h1>
            <p className="text-gray-500">Real-time worker tracking</p>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            <p className="text-xs text-green-600">Available</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">{stats.busy}</p>
            <p className="text-xs text-red-600">Busy</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-400">{stats.offline}</p>
            <p className="text-xs text-gray-400">Offline</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Map Area */}
        <div className="flex-1 relative bg-gray-200 dark:bg-gray-900">
          {/* Simulated Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <FiMapPin className="w-16 h-16 mx-auto mb-4" />
              <p>Map View</p>
              <p className="text-sm">Google Maps integration would render here</p>
            </div>
          </div>

          {/* Worker Markers (Simulated positions) */}
          {filteredWorkers.map((worker, idx) => (
            <motion.button
              key={worker.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedWorker(worker)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                selectedWorker?.id === worker.id ? 'z-30' : 'z-20'
              }`}
              style={{
                left: `${20 + (idx * 15)}%`,
                top: `${30 + (idx * 10)}%`,
              }}
            >
              <div className={`relative ${selectedWorker?.id === worker.id ? 'scale-125' : ''} transition-transform`}>
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className={`w-10 h-10 rounded-full border-3 ${
                    worker.status === 'available' ? 'border-green-500' :
                    worker.status === 'busy' ? 'border-red-500' :
                    worker.status === 'en_route' ? 'border-blue-500' : 'border-gray-400'
                  } shadow-lg`}
                />
                <BsCircleFill className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(worker.status)}`} />
              </div>
            </motion.button>
          ))}

          {/* Map Controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiZoomIn className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiZoomOut className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiMaximize className="w-5 h-5" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute left-4 bottom-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
            <p className="text-xs font-medium text-gray-500 mb-2">Legend</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BsCircleFill className="w-2 h-2 text-green-500" />
                <span className="text-xs">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <BsCircleFill className="w-2 h-2 text-blue-500" />
                <span className="text-xs">En Route</span>
              </div>
              <div className="flex items-center gap-2">
                <BsCircleFill className="w-2 h-2 text-red-500" />
                <span className="text-xs">Busy</span>
              </div>
              <div className="flex items-center gap-2">
                <BsCircleFill className="w-2 h-2 text-gray-400" />
                <span className="text-xs">Offline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workers Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
          {/* Search & Filter */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'available', 'busy'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium capitalize ${
                    filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Workers List */}
          <div className="flex-1 overflow-y-auto">
            {filteredWorkers.map((worker) => (
              <button
                key={worker.id}
                onClick={() => setSelectedWorker(worker)}
                className={`w-full p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left ${
                  selectedWorker?.id === worker.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={worker.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <BsCircleFill className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(worker.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{worker.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(worker.status)}`}>
                      {worker.status === 'en_route' ? 'En Route' : worker.status}
                    </span>
                  </div>
                </div>
                {worker.currentJob && (
                  <div className="mt-2 text-xs text-gray-500">
                    <p className="truncate">📍 {worker.currentJob.service} - {worker.currentJob.customer}</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">Updated: {worker.lastUpdated}</p>
              </button>
            ))}
          </div>

          {/* Selected Worker Details */}
          {selectedWorker && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={selectedWorker.avatar} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedWorker.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(selectedWorker.status)}`}>
                    {selectedWorker.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FiPhone className="w-4 h-4" />
                  <span>{selectedWorker.phone}</span>
                </div>
                {selectedWorker.currentJob && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <FiMapPin className="w-4 h-4" />
                    <span>{selectedWorker.currentJob.service}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500">
                  <FiClock className="w-4 h-4" />
                  <span>{selectedWorker.lastUpdated}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 border dark:border-gray-600 rounded-lg text-sm font-medium">
                  Call
                </button>
                <button className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">
                  Message
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLiveMap;
