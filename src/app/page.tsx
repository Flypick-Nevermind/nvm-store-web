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
        className="relative overflow-hidden bg-gradient-to-br from-[#C74375] via-[#E8688F] to-[#FDFD96] px-4 pt-10 pb-12"
        aria-label="Hero banner"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-16 translate-x-16 blur-2xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#FDFD96]/20 translate-y-8 -translate-x-8 blur-xl" aria-hidden="true" />

        <div className="relative max-w-md mx-auto flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="pill-tag bg-white/20 text-white border border-white/30 text-[11px] font-bold tracking-wider uppercase mb-3 inline-flex">
              ✨ Curated for Gen Z
            </span>
            <h1 className="text-3xl font-display font-black text-white leading-tight mb-2">
              Too cute,<br />too care?
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-[260px]">
              Tas trendi dari China, langsung ke tanganmu. Transparan, no hidden fees, full QC.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex gap-3 flex-wrap"
          >
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/25">
              <span aria-hidden="true">🔍</span>
              <span className="text-white text-xs font-semibold">QC Fisik Terverifikasi</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/25">
              <span aria-hidden="true">📦</span>
              <span className="text-white text-xs font-semibold">Pre-Order 2–3 Minggu</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Catalog Section ─────────────────────────────────── */}
      <section className="max-w-md mx-auto px-4 py-6 flex flex-col gap-5" aria-label="Katalog produk">

        {/* Category Pills */}
        <div
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4"
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
          className="flex items-center gap-1 bg-white rounded-xl p-1 border border-[#C8C8C8]/50"
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
                'flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150',
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

        {/* Result count */}
        <p className="text-xs text-[#888] -mt-2">
          {filtered.length} produk ditemukan
        </p>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 gap-3"
          >
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <span className="text-5xl" aria-hidden="true">🛍️</span>
            <p className="text-sm font-semibold text-[#444]">Belum ada produk di sini</p>
            <p className="text-xs text-[#888]">Coba filter lain atau check back lagi ya!</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
