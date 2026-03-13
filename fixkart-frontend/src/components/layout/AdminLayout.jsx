import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiUsers, FiTool, FiCalendar, FiMap, FiDollarSign,
  FiStar, FiGrid, FiBarChart2, FiSettings, FiMenu, FiX,
  FiBell, FiSearch, FiLogOut
} from 'react-icons/fi';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiHome },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Workers', path: '/admin/workers', icon: FiTool },
    { name: 'Bookings', path: '/admin/bookings', icon: FiCalendar },
    { name: 'Live Map', path: '/admin/live-map', icon: FiMap },
    { name: 'Payments', path: '/admin/payments', icon: FiDollarSign },
    { name: 'Ratings', path: '/admin/ratings', icon: FiStar },
    { name: 'Services', path: '/admin/services', icon: FiGrid },
    { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar Desktop */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="hidden lg:flex lg:flex-col bg-gray-900 text-white fixed left-0 top-0 bottom-0 z-30"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen ? (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-display font-bold">
                Fix<span className="text-secondary-400">Kart</span>
              </span>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">F</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={!sidebarOpen ? item.name : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Admin Info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="Admin"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-white text-sm">Admin</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarMobileOpen ? 0 : -280 }}
        className="fixed top-0 left-0 bottom-0 w-72 bg-gray-900 text-white z-50 lg:hidden"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <span className="text-xl font-display font-bold">
            Fix<span className="text-secondary-400">Kart</span>
          </span>
          <button onClick={() => setSidebarMobileOpen(false)}>
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl w-64">
              <FiSearch className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
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
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Admin Avatar */}
            <div className="lg:hidden">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="Admin"
                className="w-9 h-9 rounded-full"
              />
            </div>
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

export default AdminLayout;
