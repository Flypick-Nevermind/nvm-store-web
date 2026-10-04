'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { Badge } from '@/components/atoms/Badge';
import { formatIDR } from '@/lib/utils';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/api';

// Metadata stat per product for the best seller leaderboard
interface BestSellerMeta {
  rank: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
  badgeLabel?: string;
}

const BEST_SELLER_STATS: Record<string, BestSellerMeta> = {
  'prod-001': { rank: 1, salesCount: 540, rating: 4.9, reviewCount: 142, badgeLabel: '👑 ALL-TIME #1' },
  'prod-002': { rank: 2, salesCount: 420, rating: 4.9, reviewCount: 98, badgeLabel: '🔥 HOT SELLER' },
  'prod-004': { rank: 3, salesCount: 360, rating: 4.8, reviewCount: 86, badgeLabel: '✨ VIRAL PICK' },
  'prod-005': { rank: 4, salesCount: 290, rating: 4.8, reviewCount: 64 },
  'prod-003': { rank: 5, salesCount: 230, rating: 4.7, reviewCount: 51 },
  'prod-006': { rank: 6, salesCount: 190, rating: 4.7, reviewCount: 43 },
};

type SortByType = 'rank' | 'sales' | 'rating' | 'price-asc' | 'price-desc';

export default function BestSellerPage() {
  const [sortBy, setSortBy] = useState<SortByType>('rank');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price_total,
      quantity: 1,
      type: product.stock_type,
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  // Rank products by best seller stats
  const rankedProducts = useMemo(() => {
    return [...MOCK_PRODUCTS].sort((a, b) => {
      const rankA = BEST_SELLER_STATS[a.id]?.rank ?? 99;
      const rankB = BEST_SELLER_STATS[b.id]?.rank ?? 99;
      return rankA - rankB;
    });
  }, []);

  // Top 3 Podium
  const topThree = useMemo(() => rankedProducts.slice(0, 3), [rankedProducts]);

  // Filtered & sorted products list
  const filteredProducts = useMemo(() => {
    let list = [...rankedProducts];

    if (sortBy === 'sales') {
      list = [...list].sort(
        (a, b) =>
          (BEST_SELLER_STATS[b.id]?.salesCount ?? 0) - (BEST_SELLER_STATS[a.id]?.salesCount ?? 0)
      );
    } else if (sortBy === 'rating') {
      list = [...list].sort(
        (a, b) =>
          (BEST_SELLER_STATS[b.id]?.rating ?? 0) - (BEST_SELLER_STATS[a.id]?.rating ?? 0)
      );
    } else if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price_total - b.price_total);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price_total - a.price_total);
    } else {
      // default: rank
      list = [...list].sort(
        (a, b) => (BEST_SELLER_STATS[a.id]?.rank ?? 99) - (BEST_SELLER_STATS[b.id]?.rank ?? 99)
      );
    }

    return list;
  }, [rankedProducts, sortBy]);

  return (
    <PageShell>
      {/* ── Top 3 Spotlight Podium (Hall of Fame) ─────────── */}
      <section className="bg-[#9E1A59] py-12 px-4 sm:px-6 lg:px-8 border-y border-[#7A1244] shadow-inner relative overflow-hidden">
        {/* Subtle decorative background circle accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#7A1244]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#FDFD96] border border-white/20 text-[11px] font-black tracking-widest uppercase mb-2 backdrop-blur-xs">
                ✨ HALL OF FAME
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                Top 3 Most Loved
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-medium">
              Updated weekly based on verified customer purchases & reviews
            </p>
          </div>

          {/* 3-Column Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {topThree.map((product, idx) => {
              const stat = BEST_SELLER_STATS[product.id];
              const isFirst = idx === 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={[
                    'relative rounded-3xl overflow-hidden transition-all duration-300 flex flex-col',
                    isFirst
                      ? 'bg-white border-2 border-[#FDFD96] shadow-2xl md:-translate-y-3 ring-4 ring-black/10'
                      : 'bg-white border border-white/40 shadow-xl hover:-translate-y-1',
                  ].join(' ')}
                >
                  {/* Top Rank Header Strip */}
                  <div
                    className={[
                      'px-5 py-3 flex items-center justify-between text-xs font-black tracking-wider uppercase',
                      isFirst
                        ? 'bg-[#1A1A1A] text-[#FDFD96] border-b border-[#FDFD96]/30'
                        : idx === 1
                        ? 'bg-[#1A1A1A] text-[#D8FFF7]'
                        : 'bg-[#1A1A1A] text-white',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-1.5">
                      {idx === 0 && '👑'}
                      {idx === 1 && '🥈'}
                      {idx === 2 && '🥉'}
                      RANK #{stat?.rank ?? idx + 1}
                      {idx === 0 && <span className="text-[10px] text-white/70 font-normal ml-1">• ALL-TIME #1</span>}
                      {idx === 1 && <span className="text-[10px] text-white/70 font-normal ml-1">• HOT SELLER</span>}
                      {idx === 2 && <span className="text-[10px] text-white/70 font-normal ml-1">• VIRAL PICK</span>}
                    </span>
                    <span className="text-[11px] font-bold text-white/90">{stat?.salesCount}+ Terjual</span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 bg-white">
                    <Link
                      href={`/products/${product.slug}`}
                      className="group relative block aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF0F3] mb-4"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant={product.stock_type === 'pre-order' ? 'yellow' : 'aqua'}>
                          {product.stock_type === 'pre-order' ? '⏳ Pre-Order' : '✅ Ready Stock'}
                        </Badge>
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex text-[#9E1A59] text-xs">
                        {'★'.repeat(Math.floor(stat?.rating || 5))}
                      </div>
                      <span className="text-xs font-bold text-[#1A1A1A]">{stat?.rating}</span>
                      <span className="text-[11px] text-[#777]">({stat?.reviewCount} ulasan)</span>
                    </div>

                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-bold text-base text-[#1A1A1A] hover:text-[#9E1A59] transition-colors line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#666] line-clamp-2 mb-4 leading-relaxed">
                      {product.short_description}
                    </p>

                    <div className="mt-auto pt-3 border-t border-[#E8D5C0]/60 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#888] font-bold uppercase tracking-wider">Harga All-In</p>
                        <p className="text-lg font-black text-[#9E1A59]">
                          {formatIDR(product.price_total)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={[
                          'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm',
                          addedProductId === product.id
                            ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                            : 'bg-[#9E1A59] text-white hover:bg-[#7A1244]',
                        ].join(' ')}
                      >
                        {addedProductId === product.id ? '✓ Ditambahkan' : '+ Keranjang'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Complete Leaderboard Grid ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-label="Best seller products">
        {/* Sleek Minimalist Toolbar */}
        <div className="flex items-center justify-between py-3 mb-6 border-b border-[#E8D5C0]/80">
          <p className="text-xs font-bold text-[#8A7880] uppercase tracking-widest">
            {filteredProducts.length} Best Sellers
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#888] hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortByType)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] hover:border-[#9E1A59] focus:outline-none focus:border-[#9E1A59] transition-all cursor-pointer shadow-xs appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239E1A59' stroke-width='2.5'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
              aria-label="Sort by"
            >
              <option value="rank">Ranking #1–#6</option>
              <option value="sales">Penjualan Terbanyak</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="price-asc">Harga: Low → High</option>
              <option value="price-desc">Harga: High → Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <motion.div
            key={sortBy}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
          >
            {filteredProducts.map((product, i) => {
              const stat = BEST_SELLER_STATS[product.id];
              const rank = stat?.rank ?? i + 1;
              const isSoldOut = product.stock_type === 'sold-out';

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
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
                            isSoldOut ? 'grayscale-[25%] opacity-90' : '',
                          ].join(' ')}
                        />
                      </Link>

                      {/* Sold Out Visual Overlay */}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-5">
                          <span className="px-3 py-1 rounded-full bg-black/85 text-white text-[10px] font-black tracking-widest uppercase border border-white/30 shadow-md">
                            SOLD OUT
                          </span>
                        </div>
                      )}

                      {/* Rank Tag (Top-Left) */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
                        <span
                          className={[
                            'px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xs',
                            rank === 1
                              ? 'bg-[#9E1A59] text-white ring-2 ring-white/50'
                              : rank === 2
                              ? 'bg-[#1A1A1A] text-white ring-2 ring-white/50'
                              : rank === 3
                              ? 'bg-[#C23070] text-white ring-2 ring-white/50'
                              : 'bg-white/90 backdrop-blur-xs text-[#1A1A1A] border border-[#E8D5C0]',
                          ].join(' ')}
                        >
                          #{rank}
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
                          {isSoldOut ? '❌ Sold Out' : product.stock_type === 'pre-order' ? '⏳ PO' : '✅ Ready'}
                        </Badge>
                      </div>

                      {/* Sold Count Badge (Top-Right) */}
                      {stat && (
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold tracking-wide">
                            {stat.salesCount}+ Sold
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
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={[
                              'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-md',
                              addedProductId === product.id
                                ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                                : 'bg-[#9E1A59] text-white hover:bg-[#7A1244]',
                            ].join(' ')}
                          >
                            {addedProductId === product.id ? '✓ Ditambahkan!' : '+ Quick Add'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2 hover:text-[#9E1A59] transition-colors min-h-[2.5rem]">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating & Sold count */}
                      <div className="flex items-center gap-1.5 text-[11px] text-[#888]">
                        <span className="text-[#9E1A59] font-bold">★ {stat?.rating ?? '4.8'}</span>
                        <span>•</span>
                        <span>{stat?.salesCount ?? 200}+ terjual</span>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-end justify-between gap-2 mt-auto pt-1">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[#9E1A59] font-black text-sm sm:text-base">
                            {formatIDR(product.price_total)}
                          </p>
                          <p className="text-[10px] text-[#8A7880] font-medium">
                            {isSoldOut
                              ? '❌ Stok habis • Menunggu restock'
                              : product.stock_type === 'pre-order'
                              ? `Est. ${product.lead_time_days[0]}–${product.lead_time_days[1]} hari`
                              : 'Siap kirim hari ini'}
                          </p>
                        </div>
                        <span className="text-[#8A7880] hover:text-[#9E1A59] transition-colors text-sm mb-1">
                          ♡
                        </span>
                      </div>
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-[#F2EEEB] rounded-2xl border border-[#E8D5C0]">
            <span className="text-5xl" aria-hidden="true">
              🔍
            </span>
            <p className="font-display font-bold text-lg text-[#1A1A1A]">Belum ada produk yang cocok</p>
            <p className="text-sm text-[#888] max-w-xs">
              Coba reset filter untuk melihat semua koleksi Best Seller Nevermind.
            </p>
            <button
              type="button"
              onClick={() => setSortBy('rank')}
              className="mt-2 px-5 py-2 rounded-full bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-colors cursor-pointer"
            >
              Reset Urutan
            </button>
          </div>
        )}
      </section>

      {/* ── Why Our Best Sellers Win (Trust Section) ────────── */}
      <section className="bg-[#F2EEEB] border-t border-[#E8D5C0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#9E1A59]">
              THE NEVERMIND PROMISE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mt-1 tracking-tight">
              Kenapa Best Seller Kami Cepat Habis?
            </h2>
            <p className="text-xs sm:text-sm text-[#777] mt-2">
              Kurasi tangan pertama langsung dari studio desainer di China dengan standar kualitas tanpa kompromi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 rounded-xl bg-[#F2EEEB] text-[#9E1A59] flex items-center justify-center text-2xl mb-4 border border-[#E8D5C0]">
                🇨🇳
              </div>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Langsung dari Sumber Tren
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Dikurasi langsung dari pusat fashion Guangzhou & Shanghai. Desain viral yang belum banyak masuk pasar lokal Indonesia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 rounded-xl bg-[#F2EEEB] text-[#9E1A59] flex items-center justify-center text-2xl mb-4 border border-[#E8D5C0]">
                ✨
              </div>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Double Quality Control (QC)
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Dicek 2x: saat tiba di warehouse China dan sebelum dikirim ke alamatmu. Jahitan rapi, resleting mulus, dan hardware kokoh.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 rounded-xl bg-[#F2EEEB] text-[#9E1A59] flex items-center justify-center text-2xl mb-4 border border-[#E8D5C0]">
                🛡️
              </div>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Harga Transparan & All-In
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Semua harga sudah termasuk bea masuk, pajak impor resmi, dan ongkir internasional. Tidak ada biaya siluman saat barang sampai.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
