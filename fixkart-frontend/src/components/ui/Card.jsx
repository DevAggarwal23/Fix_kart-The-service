/**
 * Card Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
  shadow = 'md',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-card',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const Component = hover || onClick ? motion.div : 'div';
  const hoverProps = hover || onClick ? {
    whileHover: { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    whileTap: onClick ? { scale: 0.98 } : {},
  } : {};

  return (
    <Component
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-2xl',
        shadows[shadow],
        paddings[padding],
        hover && 'cursor-pointer transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Header
Card.Header = ({ children, className = '' }) => (
  <div className={clsx('border-b border-gray-100 dark:border-gray-700 pb-4 mb-4', className)}>
    {children}
  </div>
);

// Card Title
Card.Title = ({ children, className = '' }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
    {children}
  </h3>
);

// Card Body
Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

// Card Footer
Card.Footer = ({ children, className = '' }) => (
  <div className={clsx('border-t border-gray-100 dark:border-gray-700 pt-4 mt-4', className)}>
    {children}
  </div>
);

export default Card;
