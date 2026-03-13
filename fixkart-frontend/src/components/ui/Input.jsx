/**
 * Input Component
 */
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  inputClassName = '',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-200',
            leftIcon && 'pl-11',
            (rightIcon || isPassword) && 'pr-11',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600',
            disabled && 'opacity-60 cursor-not-allowed',
            inputClassName
          )}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
        
        {rightIcon && !isPassword && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <FiAlertCircle size={14} />
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
