import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiMapPin, FiEdit2, FiTrash2, FiHome, FiBriefcase, 
  FiHeart, FiCheck, FiX, FiNavigation
} from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const addressIcons = {
  home: FiHome,
  work: FiBriefcase,
  other: FiHeart,
};

const Addresses = () => {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuthStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: 'home',
    name: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const handleSubmit = () => {
    if (!formData.address || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingId) {
      updateAddress(editingId, formData);
      toast.success('Address updated!');
      setEditingId(null);
    } else {
      addAddress({ ...formData, id: Date.now() });
      toast.success('Address added!');
    }
    
    setShowAddForm(false);
    setFormData({
      label: 'home',
      name: '',
      phone: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditingId(addr.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      removeAddress(id);
      toast.success('Address removed');
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app, reverse geocode to get address
          toast.success('Location detected! Fill in the details.');
          setFormData({ ...formData, city: 'Current Location' });
        },
        (error) => {
          toast.error('Unable to get location');
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Addresses</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
            >
              <FiPlus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Addresses List */}
        {addresses.length === 0 && !showAddForm ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📍</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Addresses Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first address for quick booking</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium"
            >
              <FiPlus className="w-5 h-5" />
              Add Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr, idx) => {
              const IconComponent = addressIcons[addr.label] || FiMapPin;
              
              return (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg ${
                    addr.isDefault ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      addr.label === 'home' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                        : addr.label === 'work'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                          : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white capitalize">{addr.label || 'Address'}</h3>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{addr.address}</p>
                      {addr.landmark && (
                        <p className="text-sm text-gray-500">Near {addr.landmark}</p>
                      )}
                      <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                      {addr.phone && (
                        <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-primary-600 text-sm font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => handleEdit(addr)}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {editingId ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Use Current Location */}
                  <button
                    onClick={handleCurrentLocation}
                    className="w-full py-3 border-2 border-dashed border-primary-300 dark:border-primary-700 text-primary-600 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    <FiNavigation className="w-5 h-5" />
                    Use Current Location
                  </button>

                  {/* Address Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Save As
                    </label>
                    <div className="flex gap-3">
                      {['home', 'work', 'other'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, label: type })}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 capitalize flex items-center justify-center gap-2 ${
                            formData.label === type
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          {type === 'home' && <FiHome className="w-4 h-4" />}
                          {type === 'work' && <FiBriefcase className="w-4 h-4" />}
                          {type === 'other' && <FiHeart className="w-4 h-4" />}
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Address *
                    </label>
                    <textarea
                      placeholder="House/Flat No., Building, Street, Area"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      className="w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Landmark</label>
                    <input
                      type="text"
                      placeholder="Nearby landmark (optional)"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode *</label>
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>

                  {/* Default Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-5 h-5 rounded text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Set as default address</span>
                  </label>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl"
                  >
                    {editingId ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Addresses;
