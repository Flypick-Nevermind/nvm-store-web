'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef } from 'react';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  error?: string;
  hint?: string;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAdornment, rightAdornment, id, className = '', ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1A1A]">
            {label}
            {props.required && <span className="text-[#C74375] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAdornment && (
            <span className="absolute left-3 text-[#C8C8C8] pointer-events-none">
              {leftAdornment}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-xl border px-4 py-3 text-sm text-[#1A1A1A] bg-white',
              'placeholder:text-[#C8C8C8]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#C74375]/40 focus:border-[#C74375]',
              hasError
                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                : 'border-[#C8C8C8] hover:border-[#C74375]/50',
              leftAdornment ? 'pl-9' : '',
              rightAdornment ? 'pr-9' : '',
              className,
            ].join(' ')}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightAdornment && (
            <span className="absolute right-3 text-[#C8C8C8]">{rightAdornment}</span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 flex items-center gap-1">
            <span aria-hidden="true">⚠</span> {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-[#888]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export type { InputProps };
export { Input };
