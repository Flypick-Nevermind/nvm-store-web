'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import logoImg from '../../../../public/assets/nvm-logo.png';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'light' | 'dark';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  href?: string | null;
  className?: string;
  showTagline?: boolean;
}

const sizeConfig: Record<
  LogoSize,
  { imageClass: string; textClass: string; taglineClass: string }
> = {
  sm: { imageClass: 'h-7 sm:h-9 md:h-12 w-auto', textClass: 'text-lg sm:text-xl', taglineClass: 'text-[9px] sm:text-[10px]' },
  md: {
    imageClass: 'h-8 sm:h-10 md:h-14 w-auto',
    textClass: 'text-xl sm:text-2xl md:text-3xl',
    taglineClass: 'text-[10px] sm:text-xs',
  },
  lg: {
    imageClass: 'h-8.5 sm:h-12 md:h-16 lg:h-20 w-auto',
    textClass: 'text-2xl sm:text-3xl md:text-4xl',
    taglineClass: 'text-xs sm:text-sm',
  },
  xl: {
    imageClass: 'h-12 sm:h-16 md:h-20 lg:h-24 w-auto',
    textClass: 'text-3xl sm:text-4xl md:text-5xl',
    taglineClass: 'text-sm sm:text-base',
  },
};

function LogoContent({
  size = 'md',
  variant = 'dark',
  showTagline = false,
}: Omit<LogoProps, 'href'>) {
  const [logoSrc, setLogoSrc] = useState<string | StaticImageData>(logoImg);
  const [imageError, setImageError] = useState(false);
  const cfg = sizeConfig[size];
  const textColor = variant === 'dark' ? 'text-[#9E1A59]' : 'text-white';
  const subColor = variant === 'dark' ? 'text-[#8A7880]' : 'text-white/70';

  const handleError = () => {
    if (logoSrc === logoImg) {
      setLogoSrc('/assets/nevermind-logo.PNG');
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
          <span
            className={`${cfg.taglineClass} ${subColor} font-medium tracking-widest uppercase hidden sm:inline`}
          >
            too cute, too care
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
          className={`${cfg.taglineClass} ${subColor} font-medium tracking-widest lowercase`}
          style={{ letterSpacing: '0.12em' }}
        >
          too cute, too care ♡
        </span>
      )}
    </div>
  );
}

export function Logo({ href = '/', className = '', ...props }: LogoProps) {
  if (!href) {
    return (
      <div className={`inline-flex items-center justify-start ${className}`}>
        <LogoContent {...props} />
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E1A59] focus-visible:ring-offset-2 rounded-sm ${className}`}
      aria-label="NEVERMIND — Beranda"
    >
      <LogoContent {...props} />
    </Link>
  );
}

export type { LogoProps, LogoSize, LogoVariant };
