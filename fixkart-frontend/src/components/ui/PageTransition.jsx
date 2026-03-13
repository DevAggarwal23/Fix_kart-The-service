import React from 'react';
import { motion } from 'framer-motion';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, y: -10, scale: 0.99,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
  },
};

// Stagger children
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },
};

// Fade in from direction
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] } },
};

// Card hover effects
export const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  hover: { 
    scale: 1.02, y: -8,
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  tap: { scale: 0.98 },
};

// Button animations
export const buttonTap = {
  whileHover: { scale: 1.03, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97 },
};

export const buttonRipple = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.95 },
};

// Floating animation
export const floatingVariant = (delay = 0) => ({
  animate: {
    y: [0, -12, 0],
    transition: { duration: 3, repeat: Infinity, delay, ease: 'easeInOut' }
  }
});

const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
