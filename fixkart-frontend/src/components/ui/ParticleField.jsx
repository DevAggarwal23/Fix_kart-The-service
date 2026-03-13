import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Animated floating particles background - pure Framer Motion, no heavy libs
const ParticleField = ({ count = 30, className = '', colors }) => {
  const defaultColors = ['#3B82F6', '#8B5CF6', '#F97316', '#14B8A6', '#EC4899'];
  const particleColors = colors || defaultColors;

  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: particleColors[i % particleColors.length],
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    })),
  [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0, 30, 0],
            x: [0, 20, -15, 10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.8, p.opacity * 1.2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Animated gradient orbs background
export const GradientOrbs = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 100, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
};

// Animated mesh grid
export const AnimatedGrid = ({ className = '' }) => (
  <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
    <div className="w-full h-full bg-grid-pattern opacity-50" />
  </div>
);

export default ParticleField;
