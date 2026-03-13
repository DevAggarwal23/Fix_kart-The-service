/**
 * Skeleton Loading Component
 */
import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ className = '', variant = 'text', width, height, rounded = 'md' }) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const variantClasses = {
    text: 'h-4',
    title: 'h-6',
    avatar: 'w-10 h-10 rounded-full',
    thumbnail: 'w-20 h-20',
    card: 'h-48',
    button: 'h-10 w-24',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        roundedClasses[rounded],
        className
      )}
      style={{ width, height }}
    />
  );
};

// Card Skeleton
Skeleton.Card = ({ className = '' }) => (
  <div className={clsx('bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4', className)}>
    <Skeleton variant="thumbnail" className="w-full h-40" rounded="lg" />
    <Skeleton variant="title" className="w-3/4" />
    <Skeleton variant="text" className="w-full" />
    <Skeleton variant="text" className="w-2/3" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton variant="text" className="w-20" />
      <Skeleton variant="button" />
    </div>
  </div>
);

// Service Card Skeleton
Skeleton.ServiceCard = ({ className = '' }) => (
  <div className={clsx('bg-white dark:bg-gray-800 rounded-2xl overflow-hidden', className)}>
    <Skeleton className="w-full h-48" rounded="none" />
    <div className="p-4 space-y-3">
      <Skeleton variant="title" className="w-3/4" />
      <Skeleton variant="text" className="w-full" />
      <div className="flex justify-between items-center">
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-24 h-8" rounded="lg" />
      </div>
    </div>
  </div>
);

// Booking Card Skeleton
Skeleton.BookingCard = ({ className = '' }) => (
  <div className={clsx('bg-white dark:bg-gray-800 rounded-2xl p-6', className)}>
    <div className="flex items-start gap-4">
      <Skeleton variant="avatar" className="w-16 h-16" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" className="w-1/2" />
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
      <Skeleton className="w-20 h-6" rounded="full" />
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
      <Skeleton variant="text" className="w-32" />
      <Skeleton variant="button" />
    </div>
  </div>
);

// List Item Skeleton
Skeleton.ListItem = ({ className = '' }) => (
  <div className={clsx('flex items-center gap-4 py-4', className)}>
    <Skeleton variant="avatar" />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
    <Skeleton className="w-16 h-4" />
  </div>
);

// Category Skeleton
Skeleton.Category = ({ className = '' }) => (
  <div className={clsx('flex flex-col items-center gap-2', className)}>
    <Skeleton className="w-16 h-16" rounded="full" />
    <Skeleton variant="text" className="w-16" />
  </div>
);

// Stats Skeleton
Skeleton.Stats = ({ className = '' }) => (
  <div className={clsx('bg-white dark:bg-gray-800 rounded-2xl p-6', className)}>
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12" rounded="lg" />
      <div className="space-y-2">
        <Skeleton variant="title" className="w-24" />
        <Skeleton variant="text" className="w-16" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
Skeleton.TableRow = ({ columns = 5, className = '' }) => (
  <div className={clsx('flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-700', className)}>
    {[...Array(columns)].map((_, i) => (
      <Skeleton key={i} variant="text" className="flex-1" />
    ))}
  </div>
);

// Form Skeleton
Skeleton.Form = ({ className = '' }) => (
  <div className={clsx('space-y-6', className)}>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton variant="text" className="w-24" />
        <Skeleton className="w-full h-12" rounded="xl" />
      </div>
    ))}
    <Skeleton variant="button" className="w-full h-12" rounded="xl" />
  </div>
);

export default Skeleton;
