import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiBriefcase, FiDollarSign, FiStar, FiUser, FiMenu, FiX,
  FiToggleLeft, FiToggleRight, FiBell, FiSettings, FiLogOut, FiMapPin
} from 'react-icons/fi';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

const WorkerLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/worker', icon: FiHome },
    { name: 'Job Requests', path: '/worker/jobs', icon: FiBriefcase },
    { name: 'Earnings', path: '/worker/earnings', icon: FiDollarSign },
    { name: 'My Ratings', path: '/worker/ratings', icon: FiStar },
    { name: 'Profile', path: '/worker/profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <Link to="/worker" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-display font-bold">
              <span className="text-primary-600 dark:text-primary-400">Fix</span>
              <span className="text-secondary-500">Kart</span>
            </span>
          </Link>
        </div>

        {/* Worker Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'}
              alt="Worker"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Worker'}</p>
              <p className="text-sm text-gray-500">Plumber • 4.8 ⭐</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isAvailable ? 'Available' : 'Offline'}
            </span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAvailable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: isAvailable ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Link
            to="/worker/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-800 z-50 lg:hidden"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-display font-bold">
            <span className="text-primary-600">Fix</span>
            <span className="text-secondary-500">Kart</span>
          </span>
          <button onClick={() => setSidebarOpen(false)}>
            <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Mobile Nav Content */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Worker Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Current Location */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm">
              <FiMapPin className="w-4 h-4 text-primary-500" />
              <span className="text-gray-600 dark:text-gray-300">New Delhi</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <span className="text-yellow-500">☀️</span>
              ) : (
                <span>🌙</span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;
