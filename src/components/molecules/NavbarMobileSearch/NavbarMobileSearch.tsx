'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useNavbarSearch } from '@/hooks/useNavbarSearch';

interface NavbarMobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavbarMobileSearch({ isOpen, onClose }: NavbarMobileSearchProps) {
  const { searchQuery, setSearchQuery, handleSearchSubmit } = useNavbarSearch();

  const handleSubmit = (e: React.FormEvent) => {
    handleSearchSubmit(e);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden px-4 py-2.5 border-t border-[#E8D5C0] bg-[#F2EEEB]"
        >
          <form onSubmit={handleSubmit} className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E1A59]/70 pointer-events-none"
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
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tas, brand, atau warna..."
              className="w-full pl-9 pr-16 py-2 text-xs rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] placeholder-[#888] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15"
              aria-label="Cari produk"
            />
            <button
              type="submit"
              className="absolute right-7 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9E1A59] px-1 hover:underline cursor-pointer"
            >
              Cari
            </button>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#888] hover:text-[#1A1A1A] p-1 cursor-pointer"
              aria-label="Tutup pencarian"
            >
              ✕
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
