import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wrench, Shield, Zap, ArrowRight, BrainCircuit } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'AI-Powered Repairs',
    subtitle: 'Describe your problem, snap a photo, or use voice — our AI finds the perfect fix instantly.',
    icon: BrainCircuit,
    gradient: 'from-ai-500 via-purple-500 to-ai-600',
    bgGlow: 'bg-ai-500/20',
    emoji: '🤖',
  },
  {
    id: 2,
    title: 'Trusted Professionals',
    subtitle: 'Verified, background-checked experts with real ratings. Quality guaranteed or money back.',
    icon: Shield,
    gradient: 'from-green-500 via-emerald-500 to-green-600',
    bgGlow: 'bg-green-500/20',
    emoji: '🛡️',
  },
  {
    id: 3,
    title: 'Lightning Fast Service',
    subtitle: 'Book in 60 seconds. Track your pro in real-time. Pay securely. It\'s that simple.',
    icon: Zap,
    gradient: 'from-secondary-500 via-orange-500 to-secondary-600',
    bgGlow: 'bg-secondary-500/20',
    emoji: '⚡',
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    localStorage.setItem('fixkart_welcomed', 'true');
    navigate('/');
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex flex-col
                    bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        {/* Gradient glow */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 ${slide.bgGlow} rounded-full blur-[100px]`}
        />
      </div>

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStarted}
          className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2 rounded-xl
                     hover:bg-white/5 transition-all"
        >
          Skip
        </motion.button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-sm"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              className="mb-8"
            >
              <div className={`w-28 h-28 mx-auto rounded-3xl rotate-12 
                              bg-gradient-to-br ${slide.gradient}
                              flex items-center justify-center shadow-2xl`}>
                <motion.div className="-rotate-12"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}>
                  <slide.icon className="w-14 h-14 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-display font-bold text-white mb-4"
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-8 pb-12 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl font-bold text-white text-sm
                     bg-gradient-to-r ${slide.gradient}
                     shadow-xl flex items-center justify-center gap-2 transition-all`}
        >
          {currentSlide < slides.length - 1 ? (
            <>Continue <ArrowRight className="w-5 h-5" /></>
          ) : (
            <>Get Started <Sparkles className="w-5 h-5" /></>
          )}
        </motion.button>

        {/* Login link */}
        <p className="text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary-400 font-medium hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
