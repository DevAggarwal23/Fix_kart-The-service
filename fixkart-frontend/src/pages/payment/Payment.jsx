import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiCreditCard, FiSmartphone, FiDollarSign, 
  FiCheck, FiShield, FiLock, FiPercent, FiTag
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: '📱', description: 'Pay via any UPI app', popular: true },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Rupay' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks' },
  { id: 'wallet', name: 'Wallets', icon: '👛', description: 'PayTM, PhonePe, etc.' },
  { id: 'cash', name: 'Cash on Service', icon: '💵', description: 'Pay after service' },
];

const upiApps = [
  { id: 'gpay', name: 'Google Pay', icon: '🔵' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
  { id: 'paytm', name: 'PayTM', icon: '🔷' },
  { id: 'bhim', name: 'BHIM', icon: '🟢' },
];

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Get amount from state or use default
  const baseAmount = location.state?.amount || 499;
  const discount = promoApplied ? 50 : 0;
  const totalAmount = baseAmount - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'fixkart50') {
      setPromoApplied(true);
      toast.success('Promo code applied! ₹50 off');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (selectedMethod === 'upi' && !selectedUpi && !upiId) {
      toast.error('Please select UPI app or enter UPI ID');
      return;
    }

    if (selectedMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      toast.error('Please fill all card details');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment-success', { 
        state: { 
          amount: totalAmount, 
          method: selectedMethod,
          transactionId: `TXN${Date.now().toString().slice(-8)}`
        } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-lg">Payment</h1>
            <div className="flex items-center gap-1 text-green-600">
              <FiLock className="w-4 h-4" />
              <span className="text-sm">Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Amount Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-white"
        >
          <p className="text-sm opacity-80">Amount to Pay</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">₹{totalAmount}</span>
            {promoApplied && (
              <span className="text-sm line-through opacity-60">₹{baseAmount}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <FiShield className="w-4 h-4" />
            <span className="text-sm">Powered by Razorpay • 100% Secure</span>
          </div>
        </motion.div>

        {/* Promo Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiTag className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-gray-900 dark:text-white">Promo Code</span>
            </div>
            {promoApplied && (
              <span className="text-green-500 text-sm flex items-center gap-1">
                <FiCheck className="w-4 h-4" />
                Applied
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
              className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
            />
            <button
              onClick={handleApplyPromo}
              disabled={promoApplied || !promoCode}
              className="px-6 bg-primary-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              Apply
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Try: FIXKART50 for ₹50 off</p>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Select Payment Method</h2>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id}>
                <button
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">{method.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{method.name}</span>
                      {method.popular && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedMethod === method.id && (
                      <FiCheck className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>

                {/* UPI Options */}
                <AnimatePresence>
                  {selectedMethod === 'upi' && method.id === 'upi' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pl-12 space-y-4">
                        <div className="grid grid-cols-4 gap-3">
                          {upiApps.map((app) => (
                            <button
                              key={app.id}
                              onClick={() => setSelectedUpi(app.id)}
                              className={`p-3 border-2 rounded-xl text-center transition-all ${
                                selectedUpi === app.id
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <span className="text-2xl block mb-1">{app.icon}</span>
                              <span className="text-xs">{app.name}</span>
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-gray-400 px-3">
                            OR
                          </span>
                          <hr className="border-gray-200 dark:border-gray-700" />
                        </div>
                        <input
                          type="text"
                          placeholder="Enter UPI ID (e.g., name@upi)"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Options */}
                <AnimatePresence>
                  {selectedMethod === 'card' && method.id === 'card' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pl-12 space-y-4">
                        <input
                          type="text"
                          placeholder="Card Number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.slice(0, 3))}
                            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Price Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Price Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Service Charge</span>
              <span>₹{baseAmount - 49}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Visiting Fee</span>
              <span>₹49</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-green-600">
                <span>Promo Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="pt-3 border-t dark:border-gray-700 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-600">₹{totalAmount}</span>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FiShield className="w-4 h-4" />
            <span className="text-xs">256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1">
            <FiLock className="w-4 h-4" />
            <span className="text-xs">PCI Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCheck className="w-4 h-4" />
            <span className="text-xs">RBI Approved</span>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isProcessing
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg'
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>Pay ₹{totalAmount}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
