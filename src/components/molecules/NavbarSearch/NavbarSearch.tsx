'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useNavbarSearch } from '@/hooks/useNavbarSearch';
import { formatIDR } from '@/lib/utils';

export function NavbarSearch() {
  const {
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    liveSearchResults,
    handleSearchSubmit,
    desktopSearchRef,
  } = useNavbarSearch();

  return (
    <div
      ref={desktopSearchRef}
      className="hidden md:flex items-center gap-2 flex-1 max-w-[220px] lg:max-w-xs z-20 relative"
    >
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E1A59]/60 pointer-events-none"
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
          onFocus={() => setIsSearchFocused(true)}
          placeholder="Cari tas, bow, tote, warna..."
          className="w-full pl-9 pr-8 py-2 text-xs rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] placeholder-[#C8A0B0] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all shadow-xs"
          aria-label="Search products"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-xs text-[#888] hover:text-[#1A1A1A] cursor-pointer"
            aria-label="Hapus pencarian"
          >
            ✕
          </button>
        )}
      </form>

      {/* Live Search Instant Preview Dropdown */}
      <AnimatePresence>
        {isSearchFocused && searchQuery.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-80 rounded-2xl bg-white border border-[#E8D5C0] shadow-2xl p-3 z-50 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8D5C0]">
              <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">
                Saran Tas Y2K
              </span>
              <span className="text-[10px] text-[#9E1A59] font-semibold">
                {liveSearchResults.length} Ditemukan
              </span>
            </div>

            {liveSearchResults.length > 0 ? (
              <div className="flex flex-col gap-1">
                {liveSearchResults.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    onClick={() => {
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FFF8E1] transition-colors group"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#FFF8E1] border border-[#E8D5C0] shrink-0">
                      <Image
                        src={prod.images[0]}
                        alt={prod.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#9E1A59] truncate">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-[#888]">{formatIDR(prod.price_total)}</p>
                    </div>
                    <span className="text-xs text-[#9E1A59] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      ➔
                    </span>
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full text-center text-xs font-bold text-[#9E1A59] hover:underline pt-2 border-t border-[#E8D5C0] cursor-pointer mt-1"
                >
                  Lihat semua hasil untuk &quot;{searchQuery}&quot; →
                </button>
              </div>
            ) : (
              <div className="py-4 px-2 text-center text-xs text-[#888]">
                <p>Tidak ada tas dengan kata kunci &quot;{searchQuery}&quot;.</p>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-[11px] font-bold text-[#9E1A59] hover:underline mt-1 cursor-pointer block w-full text-center"
                >
                  Buka halaman pencarian katalog →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
