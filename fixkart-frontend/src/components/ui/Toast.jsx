/**
 * Toast wrapper component for custom notifications
 */
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      ...options,
      icon: <FiCheck className="w-5 h-5 text-green-500" />,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      ...options,
      icon: <FiX className="w-5 h-5 text-red-500" />,
    });
  },

  info: (message, options = {}) => {
    toast(message, {
      ...options,
      icon: <FiInfo className="w-5 h-5 text-blue-500" />,
    });
  },

  warning: (message, options = {}) => {
    toast(message, {
      ...options,
      icon: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, options);
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(promise, messages, options);
  },

  // Custom notification with action
  action: (message, actionText, onAction, options = {}) => {
    toast(
      (t) => (
        <div className="flex items-center gap-4">
          <span>{message}</span>
          <button
            onClick={() => {
              onAction();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
          >
            {actionText}
          </button>
        </div>
      ),
      {
        duration: 5000,
        ...options,
      }
    );
  },

  // Booking notification
  booking: (status, details = {}) => {
    const messages = {
      confirmed: {
        icon: '✅',
        title: 'Booking Confirmed!',
        body: `Your booking #${details.bookingNumber} is confirmed`,
      },
      assigned: {
        icon: '👨‍🔧',
        title: 'Worker Assigned',
        body: `${details.workerName} will handle your service`,
      },
      on_the_way: {
        icon: '🚗',
        title: 'On the Way!',
        body: `Your professional is heading to your location`,
      },
      arrived: {
        icon: '📍',
        title: 'Professional Arrived',
        body: `Share OTP: ${details.otp} to start the service`,
      },
      completed: {
        icon: '🎉',
        title: 'Service Completed!',
        body: 'Rate your experience',
      },
      cancelled: {
        icon: '❌',
        title: 'Booking Cancelled',
        body: 'Your booking has been cancelled',
      },
    };

    const msg = messages[status];
    if (!msg) return;

    toast(
      (t) => (
        <div className="flex items-start gap-3">
          <span className="text-2xl">{msg.icon}</span>
          <div>
            <p className="font-semibold text-gray-900">{msg.title}</p>
            <p className="text-sm text-gray-600">{msg.body}</p>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: {
          background: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
      }
    );
  },
};

export default showToast;
