'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/layouts/PageShell';
import { CategoryPill } from '@/components/molecules/CategoryPill';
import { ProductCard } from '@/components/molecules/ProductCard';
import { CATEGORIES, STOCK_FILTERS } from '@/constants/categories';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';
import type { CategoryId, StockFilter } from '@/constants/categories';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [activeStock, setActiveStock] = useState<StockFilter>('all');

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const catMatch =
        activeCategory === 'all' ||
        p.category === activeCategory ||
        p.tags.includes(activeCategory);
      const stockMatch =
        activeStock === 'all' || p.stock_type === activeStock;
      return catMatch && stockMatch;
    });
  }, [activeCategory, activeStock]);

  return (
    <PageShell>
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-[#C74375] via-[#E8688F] to-[#FDFD96] px-4 pt-10 pb-12 md:py-20"
        aria-label="Hero banner"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 -translate-y-24 translate-x-24 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#FDFD96]/20 translate-y-16 -translate-x-16 blur-2xl" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Col: Hero Copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 flex flex-col items-start gap-4"
            >
              <span className="pill-tag bg-white/20 text-white border border-white/30 text-[11px] md:text-xs font-bold tracking-wider uppercase inline-flex backdrop-blur-xs">
                ✨ Curated Cross-Border Fashion for Gen Z
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white leading-[1.08] tracking-tight">
                Too cute,<br className="hidden sm:inline" /> too care?
              </h1>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                Tas trendi pilihan dari produsen terkurasi di China, langsung ke tanganmu. Transparan, harga all-in tanpa hidden fee, dan jaminan full QC fisik.
              </p>

              <div className="flex gap-2.5 sm:gap-3 flex-wrap pt-2">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3.5 py-1.5 border border-white/30 text-white text-xs font-semibold">
                  <span aria-hidden="true">🔍</span>
                  <span>QC Fisik Terverifikasi</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3.5 py-1.5 border border-white/30 text-white text-xs font-semibold">
                  <span aria-hidden="true">📦</span>
                  <span>Pre-Order 14–21 Hari</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3.5 py-1.5 border border-white/30 text-white text-xs font-semibold">
                  <span aria-hidden="true">💸</span>
                  <span>Transparan Tanpa Bea Tambahan</span>
                </div>
              </div>
            </motion.div>

            {/* Right Col: Hero Visual Card (Desktop showcase) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex md:col-span-5 justify-end"
            >
              <div className="relative w-full max-w-sm rounded-3xl bg-white/20 backdrop-blur-xl p-5 border border-white/40 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/30 mb-4 border border-white/30">
                  <img
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"
                    alt="Featured Bag"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#FDFD96] text-[#1A1A1A] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                    ⚡ Just Dropped
                  </span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Trending This Week</p>
                    <p className="text-base font-bold text-white">Mini Bow Quilted Tote</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#FDFD96] bg-black/20 px-3 py-1 rounded-full">
                    Rp 389.000
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Catalog Section ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-6" aria-label="Katalog produk">
        
        {/* Responsive Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#C8C8C8]/30">
          {/* Category Pills */}
          <div
            className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0"
            role="group"
            aria-label="Filter kategori"
          >
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat.id}
                category={cat}
                isActive={activeCategory === cat.id}
                onClick={setActiveCategory}
              />
            ))}
          </div>

          {/* Stock Filter Toggle */}
          <div
            className="flex items-center gap-1 bg-white rounded-xl p-1 border border-[#C8C8C8]/50 shrink-0 self-start md:self-auto shadow-xs"
            role="group"
            aria-label="Filter stok"
          >
            {STOCK_FILTERS.map((f) => (
              <button
                key={f.id}
                id={`stock-filter-${f.id}`}
                onClick={() => setActiveStock(f.id)}
                aria-pressed={activeStock === f.id}
                className={[
                  'px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375]/50',
                  activeStock === f.id
                    ? 'bg-[#C74375] text-white shadow-sm'
                    : 'text-[#888] hover:text-[#1A1A1A]',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#888]">
            Menampilkan <span className="text-[#1A1A1A] font-bold">{filtered.length}</span> koleksi tas
          </p>
        </div>

        {/* Responsive Product Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 items-stretch"
          >
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="h-full flex flex-col"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-3xl border border-[#C8C8C8]/40 p-8">
            <span className="text-5xl" aria-hidden="true">🛍️</span>
            <p className="text-base font-bold text-[#1A1A1A]">Belum ada produk di kategori ini</p>
            <p className="text-xs text-[#888]">Coba pilih kategori lain atau reset filter stok ya!</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
