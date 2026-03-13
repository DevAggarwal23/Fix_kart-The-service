import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCards } from 'swiper/modules';
import { 
  FiSearch, FiArrowRight, FiStar, FiMapPin, FiClock, FiShield,
  FiTrendingUp, FiUsers, FiAward, FiCheck, FiPlay, FiZap, FiMessageSquare,
  FiChevronRight
} from 'react-icons/fi';
import { serviceCategories, testimonials, offers, quickActions } from '../data/dummyData';
import { useAuthStore } from '../store/authStore';
import ParticleField, { GradientOrbs } from '../components/ui/ParticleField';
import { staggerContainer, staggerItem, cardHover } from '../components/ui/PageTransition';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = numericValue;
    const inc = end / (duration * 60);
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start * 10) / 10);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, numericValue, duration]);

  return (
    <span ref={ref}>
      {isInView ? (numericValue % 1 === 0 ? Math.floor(count) : count.toFixed(1)) : '0'}
      {suffix}
    </span>
  );
};

// ServiceCard with premium glassmorphism
const ServiceCategoryCard = ({ category, index, isInView }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay: index * 0.08, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -12, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="group relative"
  >
    <Link to={`/services/${category.slug}`}>
      <div className="relative overflow-hidden rounded-3xl aspect-[4/3]">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-500`} />
        
        {/* Glass overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <motion.span 
            className="text-4xl mb-2 block drop-shadow-lg"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {category.icon}
          </motion.span>
          <h3 className="text-xl font-bold text-white tracking-tight">{category.name}</h3>
          <p className="text-white/80 text-sm font-medium">{category.subCategories.length} services</p>
          
          {/* Animated arrow on hover */}
          <motion.div 
            className="absolute bottom-5 right-5 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <FiArrowRight className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const { toggleAIAssistant, toggleCityModal, selectedCity } = useAuthStore();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const featuresRef = useRef(null);
  
  const isStatsInView = useInView(statsRef, { once: true, margin: '-50px' });
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-50px' });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: '-50px' });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const stats = [
    { icon: FiUsers, value: '50K+', numValue: '50', suffix: 'K+', label: 'Happy Customers', color: 'from-primary-500 to-primary-600' },
    { icon: FiTrendingUp, value: '25K+', numValue: '25', suffix: 'K+', label: 'Services Done', color: 'from-secondary-500 to-secondary-600' },
    { icon: FiAward, value: '1000+', numValue: '1000', suffix: '+', label: 'Pro Workers', color: 'from-ai-500 to-ai-600' },
    { icon: FiStar, value: '4.8', numValue: '4.8', suffix: '', label: 'Avg Rating', color: 'from-yellow-500 to-amber-500' },
  ];

  const features = [
    { icon: FiZap, title: 'AI-Powered', description: 'Smart problem detection and instant solutions using GPT-4', gradient: 'from-ai-500 to-ai-600', glow: 'shadow-glow-purple' },
    { icon: FiShield, title: 'Verified Pros', description: '100% background-checked, trained professionals', gradient: 'from-emerald-500 to-teal-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]' },
    { icon: FiClock, title: '30-Min Response', description: 'Average arrival time for urgent bookings', gradient: 'from-primary-500 to-primary-600', glow: 'shadow-glow-blue' },
    { icon: FiCheck, title: 'Price Guarantee', description: 'Best rates guaranteed â€” or we match it', gradient: 'from-secondary-500 to-secondary-600', glow: 'shadow-glow-orange' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 25%, #7c3aed 50%, #1e40af 75%, #1e3a8a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }} />

        {/* Particle field */}
        <ParticleField count={40} colors={['#60A5FA', '#A78BFA', '#FDBA74', '#34D399', '#F472B6']} />

        {/* Animated orbs */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 50, repeat: Infinity, ease: 'linear' }, scale: { duration: 10, repeat: Infinity } }}
          className="absolute -top-1/2 -right-1/4 w-[900px] h-[900px] bg-gradient-to-br from-secondary-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ rotate: { duration: 60, repeat: Infinity, ease: 'linear' }, scale: { duration: 15, repeat: Infinity } }}
          className="absolute -bottom-1/2 -left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-ai-500/20 to-transparent rounded-full blur-3xl"
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Floating service icons */}
        <div className="absolute inset-0 hidden lg:block">
          {[
            { emoji: 'ðŸ”§', x: '10%', y: '20%', delay: 0, size: 'text-5xl' },
            { emoji: 'âš¡', x: '85%', y: '15%', delay: 0.5, size: 'text-4xl' },
            { emoji: 'ðŸ§¹', x: '78%', y: '72%', delay: 1, size: 'text-5xl' },
            { emoji: 'â„ï¸', x: '12%', y: '75%', delay: 1.5, size: 'text-4xl' },
            { emoji: 'ðŸŽ¨', x: '92%', y: '45%', delay: 2, size: 'text-3xl' },
            { emoji: 'ðŸª ', x: '5%', y: '50%', delay: 2.5, size: 'text-3xl' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1, y: [0, -25, 0] }}
              transition={{ 
                delay: item.delay + 0.5,
                y: { duration: 4, repeat: Infinity, delay: item.delay, ease: 'easeInOut' },
                opacity: { duration: 1 }
              }}
              style={{ left: item.x, top: item.y }}
              className={`absolute ${item.size} filter drop-shadow-2xl`}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="text-center lg:text-left"
            >
              {/* AI Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm mb-8 border border-white/20"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                <span className="text-white/90 font-medium">India&apos;s #1 AI-Powered Home Services</span>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-2xs text-white/80 font-bold uppercase tracking-wider">New</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-white leading-[1.1] mb-6 tracking-tight"
              >
                AI-Powered
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text" style={{
                    backgroundImage: 'linear-gradient(135deg, #FDBA74, #F97316, #FB923C)',
                  }}>
                    Home Fixes
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-3 rounded-full opacity-30"
                    style={{ background: 'linear-gradient(90deg, #F97316, #FB923C)' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  />
                </span>
                <br />
                <span className="text-white/90">At Your Door</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg lg:text-xl text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Describe your problem, our AI finds the solution. Book verified plumbers, electricians, cleaners & more in{' '}
                <span className="text-white font-semibold">just 2 taps!</span>
              </motion.p>

              {/* Premium Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
                className="relative max-w-xl mx-auto lg:mx-0"
              >
                <div className="flex items-center rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' }}
                >
                  <button
                    onClick={toggleCityModal}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 border-r border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
                  >
                    <FiMapPin className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-semibold hidden sm:inline">{selectedCity?.name || 'City'}</span>
                  </button>
                  <input
                    type="text"
                    placeholder="Describe your problem or search..."
                    className="flex-1 px-4 py-4 border-none outline-none text-gray-700 bg-transparent placeholder-gray-400"
                    onFocus={toggleAIAssistant}
                    readOnly
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAIAssistant}
                    className="m-1.5 p-3.5 rounded-xl text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}
                  >
                    <FiSearch className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-5">
                  <span className="text-white/40 text-sm">Trending:</span>
                  {['AC Repair', 'Plumber', 'Electrician', 'Deep Cleaning'].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      <Link
                        to={`/services/${item.toLowerCase().replace(' ', '-')}`}
                        className="text-sm text-white/70 hover:text-white px-3 py-1 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                      >
                        {item}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 mt-10"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={toggleAIAssistant}
                  className="group flex items-center gap-3 px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl shadow-xl transition-all"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
                    <FiMessageSquare className="w-4 h-4 text-white" />
                  </div>
                  Try AI Assistant
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <Link to="/services">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    <FiPlay className="w-4 h-4" />
                    Explore Services
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Card Stack */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop"
                    alt="Home Services"
                    className="w-full h-full object-cover rounded-3xl shadow-elevation-4"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </motion.div>

                {/* Floating glass cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                  className="absolute -top-6 -left-6 z-20"
                >
                  <div className="card-glass p-4 shadow-elevation-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                        <FiCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Verified Pro</p>
                        <p className="text-xs text-gray-500">Arriving in 15 min</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
                  className="absolute -bottom-6 -right-6 z-20"
                >
                  <div className="card-glass p-4 shadow-elevation-3">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ delay: 1.6 + i * 0.1, type: 'spring', stiffness: 300 }}
                        >
                          <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      &ldquo;Fixed my AC in 30 mins!&rdquo;
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
                  className="absolute top-1/2 -right-10 z-20"
                >
                  <div className="p-3 rounded-2xl shadow-elevation-2 border border-ai-200/30" 
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(167,139,250,0.15))', backdropFilter: 'blur(12px)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">ðŸ¤–</span>
                      <div>
                        <p className="text-xs font-bold text-ai-700 dark:text-ai-300">AI Detected</p>
                        <p className="text-xs text-ai-600 dark:text-ai-400">Pipe Leak Found</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], height: [6, 12, 6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 bg-white/60 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section ref={statsRef} className="relative py-20 bg-white dark:bg-surface-900 -mt-1">
        <GradientOrbs />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={isStatsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: index * 0.12, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="text-center group"
              >
                <motion.div 
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-5 shadow-lg bg-gradient-to-br ${stat.color}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-3xl lg:text-5xl font-display font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                  <AnimatedCounter value={stat.numValue} suffix={stat.suffix} />
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUICK ACTIONS ===== */}
      <section className="py-20 bg-gray-50/80 dark:bg-surface-900 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="badge badge-primary mb-4 inline-block">Services</span>
            <h2 className="text-3xl lg:text-5xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              What do you need{' '}
              <span className="gradient-text-premium">help with?</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Book professional services in just a few taps
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {quickActions.map((action, index) => (
              <motion.div key={action.id} variants={staggerItem}>
                <Link
                  to={action.route}
                  className="group flex flex-col items-center p-3 lg:p-5 bg-white dark:bg-surface-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-elevation-2 transition-all duration-500 hover:-translate-y-2"
                >
                  <motion.span 
                    whileHover={{ scale: 1.3, rotate: 15 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="text-3xl lg:text-4xl mb-2"
                  >
                    {action.icon}
                  </motion.span>
                  <span className="text-2xs lg:text-xs font-semibold text-gray-600 dark:text-gray-300 text-center leading-tight">
                    {action.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICES CAROUSEL ===== */}
      <section ref={servicesRef} className="py-20 bg-white dark:bg-surface-800 relative">
        <GradientOrbs />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-14 gap-4"
          >
            <div>
              <span className="badge badge-secondary mb-4 inline-block">Popular</span>
              <h2 className="text-3xl lg:text-5xl font-display font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                Our Top <span className="gradient-text">Services</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Explore our most popular home service categories
              </p>
            </div>
            <Link
              to="/services"
              className="group flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
            >
              View All
              <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.slice(0, 8).map((category, index) => (
              <ServiceCategoryCard key={category.id} category={category} index={index} isInView={isServicesInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section ref={featuresRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-animated-mesh" />
        <div className="absolute inset-0 bg-gray-50/90 dark:bg-surface-900/95" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <span className="badge badge-ai mb-4 inline-block">Why FixKart</span>
            <h2 className="text-3xl lg:text-5xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Why Choose <span className="gradient-text-ai">FixKart?</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Our AI-powered platform ensures you get the best service every time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.12, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white dark:bg-surface-800 rounded-3xl p-7 border border-gray-100 dark:border-gray-800 shadow-card-premium hover:shadow-elevation-3 transition-all duration-500"
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #F97316)', padding: '1px' }}>
                  <div className="w-full h-full bg-white dark:bg-surface-800 rounded-3xl" />
                </div>

                <motion.div 
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 ${feature.glow}`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFERS SECTION ===== */}
      <section className="py-20 bg-white dark:bg-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge badge-warning mb-4 inline-block">Limited Time</span>
            <h2 className="text-3xl lg:text-5xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Special <span className="gradient-text-premium">Offers</span> ðŸŽ‰
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Grab these deals before they&apos;re gone!
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="pb-14"
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer.id}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  className="relative overflow-hidden rounded-3xl aspect-[2/1] shadow-card-premium cursor-pointer group"
                >
                  <img src={offer.image} alt={offer.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${offer.color} opacity-90`} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div>
                      <p className="text-sm font-bold opacity-80 mb-1 uppercase tracking-wider">Limited Time</p>
                      <h3 className="text-2xl font-black tracking-tight">{offer.title}</h3>
                      <p className="opacity-90 text-sm mt-1">{offer.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl font-mono font-bold text-sm border border-white/20">
                        {offer.code}
                      </span>
                      <span className="text-xs opacity-70">Valid till {offer.validTill}</span>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-gray-50/80 dark:bg-surface-900 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge badge-success mb-4 inline-block">Reviews</span>
            <h2 className="text-3xl lg:text-5xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              What Customers <span className="gradient-text">Say</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Real reviews from real people
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-surface-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-card-premium hover:shadow-elevation-2 transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-700" loading="lazy" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{testimonial.text}</p>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-primary-500">{testimonial.service}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 30%, #7c3aed 60%, #f97316 100%)',
        }} />
        <ParticleField count={25} colors={['#fff', '#BFDBFE', '#DDD6FE']} />
        
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.h2 
              className="text-3xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to get your
              <br />
              home fixed? âœ¨
            </motion.h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of happy customers who trust FixKart for all their home service needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={toggleAIAssistant}
                className="flex items-center gap-3 px-10 py-5 bg-white text-primary-600 font-black rounded-2xl shadow-2xl text-lg"
              >
                <FiMessageSquare className="w-6 h-6" />
                Start with AI
              </motion.button>
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-10 py-5 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-lg backdrop-blur-sm"
                >
                  Create Free Account
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== DOWNLOAD BANNER ===== */}
      <section className="py-12 bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">ðŸ“±</span>
              <div>
                <p className="text-white font-bold">Download FixKart App</p>
                <p className="text-gray-400 text-sm">Book services on the go</p>
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg">
                <img src="https://www.svgrepo.com/show/303128/download-on-the-app-store-apple-logo.svg" alt="App Store" className="h-8" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg">
                <img src="https://www.svgrepo.com/show/303139/google-play-badge-logo.svg" alt="Play Store" className="h-8" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
