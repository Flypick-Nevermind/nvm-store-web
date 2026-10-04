'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useAddressModalStore } from '@/store/addressModalStore';
import type { User } from '@/types/auth';

interface NavbarAccountMenuProps {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export function NavbarAccountMenu({
  user,
  isOpen,
  onToggle,
  onClose,
  onLogout,
}: NavbarAccountMenuProps) {
  const openAddressModal = useAddressModalStore((s) => s.openModal);
  return (
    <div className="relative" id="navbar-account-menu">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-[#FFF0F5] hover:bg-[#FCE4EC] border border-[#F48FB1]/40 transition-colors text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="w-6 h-6 rounded-full bg-[#9E1A59] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="text-xs font-bold text-[#1A1A1A] max-w-[90px] sm:max-w-[120px] truncate hidden sm:inline">
          {user.name.split(' ')[0]}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-[#9E1A59] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E8D5C0] shadow-xl p-3 z-50 flex flex-col gap-2"
          >
            {/* User Profile Card */}
            <div className="p-3 rounded-xl bg-[#F2EEEB] border border-[#E8D5C0] flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-[#1A1A1A] truncate">{user.name}</p>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#9E1A59] text-white">
                  {user.member_tier || 'VIP Club'}
                </span>
              </div>
              <p className="text-[11px] text-[#888] truncate">
                {user.email || user.whatsapp_number}
              </p>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col gap-0.5">
              <Link
                href="/orders"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#9E1A59]/8 hover:text-[#9E1A59] transition-colors"
              >
                <span>🛍️</span>
                <span>Riwayat Pembelian</span>
              </Link>
              <Link
                href="/track"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#9E1A59]/8 hover:text-[#9E1A59] transition-colors"
              >
                <span>📦</span>
                <span>Lacak Pesanan Saya</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAddressModal();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#9E1A59]/8 hover:text-[#9E1A59] transition-colors cursor-pointer text-left w-full"
              >
                <span>📍</span>
                <span>Buku Alamat Saya</span>
              </button>
            </div>

            {/* Logout button */}
            <div className="border-t border-[#E8D5C0] pt-2">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
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
  );
}
