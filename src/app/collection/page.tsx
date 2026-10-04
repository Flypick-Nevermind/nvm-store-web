'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { ProductCard } from '@/components/molecules/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';

interface Collection {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  coverImage: string;
  accentColor: string;
  textColor: string;
  badge: string;
  tags: string[];
}

const COLLECTIONS: Collection[] = [
  {
    id: 'y2k-archive',
    name: 'Y2K Archive',
    subtitle: 'SS 2026',
    description:
      'Nostalgia meets Gen Z energy. Curated dari pasar trendi China — chrome, metalik, dan vibes retro-futuristik yang tidak pernah out of style.',
    coverImage: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200&q=85',
    accentColor: '#9E1A59',
    textColor: '#ffffff',
    badge: 'FEATURED DROP',
    tags: ['y2k', 'chrome', 'metalik'],
  },
  {
    id: 'mini-edit',
    name: 'The Mini Edit',
    subtitle: 'Compact Luxe',
    description:
      'Small bag, big personality. Koleksi tas mini yang compact tapi statement — dari bow detail hingga structured mini tote.',
    coverImage: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    accentColor: '#F2EEEB',
    textColor: '#1A1A1A',
    badge: 'BESTSELLER',
    tags: ['mini', 'bow', 'tote'],
  },
  {
    id: 'chrome-series',
    name: 'Chrome Series',
    subtitle: 'Metallic Mood',
    description:
      'Untuk yang berani tampil beda. Quilted chrome, silver chain, dan finish metalik yang catch light dari segala sudut.',
    coverImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    accentColor: '#C8C8C8',
    textColor: '#1A1A1A',
    badge: 'NEW',
    tags: ['chrome', 'quilted', 'shoulder'],
  },
  {
    id: 'daily-carry',
    name: 'Daily Carry',
    subtitle: 'Everyday Essentials',
    description:
      'Tas yang bisa ikut kamu dari morning class ke after-hours hangout. Versatile, ringan, dan tetap cute sepanjang hari.',
    coverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    accentColor: '#D8FFF7',
    textColor: '#1A1A1A',
    badge: 'EVERYDAY',
    tags: ['tote', 'crossbody'],
  },
  {
    id: 'aqua-drop',
    name: 'Aqua Drop',
    subtitle: 'Fresh Airy Hues',
    description:
      'Koleksi musim panas dengan warna-warna airy — aqua, pastel, dan clean whites yang bikin look terasa segar dan ringan.',
    coverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    accentColor: '#D8FFF7',
    textColor: '#1A1A1A',
    badge: 'SEASONAL',
    tags: ['crossbody', 'jelly', 'aqua'],
  },
  {
    id: 'ribbon-romance',
    name: 'Ribbon & Bows',
    subtitle: 'Coquette Mood',
    description:
      'Aksen pita manis, siluet feminin, dan sentuhan lembut yang viral di kalangan pecinta gaya balletcore dan coquette.',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    accentColor: '#FAF0F3',
    textColor: '#1A1A1A',
    badge: 'TRENDING',
    tags: ['bow', 'ribbon', 'velvet'],
  },
];

export default function CollectionPage() {
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  const collectionProducts = activeCollection
    ? MOCK_PRODUCTS.filter((p) =>
        activeCollection.tags.some(
          (tag) => p.tags.includes(tag) || p.category.includes(tag),
        ),
      )
    : [];

  const displayProducts =
    activeCollection && collectionProducts.length === 0 ? MOCK_PRODUCTS.slice(0, 4) : collectionProducts;

  return (
    <PageShell>
      <AnimatePresence mode="wait">
        {/* ── Collection Grid ──────────────────────────────── */}
        {!activeCollection && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 sm:mb-10 border-b border-[#E8D5C0]/80 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] sm:text-[11px] font-black tracking-widest uppercase border border-[#9E1A59]/20">
                      ✨ THEMATIC DROPS
                    </span>
                    <span className="text-xs font-semibold text-[#888]">
                      • {COLLECTIONS.length} Curated Collections
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#1A1A1A] tracking-tight">
                    Koleksi Pilihan
                  </h1>
                  <p className="text-xs sm:text-sm text-[#666] mt-2 max-w-xl leading-relaxed">
                    Eksplorasi tas impor kurasi NEVERMIND berdasarkan estetika tren viral, gaya personal, dan momen spesialmu.
                  </p>
                </div>
              </div>

              {/* Collections Grid — 3 Column Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {COLLECTIONS.map((col, i) => (
                  <motion.button
                    key={col.id}
                    type="button"
                    onClick={() => setActiveCollection(col)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="relative rounded-3xl overflow-hidden cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E1A59] shadow-md hover:shadow-xl transition-all duration-300"
                    style={{ aspectRatio: '4/5' }}
                    aria-label={`Lihat koleksi ${col.name}`}
                  >
                    <Image
                      src={col.coverImage}
                      alt={col.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7 text-white">
                      {/* Badge top-left */}
                      <span className="self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black tracking-widest uppercase border border-white/25 shadow-xs">
                        {col.badge}
                      </span>

                      {/* Name bottom */}
                      <div>
                        <p className="text-[11px] font-bold tracking-widest uppercase text-white/70 mb-1">
                          {col.subtitle}
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight">
                          {col.name}
                        </h2>
                        <p className="text-xs text-white/80 mt-2 leading-relaxed line-clamp-2">
                          {col.description}
                        </p>
                        <span className="inline-flex items-center gap-2 mt-4 text-xs font-bold tracking-widest uppercase text-[#FDFD96] group-hover:gap-3 transition-all">
                          EXPLORE COLLECTION
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* ── Products in Selected Collection ──────────────── */}
        {activeCollection && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Sleek Minimalist Toolbar */}
              <div className="flex items-center justify-between py-3 mb-6 border-b border-[#E8D5C0]/80">
                <button
                  type="button"
                  onClick={() => setActiveCollection(null)}
                  className="flex items-center gap-2 text-xs font-bold text-[#9E1A59] hover:text-[#7A1244] transition-colors cursor-pointer group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Semua Koleksi</span>
                  <span className="text-[#888] font-normal">/</span>
                  <span className="text-[#1A1A1A]">{activeCollection.name}</span>
                </button>
                <p className="text-xs font-bold text-[#8A7880] uppercase tracking-widest">
                  {displayProducts.length} Products
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
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
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
