import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiPhone, FiMessageSquare, FiMapPin, FiClock, FiCamera,
  FiNavigation, FiCheck, FiX, FiAlertTriangle, FiImage
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const jobStages = [
  { id: 'accepted', label: 'Accepted', description: 'Job confirmed' },
  { id: 'on_way', label: 'On the Way', description: 'Heading to location' },
  { id: 'arrived', label: 'Arrived', description: 'At location' },
  { id: 'working', label: 'Working', description: 'Service in progress' },
  { id: 'completed', label: 'Completed', description: 'Job finished' },
];

const WorkerActiveJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentStage, setCurrentStage] = useState(0);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [workProgress, setWorkProgress] = useState([]);
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [progressNote, setProgressNote] = useState('');
  const [progressImages, setProgressImages] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [additionalItems, setAdditionalItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  // Mock Job Data
  const job = {
    id: 'FK123001',
    service: 'AC Deep Cleaning',
    category: 'AC Services',
    customer: {
      name: 'Amit Sharma',
      phone: '+91 98765 43210',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    address: {
      full: '245, Koramangala 4th Block, 560034',
      landmark: 'Near Forum Mall',
      coords: { lat: 12.9352, lng: 77.6245 },
    },
    scheduledTime: '10:30 AM - 11:30 AM',
    estimatedDuration: '45 min',
    basePrice: 699,
    items: [
      { name: 'AC Deep Cleaning - 1 Unit', price: 699 },
    ],
    notes: 'AC is in the master bedroom. Please bring your own ladder.',
    otp: '4523',
  };

  const handleNextStage = () => {
    if (currentStage === 2) {
      // Need OTP verification at arrival
      setShowOTPModal(true);
    } else if (currentStage === 3) {
      // Completing job
      setShowCompletionModal(true);
    } else {
      setCurrentStage(prev => Math.min(prev + 1, jobStages.length - 1));
      toast.success(`Status updated: ${jobStages[currentStage + 1].label}`);
    }
  };

  const verifyOTP = () => {
    if (otp === job.otp) {
      setShowOTPModal(false);
      setCurrentStage(3); // Move to working stage
      toast.success('OTP verified! Starting work...');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleAddProgress = () => {
    if (!progressNote && progressImages.length === 0) {
      toast.error('Please add a note or image');
      return;
    }
    setWorkProgress(prev => [...prev, {
      id: Date.now(),
      note: progressNote,
      images: progressImages,
      time: new Date().toLocaleTimeString(),
    }]);
    setProgressNote('');
    setProgressImages([]);
    setShowAddProgressModal(false);
    toast.success('Progress updated');
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast.error('Please enter item name and price');
      return;
    }
    setAdditionalItems(prev => [...prev, { ...newItem, price: Number(newItem.price) }]);
    setNewItem({ name: '', price: '' });
  };

  const handleCompleteJob = () => {
    setShowCompletionModal(false);
    setCurrentStage(4);
    toast.success('Job completed successfully!');
    // In real app: API call to complete job and process payment
  };

  const totalAmount = job.basePrice + additionalItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg">Active Job</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            {jobStages.map((stage, idx) => (
              <div key={stage.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx < currentStage ? 'bg-green-500 text-white' :
                  idx === currentStage ? 'bg-primary-500 text-white animate-pulse' :
                  'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {idx < currentStage ? <FiCheck /> : idx + 1}
                </div>
                <p className={`text-xs mt-2 text-center ${
                  idx <= currentStage ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'
                }`}>
                  {stage.label}
                </p>
                {idx < jobStages.length - 1 && (
                  <div className={`absolute w-full h-0.5 top-4 left-1/2 ${
                    idx < currentStage ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} style={{ width: 'calc(100% - 32px)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{job.service}</h2>
          
          {/* Customer Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              <img src={job.customer.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{job.customer.name}</p>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${job.customer.phone}`} className="p-3 bg-green-500 text-white rounded-full">
                <FiPhone className="w-5 h-5" />
              </a>
              <button className="p-3 bg-primary-500 text-white rounded-full">
                <FiMessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <div className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 text-primary-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{job.address.full}</p>
                <p className="text-sm text-gray-500">Landmark: {job.address.landmark}</p>
              </div>
            </div>
            <button className="mt-3 w-full py-2 border border-primary-500 text-primary-600 rounded-lg flex items-center justify-center gap-2">
              <FiNavigation /> Navigate
            </button>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <FiClock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400">Scheduled Time</p>
              <p className="font-medium text-blue-900 dark:text-blue-300">{job.scheduledTime}</p>
            </div>
          </div>

          {/* Customer Notes */}
          {job.notes && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                <span className="font-semibold">Customer Note:</span> {job.notes}
              </p>
            </div>
          )}
        </div>

        {/* Work Progress (when working) */}
        {currentStage >= 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Work Progress</h3>
              <button
                onClick={() => setShowAddProgressModal(true)}
                className="text-primary-600 text-sm font-medium flex items-center gap-1"
              >
                <FiCamera /> Add Update
              </button>
            </div>
            
            {workProgress.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No updates yet. Add progress photos.</p>
            ) : (
              <div className="space-y-3">
                {workProgress.map((progress) => (
                  <div key={progress.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{progress.time}</span>
                    </div>
                    {progress.note && <p className="text-gray-700 dark:text-gray-300">{progress.note}</p>}
                    {progress.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {progress.images.map((img, idx) => (
                          <img key={idx} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price Breakdown</h3>
          
          <div className="space-y-3">
            {job.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                <span className="font-medium">₹{item.price}</span>
              </div>
            ))}
            {additionalItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-green-600">
                <span>{item.name} (Added)</span>
                <span className="font-medium">₹{item.price}</span>
              </div>
            ))}
            <div className="border-t dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {currentStage < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
          <button
            onClick={handleNextStage}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg"
          >
            {currentStage === 0 && 'Start Journey'}
            {currentStage === 1 && 'I\'ve Arrived'}
            {currentStage === 2 && 'Verify & Start Work'}
            {currentStage === 3 && 'Complete Job'}
          </button>
        </div>
      )}

      {/* Job Complete Banner */}
      {currentStage === 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold mb-1">Job Completed!</h3>
          <p className="text-green-100 mb-4">Great work! Payment will be processed shortly.</p>
          <Link to="/worker" className="block py-3 bg-white text-green-600 rounded-xl font-medium">
            Back to Dashboard
          </Link>
        </div>
      )}

      {/* OTP Modal */}
      <AnimatePresence>
        {showOTPModal && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-xl font-bold text-center mb-2">Verify OTP</h3>
              <p className="text-gray-500 text-center mb-6">Ask the customer for the 4-digit OTP</p>
              
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full text-center text-2xl font-mono tracking-widest p-4 border dark:border-gray-700 rounded-xl mb-4"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowOTPModal(false)}
                  className="flex-1 py-3 border dark:border-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyOTP}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Progress Modal */}
      <AnimatePresence>
        {showAddProgressModal && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-xl font-bold mb-4">Add Progress Update</h3>
              
              <textarea
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                placeholder="What have you completed?"
                rows={3}
                className="w-full p-3 border dark:border-gray-700 rounded-xl mb-4 resize-none"
              />
              
              <label className="flex items-center gap-2 p-4 border-2 border-dashed dark:border-gray-700 rounded-xl cursor-pointer mb-4">
                <FiImage className="w-6 h-6 text-gray-400" />
                <span className="text-gray-500">Add photos</span>
                <input type="file" accept="image/*" multiple className="hidden" />
              </label>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddProgressModal(false)}
                  className="flex-1 py-3 border dark:border-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProgress}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold mb-4">Complete Job</h3>
              
              {/* Add Additional Items */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Add Extra Items/Parts</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="flex-1 p-2 border dark:border-gray-700 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="₹"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-20 p-2 border dark:border-gray-700 rounded-lg"
                  />
                  <button
                    onClick={handleAddItem}
                    className="p-2 bg-primary-500 text-white rounded-lg"
                  >
                    <FiCheck />
                  </button>
                </div>
                {additionalItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg mb-1">
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Final Amount */}
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary-600">₹{totalAmount}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 py-3 border dark:border-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteJob}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium"
                >
                  Complete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkerActiveJob;
