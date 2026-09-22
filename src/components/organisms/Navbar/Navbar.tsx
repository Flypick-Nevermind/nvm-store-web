'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/atoms/Logo';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const openAuthModal = useAuthModalStore((s) => s.openModal);

  const [scrolled, setScrolled] = useState(false);
  const [lastCount, setLastCount] = useState(totalItems);
  const [badgePulse, setBadgePulse] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated && totalItems > 0) {
      e.preventDefault();
      openAuthModal({
        redirectUrl: '/checkout',
        title: 'Masuk untuk Melanjutkan Checkout',
        message: `Terdapat ${totalItems} produk di keranjangmu. Silakan masuk atau daftar akun terlebih dahulu untuk melanjutkan pesanan.`,
      });
    }
  };

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
    // Close account menu on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#navbar-account-menu')) {
        setIsAccountMenuOpen(false);
      }
    };
    if (isAccountMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [isAccountMenuOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAccountMenuOpen(false);
  }, [pathname]);

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

        <div className="flex items-center gap-1.5 sm:gap-2">
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
            onClick={handleCartClick}
            aria-label={mounted ? `Keranjang (${totalItems} item)` : 'Keranjang'}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#444] hover:text-[#C74375] hover:bg-[#C74375]/8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375]/50"
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

          {/* Account Info / Login Button */}
          {mounted && isAuthenticated && user ? (
            <div className="relative ml-1" id="navbar-account-menu">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                aria-expanded={isAccountMenuOpen}
                aria-label="Menu akun"
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[#C8C8C8]/60 bg-white/80 hover:bg-white transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#C74375] to-[#E8688F] text-white flex items-center justify-center text-xs font-black uppercase shadow-2xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-bold text-[#1A1A1A] hidden sm:inline max-w-[85px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-[#888] transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isAccountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-[#C8C8C8]/60 shadow-xl p-3 z-50 flex flex-col gap-2"
                  >
                    {/* User profile header */}
                    <div className="p-3 rounded-2xl bg-[#FFF8E1] border border-[#C8C8C8]/40 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-extrabold text-[#1A1A1A] truncate">{user.name}</p>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#C74375] text-white shadow-2xs">
                          {user.member_tier || 'VIP Club'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#888] truncate">{user.email || user.whatsapp_number}</p>
                    </div>

                    {/* Menu links */}
                    <div className="flex flex-col gap-0.5 pt-1">
                      <Link
                        href="/track"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#C74375]/8 hover:text-[#C74375] transition-colors"
                      >
                        <span aria-hidden="true">📦</span>
                        <span>Lacak Pesanan Saya</span>
                      </Link>
                      <Link
                        href="/"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#C74375]/8 hover:text-[#C74375] transition-colors"
                      >
                        <span aria-hidden="true">🛍️</span>
                        <span>Katalog Koleksi Tas</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[#C8C8C8]/40 pt-2 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <span aria-hidden="true">🚪</span>
                        <span>Keluar dari Akun</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              id="navbar-login-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:text-[#C74375] hover:bg-[#C74375]/8 transition-colors border border-[#C8C8C8]/50 bg-white/60"
            >
              <svg className="w-4 h-4 text-[#C74375]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
