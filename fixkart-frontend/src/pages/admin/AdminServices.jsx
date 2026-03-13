import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiX,
  FiImage, FiDollarSign, FiTag, FiChevronRight, FiChevronDown
} from 'react-icons/fi';
import { BsGrid, BsListUl, BsThreeDotsVertical } from 'react-icons/bs';

const AdminServices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);

  // Mock Data
  const categories = [
    {
      id: 'cat1',
      name: 'AC Services',
      icon: '❄️',
      services: [
        { id: 's1', name: 'AC Repair', price: 399, bookings: 1245, status: 'active', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200' },
        { id: 's2', name: 'AC Deep Cleaning', price: 699, bookings: 892, status: 'active', image: 'https://images.unsplash.com/photo-1631545806609-c1b6409eb39c?w=200' },
        { id: 's3', name: 'AC Installation', price: 1499, bookings: 456, status: 'active', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200' },
        { id: 's4', name: 'AC Gas Refill', price: 2499, bookings: 234, status: 'inactive', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200' },
      ],
      totalBookings: 2827,
      revenue: '₹14.2L',
    },
    {
      id: 'cat2',
      name: 'Home Cleaning',
      icon: '🧹',
      services: [
        { id: 's5', name: 'Full Home Cleaning', price: 999, bookings: 1567, status: 'active', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200' },
        { id: 's6', name: 'Bathroom Cleaning', price: 399, bookings: 723, status: 'active', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200' },
        { id: 's7', name: 'Kitchen Cleaning', price: 499, bookings: 512, status: 'active', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200' },
      ],
      totalBookings: 2802,
      revenue: '₹18.9L',
    },
    {
      id: 'cat3',
      name: 'Plumbing',
      icon: '🔧',
      services: [
        { id: 's8', name: 'Pipe Repair', price: 299, bookings: 456, status: 'active', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200' },
        { id: 's9', name: 'Tap Installation', price: 199, bookings: 234, status: 'active', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200' },
        { id: 's10', name: 'Toilet Repair', price: 349, bookings: 189, status: 'active', image: 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=200' },
      ],
      totalBookings: 879,
      revenue: '₹3.8L',
    },
    {
      id: 'cat4',
      name: 'Electrical',
      icon: '⚡',
      services: [
        { id: 's11', name: 'Wiring Repair', price: 399, bookings: 678, status: 'active', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200' },
        { id: 's12', name: 'Switch/Socket Installation', price: 149, bookings: 345, status: 'active', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
        { id: 's13', name: 'Fan Installation', price: 299, bookings: 289, status: 'active', image: 'https://images.unsplash.com/photo-1631646109206-4c986f672da9?w=200' },
      ],
      totalBookings: 1312,
      revenue: '₹5.2L',
    },
  ];

  const stats = [
    { label: 'Total Categories', value: categories.length },
    { label: 'Total Services', value: categories.reduce((sum, cat) => sum + cat.services.length, 0) },
    { label: 'Active Services', value: categories.reduce((sum, cat) => sum + cat.services.filter(s => s.status === 'active').length, 0) },
    { label: 'Total Revenue', value: '₹42.1L' },
  ];

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-gray-500">Manage service categories and offerings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Add Service
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow text-center"
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative w-full md:w-auto">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            <BsGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            <BsListUl className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories & Services */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{category.icon}</span>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.services.length} services • {category.totalBookings} bookings</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary-600">{category.revenue}</span>
                {expandedCategories.includes(category.id) 
                  ? <FiChevronDown className="w-5 h-5" /> 
                  : <FiChevronRight className="w-5 h-5" />
                }
              </div>
            </button>

            {/* Services */}
            <AnimatePresence>
              {expandedCategories.includes(category.id) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t dark:border-gray-700 p-4">
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {category.services.map((service) => (
                          <div
                            key={service.id}
                            className="border dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-full h-32 object-cover"
                            />
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  service.status === 'active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {service.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-primary-600 font-bold">₹{service.price}</span>
                                <span className="text-gray-500">{service.bookings} bookings</span>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button className="flex-1 py-1.5 border dark:border-gray-700 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <FiEdit2 className="w-4 h-4" /> Edit
                                </button>
                                <button className="p-1.5 border dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-red-500">
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Add New Service Card */}
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="border-2 border-dashed dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <FiPlus className="w-8 h-8 text-gray-400" />
                          <span className="text-gray-500">Add Service</span>
                        </button>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                          {category.services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 flex items-center gap-3">
                                <img src={service.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                <span className="font-medium text-gray-900 dark:text-white">{service.name}</span>
                              </td>
                              <td className="px-4 py-3 text-primary-600 font-medium">₹{service.price}</td>
                              <td className="px-4 py-3 text-gray-500">{service.bookings}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  service.status === 'active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {service.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                                    <FiEdit2 className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-500">
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold">Add New Service</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter service name"
                    className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700">
                    <option>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 45 min"
                      className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Service description"
                    className="w-full p-3 border dark:border-gray-700 rounded-lg resize-none dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Image
                  </label>
                  <div className="border-2 border-dashed dark:border-gray-700 rounded-lg p-8 text-center">
                    <FiImage className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">Click to upload or drag and drop</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border dark:border-gray-700 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium">
                    Add Service
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServices;
