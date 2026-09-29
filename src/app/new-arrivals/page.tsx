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
import type { Product, ProductType } from '@/types/api';

type SortByType = 'newest' | 'price-asc' | 'price-desc';

export default function NewArrivalsPage() {
  const [sortBy, setSortBy] = useState<SortByType>('newest');
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

  // Sort by newest date as default
  const sortedNewArrivals = useMemo(() => {
    return [...MOCK_PRODUCTS].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, []);

  // Spotlight newest piece
  const heroDrop = sortedNewArrivals[0];

  // Filtered products list
  const filteredProducts = useMemo(() => {
    let list = [...sortedNewArrivals];

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price_total - b.price_total);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price_total - a.price_total);
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return list;
  }, [sortedNewArrivals, sortBy]);

  return (
    <PageShell>
      {/* ── Spotlight / New Drop Hero Feature ───────────────── */}
      {heroDrop && (
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E8D5C0]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-black tracking-widest uppercase text-[#9E1A59]">
                  EDITOR&apos;S SPOTLIGHT
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] tracking-tight">
                  The Freshest Pick
                </h2>
              </div>
              <span className="text-xs font-bold text-[#888] hidden sm:inline">
                Baru rilis minggu ini
              </span>
            </div>

            <div className="bg-[#FFF8E1] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E8D5C0] flex flex-col lg:flex-row items-center gap-8 shadow-xs">
              {/* Product Visual */}
              <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-white shrink-0 border border-[#E8D5C0]/60">
                <Image
                  src={heroDrop.images[0]}
                  alt={heroDrop.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#9E1A59] text-white text-xs font-black tracking-wider uppercase shadow-sm">
                    ✨ JUST DROPPED
                  </span>
                  <Badge variant={heroDrop.stock_type === 'pre-order' ? 'yellow' : 'aqua'}>
                    {heroDrop.stock_type === 'pre-order' ? '⏳ Pre-Order' : '✅ Ready Stock'}
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 w-full">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {heroDrop.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-[#E8D5C0] text-[10px] font-bold text-[#666] uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link href={`/products/${heroDrop.slug}`}>
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] hover:text-[#9E1A59] transition-colors leading-tight mb-2">
                    {heroDrop.name}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-[#666] leading-relaxed mb-6">
                  {heroDrop.description}
                </p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-[#9E1A59]">
                    {formatIDR(heroDrop.price_total)}
                  </span>
                  <span className="text-xs text-[#888] font-semibold bg-white px-2.5 py-1 rounded-full border border-[#E8D5C0]">
                    Harga All-In (Bebas Bea Masuk)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, heroDrop)}
                    className={[
                      'flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all cursor-pointer shadow-sm text-center',
                      addedProductId === heroDrop.id
                        ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                        : 'bg-[#9E1A59] text-white hover:bg-[#7A1244]',
                    ].join(' ')}
                  >
                    {addedProductId === heroDrop.id ? '✓ Berhasil Ditambahkan!' : '+ Tambah ke Keranjang'}
                  </button>

                  <Link
                    href={`/products/${heroDrop.slug}`}
                    className="px-6 py-3.5 rounded-2xl text-xs font-bold border border-[#E8D5C0] bg-white text-[#1A1A1A] hover:bg-[#FFF8E1] transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── New Arrivals Product Grid ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-label="Koleksi New Arrivals">
        {/* Sleek Minimalist Toolbar */}
        <div className="flex items-center justify-between py-3 mb-6 border-b border-[#E8D5C0]/80">
          <p className="text-xs font-bold text-[#8A7880] uppercase tracking-widest">
            {filteredProducts.length} New Arrivals
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
              aria-label="Urutkan produk"
            >
              <option value="newest">Rilis Terbaru</option>
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

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
                        <span className="px-2.5 py-1 rounded-full bg-[#1A1A1A] text-[#FDFD96] text-[9px] font-black tracking-wider uppercase shadow-xs">
                          ✨ NEW DROP
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

                      {/* Sold Out Visual Overlay */}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-5">
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

                      {/* Lead Time & Origin */}
                      <div className="text-[11px] text-[#888] flex items-center gap-1">
                        <span>🇨🇳 Curated China Drop</span>
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
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-[#FFF8E1] rounded-2xl border border-[#E8D5C0]">
            <span className="text-5xl" aria-hidden="true">
              🔍
            </span>
            <p className="font-display font-bold text-lg text-[#1A1A1A]">Belum ada produk yang cocok</p>
            <p className="text-sm text-[#888] max-w-xs">
              Coba atur ulang filter gaya atau stok untuk melihat semua New Arrivals.
            </p>
            <button
              type="button"
              onClick={() => setSortBy('newest')}
              className="mt-2 px-5 py-2 rounded-full bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-colors cursor-pointer"
            >
              Reset Urutan
            </button>
          </div>
        )}
      </section>

      {/* ── Trend Radar / Style Notes Section ───────────────── */}
      <section className="bg-[#FFF8E1] border-t border-[#E8D5C0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#9E1A59]">
              TREND RADAR
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mt-1 tracking-tight">
              3 Tren Tas Paling Dicari Minggu Ini
            </h2>
            <p className="text-xs sm:text-sm text-[#777] mt-2">
              Inspirasi tren langsung dari runway & media sosial Gen Z di Shanghai & Hangzhou.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">🪞</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Chrome & Liquid Metallic
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Finish mengkilap dengan aksen quilted atau chain tebal. Memberikan sentuhan retro-futuristik instan pada outfit simpel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">🎀</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Coquette Bow & Sweet Ties
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Detail pita manis di bagian depan atau handle tas. Populer untuk hangout brunch dan paduan outfit serba feminin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] flex flex-col items-start">
              <span className="text-3xl mb-3">🍋</span>
              <h3 className="font-display font-bold text-base text-[#1A1A1A] mb-1">
                Pastel & Butter Yellow
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Warna cerah tapi lembut seperti pastel lemon, soft lilac, dan aqua transparan yang bikin tampilan terasa airy dan segar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
