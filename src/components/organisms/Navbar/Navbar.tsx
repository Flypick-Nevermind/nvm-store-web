'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/atoms/Logo';
import { NavbarAccountMenu } from '@/components/molecules/NavbarAccountMenu';
import { NavbarMobileDrawer } from '@/components/molecules/NavbarMobileDrawer';
import { NavbarMobileSearch } from '@/components/molecules/NavbarMobileSearch';
import { NavbarSearch } from '@/components/molecules/NavbarSearch';
import { WishlistDrawer } from '@/components/organisms/WishlistDrawer';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useRequestBagModalStore } from '@/store/requestBagModalStore';
import { useWishlistStore } from '@/store/wishlistStore';

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
  const openRequestBagModal = useRequestBagModalStore((s) => s.openModal);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const [scrolled, setScrolled] = useState(false);
  const [lastCount, setLastCount] = useState(totalItems);
  const [badgePulse, setBadgePulse] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
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

  // Close menus on route change
  useEffect(() => {
    if (pathname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAccountMenuOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupportOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobileMenuOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobileSearchOpen(false);
    }
  }, [pathname]);

  // Cart badge pulse on item added
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
      <div className="bg-[#9E1A59] text-white text-[11px] font-semibold tracking-wide py-2 px-4 flex items-center justify-between sm:justify-center relative">
        <span className="truncate">
          FREE SHIPPING FOR NEW MEMBERS! —{' '}
          <Link
            href="/login"
            className="underline underline-offset-2 hover:text-[#FDFD96] transition-colors"
          >
            SIGN UP NOW →
          </Link>
        </span>
        <button
          type="button"
          onClick={() => openRequestBagModal()}
          className="hidden md:inline-flex items-center gap-1.5 ml-4 px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-[#FDFD96] text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer border border-white/20 shrink-0"
        >
          <span>✨</span>
          <span>Request a Bag</span>
        </button>
      </div>

      {/* ── Layer 2: Mobile (Logo Left, Icons Right) | Desktop (Search Left, Logo Center, Icons Right) ── */}
      <div className="bg-[#F2EEEB] border-b border-[#E8D5C0] py-2.5 sm:py-3 transition-all duration-300">
        <div className="relative w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between min-h-[52px] sm:min-h-[72px] md:min-h-[80px]">
          {/* Mobile: Logo di Kiri */}
          <div className="flex md:hidden items-center justify-start shrink-0 z-10">
            <Logo size="lg" variant="dark" />
          </div>

          {/* Desktop: Search Bar Molecule */}
          <Suspense
            fallback={<div className="hidden md:flex flex-1 max-w-[220px] lg:max-w-xs h-9" />}
          >
            <NavbarSearch />
          </Suspense>

          {/* Desktop: Logo di Tengah (Exact 50% Center) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center pointer-events-auto z-10">
            <Logo size="lg" variant="dark" />
          </div>

          {/* Sisi Kanan: Action Icons */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1.5 z-10">
            {/* Mobile search toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF0F5] transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1A1A1A]"
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

            {/* Account Menu Molecule */}
            {mounted && isAuthenticated && user ? (
              <NavbarAccountMenu
                user={user}
                isOpen={isAccountMenuOpen}
                onToggle={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                onClose={() => setIsAccountMenuOpen(false)}
                onLogout={logout}
              />
            ) : (
              <Link
                href="/login"
                id="navbar-login-btn"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF0F5] hover:text-[#9E1A59] transition-colors"
                aria-label="Login"
              >
                <svg
                  className="w-4.5 h-4.5 sm:w-5 sm:h-5"
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

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF0F5] hover:text-[#9E1A59] transition-colors cursor-pointer"
              aria-label={mounted ? `Wishlist (${wishlistCount} item)` : 'Wishlist'}
            >
              <svg
                className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform active:scale-90"
                fill={mounted && wishlistCount > 0 ? '#9E1A59' : 'none'}
                viewBox="0 0 24 24"
                stroke={mounted && wishlistCount > 0 ? '#9E1A59' : 'currentColor'}
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <AnimatePresence>
                {mounted && wishlistCount > 0 && (
                  <motion.span
                    key="wishlist-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center leading-none bg-[#9E1A59] text-white"
                    aria-hidden="true"
                  >
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Cart Button */}
            <Link
              href="/checkout"
              id="navbar-cart-btn"
              onClick={handleCartClick}
              aria-label={mounted ? `Keranjang (${totalItems} item)` : 'Keranjang'}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF0F5] hover:text-[#9E1A59] transition-colors"
            >
              <svg
                className="w-4.5 h-4.5 sm:w-5 sm:h-5"
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
                    className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center leading-none bg-[#9E1A59] text-white"
                    aria-hidden="true"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFF0F5] transition-colors"
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

        {/* Mobile Search Dropdown Molecule */}
        <Suspense fallback={null}>
          <NavbarMobileSearch
            isOpen={isMobileSearchOpen}
            onClose={() => setIsMobileSearchOpen(false)}
          />
        </Suspense>
      </div>

      {/* ── Layer 3: Desktop Navigation Menu ───────────────── */}
      <nav
        className="hidden lg:block bg-[#F2EEEB] border-b border-[#E8D5C0]"
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

              <AnimatePresence>
                {isSupportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-0 w-52 bg-[#F2EEEB] border border-[#E8D5C0] shadow-xl z-50 py-2"
                  >
                    {SUPPORT_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-2.5 text-sm text-[#333] hover:text-[#9E1A59] hover:bg-[#F2EEEB] transition-colors"
                        onClick={() => setIsSupportOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Request a Bag Action Button */}
            <li className="ml-3">
              <button
                type="button"
                onClick={() => openRequestBagModal()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9E1A59]/10 hover:bg-[#9E1A59] text-[#9E1A59] hover:text-white border border-[#9E1A59]/30 text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group"
              >
                <span className="text-xs group-hover:scale-115 transition-transform">✨</span>
                <span>REQUEST BAG</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Drawer Molecule */}
      <NavbarMobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
        pathname={pathname || ''}
        wishlistCount={wishlistCount}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenRequestBag={() => openRequestBagModal()}
        supportItems={SUPPORT_ITEMS}
      />

      {/* Wishlist Slide-Over Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </header>
  );
}
