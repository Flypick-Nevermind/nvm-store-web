'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { PageShell } from '@/components/layouts/PageShell';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';
import { formatIDR } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/api';

interface FlashSaleDeal {
  productId: string;
  flashPrice: number;
  discountPercent: number;
  stockTotal: number;
  stockClaimed: number;
  isMegaDeal?: boolean;
}

const FLASH_DEALS: Record<string, FlashSaleDeal> = {
  'prod-002': {
    productId: 'prod-002',
    flashPrice: 239000,
    discountPercent: 23,
    stockTotal: 25,
    stockClaimed: 22,
    isMegaDeal: true,
  },
  'prod-001': {
    productId: 'prod-001',
    flashPrice: 189000,
    discountPercent: 21,
    stockTotal: 30,
    stockClaimed: 26,
  },
  'prod-003': {
    productId: 'prod-003',
    flashPrice: 129000,
    discountPercent: 28,
    stockTotal: 20,
    stockClaimed: 13,
  },
  'prod-004': {
    productId: 'prod-004',
    flashPrice: 159000,
    discountPercent: 24,
    stockTotal: 25,
    stockClaimed: 21,
  },
  'prod-005': {
    productId: 'prod-005',
    flashPrice: 199000,
    discountPercent: 21,
    stockTotal: 20,
    stockClaimed: 20,
  },
  'prod-006': {
    productId: 'prod-006',
    flashPrice: 219000,
    discountPercent: 20,
    stockTotal: 20,
    stockClaimed: 12,
  },
};

type SessionSlot = 'active' | 'upcoming-1' | 'upcoming-2';

export default function FlashSalePage() {
  const [activeSession, setActiveSession] = useState<SessionSlot>('active');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Dynamic ticking countdown timer (e.g. 6h 48m 22s remaining in session)
  const [secondsRemaining, setSecondsRemaining] = useState(24522);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent, product: Product, dealPrice: number) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: dealPrice,
      quantity: 1,
      type: product.stock_type,
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  // Find Mega Deal
  const megaDealProduct = useMemo(() => {
    return MOCK_PRODUCTS.find((p) => FLASH_DEALS[p.id]?.isMegaDeal);
  }, []);

  const megaDealMeta = megaDealProduct ? FLASH_DEALS[megaDealProduct.id] : null;

  return (
    <PageShell>
      {/* ── Breadcrumb Hero Header ──────────────────────────── */}
      <section className="bg-[#FFF8E1] pt-40 pb-12 px-4 text-center border-b border-[#E8D5C0]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav
            className="flex items-center justify-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#999] mb-4"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-[#9E1A59] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[#1A1A1A]">FLASH SALE</span>
          </nav>

          {/* Flash Sale Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9E1A59] text-white text-[11px] font-black tracking-widest uppercase mb-3 shadow-xs">
            <span>⚡</span> LIMITED TIME DROP • UP TO 30% OFF
          </div>

          <h1 className="text-5xl sm:text-6xl font-display font-black text-[#1A1A1A] tracking-tight">
            Flash Sale
          </h1>
          <p className="mt-3 text-sm text-[#777] max-w-xl mx-auto font-medium leading-relaxed">
            Promo harga spesial jastip tas viral pilihan dengan stok sangat terbatas. Harga akan
            kembali normal setelah sesi timer berakhir!
          </p>

          {/* Live Countdown Clock */}
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-3 bg-white px-6 py-4 rounded-3xl border border-[#E8D5C0] shadow-sm">
            <span className="text-xs font-black text-[#9E1A59] uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              BERAKHIR DALAM:
            </span>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="w-12 h-11 bg-[#1A1A1A] text-[#FDFD96] rounded-xl flex items-center justify-center text-xl font-display font-black shadow-inner">
                  {pad(hours)}
                </span>
                <span className="text-[9px] font-bold text-[#888] uppercase mt-1">Jam</span>
              </div>
              <span className="text-xl font-black text-[#1A1A1A] -translate-y-2">:</span>

              <div className="flex flex-col items-center">
                <span className="w-12 h-11 bg-[#1A1A1A] text-[#FDFD96] rounded-xl flex items-center justify-center text-xl font-display font-black shadow-inner">
                  {pad(minutes)}
                </span>
                <span className="text-[9px] font-bold text-[#888] uppercase mt-1">Menit</span>
              </div>
              <span className="text-xl font-black text-[#1A1A1A] -translate-y-2">:</span>

              <div className="flex flex-col items-center">
                <span className="w-12 h-11 bg-[#9E1A59] text-white rounded-xl flex items-center justify-center text-xl font-display font-black shadow-inner">
                  {pad(seconds)}
                </span>
                <span className="text-[9px] font-bold text-[#888] uppercase mt-1">Detik</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Flash Sale Time Session Tabs ────────────────────── */}
      <section className="bg-white border-b border-[#E8D5C0] sticky top-[7rem] lg:top-[11.25rem] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl mx-auto grid grid-cols-3 gap-1.5 sm:gap-3 py-2.5 sm:py-3">
            {[
              { id: 'active', label: '12:00 - 18:00', status: 'Sedang Berlangsung', icon: '⚡' },
              { id: 'upcoming-1', label: '18:00 - 21:00', status: 'Segera Hadir', icon: '⏰' },
              { id: 'upcoming-2', label: '21:00 - 00:00', status: 'Malam Nanti', icon: '🌙' },
            ].map((tab) => {
              const isSelected = activeSession === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSession(tab.id as SessionSlot)}
                  className={[
                    'w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all cursor-pointer border text-center sm:text-left min-w-0',
                    isSelected
                      ? 'bg-[#9E1A59] text-white border-[#9E1A59] shadow-sm ring-2 ring-[#9E1A59]/20'
                      : 'bg-[#FFF8E1] text-[#666] border-[#E8D5C0] hover:text-[#9E1A59] hover:bg-white',
                  ].join(' ')}
                >
                  <span className="text-sm sm:text-base shrink-0">{tab.icon}</span>
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <span className="text-[10px] sm:text-xs font-bold leading-tight tracking-tight sm:tracking-wide truncate">
                      {tab.label}
                    </span>
                    <span
                      className={[
                        'text-[8.5px] sm:text-[10px] font-medium leading-none mt-0.5 truncate',
                        isSelected ? 'text-[#FDFD96]' : 'text-[#888]',
                      ].join(' ')}
                    >
                      {tab.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mega Deal Highlight Section ─────────────────────── */}
      {megaDealProduct && megaDealMeta && activeSession === 'active' && (
        <section className="bg-[#9E1A59] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#7A1244] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border-2 border-[#FDFD96] flex flex-col lg:flex-row items-center gap-8">
              {/* Product Image */}
              <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF0F3] shrink-0">
                <Image
                  src={megaDealProduct.images[0]}
                  alt={megaDealProduct.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#9E1A59] text-white text-xs font-black tracking-wider uppercase shadow-md">
                    ⚡ MEGA DEAL -{megaDealMeta.discountPercent}%
                  </span>
                  <Badge variant={megaDealProduct.stock_type === 'pre-order' ? 'yellow' : 'aqua'}>
                    {megaDealProduct.stock_type === 'pre-order' ? '⏳ Pre-Order' : '✅ Ready Stock'}
                  </Badge>
                </div>
              </div>

              {/* Deal Details */}
              <div className="flex flex-col flex-1 w-full">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#9E1A59] mb-1">
                  ⭐ DEALS OF THE HOUR
                </span>
                <Link href={`/products/${megaDealProduct.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] hover:text-[#9E1A59] transition-colors leading-tight mb-2">
                    {megaDealProduct.name}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-[#666] leading-relaxed mb-6">
                  {megaDealProduct.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-[#9E1A59]">
                    {formatIDR(megaDealMeta.flashPrice)}
                  </span>
                  <span className="text-base sm:text-lg text-[#888] line-through font-semibold">
                    {formatIDR(megaDealProduct.price_total)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FDFD96] text-[#7A1244] text-xs font-black">
                    HEMAT {formatIDR(megaDealProduct.price_total - megaDealMeta.flashPrice)}
                  </span>
                </div>

                {/* Stock Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#9E1A59]">
                      🔥 Terjual {megaDealMeta.stockClaimed} dari {megaDealMeta.stockTotal} pcs
                    </span>
                    <span className="text-[#888]">
                      Sisa {megaDealMeta.stockTotal - megaDealMeta.stockClaimed} pcs lagi!
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#FAF0F3] overflow-hidden p-0.5 border border-[#E8D5C0]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#9E1A59] to-[#C23070] transition-all duration-500"
                      style={{
                        width: `${(megaDealMeta.stockClaimed / megaDealMeta.stockTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, megaDealProduct, megaDealMeta.flashPrice)}
                    className={[
                      'flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all cursor-pointer shadow-md text-center',
                      addedProductId === megaDealProduct.id
                        ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                        : 'bg-[#9E1A59] text-white hover:bg-[#7A1244]',
                    ].join(' ')}
                  >
                    {addedProductId === megaDealProduct.id
                      ? '✓ Berhasil Ditambahkan!'
                      : '⚡ Beli Sekarang dengan Harga Flash'}
                  </button>

                  <Link
                    href={`/products/${megaDealProduct.slug}`}
                    className="px-5 py-3.5 rounded-2xl text-xs font-bold border border-[#E8D5C0] text-[#1A1A1A] hover:bg-[#FFF8E1] transition-colors"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Flash Deals Grid ────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        aria-label="Katalog flash sale"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] tracking-tight">
              {activeSession === 'active' ? 'Semua Promo Flash Sale' : 'Preview Sesi Mendatang'}
            </h2>
            <p className="text-xs text-[#888] mt-1">
              {activeSession === 'active'
                ? 'Stok berkurang secara real-time. Checkout sebelum kehabisan!'
                : 'Pasang pengingat agar tidak ketinggalan saat sesi dimulai.'}
            </p>
          </div>
        </div>

        {activeSession === 'active' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {MOCK_PRODUCTS.map((product, i) => {
              const deal = FLASH_DEALS[product.id];
              const flashPrice = deal?.flashPrice ?? product.price_total;
              const discountPercent = deal?.discountPercent ?? 20;
              const stockTotal = deal?.stockTotal ?? 20;
              const stockClaimed = deal?.stockClaimed ?? 15;
              const isSoldOut = product.stock_type === 'sold-out' || stockClaimed >= stockTotal;
              const percentClaimed = Math.min(100, Math.round((stockClaimed / stockTotal) * 100));

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex flex-col h-full group"
                >
                  <article
                    className="flex flex-col h-full relative rounded-[1.25rem] overflow-hidden bg-white border border-[#E8D5C0] cursor-pointer hover:shadow-lg transition-all duration-300"
                    style={{ boxShadow: '0 2px 16px 0 rgba(184,38,94,0.06)' }}
                  >
                    {/* Image with 3:4 ratio */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF0F3] shrink-0">
                      <Link href={`/products/${product.slug}`} className="block w-full h-full">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className={[
                            'object-cover transition-transform duration-500 group-hover:scale-105',
                            isSoldOut ? 'grayscale-[25%] opacity-85' : '',
                          ].join(' ')}
                        />
                      </Link>

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
                        <span className="px-2.5 py-1 rounded-full bg-[#9E1A59] text-white text-[10px] font-black tracking-wider shadow-sm">
                          -{discountPercent}%
                        </span>
                        <Badge
                          variant={
                            isSoldOut
                              ? 'sold-out'
                              : product.stock_type === 'pre-order'
                                ? 'yellow'
                                : 'aqua'
                          }
                        >
                          {isSoldOut
                            ? '❌ Sold Out'
                            : product.stock_type === 'pre-order'
                              ? '⏳ PO'
                              : '✅ Ready'}
                        </Badge>
                      </div>

                      {/* Sold Out Visual Overlay */}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-5">
                          <span className="px-3 py-1 rounded-full bg-black/85 text-white text-[10px] font-black tracking-widest uppercase border border-white/30 shadow-md">
                            SOLD OUT
                          </span>
                        </div>
                      )}

                      {/* Quick Add overlay button */}
                      <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        {isSoldOut ? (
                          <div className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#1A1A1A]/85 text-white/90 backdrop-blur-xs border border-white/20 shadow-sm">
                            Habis Terjual
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product, flashPrice)}
                            className={[
                              'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-md',
                              addedProductId === product.id
                                ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                                : 'bg-[#9E1A59] text-white hover:bg-[#7A1244]',
                            ].join(' ')}
                          >
                            {addedProductId === product.id ? '✓ Ditambahkan!' : '+ Ambil Promo'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
                      <div>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2 hover:text-[#9E1A59] transition-colors min-h-[2.5rem]">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 mt-1.5">
                          <span className="text-[#9E1A59] font-black text-sm sm:text-base">
                            {formatIDR(flashPrice)}
                          </span>
                          <span className="text-[11px] text-[#888] line-through font-medium">
                            {formatIDR(product.price_total)}
                          </span>
                        </div>
                      </div>

                      {/* Stock Bar */}
                      <div className="mt-auto pt-2 border-t border-[#E8D5C0]/60">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#666] mb-1">
                          <span>
                            {isSoldOut ? '❌ Habis terjual' : `🔥 Terjual ${percentClaimed}%`}
                          </span>
                          <span>{isSoldOut ? '0 pcs' : `Sisa ${stockTotal - stockClaimed}`}</span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-[#FAF0F3] overflow-hidden border border-[#E8D5C0]/60">
                          <div
                            className={[
                              'h-full rounded-full transition-all duration-300',
                              isSoldOut
                                ? 'bg-gray-400'
                                : 'bg-gradient-to-r from-[#9E1A59] to-[#C23070]',
                            ].join(' ')}
                            style={{ width: `${percentClaimed}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Upcoming Session Preview */
          <div className="bg-[#FFF8E1] rounded-3xl p-8 sm:p-12 border border-[#E8D5C0] text-center max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-5xl mb-4">⏰</span>
            <h3 className="text-2xl font-display font-black text-[#1A1A1A] mb-2">
              Sesi Flash Sale Belum Dimulai
            </h3>
            <p className="text-sm text-[#777] leading-relaxed mb-6">
              Sesi ini akan menghadirkan diskon ekstra hingga 35% untuk koleksi Y2K & Mini Bag
              terpopuler. Jangan sampai kehabisan kuota saat flash sale dibuka!
            </p>
            <a
              href={`https://wa.me/6281234567890?text=Halo+Nevermind,+tolong+ingatkan+saya+untuk+sesi+Flash+Sale+berikutnya!`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-colors shadow-sm"
            >
              💬 Pasang Pengingat via WhatsApp
            </a>
          </div>
        )}
      </section>

      {/* ── Flash Sale Rules & Guarantee Banner ──────────────── */}
      <section className="bg-[#FFF8E1] border-t border-[#E8D5C0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#9E1A59]">
              ATURAN & JAMINAN
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mt-1 tracking-tight">
              Belanja Flash Sale dengan Tenang
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">⚡</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Kunci Harga Diskonmu
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Harga diskon berlaku selama periode sesi timer berjalan. Begitu timer habis, harga
                akan otomatis kembali ke harga normal.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">🛡️</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Kualitas Tetap Prioritas #1
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Meskipun harga promo, setiap tas tetap melalui proses Double Quality Control resmi
                sebelum dikirim ke alamatmu.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">📦</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Transparan Tanpa Biaya Tambahan
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Semua harga Flash Sale sudah termasuk bea masuk impor dan biaya jastip resmi. Tidak
                ada biaya siluman saat barang tiba.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
