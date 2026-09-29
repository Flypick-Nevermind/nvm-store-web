'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { ProductCard } from '@/components/molecules/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';

export default function AllProductsPage() {
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('default');

  const filtered = useMemo(() => {
    const result = [...MOCK_PRODUCTS];

    if (sortBy === 'price-asc') result.sort((a, b) => a.price_total - b.price_total);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price_total - a.price_total);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [sortBy]);

  return (
    <PageShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label="All products">
        {/* Sleek Minimalist Toolbar */}
        <div className="flex items-center justify-between py-3.5 mb-8 border-b border-[#E8D5C0]/80">
          <p className="text-xs font-bold text-[#8A7880] uppercase tracking-widest">
            {filtered.length} Products
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#888] hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] hover:border-[#9E1A59] focus:outline-none focus:border-[#9E1A59] transition-all cursor-pointer shadow-xs appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239E1A59' stroke-width='2.5'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
              aria-label="Sort by"
            >
              <option value="default">Default</option>
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga: Low → High</option>
              <option value="price-desc">Harga: High → Low</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <motion.div
            key={sortBy}
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
              onClick={() => setSortBy('default')}
              className="mt-2 px-5 py-2 rounded-full bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-colors cursor-pointer"
            >
              Reset Sorting
            </button>
          </div>
        )}
      </section>
    </PageShell>
  );
}
