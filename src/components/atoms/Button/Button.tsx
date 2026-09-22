'use client';

import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#C74375] text-white hover:bg-[#A33360] active:bg-[#8B2A52] shadow-md hover:shadow-lg',
  secondary: 'bg-[#D8FFF7] text-[#1A1A1A] hover:bg-[#B8EFE7] border border-[#C8C8C8]',
  ghost: 'bg-transparent text-[#C74375] hover:bg-[#C74375]/8',
  outline:
    'bg-transparent border-2 border-[#C74375] text-[#C74375] hover:bg-[#C74375] hover:text-white',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
  xl: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
};

/**
 * Button — uses a motion.div wrapper around a native <button> to avoid
 * type conflicts between Framer Motion's event overrides and HTML button events.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.div
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        whileHover={{ scale: isDisabled ? 1 : 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={fullWidth ? 'w-full' : 'inline-flex'}
        style={{ display: fullWidth ? 'block' : 'inline-flex' }}
      >
        <button
          ref={ref}
          type={type}
          disabled={isDisabled}
          className={[
            'inline-flex items-center justify-center font-semibold transition-all duration-200 w-full',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375] focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
            variantStyles[variant],
            sizeStyles[size],
            className,
          ].join(' ')}
          {...props}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
          )}
          {children}
          {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';

export type { ButtonProps, ButtonSize, ButtonVariant };
export { Button };
