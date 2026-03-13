import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiPhone, FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const { signup, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    if (step === 1) {
      // Send OTP
      setStep(2);
      toast.success('OTP sent to your phone!');
      return;
    }

    const result = await signup(data);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/profile-setup');
    } else {
      toast.error(result.error || 'Signup failed');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    setStep(3);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-600 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1621905252507-b35b0e1312c6?w=1200&h=1600&fit=crop"
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
              Join FixKart Today!
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Create an account to access AI-powered home services at your fingertips.
            </p>

            {/* Progress Steps */}
            <div className="space-y-4">
              {[
                { num: 1, text: 'Enter your details' },
                { num: 2, text: 'Verify your phone' },
                { num: 3, text: 'Complete signup' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step > item.num ? 'bg-green-500' : step === item.num ? 'bg-white text-primary-600' : 'bg-white/20'
                  } text-white font-semibold`}>
                    {step > item.num ? <FiCheck className="w-4 h-4" /> : item.num}
                  </div>
                  <span className={`${step >= item.num ? 'text-white' : 'text-white/60'}`}>
                    {item.text}
                  </span>
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
            {step === 1 ? 'Create Account' : step === 2 ? 'Verify Phone' : 'Almost Done!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {step === 1 ? 'Fill in your details to get started' : step === 2 ? 'Enter the OTP sent to your phone' : 'Set your password to complete signup'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {step === 1 && (
              <>
                <div>
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Enter your full name"
                      className="input-field pl-12"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

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
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="label">Enter OTP</label>
                <div className="flex gap-2 justify-between mb-4">
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
                  className="text-primary-600 text-sm hover:underline"
                  onClick={() => toast.success('OTP resent!')}
                >
                  Resend OTP
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div>
                  <label className="label">Create Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                      })}
                      placeholder="Create a strong password"
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

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Password must have:</p>
                  <div className="space-y-1">
                    {[
                      { text: 'At least 8 characters', valid: watch('password')?.length >= 8 },
                      { text: 'One uppercase letter', valid: /[A-Z]/.test(watch('password') || '') },
                      { text: 'One number', valid: /\d/.test(watch('password') || '') },
                    ].map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          rule.valid ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {rule.valid && <FiCheck className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className={rule.valid ? 'text-green-600' : 'text-gray-500'}>{rule.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    {...register('terms', { required: true })}
                    className="w-5 h-5 mt-0.5 text-primary-600 rounded" 
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type={step === 2 ? 'button' : 'submit'}
              onClick={step === 2 ? verifyOtp : undefined}
              disabled={isLoading}
              className="w-full btn-primary py-4 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : step === 1 ? 'Continue' : step === 2 ? 'Verify' : 'Create Account'}
            </motion.button>
          </form>

          {step === 1 && (
            <>
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
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
