'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type LogoSize    = 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'light' | 'dark';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  href?: string;
  className?: string;
  showTagline?: boolean;
}

const sizeConfig: Record<LogoSize, { imageWidth: number; imageHeight: number; textClass: string; taglineClass: string }> = {
  sm: { imageWidth: 80,  imageHeight: 28,  textClass: 'text-lg',   taglineClass: 'text-[10px]' },
  md: { imageWidth: 120, imageHeight: 40,  textClass: 'text-2xl',  taglineClass: 'text-xs' },
  lg: { imageWidth: 160, imageHeight: 56,  textClass: 'text-3xl',  taglineClass: 'text-sm' },
  xl: { imageWidth: 200, imageHeight: 70,  textClass: 'text-4xl',  taglineClass: 'text-base' },
};

function LogoContent({ size = 'md', variant = 'dark', showTagline = false }: Omit<LogoProps, 'href'>) {
  const [imageError, setImageError] = useState(false);
  const cfg = sizeConfig[size];
  const textColor = variant === 'dark' ? 'text-[#C74375]' : 'text-white';
  const subColor  = variant === 'dark' ? 'text-[#888]'    : 'text-white/60';

  if (!imageError) {
    return (
      <div className="flex flex-col items-start gap-0.5">
        <Image
          src="/assets/logo.svg"
          alt="NEVERMIND"
          width={cfg.imageWidth}
          height={cfg.imageHeight}
          priority
          className="object-contain"
          onError={() => setImageError(true)}
        />
        {showTagline && (
          <span className={`${cfg.taglineClass} ${subColor} font-medium tracking-widest uppercase`}>
            Too cute, too care?
          </span>
        )}
      </div>
    );
  }

  // Fallback: styled text mark
  return (
    <div className="flex flex-col items-start gap-0">
      <span
        className={[
          cfg.textClass,
          textColor,
          'font-display font-black tracking-tight leading-none',
          'select-none',
        ].join(' ')}
        style={{ letterSpacing: '-0.04em' }}
      >
        NEVERMIND
      </span>
      {showTagline && (
        <span
          className={`${cfg.taglineClass} ${subColor} font-medium tracking-widest uppercase`}
          style={{ letterSpacing: '0.18em' }}
        >
          Too cute, too care?
        </span>
      )}
    </div>
  );
}

export function Logo({ href = '/', className = '', ...props }: LogoProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375] focus-visible:ring-offset-2 rounded-sm ${className}`}
      aria-label="NEVERMIND — Beranda"
    >
      <LogoContent {...props} />
    </Link>
  );
}

export type { LogoProps, LogoSize, LogoVariant };
