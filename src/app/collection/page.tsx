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
  featured?: boolean;
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
    featured: true,
  },
  {
    id: 'mini-edit',
    name: 'The Mini Edit',
    subtitle: 'Compact Luxe',
    description:
      'Small bag, big personality. Koleksi tas mini yang compact tapi statement — dari bow detail hingga structured mini tote.',
    coverImage: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    accentColor: '#FFF8E1',
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
];

export default function CollectionPage() {
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  const featured = COLLECTIONS.find((c) => c.featured);
  const rest = COLLECTIONS.filter((c) => !c.featured);

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
      {/* ── Breadcrumb Header ───────────────────────────────── */}
      <section className="bg-[#FFF8E1] pt-40 pb-10 px-4 text-center border-b border-[#E8D5C0]">
        <div className="max-w-7xl mx-auto">
          <nav
            className="flex items-center justify-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#999] mb-4"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-[#9E1A59] transition-colors">
              HOME
            </Link>
            <span>/</span>
            {activeCollection ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveCollection(null)}
                  className="hover:text-[#9E1A59] transition-colors cursor-pointer"
                >
                  COLLECTION
                </button>
                <span>/</span>
                <span className="text-[#1A1A1A]">{activeCollection.name.toUpperCase()}</span>
              </>
            ) : (
              <span className="text-[#1A1A1A]">COLLECTION</span>
            )}
          </nav>
          <h1 className="text-5xl sm:text-6xl font-display font-black text-[#1A1A1A] tracking-tight">
            {activeCollection ? activeCollection.name : 'Collections'}
          </h1>
          {activeCollection && (
            <p className="mt-2 text-sm text-[#888] font-medium">{activeCollection.subtitle}</p>
          )}
        </div>
      </section>

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
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Featured Collection — Full width hero card */}
              {featured && (
                <motion.button
                  type="button"
                  onClick={() => setActiveCollection(featured)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full rounded-3xl overflow-hidden cursor-pointer group mb-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E1A59]"
                  style={{ aspectRatio: '21/8' }}
                  aria-label={`Lihat koleksi ${featured.name}`}
                >
                  <Image
                    src={featured.coverImage}
                    alt={featured.name}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 text-white">
                    <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#9E1A59] text-[10px] font-black tracking-widest uppercase self-start">
                      {featured.badge}
                    </span>
                    <p className="text-xs font-bold tracking-widest uppercase text-white/60 mb-1">
                      {featured.subtitle}
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight mb-2">
                      {featured.name}
                    </h2>
                    <p className="text-sm text-white/80 max-w-md mb-4 leading-relaxed">
                      {featured.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/90 group-hover:gap-3 transition-all">
                      EXPLORE COLLECTION
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </motion.button>
              )}

              {/* Rest — 2-col then 3-col grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rest.map((col, i) => (
                  <motion.button
                    key={col.id}
                    type="button"
                    onClick={() => setActiveCollection(col)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E1A59]"
                    style={{ aspectRatio: '3/4' }}
                    aria-label={`Lihat koleksi ${col.name}`}
                  >
                    <Image
                      src={col.coverImage}
                      alt={col.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-all duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                      {/* Badge top-left */}
                      <span className="self-start px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] font-black tracking-widest uppercase border border-white/20">
                        {col.badge}
                      </span>

                      {/* Name bottom */}
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-0.5">
                          {col.subtitle}
                        </p>
                        <h2 className="text-lg sm:text-xl font-display font-black tracking-tight leading-tight">
                          {col.name}
                        </h2>
                        <p className="text-[11px] text-white/70 mt-1.5 leading-snug opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 line-clamp-2">
                          {col.description}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          SHOP NOW →
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
            {/* Collection hero strip */}
            <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
              <Image
                src={activeCollection.coverImage}
                alt={activeCollection.name}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/80 text-sm font-medium italic">
                  {activeCollection.description}
                </p>
              </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setActiveCollection(null)}
                  className="flex items-center gap-2 text-xs font-bold text-[#9E1A59] hover:text-[#7A1244] transition-colors cursor-pointer group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  All Collections
                </button>
                <p className="text-xs text-[#9E1A59] font-semibold">
                  {displayProducts.length} products
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
