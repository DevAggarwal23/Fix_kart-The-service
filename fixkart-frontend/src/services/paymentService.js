/**
 * Payment Service
 */
import api, { endpoints } from './api';

// Razorpay script loader
const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

export const paymentService = {
  // Create payment order
  async createOrder(bookingId, amount) {
    return api.post(endpoints.payments.createOrder, { bookingId, amount });
  },

  // Verify payment
  async verifyPayment(paymentData) {
    return api.post(endpoints.payments.verify, paymentData);
  },

  // Process payment with Razorpay
  async processPayment(orderData, userInfo) {
    await loadRazorpay();
    
    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'FixKart',
        description: orderData.description || 'Service Booking Payment',
        image: '/logo.png',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Verify payment on server
            const result = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId,
            });
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone,
        },
        notes: {
          bookingId: orderData.bookingId,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled'));
          },
        },
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        reject(new Error(response.error.description));
      });
      rzp.open();
    });
  },

  // Get payment history
  async getPaymentHistory(page = 1, limit = 20) {
    const params = new URLSearchParams({ page, limit });
    return api.get(`${endpoints.payments.history}?${params}`);
  },

  // Request refund
  async requestRefund(paymentId, reason) {
    return api.post(endpoints.payments.refund(paymentId), { reason });
  },

  // Wallet operations
  wallet: {
    // Add money to wallet
    async addMoney(amount) {
      return api.post(endpoints.payments.wallet.add, { amount });
    },

    // Verify wallet recharge
    async verifyRecharge(paymentData) {
      return api.post(endpoints.payments.wallet.verify, paymentData);
    },

    // Pay using wallet
    async pay(bookingId, amount) {
      return api.post(endpoints.payments.wallet.pay, { bookingId, amount });
    },

    // Process wallet recharge
    async recharge(amount, userInfo) {
      const order = await this.addMoney(amount);
      
      await loadRazorpay();
      
      return new Promise((resolve, reject) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: 'INR',
          name: 'FixKart',
          description: 'Wallet Recharge',
          image: '/logo.png',
          order_id: order.orderId,
          handler: async (response) => {
            try {
              const result = await this.verifyRecharge({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.phone,
          },
          theme: {
            color: '#2563eb',
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Recharge cancelled'));
            },
          },
        };
        
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          reject(new Error(response.error.description));
        });
        rzp.open();
      });
    },
  },
};

export default paymentService;
