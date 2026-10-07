'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { ProductCard, ProductCardSkeleton } from '@/components/molecules/ProductCard';
import { useProducts } from '@/hooks/useProducts';

type SortByType = 'newest' | 'price-asc' | 'price-desc';
type StockFilterType = 'all' | 'ready-stock' | 'pre-order';

export default function NewArrivalsPage() {
  const [stockFilter, setStockFilter] = useState<StockFilterType>('all');
  const [sortBy, setSortBy] = useState<SortByType>('newest');
  const { data: allProducts = [], isLoading } = useProducts();

  // Sort by newest date as base
  const sortedNewArrivals = useMemo(() => {
    return [...allProducts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [allProducts]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: sortedNewArrivals.length,
      ready: sortedNewArrivals.filter((p) => p.stock_type === 'ready-stock').length,
      preOrder: sortedNewArrivals.filter((p) => p.stock_type === 'pre-order').length,
    };
  }, [sortedNewArrivals]);

  // Filtered & sorted products list
  const filteredProducts = useMemo(() => {
    let list = [...sortedNewArrivals];

    // Filter by stock status
    if (stockFilter !== 'all') {
      list = list.filter((p) => p.stock_type === stockFilter);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list = list.sort((a, b) => a.price_base - b.price_base);
    } else if (sortBy === 'price-desc') {
      list = list.sort((a, b) => b.price_base - a.price_base);
    } else {
      list = list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return list;
  }, [sortedNewArrivals, stockFilter, sortBy]);

  return (
    <PageShell>
      {/* ── Page Header Banner ─────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#F2EEEB] to-white border-b border-[#E8D5C0]/80 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8A7880]">
            <Link href="/" className="hover:text-[#9E1A59] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#1A1A1A]">New Arrivals</span>
          </nav>

          {/* Heading Content */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] sm:text-[11px] font-black tracking-widest uppercase mb-2.5 border border-[#9E1A59]/20">
                ✨ FRESH DROPS · JUST IN
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#1A1A1A] tracking-tight leading-tight">
                New Arrivals
              </h1>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed mt-2 max-w-xl">
                Rilisan tas impor terbaru pilihan kurator NEVERMIND. Dari siluet viral TikTok &amp; XiaoHongShu hingga statement bag unik bergaransi QC fisik.
              </p>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setStockFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  stockFilter === 'all'
                    ? 'bg-[#9E1A59] text-white shadow-xs'
                    : 'bg-white text-[#666] border border-[#E8D5C0] hover:border-[#9E1A59]/60 hover:text-[#9E1A59]'
                }`}
              >
                Semua ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('ready-stock')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  stockFilter === 'ready-stock'
                    ? 'bg-[#9E1A59] text-white shadow-xs'
                    : 'bg-white text-[#666] border border-[#E8D5C0] hover:border-[#9E1A59]/60 hover:text-[#9E1A59]'
                }`}
              >
                ✅ Ready Stock ({counts.ready})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('pre-order')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  stockFilter === 'pre-order'
                    ? 'bg-[#9E1A59] text-white shadow-xs'
                    : 'bg-white text-[#666] border border-[#E8D5C0] hover:border-[#9E1A59]/60 hover:text-[#9E1A59]'
                }`}
              >
                ⏳ Pre-Order ({counts.preOrder})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Section ─────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
        aria-label="Koleksi New Arrivals"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between py-3 mb-6 sm:mb-8 border-b border-[#E8D5C0]/80">
          <p className="text-xs font-bold text-[#8A7880] uppercase tracking-widest">
            Menampilkan <span className="text-[#9E1A59] font-black">{filteredProducts.length}</span> Tas Terbaru
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#888] hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortByType)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] hover:border-[#9E1A59] focus:outline-none focus:border-[#9E1A59] transition-all cursor-pointer shadow-xs appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239E1A59' stroke-width='2.5'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
              aria-label="Urutkan produk"
            >
              <option value="newest">Rilis Terbaru</option>
              <option value="price-asc">Harga: Low → High</option>
              <option value="price-desc">Harga: High → Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <ProductCardSkeleton key={key} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            key={`${sortBy}-${stockFilter}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-[#F2EEEB] rounded-2xl border border-[#E8D5C0]">
            <span className="text-5xl" aria-hidden="true">
              🔍
            </span>
            <p className="font-display font-bold text-lg text-[#1A1A1A]">Belum ada produk yang cocok</p>
            <p className="text-sm text-[#888] max-w-xs">
              Coba ganti filter stok untuk melihat koleksi tas terbaru lainnya.
            </p>
            <button
              type="button"
              onClick={() => {
                setStockFilter('all');
                setSortBy('newest');
              }}
              className="mt-2 px-5 py-2 rounded-full bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-colors cursor-pointer"
            >
              Tampilkan Semua
            </button>
          </div>
        )}
      </section>

      {/* ── Trend Radar Section ─────────────────────────────── */}
      <section className="bg-[#F2EEEB] border-t border-[#E8D5C0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#9E1A59]">
              TREND RADAR
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mt-1 tracking-tight">
              3 Tren Tas Paling Dicari Minggu Ini
            </h2>
            <p className="text-xs sm:text-sm text-[#777] mt-2">
              Inspirasi tren langsung dari runway &amp; media sosial Gen Z di Shanghai &amp; Hangzhou.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">🪞</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Chrome &amp; Liquid Metallic
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Finish mengkilap dengan aksen quilted atau chain tebal. Memberikan sentuhan retro-futuristik instan pada outfit simpel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">🎀</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Coquette Bow &amp; Sweet Ties
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Detail pita manis di bagian depan atau handle tas. Populer untuk hangout brunch dan paduan outfit serba feminin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">🍋</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Pastel &amp; Butter Yellow
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Warna cerah tapi lembut seperti pastel lemon, soft lilac, dan aqua transparan yang bikin tampilan terasa airy dan segar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
