/**
 * Razorpay Payment Service
 * Handles payment integration with Razorpay
 */

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo123';

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order (should be done on server in production)
 * For demo, we simulate order creation
 */
export const createOrder = async (amount, bookingId, userId) => {
  // In production, call your backend API
  // const response = await fetch('/api/create-order', {
  //   method: 'POST',
  //   body: JSON.stringify({ amount, bookingId, userId })
  // });
  // return response.json();

  // Demo mode - simulate order creation
  return {
    success: true,
    orderId: `order_${Date.now()}`,
    amount: amount * 100, // Razorpay expects amount in paise
    currency: 'INR'
  };
};

/**
 * Initialize and open Razorpay payment modal
 * @param {Object} options - Payment options
 * @returns {Promise<Object>} Payment result
 */
export const initiatePayment = async ({
  amount,
  currency = 'INR',
  orderId,
  bookingId,
  customerName,
  customerEmail,
  customerPhone,
  description = 'FixKart Service Booking',
  onSuccess,
  onFailure,
  onDismiss
}) => {
  // Load Razorpay script
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: amount * 100, // Convert to paise
      currency,
      name: 'FixKart',
      description,
      image: '/logo192.png', // Your logo
      order_id: orderId, // From backend
      prefill: {
        name: customerName || '',
        email: customerEmail || '',
        contact: customerPhone || ''
      },
      notes: {
        bookingId: bookingId || ''
      },
      theme: {
        color: '#2563eb', // Primary blue
        backdrop_color: 'rgba(0, 0, 0, 0.5)'
      },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          resolve({ success: false, cancelled: true });
        },
        confirm_close: true,
        escape: true
      },
      handler: function(response) {
        // Payment successful
        const result = {
          success: true,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        };
        onSuccess?.(result);
        resolve(result);
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function(response) {
        const error = {
          success: false,
          error: {
            code: response.error.code,
            description: response.error.description,
            source: response.error.source,
            step: response.error.step,
            reason: response.error.reason
          }
        };
        onFailure?.(error);
        resolve(error);
      });

      rzp.open();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Verify payment signature (should be done on server)
 */
export const verifyPayment = async (paymentId, orderId, signature) => {
  // In production, verify on server
  // const response = await fetch('/api/verify-payment', {
  //   method: 'POST',
  //   body: JSON.stringify({ paymentId, orderId, signature })
  // });
  // return response.json();

  // Demo mode - assume verification passes
  return {
    success: true,
    verified: true
  };
};

/**
 * Simulate payment for demo/testing
 * @param {number} amount - Amount in INR
 * @param {Function} onSuccess - Success callback
 */
export const simulatePayment = async (amount, onSuccess) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const result = {
    success: true,
    razorpay_payment_id: `pay_demo_${Date.now()}`,
    razorpay_order_id: `order_demo_${Date.now()}`,
    amount,
    method: 'demo',
    timestamp: new Date().toISOString()
  };

  onSuccess?.(result);
  return result;
};

/**
 * Get payment methods available
 */
export const getPaymentMethods = () => [
  {
    id: 'upi',
    name: 'UPI',
    icon: '📱',
    description: 'Pay via any UPI app',
    popular: true,
    apps: [
      { id: 'gpay', name: 'Google Pay', icon: '🔵' },
      { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
      { id: 'paytm', name: 'PayTM', icon: '🔷' },
      { id: 'bhim', name: 'BHIM', icon: '🟢' }
    ]
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, Rupay',
    popular: false
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: '🏦',
    description: 'All major banks',
    popular: false
  },
  {
    id: 'wallet',
    name: 'Wallets',
    icon: '👛',
    description: 'PayTM, PhonePe, etc.',
    popular: false
  },
  {
    id: 'cash',
    name: 'Cash on Service',
    icon: '💵',
    description: 'Pay after service completion',
    popular: false
  }
];

export default {
  loadRazorpayScript,
  createOrder,
  initiatePayment,
  verifyPayment,
  simulatePayment,
  getPaymentMethods
};
