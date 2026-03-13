import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiArrowRight, FiCheck, FiCamera, FiMic, FiMapPin, 
  FiCalendar, FiClock, FiUser, FiStar, FiShield, FiPercent,
  FiUpload, FiX, FiPlus
} from 'react-icons/fi';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { sampleWorkers } from '../../data/dummyData';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, title: 'Problem', icon: '🔧' },
  { id: 2, title: 'Address', icon: '📍' },
  { id: 3, title: 'Schedule', icon: '📅' },
  { id: 4, title: 'Worker', icon: '👷' },
  { id: 5, title: 'Review', icon: '✅' },
];

const Booking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isListening, setIsListening] = useState(false);
  
  const { 
    selectedCategory, 
    selectedSubCategory, 
    problemDescription,
    problemImages,
    selectedAddress,
    selectedDate,
    selectedTimeSlot,
    selectedWorker,
    setProblemDescription,
    addProblemImage,
    removeProblemImage,
    setSelectedAddress,
    setSelectedDate,
    setSelectedTimeSlot,
    setSelectedWorker,
    aiAnalysis,
    setAiAnalysis,
    startBidding,
    selectBestBid,
    urgencyLevel,
    setUrgencyLevel,
  } = useBookingStore();

  const { user, addresses, addAddress } = useAuthStore();

  const [newAddress, setNewAddress] = useState({ label: '', address: '', city: '', pincode: '' });
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Redirect if no service selected
  useEffect(() => {
    if (!selectedCategory || !selectedSubCategory) {
      navigate('/services');
    }
  }, [selectedCategory, selectedSubCategory, navigate]);

  // Mock AI Analysis
  const analyzeWithAI = () => {
    if (problemDescription.length < 10) {
      toast.error('Please describe your problem in more detail');
      return;
    }
    
    setAiAnalysis({
      estimatedCost: Math.floor(Math.random() * 1000) + 500,
      estimatedTime: `${Math.floor(Math.random() * 2) + 1}-${Math.floor(Math.random() * 2) + 2} hours`,
      complexity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      recommendation: 'Based on your description, we recommend a professional inspection first.',
    });
    toast.success('AI analysis complete!');
  };

  // Voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice input not supported');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setProblemDescription(problemDescription + ' ' + transcript);
    };
    
    recognition.start();
  };

  // Image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => addProblemImage(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const handleAddAddress = () => {
    if (newAddress.address && newAddress.city && newAddress.pincode) {
      addAddress({ ...newAddress, id: Date.now() });
      setNewAddress({ label: '', address: '', city: '', pincode: '' });
      setShowAddAddress(false);
      toast.success('Address added!');
    }
  };

  // Time slots
  const timeSlots = [
    { id: 1, time: '8:00 AM - 10:00 AM', available: true },
    { id: 2, time: '10:00 AM - 12:00 PM', available: true },
    { id: 3, time: '12:00 PM - 2:00 PM', available: false },
    { id: 4, time: '2:00 PM - 4:00 PM', available: true },
    { id: 5, time: '4:00 PM - 6:00 PM', available: true },
    { id: 6, time: '6:00 PM - 8:00 PM', available: true },
  ];

  // Get relevant workers
  const relevantWorkers = sampleWorkers.filter(w => 
    w.services.includes(selectedCategory?.name)
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1: return problemDescription.length >= 10;
      case 2: return selectedAddress !== null;
      case 3: return selectedDate && selectedTimeSlot;
      case 4: return selectedWorker !== null;
      default: return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('Please complete this step');
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleConfirmBooking = () => {
    toast.success('Booking confirmed!');
    navigate('/booking-confirmation');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Describe Your Problem</h2>
              <p className="text-gray-600 dark:text-gray-400">Tell us what needs to be fixed. Be as detailed as possible.</p>
            </div>

            {/* Selected Service */}
            <div className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              <span className="text-4xl">{selectedCategory?.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedSubCategory?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCategory?.name}</p>
              </div>
              <span className="ml-auto text-xl font-bold text-primary-600">₹{selectedSubCategory?.price}</span>
            </div>

            {/* Problem Description */}
            <div className="relative">
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="E.g., My AC is not cooling properly, making noise when turned on..."
                className="w-full h-32 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800"
              />
              <button
                onClick={handleVoiceInput}
                className={`absolute bottom-4 right-4 p-3 rounded-full transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <FiMic className="w-5 h-5" />
              </button>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="flex flex-wrap gap-3">
                {problemImages.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeProblemImage(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  <FiCamera className="w-6 h-6 text-gray-400" />
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* AI Analysis Button */}
            <button
              onClick={analyzeWithAI}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <span className="text-xl">🤖</span>
              Get AI Estimate
            </button>

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
              >
                <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-3">🤖 AI Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Est. Cost</p>
                    <p className="font-bold text-lg">₹{aiAnalysis.estimatedCost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Est. Time</p>
                    <p className="font-bold text-lg">{aiAnalysis.estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Complexity</p>
                    <p className={`font-bold text-lg ${
                      aiAnalysis.complexity === 'Low' ? 'text-green-600' :
                      aiAnalysis.complexity === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{aiAnalysis.complexity}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{aiAnalysis.recommendation}</p>
              </motion.div>
            )}

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How urgent is this?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Normal', 'Urgent', 'Emergency'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setUrgencyLevel(level.toLowerCase())}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      urgencyLevel === level.toLowerCase()
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">
                      {level === 'Normal' ? '🕐' : level === 'Urgent' ? '⚡' : '🚨'}
                    </span>
                    <p className="font-medium mt-1">{level}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Address</h2>
              <p className="text-gray-600 dark:text-gray-400">Where should our professional visit?</p>
            </div>

            {/* Saved Addresses */}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedAddress?.id === addr.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FiMapPin className={`w-5 h-5 mt-1 ${selectedAddress?.id === addr.id ? 'text-primary-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{addr.label || 'Address'}</p>
                      <p className="text-gray-600 dark:text-gray-400">{addr.address}</p>
                      <p className="text-sm text-gray-500">{addr.city} - {addr.pincode}</p>
                    </div>
                    {selectedAddress?.id === addr.id && (
                      <FiCheck className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Address */}
            {!showAddAddress ? (
              <button
                onClick={() => setShowAddAddress(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 transition-all"
              >
                <FiPlus className="w-5 h-5" />
                Add New Address
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4"
              >
                <input
                  type="text"
                  placeholder="Label (Home, Office, etc.)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <textarea
                  placeholder="Full Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddAddress(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAddress}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-lg"
                  >
                    Save Address
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Date & Time</h2>
              <p className="text-gray-600 dark:text-gray-400">When would you like the service?</p>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FiCalendar className="inline w-4 h-4 mr-2" />
                Select Date
              </label>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const dateStr = date.toISOString().split('T')[0];
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = date.getDate();
                  const isToday = i === 0;
                  
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                        selectedDate === dateStr
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <p className="text-xs">{isToday ? 'Today' : dayName}</p>
                      <p className="text-lg font-bold">{dayNum}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FiClock className="inline w-4 h-4 mr-2" />
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTimeSlot(slot)}
                    disabled={!slot.available}
                    className={`p-4 rounded-xl text-center transition-all ${
                      !slot.available
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50'
                        : selectedTimeSlot?.id === slot.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <p className="font-medium">{slot.time}</p>
                    {!slot.available && <p className="text-xs mt-1">Booked</p>}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose a Professional</h2>
              <p className="text-gray-600 dark:text-gray-400">Select from our verified experts or let us assign the best available.</p>
            </div>

            {/* Auto Assign Option */}
            <div
              onClick={() => setSelectedWorker('auto')}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedWorker === 'auto'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Auto-Assign Best Match</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">We'll assign the best available professional</p>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <FiPercent className="w-4 h-4" />
                  <span className="text-sm font-medium">Fastest</span>
                </div>
              </div>
            </div>

            {/* Worker List */}
            <div className="space-y-3">
              {relevantWorkers.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedWorker?.id === worker.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={worker.image}
                      alt={worker.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white">{worker.name}</p>
                        <FiShield className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{worker.experience} experience</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FiStar className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{worker.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({worker.jobsCompleted}+ jobs)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">₹{worker.hourlyRate}/hr</p>
                      <p className={`text-xs ${worker.available ? 'text-green-500' : 'text-red-500'}`}>
                        {worker.available ? 'Available' : 'Busy'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        const totalCost = (selectedSubCategory?.price || 0) + (aiAnalysis?.estimatedCost || 0) * 0.3;
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review Booking</h2>
              <p className="text-gray-600 dark:text-gray-400">Please review your booking details.</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Service */}
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{selectedCategory?.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedSubCategory?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCategory?.name}</p>
                  </div>
                </div>
              </div>

              {/* Problem */}
              {problemDescription && (
                <div className="p-4 border-b dark:border-gray-700">
                  <p className="text-sm text-gray-500 mb-1">Problem Description</p>
                  <p className="text-gray-900 dark:text-white">{problemDescription}</p>
                  {problemImages.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {problemImages.map((img, idx) => (
                        <img key={idx} src={img} alt="" className="w-12 h-12 object-cover rounded" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Address */}
              <div className="p-4 border-b dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Service Address</p>
                <p className="text-gray-900 dark:text-white">{selectedAddress?.address}</p>
                <p className="text-sm text-gray-600">{selectedAddress?.city} - {selectedAddress?.pincode}</p>
              </div>

              {/* Schedule */}
              <div className="p-4 border-b dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Scheduled For</p>
                <p className="text-gray-900 dark:text-white">
                  {selectedDate && new Date(selectedDate).toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
                <p className="text-sm text-gray-600">{selectedTimeSlot?.time}</p>
              </div>

              {/* Worker */}
              <div className="p-4 border-b dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-1">Assigned Professional</p>
                {selectedWorker === 'auto' ? (
                  <p className="text-gray-900 dark:text-white">Auto-assigned (Best available)</p>
                ) : (
                  <div className="flex items-center gap-3">
                    <img src={selectedWorker?.image} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedWorker?.name}</p>
                      <p className="text-sm text-gray-500">⭐ {selectedWorker?.rating}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Service Charge</span>
                    <span>₹{selectedSubCategory?.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Visiting Charge</span>
                    <span>₹49</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹50</span>
                  </div>
                  <div className="pt-2 border-t dark:border-gray-600 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary-600">₹{(selectedSubCategory?.price || 0) + 49 - 50}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
              <button className="px-6 bg-primary-600 text-white rounded-lg font-medium">
                Apply
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!selectedCategory || !selectedSubCategory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-lg">Book Service</h1>
            <div className="w-10" />
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? <FiCheck /> : step.icon}
                  </div>
                  <span className="text-xs mt-1 text-gray-500">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={currentStep === 5 ? handleConfirmBooking : handleNext}
            disabled={!canProceed()}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === 5 ? (
              <>Confirm Booking</>
            ) : (
              <>
                Continue
                <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
