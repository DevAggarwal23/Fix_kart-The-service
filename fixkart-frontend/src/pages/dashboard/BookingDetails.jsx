import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiUser, 
  FiPhone, FiMessageSquare, FiDownload, FiShare2, FiStar,
  FiCheckCircle, FiAlertCircle, FiX
} from 'react-icons/fi';
import { sampleBookings, sampleWorkers } from '../../data/dummyData';

const statusSteps = [
  { id: 'booked', label: 'Booked', icon: '📝' },
  { id: 'confirmed', label: 'Confirmed', icon: '✅' },
  { id: 'assigned', label: 'Assigned', icon: '👷' },
  { id: 'on-way', label: 'On The Way', icon: '🚗' },
  { id: 'in-progress', label: 'In Progress', icon: '🔧' },
  { id: 'completed', label: 'Completed', icon: '🎉' },
];

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // Find booking
  const booking = sampleBookings.find(b => b.id === bookingId) || {
    id: bookingId,
    service: 'AC General Service',
    category: 'AC Repair',
    date: '25 Dec 2024',
    time: '10:00 AM - 12:00 PM',
    status: 'confirmed',
    amount: 499,
    address: '123 Main Street, Sector 15, Noida, UP - 201301',
    icon: '❄️',
  };

  const worker = sampleWorkers[0];

  const currentStepIndex = statusSteps.findIndex(s => 
    s.id === booking.status || 
    (booking.status === 'completed' && s.id === 'completed') ||
    (booking.status === 'pending' && s.id === 'booked')
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="font-bold text-lg">Booking Details</h1>
              <p className="text-sm text-gray-500">#{booking.id}</p>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <FiShare2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 text-white ${
            booking.status === 'completed' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : booking.status === 'cancelled'
                ? 'bg-gradient-to-r from-red-500 to-rose-500'
                : 'bg-gradient-to-r from-primary-600 to-primary-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Booking Status</p>
              <p className="text-2xl font-bold capitalize">
                {booking.status === 'completed' ? '✅ Completed' : 
                 booking.status === 'cancelled' ? '❌ Cancelled' :
                 '⏳ ' + booking.status}
              </p>
            </div>
            {booking.status === 'confirmed' && (
              <Link 
                to={`/track/${booking.id}`}
                className="px-4 py-2 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                Track Live
              </Link>
            )}
          </div>
        </motion.div>

        {/* Progress Timeline */}
        {booking.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Progress</h3>
            <div className="flex justify-between">
              {statusSteps.slice(0, 4).map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    } ${isCurrent ? 'ring-4 ring-green-200 dark:ring-green-900' : ''}`}>
                      {isCompleted ? <FiCheckCircle className="w-5 h-5" /> : step.icon}
                    </div>
                    <p className={`text-xs mt-2 ${
                      isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                    {idx < 3 && (
                      <div className={`absolute h-0.5 w-16 top-5 left-[calc(50%+1.25rem)] ${
                        idx < currentStepIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Service Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Service Details</h3>
          <div className="flex items-center gap-4 pb-4 border-b dark:border-gray-700">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <span className="text-3xl">{booking.icon || '🔧'}</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{booking.service}</p>
              <p className="text-sm text-gray-500">{booking.category || 'Home Service'}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiClock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Time Slot</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.time || '10:00 AM - 12:00 PM'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.address || '123 Main Street, City'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Worker Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Service Professional</h3>
          <div className="flex items-center gap-4">
            <img
              src={worker.image}
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white">{worker.name}</p>
              <p className="text-sm text-gray-500">{worker.experience} experience</p>
              <div className="flex items-center gap-2 mt-1">
                <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{worker.rating}</span>
                <span className="text-sm text-gray-400">({worker.jobsCompleted}+ jobs)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${worker.phone || '+919876543210'}`} className="p-3 bg-green-500 text-white rounded-full">
                <FiPhone className="w-5 h-5" />
              </a>
              <button className="p-3 bg-primary-500 text-white rounded-full">
                <FiMessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Payment Details</h3>
            <Link to={`/invoice/${booking.id}`} className="text-primary-600 text-sm font-medium flex items-center gap-1">
              <FiDownload className="w-4 h-4" />
              Invoice
            </Link>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Service Charge</span>
              <span>₹{(booking.amount || 499) - 49}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Visiting Charge</span>
              <span>₹49</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹50</span>
            </div>
            <div className="pt-3 border-t dark:border-gray-700 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-600">₹{booking.amount || 499}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-3">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Payment Successful</p>
              <p className="text-xs text-green-600 dark:text-green-500">Paid via UPI • TXN12345678</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {booking.status === 'completed' && !booking.rated && (
            <Link
              to={`/rate/${booking.id}`}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <FiStar className="w-5 h-5" />
              Rate Your Experience
            </Link>
          )}

          {['pending', 'confirmed'].includes(booking.status) && (
            <>
              <Link
                to={`/track/${booking.id}`}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                Track Booking
              </Link>
              <button className="w-full py-3 border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2">
                <FiX className="w-5 h-5" />
                Cancel Booking
              </button>
            </>
          )}

          <Link
            to="/services"
            className="w-full py-3 text-primary-600 font-medium text-center block"
          >
            Book Another Service
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingDetails;
