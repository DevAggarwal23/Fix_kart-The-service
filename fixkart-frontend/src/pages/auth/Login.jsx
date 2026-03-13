import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiPhone, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// Demo Mode - No Firebase required
const DEMO_MODE = true;
const DEMO_OTP = '123456';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('phone'); // phone or email
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');
  
  const { login, setUser, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    if (loginMethod === 'phone' && !otpSent) {
      // Send OTP - Demo Mode
      setSendingOtp(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPhone(data.phone);
      setOtpSent(true);
      setSendingOtp(false);
      toast.success(`OTP sent! (Demo: use ${DEMO_OTP})`);
      return;
    }

    // Email login - Demo Mode
    if (loginMethod === 'email') {
      const mockUser = {
        id: 'demo_user_' + Date.now(),
        name: 'Demo User',
        email: data.email,
        phone: '+91 9876543210',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        addresses: [],
        wallet: { balance: 500 },
      };
      setUser(mockUser);
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    
    setVerifyingOtp(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo Mode - Check OTP
    if (DEMO_MODE && otpString === DEMO_OTP) {
      const mockUser = {
        id: 'demo_user_' + Date.now(),
        name: 'FixKart User',
        email: null,
        phone: '+91 ' + currentPhone,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        addresses: [],
        wallet: { balance: 500 },
      };
      setUser(mockUser);
      toast.success('Welcome to FixKart!');
      navigate('/');
    } else {
      toast.error('Invalid OTP. Demo OTP is: ' + DEMO_OTP);
    }
    
    setVerifyingOtp(false);
  };

  const resendOtp = async () => {
    setSendingOtp(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSendingOtp(false);
    toast.success(`OTP resent! (Demo: use ${DEMO_OTP})`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=1600&fit=crop"
            alt="Home Service"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <span className="text-3xl font-display font-bold text-white">
                FixKart
              </span>
            </Link>

            <h1 className="text-4xl font-display font-bold text-white mb-6">
              Welcome Back!
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Login to access your bookings, saved addresses, and exclusive offers.
            </p>

            <div className="space-y-4">
              {['AI-powered problem detection', 'Verified professionals', 'Transparent pricing', 'Track your booking live'].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <FiArrowRight className="w-3 h-3" />
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-display font-bold">
                <span className="text-primary-600">Fix</span>
                <span className="text-secondary-500">Kart</span>
              </span>
            </Link>
          </div>

          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Log In
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Enter your details to continue
          </p>

          {/* Demo Mode Banner */}
          {DEMO_MODE && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 mb-6">
              <p className="text-yellow-700 dark:text-yellow-400 text-sm text-center">
                Demo Mode: Use OTP <span className="font-bold">{DEMO_OTP}</span> for any phone number
              </p>
            </div>
          )}

          {/* Login Method Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <FiPhone className="w-4 h-4" />
              Phone
            </button>
            <button
              onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <FiMail className="w-4 h-4" />
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {loginMethod === 'phone' ? (
              <>
                <div>
                  <label className="label">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit phone' }
                      })}
                      placeholder="Enter your phone number"
                      className="input-field pl-12"
                      disabled={otpSent}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="label">Enter OTP</label>
                    <div className="flex gap-2 justify-between">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-12 h-14 text-center text-xl font-bold input-field"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="text-primary-600 text-sm mt-2 hover:underline disabled:opacity-50"
                      onClick={resendOtp}
                      disabled={sendingOtp}
                    >
                      {sendingOtp ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Enter valid email' }
                      })}
                      placeholder="Enter your email"
                      className="input-field pl-12"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: 'Password is required' })}
                      placeholder="Enter your password"
                      className="input-field pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type={otpSent ? 'button' : 'submit'}
              onClick={otpSent ? verifyOtp : undefined}
              disabled={isLoading || sendingOtp || verifyingOtp}
              className="w-full btn-primary py-4 disabled:opacity-50"
            >
              {(isLoading || sendingOtp || verifyingOtp) ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {sendingOtp ? 'Sending OTP...' : verifyingOtp ? 'Verifying...' : 'Please wait...'}
                </span>
              ) : otpSent ? 'Verify OTP' : loginMethod === 'phone' ? 'Send OTP' : 'Log In'}
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <img src="https://www.svgrepo.com/show/475689/twitter-color.svg" alt="Twitter" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
