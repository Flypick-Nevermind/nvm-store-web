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

const sizeConfig: Record<LogoSize, { imageClass: string; textClass: string; taglineClass: string }> = {
  sm: { imageClass: 'h-10 sm:h-12 w-auto', textClass: 'text-xl', taglineClass: 'text-[10px]' },
  md: { imageClass: 'h-12 sm:h-16 w-auto', textClass: 'text-2xl sm:text-3xl', taglineClass: 'text-xs' },
  lg: { imageClass: 'h-14 sm:h-18 md:h-20 w-auto', textClass: 'text-3xl sm:text-4xl', taglineClass: 'text-sm' },
  xl: { imageClass: 'h-20 sm:h-24 md:h-28 w-auto', textClass: 'text-4xl sm:text-5xl', taglineClass: 'text-base' },
};

function LogoContent({ size = 'md', variant = 'dark', showTagline = false }: Omit<LogoProps, 'href'>) {
  const [logoSrc, setLogoSrc] = useState<string>('/assets/nevermind-logo.PNG');
  const [imageError, setImageError] = useState(false);
  const cfg = sizeConfig[size];
  const textColor = variant === 'dark' ? 'text-[#C74375]' : 'text-white';
  const subColor  = variant === 'dark' ? 'text-[#888]'    : 'text-white/60';

  const handleError = () => {
    if (logoSrc === '/assets/nevermind-logo.PNG') {
      setLogoSrc('/assets/logo.svg');
    } else {
      setImageError(true);
    }
  };

  if (!imageError) {
    return (
      <div className="flex items-center gap-2">
        <Image
          src={logoSrc}
          alt="NEVERMIND"
          width={320}
          height={160}
          priority
          className={`${cfg.imageClass} object-contain transition-transform duration-200 hover:scale-102 drop-shadow-xs`}
          onError={handleError}
        />
        {showTagline && (
          <span className={`${cfg.taglineClass} ${subColor} font-medium tracking-widest uppercase hidden sm:inline`}>
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
