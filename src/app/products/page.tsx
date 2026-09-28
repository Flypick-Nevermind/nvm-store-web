'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { ProductCard } from '@/components/molecules/ProductCard';
import type { CategoryId, StockFilter } from '@/constants/categories';
import { CATEGORIES, STOCK_FILTERS } from '@/constants/categories';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';

export default function AllProductsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [activeStock, setActiveStock] = useState<StockFilter>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('default');

  const filtered = useMemo(() => {
    let result = MOCK_PRODUCTS.filter((p) => {
      const catMatch =
        activeCategory === 'all' ||
        p.category === activeCategory ||
        p.tags.includes(activeCategory);
      const stockMatch = activeStock === 'all' || p.stock_type === activeStock;
      return catMatch && stockMatch;
    });

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price_total - b.price_total);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price_total - a.price_total);
    if (sortBy === 'newest') result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [activeCategory, activeStock, sortBy]);

  return (
    <PageShell>
      {/* ── Breadcrumb Hero Header ──────────────────────────── */}
      <section className="bg-[#FFF8E1] pt-40 pb-10 px-4 text-center border-b border-[#E8D5C0]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#999] mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#9E1A59] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[#1A1A1A]">ALL PRODUCTS</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-5xl sm:text-6xl font-display font-black text-[#1A1A1A] tracking-tight">
            All Products
          </h1>
        </div>
      </section>

      {/* ── Filter + Sort Bar ───────────────────────────────── */}
      <section className="bg-[#FFF8E1] border-b border-[#E8D5C0] sticky top-[7rem] lg:top-[11.25rem] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 flex-1">
          {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={[
                  'shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer border',
                  activeCategory === cat.id
                    ? 'bg-[#9E1A59] text-white border-[#9E1A59] shadow-sm'
                    : 'bg-white text-[#888] border-[#E8D5C0] hover:text-[#9E1A59] hover:border-[#9E1A59] hover:bg-[#FFF8E1]',
                ].join(' ')}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Right: Stock + Sort + Count */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Stock filter */}
            <div className="flex items-center gap-0.5 bg-white rounded-full p-1 border border-[#E8D5C0]">
              {STOCK_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveStock(f.id)}
                  className={[
                    'px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer',
                    activeStock === f.id
                      ? 'bg-[#9E1A59] text-white shadow-sm'
                      : 'text-[#888] hover:text-[#9E1A59] hover:bg-[#FFF8E1]',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="pl-4 pr-8 py-2 text-[11px] font-bold rounded-full border border-[#E8D5C0] bg-white text-[#9E1A59] focus:outline-none focus:border-[#9E1A59] focus:ring-1 focus:ring-[#9E1A59]/20 cursor-pointer appearance-none transition-all"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239E1A59' stroke-width='2.5'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              aria-label="Sort by"
            >
              <option value="default">Sort: Default</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Product Grid ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-label="All products">
        {/* Result count */}
        <p className="text-xs text-[#9E1A59] font-semibold mb-6 tracking-wide">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          {activeCategory !== 'all' ? ` in "${CATEGORIES.find(c => c.id === activeCategory)?.label}"` : ''}
        </p>

        {filtered.length > 0 ? (
          <motion.div
            key={`${activeCategory}-${activeStock}-${sortBy}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-[#FFF8E1] rounded-2xl border border-[#E8D5C0]">
            <span className="text-5xl" aria-hidden="true">🔍</span>
            <p className="font-display font-bold text-lg text-[#1A1A1A]">No products found</p>
            <p className="text-sm text-[#888] max-w-xs">
              Try adjusting your filters or search term to find what you&apos;re looking for.
            </p>
            <button
              type="button"
              onClick={() => { setActiveCategory('all'); setActiveStock('all'); setSortBy('default'); }}
              className="mt-2 px-5 py-2 rounded-full bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </PageShell>
  );
}
