import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiMapPin, FiPlus } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { updateProfile, user } = useAuthStore();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    updateProfile(data);
    toast.success('Profile updated!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Add your details for a better experience</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">First Name</label>
                <input {...register('firstName')} className="input-field" placeholder="First Name" />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input {...register('lastName')} className="input-field" placeholder="Last Name" />
              </div>
            </div>

            <div>
              <label className="label">Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  {...register('address')}
                  rows={3}
                  className="input-field pl-12"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input {...register('city')} className="input-field" placeholder="City" />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input {...register('pincode')} className="input-field" placeholder="Pincode" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => navigate('/')} className="flex-1 btn-outline">
                Skip for now
              </button>
              <button type="submit" className="flex-1 btn-primary">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;
