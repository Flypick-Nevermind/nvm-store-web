'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { ProductCard } from '@/components/molecules/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';
import type { Product } from '@/types/api';

interface BagCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  tag: string;
  count: number;
}

const BAG_CATEGORIES: BagCategory[] = [
  {
    id: 'tote',
    name: 'Tote Bag',
    description: 'Spacious & stylish everyday carry',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    tag: 'tote',
    count: 0,
  },
  {
    id: 'shoulder',
    name: 'Shoulder Bag',
    description: 'Classic silhouette, modern edge',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    tag: 'shoulder',
    count: 0,
  },
  {
    id: 'crossbody',
    name: 'Crossbody Bag',
    description: 'Hands-free & effortlessly cute',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    tag: 'crossbody',
    count: 0,
  },
  {
    id: 'mini',
    name: 'Mini Bag',
    description: 'Small bag, big statement',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    tag: 'mini',
    count: 0,
  },
  {
    id: 'y2k',
    name: 'Y2K Collection',
    description: 'Retro-futuristic vibes, Gen Z approved',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    tag: 'y2k',
    count: 0,
  },
  {
    id: 'new-drop',
    name: 'New Drop',
    description: 'Fresh from China, just landed',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    tag: 'new-drop',
    count: 0,
  },
];

export default function CategoryPage() {
  const [activeCategory, setActiveCategory] = useState<BagCategory | null>(null);

  const filteredProducts: Product[] = activeCategory
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.tags.includes(activeCategory.tag) ||
          p.category.includes(activeCategory.tag) ||
          p.name.toLowerCase().includes(activeCategory.tag),
      )
    : [];

  // fallback: show all if no tag matches
  const displayProducts =
    activeCategory && filteredProducts.length === 0 ? MOCK_PRODUCTS : filteredProducts;

  return (
    <PageShell>
      {/* ── Category Cards Grid ─────────────────────────────── */}
      {!activeCategory && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label="Kategori produk">
          {/* Sleek Minimalist Toolbar */}
          <div className="flex items-center justify-between py-3.5 mb-8 border-b border-[#E8D5C0]/80">
            <p className="text-xs font-bold text-[#8A7880] uppercase tracking-widest">
              {BAG_CATEGORIES.length} Categories
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {BAG_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="relative group overflow-hidden cursor-pointer text-left aspect-[3/4] rounded-2xl border border-[#E8D5C0]/60 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E1A59]"
                aria-label={`Lihat kategori ${cat.name}`}
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

                {/* Brand tint overlay on hover */}
                <div className="absolute inset-0 bg-[#9E1A59]/0 group-hover:bg-[#9E1A59]/15 transition-all duration-300" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/70 mb-1 group-hover:text-[#FDFD96] transition-colors">
                    NEVERMIND
                  </p>
                  <h2 className="text-lg sm:text-2xl font-display font-black leading-tight tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-white/75 mt-1 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 line-clamp-1">
                    {cat.description} →
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Products in Selected Category ───────────────────── */}
      {activeCategory && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" aria-label={`Produk ${activeCategory.name}`}>
          {/* Sleek Minimalist Toolbar */}
          <div className="flex items-center justify-between py-3 mb-6 border-b border-[#E8D5C0]/80">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-2 text-xs font-bold text-[#9E1A59] hover:text-[#7A1244] transition-colors cursor-pointer group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Semua Kategori</span>
              <span className="text-[#888] font-normal">/</span>
              <span className="text-[#1A1A1A]">{activeCategory.name}</span>
            </button>

            <span className="text-xs font-bold text-[#8A7880] uppercase tracking-widest">
              {displayProducts.length} Products
            </span>
          </div>

          {/* Product Grid */}
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
          >
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </PageShell>
  );
}
