import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiCamera, FiEdit2, FiCheck, FiStar, FiMapPin,
  FiPhone, FiMail, FiClock, FiAward, FiShield, FiSettings, FiLogOut
} from 'react-icons/fi';
import { BsBank, BsFileEarmarkText, BsShieldCheck } from 'react-icons/bs';
import toast from 'react-hot-toast';

const WorkerProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock Data
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: 'Koramangala, Bangalore',
    specializations: ['AC Repair', 'Electrical', 'Plumbing'],
    experience: '5+ years',
    rating: 4.8,
    totalJobs: 245,
    level: 'Gold Partner',
    verified: true,
    joinedDate: 'Jan 2022',
    languages: ['Hindi', 'English', 'Kannada'],
    availability: {
      monday: { active: true, start: '09:00', end: '18:00' },
      tuesday: { active: true, start: '09:00', end: '18:00' },
      wednesday: { active: true, start: '09:00', end: '18:00' },
      thursday: { active: true, start: '09:00', end: '18:00' },
      friday: { active: true, start: '09:00', end: '18:00' },
      saturday: { active: true, start: '10:00', end: '14:00' },
      sunday: { active: false, start: '', end: '' },
    },
  });

  const achievements = [
    { icon: '🏆', title: 'Top Performer', description: 'Dec 2024' },
    { icon: '⭐', title: '100+ 5-Star Reviews', description: 'Milestone' },
    { icon: '🎯', title: '200 Jobs Completed', description: 'Milestone' },
    { icon: '🔥', title: '30-Day Streak', description: 'Active' },
  ];

  const documents = [
    { name: 'Aadhaar Card', status: 'verified', icon: BsShieldCheck },
    { name: 'PAN Card', status: 'verified', icon: BsShieldCheck },
    { name: 'Bank Account', status: 'verified', icon: BsBank },
    { name: 'Skill Certificate', status: 'pending', icon: BsFileEarmarkText },
  ];

  const menuItems = [
    { icon: FiSettings, label: 'Settings', action: () => {} },
    { icon: FiShield, label: 'Privacy Policy', action: () => {} },
    { icon: FiLogOut, label: 'Logout', action: () => {}, danger: true },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white pt-6 pb-20">
        <div className="px-4 flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">My Profile</h1>
          <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="p-2">
            {isEditing ? <FiCheck className="w-6 h-6" /> : <FiEdit2 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          {/* Avatar & Basic Info */}
          <div className="flex flex-col items-center -mt-16 mb-4">
            <div className="relative">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center">
                  <FiCamera className="w-4 h-4" />
                </button>
              )}
              {profile.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <FiCheck className="w-4 h-4" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                {profile.level}
              </span>
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                <FiStar className="text-yellow-500 fill-current" /> {profile.rating}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y dark:border-gray-700">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{profile.totalJobs}</p>
              <p className="text-xs text-gray-500">Jobs Done</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{profile.experience}</p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{profile.rating}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 py-4">
            <div className="flex items-center gap-3">
              <FiPhone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{profile.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Member since {profile.joinedDate}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Specializations */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Languages */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang, idx) => (
              <span
                key={idx}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {lang}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{ach.title}</p>
                  <p className="text-xs text-gray-500">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Documents */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Documents</h3>
          <div className="space-y-3">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <doc.icon className={`w-5 h-5 ${doc.status === 'verified' ? 'text-green-500' : 'text-yellow-500'}`} />
                  <span className="font-medium text-gray-900 dark:text-white">{doc.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'verified' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {doc.status === 'verified' ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Working Hours */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Availability</h3>
          <div className="space-y-3">
            {Object.entries(profile.availability).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between">
                <span className="capitalize text-gray-700 dark:text-gray-300">{day}</span>
                {hours.active ? (
                  <span className="text-sm text-gray-500">{hours.start} - {hours.end}</span>
                ) : (
                  <span className="text-sm text-red-500">Off</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                idx < menuItems.length - 1 ? 'border-b dark:border-gray-700' : ''
              } ${item.danger ? 'text-red-500' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
