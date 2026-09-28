import type { ReactNode } from 'react';

type BadgeVariant = 'primary' | 'aqua' | 'yellow' | 'silver' | 'danger' | 'charcoal' | 'sold-out';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-[#9E1A59]/12 text-[#9E1A59] border border-[#9E1A59]/30',
  aqua: 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]',
  yellow: 'bg-[#FDFD96] text-[#5C5C00] border border-[#E0E040]',
  silver: 'bg-white text-[#4A4A4A] border border-[#E8D5C0]',
  danger: 'bg-red-50 text-red-600 border border-red-200',
  charcoal: 'bg-[#1A1A1A] text-white border border-[#333]',
  'sold-out': 'bg-[#1A1A1A] text-white border border-[#333]',
};

export function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap',
        variantStyles[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export type { BadgeProps, BadgeVariant };
