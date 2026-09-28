'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/atoms/Logo';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const SUPPORT_ITEMS = [
  { label: 'FAQs', href: '/support/faqs' },
  { label: 'About Us', href: '/support/about' },
  { label: 'Contact Us', href: '/support/contact' },
  { label: 'Track Order', href: '/track' },
  { label: 'Shipping Policy', href: '/support/shipping' },
  { label: 'Refund Policy', href: '/support/refund' },
];

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/products', label: 'ALL PRODUCTS' },
  { href: '/category', label: 'CATEGORY' },
  { href: '/collection', label: 'COLLECTION' },
  { href: '/best-seller', label: 'BEST SELLER' },
  { href: '/flash-sale', label: 'FLASH SALE' },
  { href: '/new-arrivals', label: 'NEW ARRIVALS' },
];

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
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const supportRef = useRef<HTMLLIElement>(null);

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

  // Close support dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setIsSupportOpen(false);
      }
    };
    if (isSupportOpen) {
      document.addEventListener('mousedown', handleOutside);
      return () => document.removeEventListener('mousedown', handleOutside);
    }
  }, [isSupportOpen]);

  // Close account menu on outside click
  useEffect(() => {
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

  // Close menus on route change
  useEffect(() => {
    if (pathname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAccountMenuOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupportOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (mounted && totalItems > lastCount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBadgePulse(true);
      setTimeout(() => setBadgePulse(false), 600);
    }
    setLastCount(totalItems);
  }, [totalItems, lastCount, mounted]);

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm',
      ].join(' ')}
    >
      {/* ── Layer 1: Announcement Bar ──────────────────────── */}
      <div className="bg-[#9E1A59] text-white text-[11px] font-semibold tracking-wide py-2 px-4 flex items-center justify-center">
        <span>
          FREE SHIPPING FOR NEW MEMBERS! —{' '}
          <Link
            href="/login"
            className="underline underline-offset-2 hover:text-[#FDFD96] transition-colors"
          >
            SIGN UP NOW →
          </Link>
        </span>
      </div>

      {/* ── Layer 2: Logo + Search + Icons ─────────────────── */}
      <div
        className={[
          'bg-[#FFF8E1] border-b border-[#E8D5C0] transition-all duration-300',
          scrolled ? 'py-2' : 'py-3',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          {/* Search (left) */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E1A59]/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] placeholder-[#C8A0B0] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Logo (center) */}
          <div className="flex-1 flex justify-center">
            <Logo size="lg" variant="dark" />
          </div>

          {/* Icons (right) */}
          <div className="flex-1 flex items-center justify-end gap-1">
            {/* Mobile search toggle */}
            <button
              type="button"
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF8E1] transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-4.5 h-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Account */}
            {mounted && isAuthenticated && user ? (
              <div className="relative" id="navbar-account-menu">
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  aria-expanded={isAccountMenuOpen}
                  aria-label="Menu akun"
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-[#FFF8E1] text-[#1A1A1A] transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9E1A59] to-[#C23070] text-white flex items-center justify-center text-xs font-black uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <svg
                    className={`w-3 h-3 text-[#999] transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`}
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
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E8D5C0] shadow-xl p-3 z-50 flex flex-col gap-2"
                    >
                      <div className="p-3 rounded-xl bg-[#FFF8E1] border border-[#E8D5C0] flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-extrabold text-[#1A1A1A] truncate">
                            {user.name}
                          </p>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#9E1A59] text-white">
                            {user.member_tier || 'VIP Club'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#888] truncate">
                          {user.email || user.whatsapp_number}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href="/track"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#9E1A59]/8 hover:text-[#9E1A59] transition-colors"
                        >
                          <span>📦</span>
                          <span>Lacak Pesanan Saya</span>
                        </Link>
                        <Link
                          href="/"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#9E1A59]/8 hover:text-[#9E1A59] transition-colors"
                        >
                          <span>🛍️</span>
                          <span>Katalog Koleksi Tas</span>
                        </Link>
                      </div>
                      <div className="border-t border-[#E8D5C0] pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <span>🚪</span>
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
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF8E1] hover:text-[#9E1A59] transition-colors"
                aria-label="Login"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}

            {/* Wishlist */}
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF8E1] hover:text-[#9E1A59] transition-colors"
              aria-label="Wishlist"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Cart */}
            <Link
              href="/checkout"
              id="navbar-cart-btn"
              onClick={handleCartClick}
              aria-label={mounted ? `Keranjang (${totalItems} item)` : 'Keranjang'}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF8E1] hover:text-[#9E1A59] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <AnimatePresence>
                {mounted && totalItems > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: badgePulse ? [1, 1.35, 1] : 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={
                      badgePulse
                        ? { duration: 0.3 }
                        : { type: 'spring', stiffness: 400, damping: 20 }
                    }
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center leading-none bg-[#9E1A59] text-white"
                    aria-hidden="true"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF8E1] transition-colors ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Layer 3: Desktop Navigation Menu ───────────────── */}
      <nav
        className="hidden lg:block bg-[#FFF8E1] border-b border-[#E8D5C0]"
        aria-label="Navigasi utama"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-0">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={[
                      'block px-4 py-3.5 text-[11px] font-bold tracking-widest uppercase transition-all border-b-2 hover:text-[#9E1A59]',
                      isActive
                        ? 'text-[#9E1A59] border-[#9E1A59]'
                        : 'text-[#1A1A1A] border-transparent hover:border-[#9E1A59]/40',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Support Dropdown */}
            <li ref={supportRef} className="relative">
              <button
                type="button"
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                aria-expanded={isSupportOpen}
                className={[
                  'flex items-center gap-1 px-4 py-3.5 text-[11px] font-bold tracking-widest uppercase transition-all border-b-2 cursor-pointer hover:text-[#9E1A59]',
                  isSupportOpen
                    ? 'text-[#9E1A59] border-[#9E1A59]'
                    : 'text-[#1A1A1A] border-transparent hover:border-[#9E1A59]/40',
                ].join(' ')}
              >
                SUPPORT
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${isSupportOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Support Dropdown Panel */}
              <AnimatePresence>
                {isSupportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-0 w-52 bg-[#FFF8E1] border border-[#E8D5C0] shadow-xl z-50 py-2"
                  >
                    {SUPPORT_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-2.5 text-sm text-[#333] hover:text-[#9E1A59] hover:bg-[#FFF8E1] transition-colors"
                        onClick={() => setIsSupportOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </div>
      </nav>

      {/* ── Mobile Menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#FFF8E1] border-b border-[#E8D5C0] overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors',
                    pathname === link.href
                      ? 'bg-[#9E1A59] text-white'
                      : 'text-[#1A1A1A] hover:bg-[#FFF8E1] hover:text-[#9E1A59]',
                  ].join(' ')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Support section in mobile */}
              <div className="mt-2 border-t border-[#E8D5C0] pt-2">
                <p className="px-4 py-1.5 text-[10px] font-black tracking-widest uppercase text-[#999]">
                  SUPPORT
                </p>
                {SUPPORT_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-xs font-semibold text-[#444] hover:text-[#9E1A59] hover:bg-[#FFF8E1] rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
