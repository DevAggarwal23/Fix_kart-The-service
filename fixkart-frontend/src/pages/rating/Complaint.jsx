import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCamera, FiX, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const complaintCategories = [
  { id: 'service', label: 'Service Quality', icon: '🔧' },
  { id: 'worker', label: 'Professional Behavior', icon: '👷' },
  { id: 'payment', label: 'Payment Issue', icon: '💳' },
  { id: 'damage', label: 'Property Damage', icon: '🏠' },
  { id: 'delay', label: 'Delay/No Show', icon: '⏰' },
  { id: 'other', label: 'Other', icon: '❓' },
];

const Complaint = () => {
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [priority, setPriority] = useState('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      toast.error('Please select a complaint category');
      return;
    }
    if (!description || description.length < 20) {
      toast.error('Please describe your issue in detail (min 20 characters)');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complaint Submitted</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your complaint has been registered successfully. Our team will get back to you within 24 hours.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-6">
            <p className="text-sm text-gray-500">Complaint ID</p>
            <p className="text-xl font-mono font-bold text-primary-600">CMP-{Date.now().toString().slice(-8)}</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full py-3 bg-primary-600 text-white rounded-xl font-medium"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/dashboard/help"
              className="block w-full py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-lg">Raise a Complaint</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex gap-3"
        >
          <FiAlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-400">Before filing a complaint</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
              If you have a minor issue, please try contacting our support team first. 
              For urgent matters, proceed with the complaint form below.
            </p>
          </div>
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">What's the issue about?</h2>
          
          <div className="grid grid-cols-3 gap-3">
            {complaintCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                  selectedCategory === cat.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Booking ID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Booking ID (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., FX12345678"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full p-3 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe Your Issue *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide detailed information about your complaint..."
            rows={5}
            className="w-full p-4 border dark:border-gray-700 rounded-xl resize-none dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 mt-2">{description.length}/500 characters</p>
        </motion.div>

        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Attach Evidence (Optional)
          </label>
          
          <div className="flex gap-3 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                <FiCamera className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Add Photo</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-3">Max 5 images, each up to 5MB</p>
        </motion.div>

        {/* Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Priority Level
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-300' },
              { id: 'normal', label: 'Normal', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
              { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-300' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPriority(p.id)}
                className={`py-3 rounded-xl font-medium border-2 transition-all ${
                  priority === p.id
                    ? p.color
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit Complaint</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
