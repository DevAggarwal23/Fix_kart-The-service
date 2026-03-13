import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Floating particles for loading screen
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 2,
  duration: Math.random() * 3 + 3,
}));

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden
                    bg-gradient-to-br from-gray-900 via-ai-950 to-gray-900">
      {/* Animated gradient background */}
      <motion.div
        animate={{ 
          background: [
            'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 50%, rgba(59,130,246,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.15) 0%, transparent 50%)',
          ]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute inset-0"
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-ai-400/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Content */}
      <div className="relative text-center">
        {/* Logo + glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          className="mb-8 relative"
        >
          {/* Glow behind logo */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 
                       bg-ai-500/20 rounded-full blur-3xl"
          />
          
          {/* Logo icon */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl rotate-45 
                       bg-gradient-to-br from-ai-500 via-purple-500 to-secondary-500
                       flex items-center justify-center shadow-2xl shadow-ai-500/30"
          >
            <span className="-rotate-45 text-white font-bold text-3xl font-display">F</span>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-5xl font-display font-bold mb-2">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Fix</span>
              <span className="bg-gradient-to-r from-secondary-400 to-secondary-300 bg-clip-text text-transparent">Kart</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Sparkles className="w-4 h-4 text-ai-400" />
              <p className="text-sm font-medium">AI-Powered Home Services</p>
              <Sparkles className="w-4 h-4 text-ai-400" />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Premium loading bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-48 mx-auto mb-6"
        >
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-ai-400 to-transparent rounded-full"
            />
          </div>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-1.5"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
                backgroundColor: ['rgb(139,92,246)', 'rgb(99,102,241)', 'rgb(139,92,246)'],
              }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
