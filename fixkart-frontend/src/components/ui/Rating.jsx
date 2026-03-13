/**
 * Rating Component
 */
import React from 'react';
import { FiStar } from 'react-icons/fi';
import clsx from 'clsx';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const Rating = ({
  value = 0,
  max = 5,
  size = 'md',
  readonly = true,
  onChange,
  showValue = false,
  showCount = false,
  count = 0,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = React.useState(0);

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[...Array(max)].map((_, index) => {
          const rating = index + 1;
          const isFilled = rating <= displayValue;
          const isHalf = !isFilled && rating - 0.5 <= displayValue;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={clsx(
                'transition-colors duration-150',
                !readonly && 'cursor-pointer hover:scale-110',
                readonly && 'cursor-default'
              )}
            >
              <FiStar
                className={clsx(
                  sizes[size],
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : isHalf
                    ? 'fill-yellow-400/50 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                )}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {value.toFixed(1)}
        </span>
      )}

      {showCount && count > 0 && (
        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

// Rating Display with stats
Rating.Stats = ({ rating, total, breakdown = {} }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {rating.toFixed(1)}
        </span>
        <div>
          <Rating value={rating} size="sm" />
          <p className="text-sm text-gray-500">{total.toLocaleString()} reviews</p>
        </div>
      </div>

      {Object.keys(breakdown).length > 0 && (
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-gray-600 dark:text-gray-400">{star}</span>
                <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rating;
