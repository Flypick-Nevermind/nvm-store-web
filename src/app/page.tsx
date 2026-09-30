'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { ProductCard } from '@/components/molecules/ProductCard';
import { BRAND } from '@/constants/brand';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';
import { useRequestBagModalStore } from '@/store/requestBagModalStore';

export default function HomePage() {
  const openRequestBagModal = useRequestBagModalStore((s) => s.openModal);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const products = MOCK_PRODUCTS;

  const handleHeroCategoryClick = () => {
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
              onClick={handleHeroCategoryClick}
              className="px-4 sm:px-5 py-2 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-2xs"
            >
              <span aria-hidden="true">🌐</span>
              <span>TRENDING IN CHINA</span>
            </button>
            <button
              type="button"
              onClick={handleHeroCategoryClick}
              className="px-4 sm:px-5 py-2 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-2xs"
            >
              <span aria-hidden="true">⭐️</span>
              <span>Y2K FINDS</span>
            </button>
            <button
              type="button"
              onClick={handleHeroCategoryClick}
              className="px-4 sm:px-5 py-2 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-2xs"
            >
              <span aria-hidden="true">🤍</span>
              <span>LIMITED DROPS</span>
            </button>
            <button
              type="button"
              onClick={handleHeroCategoryClick}
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
        <div className="flex items-center justify-between pb-2 border-b border-[#E8D5C0]">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#9E1A59] tracking-tight">
              What&apos;s Hot <span className="text-[#9E1A59]">★</span>
            </h2>
            <div className="hidden sm:inline-block bg-[#FFF8E1] text-[#9E1A59] border border-[#EADFCF] px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs transform -rotate-1">
              cute bags better days ♡
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E8D5C0] bg-white text-xs font-bold text-[#9E1A59] hover:bg-[#FFF0F5] transition-all shadow-2xs"
          >
            <span>Lihat Semua</span>
            <span>→</span>
          </Link>
        </div>

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="h-full flex flex-col"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* ── Request a Bag Feature Section ───────────────────── */}
        <section
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-[#E8D5C0] p-5 sm:p-10 my-6 sm:my-8 shadow-xs"
          aria-label="Request tas impian dari China"
        >
          {/* Decorative watermarks */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFF8E1] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9E1A59]/5 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left Col: Copy & Steps */}
            <div className="lg:col-span-7 flex flex-col gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] sm:text-[11px] font-black tracking-widest uppercase border border-[#9E1A59]/20">
                  ✨ JASTIP ON-DEMAND
                </span>
                <span className="text-[11px] sm:text-xs text-[#888] font-semibold">
                  China ➔ Indonesia
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl lg:text-4xl font-display font-black text-[#1A1A1A] tracking-tight leading-tight">
                Belum Menemukan Tas yang Kamu Cari?
              </h3>

              <p className="text-xs sm:text-sm text-[#666] leading-relaxed max-w-xl">
                Nemu tas viral di <strong>TikTok</strong>, <strong>XiaoHongShu (RED)</strong>, <strong>Taobao</strong>, atau <strong>Pinterest</strong>?
                Kirim foto atau linknya ke NEVERMIND! Tim kurasi kami langsung hunting ke supplier China dengan QC fisik, garansi keaslian, dan harga all-in transparan.
              </p>

              {/* 3 Step Process Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1.5 sm:pt-3">
                <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] flex flex-col gap-1">
                  <span className="text-lg sm:text-xl">📸</span>
                  <p className="text-xs font-bold text-[#1A1A1A]">1. Kirim Foto / Link</p>
                  <p className="text-[11px] text-[#777] leading-snug">
                    Screenshot atau copy link tas yang kamu taksir
                  </p>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] flex flex-col gap-1">
                  <span className="text-lg sm:text-xl">🔍</span>
                  <p className="text-xs font-bold text-[#1A1A1A]">2. QC & Cek Harga</p>
                  <p className="text-[11px] text-[#777] leading-snug">
                    Kami carikan supplier terbaik + harga all-in
                  </p>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] flex flex-col gap-1">
                  <span className="text-lg sm:text-xl">🚚</span>
                  <p className="text-xs font-bold text-[#1A1A1A]">3. Kirim ke Rumahmu</p>
                  <p className="text-[11px] text-[#777] leading-snug">
                    Bebas bea cukai, tinggal unboxing santai!
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => openRequestBagModal()}
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#9E1A59] hover:bg-[#7A1244] text-white text-xs font-bold tracking-wide transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>✨</span>
                  <span>Request Tas Sekarang</span>
                </button>
                <a
                  href={`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
                    'Halo Admin NEVERMIND! ✨ Saya mau tanya dan request jastip tas yang belum ada di katalog website. Bisa dibantu? ♡'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat Admin WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Col: Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl sm:rounded-3xl bg-[#FFF8E1] border-2 border-dashed border-[#9E1A59]/30 p-5 sm:p-6 flex flex-col items-center text-center gap-3 sm:gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#9E1A59]/10 text-[#9E1A59] flex items-center justify-center text-3xl shadow-inner">
                  🛍️
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-display font-black text-lg text-[#1A1A1A]">
                    Punya Inspirasi Tas Lain?
                  </p>
                  <p className="text-xs text-[#777]">
                    Ribuan customer sudah request tas favorit mereka dari Taobao & XiaoHongShu lewat kami.
                  </p>
                </div>
                <div className="w-full pt-3 border-t border-[#E8D5C0] flex items-center justify-between text-[11px] font-semibold text-[#888]">
                  <span>⏱️ Respon Cepat &lt; 1 Jam</span>
                  <span className="text-[#1A6B5C] font-bold">✓ Bebas Bea Masuk</span>
                </div>
              </div>
            </div>
          </div>
        </section>

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
