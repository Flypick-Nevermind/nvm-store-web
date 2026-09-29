'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { CategoryPill } from '@/components/molecules/CategoryPill';
import { ProductCard } from '@/components/molecules/ProductCard';
import type { CategoryId, StockFilter } from '@/constants/categories';
import { CATEGORIES, STOCK_FILTERS } from '@/constants/categories';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [activeStock, setActiveStock] = useState<StockFilter>('all');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const catMatch =
        activeCategory === 'all' ||
        p.category === activeCategory ||
        p.tags.includes(activeCategory);
      const stockMatch = activeStock === 'all' || p.stock_type === activeStock;
      return catMatch && stockMatch;
    });
  }, [activeCategory, activeStock]);

  const handleHeroCategoryClick = (catId: CategoryId) => {
    setActiveCategory(catId);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput('');
      setTimeout(() => setEmailSubscribed(false), 3000);
    }
  };

  return (
    <PageShell>
      {/* ── Hero Banner (Mockup Y2K Berry Magenta) ──────────── */}
      <section
        className="relative overflow-hidden bg-[#9E1A59] text-white py-12 md:py-16 px-4"
        aria-label="Hero banner"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Hero Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 flex flex-col items-start gap-4"
            >
              {/* Route Pill: CHINA → INDONESIA */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/60 bg-transparent text-white text-[11px] font-bold tracking-widest uppercase backdrop-blur-xs">
                <span>CHINA</span>
                <span className="text-white/80">➔</span>
                <span>INDONESIA</span>
                <span className="text-xs">☆</span>
              </div>

              {/* Main Liquid Chrome Title */}
              <div className="relative">
                <h1
                  className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight leading-none select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #E8E8E8 50%, #C0C0C0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  NEVERMIND<span className="text-2xl sm:text-4xl align-top opacity-90">®</span>
                </h1>
                <span
                  className="absolute -top-3 -right-6 text-xl sm:text-2xl text-white/90 animate-pulse"
                  aria-hidden="true"
                >
                  ✧
                </span>
                <span
                  className="absolute -bottom-2 -left-4 text-lg text-white/70"
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-white/95 text-lg sm:text-2xl font-medium italic tracking-wide font-serif max-w-xl">
                The first Gen Z jastip for China&apos;s trendiest bags.
              </p>

              {/* Slanted Tape / Sticker */}
              <div className="inline-block transform -rotate-2 hover:rotate-0 transition-transform duration-200 mt-1">
                <div className="bg-[#FFF8E1] text-[#9E1A59] px-4 py-1.5 rounded-lg shadow-md border border-[#EADFCF] font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                  <span>too cute, too care</span>
                  <span className="text-base leading-none">♡</span>
                </div>
              </div>
            </motion.div>

            {/* Right Col: Hero Visual Receipt Showcase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-sm">
                {/* Vintage Receipt Card */}
                <div className="bg-[#FFF8E1] text-[#1A1A1A] p-5 sm:p-6 rounded-3xl shadow-2xl border border-[#E5DACB] transform rotate-2 hover:rotate-0 transition-transform duration-300 relative overflow-hidden">
                  {/* Chrome metallic 4-point star accent */}
                  <div
                    className="absolute top-3 right-3 text-2xl text-[#C8C8C8] select-none"
                    aria-hidden="true"
                  >
                    ✦
                  </div>

                  <div className="flex flex-col gap-1 pb-3 border-b border-[#E5DACB]/80">
                    <p className="font-display font-black text-xs tracking-widest text-[#9E1A59] uppercase">
                      NEVERMIND
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#555]">
                      Trending Bags From China
                    </p>
                    <span className="text-[10px] text-[#888] font-mono">NEW DROP •••••</span>
                  </div>

                  {/* Showcase Product Image */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden my-3 bg-[#FAF0F3] border border-[#E8D5C0]">
                    <Image
                      src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"
                      alt="Featured trending China bag"
                      fill
                      sizes="380px"
                      className="object-cover"
                      priority
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#9E1A59] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                      Hot Pick
                    </span>
                  </div>

                  {/* Barcode & smiley footer */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs tracking-widest text-[#666]">
                        |||||||||||||||||||
                      </span>
                      <span className="text-[9px] text-[#999] font-mono">#NVMD-2026-DROP</span>
                    </div>
                    <span className="text-xl text-[#9E1A59]" aria-hidden="true">
                      ☺
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── 4 Oval Category Pills across Bottom of Hero ── */}
          <div className="pt-10 md:pt-14 flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleHeroCategoryClick('trending-now')}
              className="px-4 sm:px-5 py-2 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-2xs"
            >
              <span aria-hidden="true">🌐</span>
              <span>TRENDING IN CHINA</span>
            </button>
            <button
              type="button"
              onClick={() => handleHeroCategoryClick('y2k-core')}
              className="px-4 sm:px-5 py-2 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-2xs"
            >
              <span aria-hidden="true">⭐️</span>
              <span>Y2K FINDS</span>
            </button>
            <button
              type="button"
              onClick={() => handleHeroCategoryClick('just-dropped')}
              className="px-4 sm:px-5 py-2 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-2xs"
            >
              <span aria-hidden="true">🤍</span>
              <span>LIMITED DROPS</span>
            </button>
            <button
              type="button"
              onClick={() => handleHeroCategoryClick('cute-finds')}
              className="px-4 sm:px-5 py-2 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-2xs"
            >
              <span aria-hidden="true">✈️</span>
              <span>FROM CHINA, WITH LOVE</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Catalog Section ("What's Hot ★") ─────────────────── */}
      <section
        id="catalog-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex flex-col gap-6"
        aria-label="Katalog produk"
      >
        {/* Section Header matching mockup "What's Hot ★" */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E8D5C0]">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#9E1A59] tracking-tight">
              What&apos;s Hot <span className="text-[#9E1A59]">★</span>
            </h2>
            <div className="hidden sm:inline-block bg-[#FFF8E1] text-[#9E1A59] border border-[#EADFCF] px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs transform -rotate-1">
              cute bags better days ♡
            </div>
          </div>

          {/* Stock Filter Toggle */}
          <div
            className="flex items-center gap-1 bg-white rounded-xl p-1 border border-[#E8D5C0] shrink-0 self-start sm:self-auto shadow-2xs"
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
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E1A59]/50',
                  activeStock === f.id
                    ? 'bg-[#9E1A59] text-white shadow-xs'
                    : 'text-[#8A7880] hover:text-[#1A1A1A]',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0"
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

        {/* Result count */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#8A7880]">
            Menampilkan <span className="text-[#1A1A1A] font-bold">{filtered.length}</span> koleksi
            tas pilihan
          </p>
        </div>

        {/* Responsive Product Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch"
          >
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="h-full flex flex-col"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-3xl border border-[#E8D5C0] p-8">
            <span className="text-5xl" aria-hidden="true">
              🛍️
            </span>
            <p className="text-base font-bold text-[#1A1A1A]">Belum ada produk di kategori ini</p>
            <p className="text-xs text-[#8A7880]">
              Coba pilih kategori lain atau reset filter stok ya!
            </p>
          </div>
        )}

        {/* ── Community Receipt Banner ("Bag today, icon tomorrow") ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#9E1A59] via-[#A81E52] to-[#8E1744] text-white p-6 sm:p-10 my-8 shadow-xl border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 flex flex-col gap-2">
              <span className="text-xs text-white/80 uppercase tracking-widest font-mono">
                NEVERMIND CLUB ✦
              </span>
              <h3 className="text-2xl sm:text-4xl font-display font-black text-white italic tracking-tight leading-snug">
                Bag today,
                <br />
                icon tomorrow ♡
              </h3>
              <p className="text-white/85 text-xs sm:text-sm max-w-sm mt-1">
                Dapatkan notifikasi drop tas terbaru dari China dan voucher eksklusif langsung ke
                emailmu.
              </p>
            </div>

            {/* Right Receipt Paper Card */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="bg-[#FFF8E1] text-[#1A1A1A] p-5 sm:p-6 rounded-2xl shadow-xl border border-[#E5DACB] max-w-sm w-full relative">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5DACB]">
                  <p className="font-display font-black text-xs tracking-wider uppercase text-[#9E1A59]">
                    JOIN OUR COMMUNITY
                  </p>
                  <span className="text-sm text-[#9E1A59]">♡</span>
                </div>
                <p className="text-xs text-[#666] mt-2 mb-3">
                  Be the first to know about new drops, exclusive offers and more!
                </p>

                <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 bg-white border border-[#E5DACB] rounded-full px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#9E1A59]"
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-full bg-[#9E1A59] hover:bg-[#7A1244] text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                    aria-label="Submit email"
                  >
                    ➔
                  </button>
                </form>

                {emailSubscribed && (
                  <p className="text-[11px] font-bold text-[#1A6B5C] mt-2">
                    ✓ Terima kasih! Kamu sudah terdaftar.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
