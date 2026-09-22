'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label: ReactNode;
  error?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, id, className = '', ...props }, ref) => {
    const inputId = id ?? `checkbox-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              className="sr-only peer"
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...props}
            />
            {/* Custom checkbox UI */}
            <div
              className={[
                'w-5 h-5 rounded-md border-2 transition-all duration-150',
                'peer-checked:bg-[#C74375] peer-checked:border-[#C74375]',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-[#C74375]/40 peer-focus-visible:ring-offset-1',
                error ? 'border-red-400' : 'border-[#C8C8C8] group-hover:border-[#C74375]/60',
                className,
              ].join(' ')}
            >
              {/* Checkmark */}
              <svg
                className="w-3 h-3 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 12 12"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
              </svg>
            </div>
            {/* Overlay to show checkmark inside the custom box */}
            <svg
              className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l4 4 6-6" />
            </svg>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-[#1A1A1A] font-medium leading-snug">
              {label}
            </span>
            {description && (
              <span className="text-xs text-[#888] leading-relaxed">{description}</span>
            )}
          </div>
        </label>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 ml-8 flex items-center gap-1">
            <span aria-hidden="true">⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export { Checkbox };
export type { CheckboxProps };
