/**
 * Avatar Component
 */
import React from 'react';
import clsx from 'clsx';
import { getInitials } from '../../utils/helpers';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
  '3xl': 'w-24 h-24 text-3xl',
};

const Avatar = ({
  src,
  name,
  size = 'md',
  rounded = 'full',
  className = '',
  showBadge = false,
  badgeColor = 'green',
  ...props
}) => {
  const [hasError, setHasError] = React.useState(false);

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const badgeColors = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
  };

  const badgeSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
    '3xl': 'w-6 h-6',
  };

  const initials = getInitials(name || '');

  return (
    <div className={clsx('relative inline-flex', className)} {...props}>
      {src && !hasError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setHasError(true)}
          className={clsx(
            'object-cover',
            sizes[size],
            roundedClasses[rounded]
          )}
        />
      ) : (
        <div
          className={clsx(
            'flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold',
            sizes[size],
            roundedClasses[rounded]
          )}
        >
          {initials || '?'}
        </div>
      )}

      {showBadge && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800',
            badgeColors[badgeColor],
            badgeSizes[size]
          )}
        />
      )}
    </div>
  );
};

// Avatar Group
Avatar.Group = ({ children, max = 4, size = 'md', className = '' }) => {
  const childArray = React.Children.toArray(children);
  const visibleAvatars = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={clsx('flex -space-x-2', className)}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="ring-2 ring-white dark:ring-gray-800 rounded-full">
          {React.cloneElement(child, { size })}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={clsx(
            'flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full ring-2 ring-white dark:ring-gray-800',
            sizes[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;
