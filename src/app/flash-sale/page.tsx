'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
}

const FLASH_DEALS: Record<string, FlashSaleDeal> = {
  'prod-002': {
    productId: 'prod-002',
    flashPrice: 239000,
    discountPercent: 23,
    stockTotal: 25,
    stockClaimed: 22,
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

  return (
    <PageShell>
      {/* ── Flash Sale Time Session Tabs ────────────────────── */}
      <section className="bg-[#FFF8E1] border-b border-[#E8D5C0] sticky top-[calc(7rem-1px)] lg:top-[calc(11.25rem-1px)] z-30 shadow-xs py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto grid grid-cols-3 gap-2.5 sm:gap-4">
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
                    'w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl transition-all cursor-pointer border text-center sm:text-left min-w-0 shadow-2xs',
                    isSelected
                      ? 'bg-[#9E1A59] text-white border-[#9E1A59] shadow-sm ring-2 ring-[#9E1A59]/20'
                      : 'bg-[#FFF8E1] text-[#666] border-[#E8D5C0] hover:text-[#9E1A59] hover:bg-white',
                  ].join(' ')}
                >
                  <span className="text-base sm:text-lg shrink-0">{tab.icon}</span>
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <span className="text-xs sm:text-sm font-bold leading-tight tracking-tight sm:tracking-wide truncate">
                      {tab.label}
                    </span>
                    <span
                      className={[
                        'text-[10px] sm:text-xs font-semibold leading-none mt-1 truncate',
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

      {/* ── Flash Deals Grid ────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12"
        aria-label="Katalog flash sale"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] sm:text-[11px] font-black tracking-widest uppercase border border-[#9E1A59]/20">
                ⚡ LIMITED TIME OFFER
              </span>
              <span className="text-xs font-semibold text-[#888]">
                {activeSession === 'active' ? '• Sesi Sedang Berlangsung' : '• Sesi Mendatang'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#1A1A1A] tracking-tight">
              {activeSession === 'active' ? 'Koleksi Promo Flash Sale' : 'Preview Sesi Mendatang'}
            </h1>
            <p className="text-xs sm:text-sm text-[#666] mt-1.5 max-w-xl leading-relaxed">
              {activeSession === 'active'
                ? 'Koleksi tas impor pilihan dengan potongan harga spesial. Kuota diskon terbatas dan berkurang secara real-time!'
                : 'Pasang pengingat agar tidak ketinggalan saat sesi promo flash sale berikutnya dibuka.'}
            </p>
          </div>

          {activeSession === 'active' && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#9E1A59] bg-[#FFF8E1] px-4 py-2.5 rounded-2xl border border-[#E8D5C0] self-start sm:self-auto shrink-0 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9E1A59] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9E1A59]"></span>
              </span>
              <span>Sesi Promo Aktif</span>
            </div>
          )}
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
