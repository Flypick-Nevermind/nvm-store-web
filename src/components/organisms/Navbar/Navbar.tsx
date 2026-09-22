'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/atoms/Logo';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const [scrolled, setScrolled] = useState(false);
  const [lastCount, setLastCount] = useState(totalItems);
  const [badgePulse, setBadgePulse] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mounted && totalItems > lastCount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBadgePulse(true);
      setTimeout(() => setBadgePulse(false), 600);
    }
    setLastCount(totalItems);
  }, [totalItems, lastCount, mounted]);

  const navLinks = [
    { href: '/',         label: 'Katalog' },
    { href: '/track',    label: 'Lacak Order' },
  ];

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#FFF8E1]/90 backdrop-blur-md border-b border-[#C8C8C8]/40 shadow-sm'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between"
        aria-label="Navigasi utama"
      >
        <Logo size="lg" />

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375]/50',
                pathname === link.href
                  ? 'text-[#C74375] bg-[#C74375]/8'
                  : 'text-[#1A1A1A] hover:text-[#C74375] hover:bg-[#C74375]/5',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}

          {/* Cart Button */}
          <Link
            href="/checkout"
            id="navbar-cart-btn"
            aria-label={mounted ? `Keranjang (${totalItems} item)` : 'Keranjang'}
            className="relative ml-1 w-10 h-10 rounded-xl flex items-center justify-center text-[#444] hover:text-[#C74375] hover:bg-[#C74375]/8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375]/50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            <AnimatePresence>
              {mounted && totalItems > 0 && (
                <motion.span
                  key="cart-badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: badgePulse ? [1, 1.35, 1] : 1,
                    opacity: 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={
                    badgePulse
                      ? { duration: 0.3 }
                      : { type: 'spring', stiffness: 400, damping: 20 }
                  }
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C74375] text-white text-[10px] font-bold flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </nav>
    </header>
  );
}
