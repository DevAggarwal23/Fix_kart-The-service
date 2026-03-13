import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiPhone, FiMessageSquare, FiMapPin, FiClock, 
  FiCheck, FiAlertCircle, FiNavigation, FiStar 
} from 'react-icons/fi';
import { sampleWorkers } from '../../data/dummyData';

const trackingSteps = [
  { id: 1, title: 'Booking Confirmed', description: 'Your booking has been confirmed', icon: '✅' },
  { id: 2, title: 'Professional Assigned', description: 'A professional has been assigned', icon: '👷' },
  { id: 3, title: 'On The Way', description: 'Professional is heading to your location', icon: '🚗' },
  { id: 4, title: 'Arrived', description: 'Professional has arrived', icon: '📍' },
  { id: 5, title: 'Work In Progress', description: 'Service is being performed', icon: '🔧' },
  { id: 6, title: 'Completed', description: 'Service has been completed', icon: '🎉' },
];

const TrackBooking = () => {
  const { bookingId } = useParams();
  const [currentStep, setCurrentStep] = useState(2);
  const [etaMinutes, setEtaMinutes] = useState(15);
  const [workerLocation, setWorkerLocation] = useState({ lat: 0, progress: 0 });

  // Simulated worker
  const worker = sampleWorkers[0];

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 5) return prev + 1;
        return prev;
      });
      setEtaMinutes((prev) => Math.max(0, prev - 5));
      setWorkerLocation((prev) => ({
        ...prev,
        progress: Math.min(100, prev.progress + 10),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard/bookings" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div className="text-center">
              <h1 className="font-bold text-lg">Track Booking</h1>
              <p className="text-sm text-gray-500">#{bookingId}</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Live Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl overflow-hidden"
        >
          {/* Simulated Map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Route Line */}
              <div className="absolute top-1/2 left-8 right-8 h-2 bg-gray-300 dark:bg-gray-600 rounded-full">
                <motion.div
                  className="h-full bg-primary-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${workerLocation.progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>

              {/* Worker Marker */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2"
                animate={{ left: `${8 + workerLocation.progress * 0.84}%` }}
                transition={{ duration: 1 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-500 rotate-45" />
                </div>
              </motion.div>

              {/* Destination Marker */}
              <div className="absolute top-1/2 right-8 -translate-y-1/2">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <FiMapPin className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Your Location Label */}
              <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md">
                <p className="text-xs text-gray-500">Your Location</p>
                <p className="font-semibold text-sm">123 Main Street</p>
              </div>
            </div>
          </div>

          {/* ETA Badge */}
          <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg">
            <p className="text-xs text-gray-500">Arriving in</p>
            <p className="text-2xl font-bold text-primary-600">
              {etaMinutes > 0 ? `${etaMinutes} min` : 'Arrived'}
            </p>
          </div>
        </motion.div>

        {/* Worker Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <img
              src={worker.image}
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white">{worker.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{worker.experience} experience</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-yellow-500">
                  <FiStar className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{worker.rating}</span>
                </div>
                <span className="text-xs text-gray-500">({worker.jobsCompleted}+ jobs)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${worker.phone || '+919876543210'}`}
                className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <FiPhone className="w-5 h-5" />
              </a>
              <button className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow">
                <FiMessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* OTP */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-700 dark:text-yellow-400">Service OTP</span>
              </div>
              <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 tracking-wider">
                {Math.floor(1000 + Math.random() * 9000)}
              </span>
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
              Share this OTP only when the professional arrives
            </p>
          </div>
        </motion.div>

        {/* Tracking Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-6">Booking Status</h3>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            <motion.div
              className="absolute left-5 top-0 w-0.5 bg-primary-500"
              initial={{ height: 0 }}
              animate={{ height: `${((currentStep - 1) / (trackingSteps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />

            <div className="space-y-6">
              {trackingSteps.map((step, idx) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex items-start gap-4"
                  >
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                            ? 'bg-primary-500 text-white animate-pulse'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <span className="text-lg">{step.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`font-semibold ${
                        isCompleted || isCurrent
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-primary-600 mt-1 flex items-center gap-1"
                        >
                          <FiClock className="w-3 h-3" />
                          In progress...
                        </motion.p>
                      )}
                    </div>
                    {isCompleted && (
                      <span className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link
            to="/help"
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
          >
            <span className="text-2xl mb-2 block">💬</span>
            <p className="font-medium text-gray-900 dark:text-white">Get Help</p>
            <p className="text-xs text-gray-500">Contact support</p>
          </Link>
          <Link
            to="/dashboard/bookings"
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
          >
            <span className="text-2xl mb-2 block">📋</span>
            <p className="font-medium text-gray-900 dark:text-white">All Bookings</p>
            <p className="text-xs text-gray-500">View history</p>
          </Link>
        </motion.div>

        {/* Cancel Button */}
        {currentStep < 4 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full py-3 text-red-500 font-medium border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Cancel Booking
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TrackBooking;
