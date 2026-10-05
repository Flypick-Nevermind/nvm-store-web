'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

interface NavbarMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
  pathname: string;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenRequestBag: () => void;
  supportItems: { label: string; href: string }[];
}

export function NavbarMobileDrawer({
  isOpen,
  onClose,
  navLinks,
  pathname,
  wishlistCount,
  onOpenWishlist,
  onOpenRequestBag,
  supportItems,
}: NavbarMobileDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:hidden border-t border-[#E8D5C0] bg-[#F2EEEB] shadow-2xl max-h-[calc(100vh-100px)] overflow-y-auto"
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {/* Top Highlight: Redesigned Request Bag CTA Card */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRequestBag();
              }}
              className="mb-3 w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#9E1A59] via-[#A81B61] to-[#7A1244] text-white flex items-center justify-between text-left shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer border border-white/20 group"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  📸
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black tracking-wider uppercase">
                      Request Tas Impian
                    </p>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FDFD96] text-[#5C5C00] leading-none">
                      Upload Foto
                    </span>
                  </div>
                  <p className="text-[10px] text-white/85 mt-0.5">
                    Punya model tas yang kamu cari? Upload foto & kami carikan!
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#FDFD96] group-hover:translate-x-1 transition-transform">
                ➔
              </span>
            </button>

            {/* Navigation Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={[
                    'px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors',
                    isActive
                      ? 'bg-[#9E1A59] text-white shadow-xs'
                      : 'text-[#1A1A1A] hover:bg-[#F2EEEB] hover:text-[#9E1A59]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Wishlist in mobile drawer */}
            <button
              type="button"
              className="w-full px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors text-[#1A1A1A] hover:bg-[#F2EEEB] hover:text-[#9E1A59] flex items-center justify-between cursor-pointer"
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
            >
              <span className="flex items-center gap-2">
                <span className="text-[#9E1A59]">♡</span>
                <span>WISHLIST SAYA</span>
              </span>
              <span className="text-[10px] font-semibold text-[#888]">
                {wishlistCount > 0 ? `${wishlistCount} Tersimpan` : 'Koleksi Favorit'}
              </span>
            </button>

            {/* Purchase History in mobile drawer */}
            <Link
              href="/orders"
              onClick={onClose}
              className="w-full px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors text-[#1A1A1A] hover:bg-[#F2EEEB] hover:text-[#9E1A59] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span>🛍️</span>
                <span>RIWAYAT PESANAN</span>
              </span>
              <span className="text-[10px] font-semibold text-[#888]">Lihat Semua</span>
            </Link>

            {/* Support section in mobile */}
            <div className="mt-2 border-t border-[#E8D5C0] pt-2">
              <p className="px-4 py-1.5 text-[10px] font-black tracking-widest uppercase text-[#999]">
                SUPPORT
              </p>
              {supportItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-xs font-semibold text-[#444] hover:text-[#9E1A59] hover:bg-[#F2EEEB] rounded-xl transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
