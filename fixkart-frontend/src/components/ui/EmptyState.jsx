/**
 * Empty State Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionText,
  secondaryAction,
  secondaryActionText,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      {icon && (
        <div className="mb-6 text-gray-300 dark:text-gray-600">
          {typeof icon === 'string' ? (
            <span className="text-6xl">{icon}</span>
          ) : (
            <div className="w-24 h-24 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {description}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {action && actionText && (
          <Button onClick={action} variant="primary">
            {actionText}
          </Button>
        )}

        {secondaryAction && secondaryActionText && (
          <Button onClick={secondaryAction} variant="outline">
            {secondaryActionText}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// Predefined empty states
EmptyState.NoBookings = ({ onAction }) => (
  <EmptyState
    icon="📅"
    title="No bookings yet"
    description="You haven't made any bookings yet. Explore our services and book your first service!"
    action={onAction}
    actionText="Browse Services"
  />
);

EmptyState.NoNotifications = () => (
  <EmptyState
    icon="🔔"
    title="No notifications"
    description="You're all caught up! We'll notify you when something important happens."
  />
);

EmptyState.NoResults = ({ onReset }) => (
  <EmptyState
    icon="🔍"
    title="No results found"
    description="We couldn't find what you're looking for. Try adjusting your search or filters."
    action={onReset}
    actionText="Clear Filters"
  />
);

EmptyState.NoAddress = ({ onAction }) => (
  <EmptyState
    icon="📍"
    title="No addresses saved"
    description="Add your address to make booking services easier and faster."
    action={onAction}
    actionText="Add Address"
  />
);

EmptyState.NoReviews = () => (
  <EmptyState
    icon="⭐"
    title="No reviews yet"
    description="Be the first to share your experience with this service."
  />
);

EmptyState.Error = ({ onRetry }) => (
  <EmptyState
    icon="😕"
    title="Something went wrong"
    description="We encountered an error while loading. Please try again."
    action={onRetry}
    actionText="Try Again"
  />
);

EmptyState.Offline = () => (
  <EmptyState
    icon="📡"
    title="You're offline"
    description="Please check your internet connection and try again."
  />
);

export default EmptyState;
