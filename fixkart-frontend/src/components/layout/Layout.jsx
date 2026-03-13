import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FiHome, FiSearch, FiUser, FiMenu, FiX, FiSun, FiMoon, 
  FiMapPin, FiMessageSquare, FiPhone, FiMail, FiInstagram,
  FiFacebook, FiTwitter, FiYoutube, FiChevronDown, FiHeart,
  FiShoppingBag, FiSettings, FiLogOut, FiHelpCircle, FiBell
} from 'react-icons/fi';
import { Sparkles, Home, Search, ShoppingBag, UserCircle, MessageCircle } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import NotificationDropdown from '../ui/NotificationDropdown';
import { serviceCategories } from '../../data/dummyData';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, isAuthenticated, selectedCity, toggleCityModal, toggleAIAssistant, logout } = useAuthStore();

  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  // Track scroll for header effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Services', path: '/services', icon: FiSearch, hasDropdown: true },
    { name: 'About', path: '/about', icon: FiHeart },
    { name: 'Contact', path: '/contact', icon: FiPhone },
  ];

  const bottomNavItems = [
    { name: 'Home', path: '/', icon: Home, activeColor: 'text-primary-500' },
    { name: 'Services', path: '/services', icon: Search, activeColor: 'text-blue-500' },
    { name: 'AI', path: null, icon: MessageCircle, isAI: true },
    { name: 'Bookings', path: '/my-bookings', icon: ShoppingBag, activeColor: 'text-secondary-500' },
    { name: 'Profile', path: isAuthenticated ? '/dashboard' : '/login', icon: UserCircle, activeColor: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ====== HEADER ====== */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 
                           rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30
                           group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-shadow"
              >
                <span className="text-white font-bold text-xl">F</span>
              </motion.div>
              <span className="text-2xl font-display font-bold">
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">Fix</span>
                <span className="bg-gradient-to-r from-secondary-500 to-secondary-400 bg-clip-text text-transparent">Kart</span>
              </span>
            </Link>

            {/* City Selector - Desktop */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleCityModal}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl 
                         bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800
                         border border-gray-200/50 dark:border-gray-700/50
                         transition-all group"
            >
              <FiMapPin className="w-4 h-4 text-primary-500 group-hover:animate-bounce" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedCity?.name || 'Select City'}
              </span>
              <FiChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 transition-colors" />
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = link.path === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(link.path);
                return (
                  <div 
                    key={link.name} 
                    className="relative"
                    onMouseEnter={() => link.hasDropdown && setServicesDropdownOpen(true)}
                    onMouseLeave={() => link.hasDropdown && setServicesDropdownOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {link.name}
                      {link.hasDropdown && <FiChevronDown className="w-3.5 h-3.5" />}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl -z-10"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                    </Link>

                    {/* Services Dropdown */}
                    <AnimatePresence>
                      {link.hasDropdown && servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-80 mt-2 
                                     bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl
                                     rounded-2xl shadow-2xl shadow-black/10 
                                     border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                        >
                          <div className="p-2 max-h-80 overflow-y-auto">
                            {serviceCategories.map((category) => (
                              <Link
                                key={category.id}
                                to={`/services/${category.slug}`}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                           hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                              >
                                <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
                                <div>
                                  <p className="font-medium text-sm text-gray-900 dark:text-white">{category.name}</p>
                                  <p className="text-xs text-gray-500">{category.subCategories.length} services</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* AI Button (Desktop) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAIAssistant}
                className="hidden sm:flex items-center gap-2 px-4 py-2 
                           bg-gradient-to-r from-ai-500 to-purple-600 
                           text-white rounded-xl font-medium text-sm
                           shadow-lg shadow-ai-500/30 hover:shadow-xl hover:shadow-ai-500/40 
                           transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden lg:inline">AI Assistant</span>
              </motion.button>

              {/* Dark Mode */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? (
                  <FiSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FiMoon className="w-5 h-5 text-gray-500" />
                )}
              </motion.button>

              {/* Notifications */}
              {isAuthenticated && <NotificationDropdown />}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-primary-500/50 hover:ring-primary-500 transition-all">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <FiChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                  </motion.button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          className="absolute right-0 mt-2 w-64 z-50
                                     bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl
                                     rounded-2xl shadow-2xl shadow-black/10 
                                     border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
                            <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                          <div className="py-1">
                            {[
                              { to: '/dashboard', icon: FiUser, label: 'Dashboard' },
                              { to: '/my-bookings', icon: FiShoppingBag, label: 'My Bookings' },
                              { to: '/settings', icon: FiSettings, label: 'Settings' },
                              { to: '/help', icon: FiHelpCircle, label: 'Help & Support' },
                            ].map((item) => (
                              <Link key={item.to} to={item.to} onClick={() => setProfileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm
                                           hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                                           text-gray-700 dark:text-gray-300">
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span>{item.label}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 dark:border-gray-700/50 py-1">
                            <button onClick={() => { logout(); setProfileMenuOpen(false); }}
                              className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm
                                         text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <FiLogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                                               hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white rounded-xl
                                                bg-gradient-to-r from-primary-500 to-primary-600 
                                                shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30
                                                transition-all">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 
                         bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-2">
                <button
                  onClick={() => { toggleCityModal(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl 
                             bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <FiMapPin className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{selectedCity?.name || 'Select City'}</span>
                </button>

                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      location.pathname === link.path
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}>
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{link.name}</span>
                  </Link>
                ))}

                <button onClick={() => { toggleAIAssistant(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl 
                             bg-gradient-to-r from-ai-500 to-purple-600 text-white shadow-lg">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium text-sm">AI Assistant</span>
                </button>

                {!isAuthenticated && (
                  <div className="flex gap-2 pt-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                                 text-sm font-medium text-gray-700 dark:text-gray-300">Login</Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-3 rounded-xl bg-primary-500 text-white text-sm font-medium">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* ====== FOOTER ====== */}
      {!isAuthPage && (
        <footer className="hidden md:block bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                  <span className="text-2xl font-display font-bold text-white">
                    Fix<span className="text-secondary-400">Kart</span>
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  AI-powered home services at your doorstep. Quality work, transparent pricing, trusted professionals.
                </p>
                <div className="flex gap-2">
                  {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
                    <motion.a key={i} href="#" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center 
                                 hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 
                                 transition-all border border-gray-700/50 hover:border-transparent">
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
                <ul className="space-y-2.5">
                  {serviceCategories.slice(0, 6).map((cat) => (
                    <li key={cat.id}>
                      <Link to={`/services/${cat.slug}`} 
                        className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors" />
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
                <ul className="space-y-2.5">
                  {[
                    { to: '/about', label: 'About Us' },
                    { to: '/contact', label: 'Contact' },
                    { to: '/faq', label: 'FAQs' },
                    { to: '/privacy', label: 'Privacy Policy' },
                    { to: '/terms', label: 'Terms of Service' },
                  ].map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
                <ul className="space-y-3">
                  {[
                    { icon: FiMapPin, text: '123, Tech Park, Gurgaon, India' },
                    { icon: FiPhone, text: '+91 98765 43210' },
                    { icon: FiMail, text: 'support@fixkart.com' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <item.icon className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-400">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">© 2025 FixKart. All rights reserved.</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms</Link>
                <Link to="/faq" className="hover:text-primary-400 transition-colors">FAQs</Link>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* ====== PREMIUM MOBILE BOTTOM NAV ====== */}
      {!isAuthPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
          {/* Glass background */}
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl 
                          border-t border-gray-200/50 dark:border-gray-700/50" />
          
          <div className="relative flex items-center justify-around px-2 py-2 safe-bottom">
            {bottomNavItems.map((item) => {
              const isActive = item.path === '/' 
                ? location.pathname === '/' 
                : item.path && location.pathname.startsWith(item.path);

              // AI floating button
              if (item.isAI) {
                return (
                  <motion.button
                    key="ai-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleAIAssistant}
                    className="relative -mt-7"
                  >
                    <div className="w-14 h-14 rounded-2xl rotate-45 overflow-hidden
                                    bg-gradient-to-br from-ai-500 via-purple-500 to-secondary-500 
                                    shadow-xl shadow-ai-500/40
                                    flex items-center justify-center">
                      <div className="-rotate-45 flex flex-col items-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {/* Glow ring */}
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-2xl rotate-45
                                 bg-gradient-to-br from-ai-400 to-purple-400 -z-10 blur-md"
                    />
                  </motion.button>
                );
              }

              return (
                <Link key={item.name} to={item.path}
                  className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl group">
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className="relative"
                  >
                    <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? item.activeColor : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    {/* Active glow dot */}
                    {isActive && (
                      <motion.div
                        layoutId="bottomnav-indicator"
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500"
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                  <span className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
