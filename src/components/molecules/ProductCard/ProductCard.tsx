'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatIDR } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types/api';

interface ProductCardProps {
  product: Product;
  rank?: number;
  soldCount?: number | string;
}

export function ProductCard({ product, rank, soldCount }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);
  const [wishlistToast, setWishlistToast] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.items.some((i) => i.id === product.id));

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleWishlist(product);
    setHeartPulsing(true);
    setWishlistToast(added ? 'Tersimpan di Wishlist ♡' : 'Dihapus dari Wishlist');

    setTimeout(() => setHeartPulsing(false), 400);
    setTimeout(() => setWishlistToast(null), 1800);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price_base,
      quantity: 1,
      type: product.stock_type,
      price_import_duty: product.price_import_duty,
      price_shipping: product.price_shipping,
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const isSoldOut = product.stock_type === 'sold-out';
  const hasSecondImage = product.images.length > 1;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex flex-col h-full group"
      aria-label={product.name}
    >
      <motion.article
        className="flex flex-col h-full relative rounded-2xl overflow-hidden bg-white border border-[#E8D5C0] cursor-pointer shadow-xs hover:border-[#9E1A59]/40 transition-colors"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5, boxShadow: '0 12px 30px -4px rgba(158,26,89,0.12)' }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        {/* ── Image Area (3:4 Ratio) ─────────────────────────── */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF0F3] shrink-0">
          {/* Primary image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={[
              'object-cover transition-all duration-500',
              hasSecondImage && isHovered ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-105',
              isSoldOut ? 'grayscale-[30%] opacity-90' : '',
            ].join(' ')}
          />

          {/* Secondary preview image (revealed on hover) */}
          {hasSecondImage && (
            <Image
              src={product.images[1]}
              alt={`${product.name} angle preview`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={[
                'object-cover transition-all duration-500',
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100',
                isSoldOut ? 'grayscale-[30%] opacity-90' : '',
              ].join(' ')}
            />
          )}

          {/* Sold out overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-10">
              <span className="px-3.5 py-1 rounded-full bg-black/85 text-white text-[11px] font-black tracking-widest uppercase border border-white/30 shadow-lg">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Badges on image: Rank, Stock Status & Discount Tag */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1.5 max-w-[calc(100%-44px)]">
            {/* Optional Rank Badge for Best Seller */}
            {typeof rank === 'number' && (
              <span
                className={[
                  'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xs',
                  rank === 1
                    ? 'bg-[#9E1A59] text-white ring-1 ring-white/50'
                    : rank === 2
                    ? 'bg-[#1A1A1A] text-white ring-1 ring-white/50'
                    : rank === 3
                    ? 'bg-[#C23070] text-white ring-1 ring-white/50'
                    : 'bg-white/95 backdrop-blur-xs text-[#1A1A1A] border border-[#E8D5C0]',
                ].join(' ')}
              >
                #{rank}
              </span>
            )}

            {/* Stock Status Badge */}
            <span
              className={[
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-2xs border',
                isSoldOut
                  ? 'bg-[#1A1A1A]/85 text-white border-white/20'
                  : product.stock_type === 'ready-stock'
                  ? 'bg-emerald-50/95 text-emerald-800 border-emerald-300/80'
                  : 'bg-[#FFF9E6]/95 text-[#7A5200] border-[#FFE082]',
              ].join(' ')}
            >
              <span
                className={[
                  'w-1.5 h-1.5 rounded-full shrink-0',
                  isSoldOut
                    ? 'bg-zinc-400'
                    : product.stock_type === 'ready-stock'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500',
                ].join(' ')}
              />
              <span>
                {isSoldOut
                  ? 'Sold Out'
                  : product.stock_type === 'ready-stock'
                  ? 'Ready Stock'
                  : 'Pre-Order'}
              </span>
            </span>

            {/* Discount Sticker */}
            {product.discount_percent && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#9E1A59] text-white text-[10px] font-black tracking-tight shadow-md border border-white/30 backdrop-blur-xs transform -rotate-1 group-hover:rotate-0 transition-transform">
                <span className="text-[11px] leading-none">🔥</span>
                <span>-{product.discount_percent}%</span>
              </span>
            )}
          </div>

          {/* Optional Sold Count Badge (Top-Right) */}
          {soldCount && (
            <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold tracking-wide">
                {soldCount}+ Sold
              </span>
            </div>
          )}

          {/* Desktop Quick Add overlay on image */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="quick-add"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="hidden sm:block absolute bottom-0 inset-x-0 p-3 z-10"
              >
                {isSoldOut ? (
                  <div className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#1A1A1A]/85 text-white/90 backdrop-blur-xs border border-white/20 shadow-sm">
                    Habis Terjual
                  </div>
                ) : (
                  <button
                    id={`quick-add-${product.id}`}
                    onClick={handleQuickAdd}
                    className={[
                      'w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase',
                      'transition-all duration-150 cursor-pointer shadow-md active:scale-95',
                      addedFeedback
                        ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                        : 'bg-[#9E1A59] text-white hover:bg-[#7A1244] border border-white/20',
                    ].join(' ')}
                    aria-label={`Tambah ${product.name} ke keranjang`}
                  >
                    {addedFeedback ? '✓ Ditambahkan!' : '+ Tambah ke Keranjang'}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Product Info Section ───────────────────────────── */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5 relative">
          {/* Wishlist Feedback Toast */}
          <AnimatePresence>
            {wishlistToast && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-12 right-2.5 z-20 px-2.5 py-1 rounded-lg bg-[#1A1A1A]/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-xs shadow-md pointer-events-none"
              >
                {wishlistToast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category & Color Swatches */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A7880]">
              {product.category.replace('-', ' ')}
            </span>

            {/* Miniature Color Swatch Dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center -space-x-1" title={`${product.colors.length} Pilihan Warna`}>
                {product.colors.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[8px] font-bold text-[#8A7880] pl-1.5">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] leading-snug line-clamp-2 min-h-[2.4rem] group-hover:text-[#9E1A59] transition-colors">
            {product.name}
          </h3>

          {/* Price, Status & Wishlist Button Row */}
          <div className="flex items-end justify-between gap-2 mt-auto pt-1">
            <div className="flex flex-col gap-0.5 min-w-0">
              {/* Pricing row */}
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <p className="text-[#9E1A59] font-black text-sm sm:text-base tracking-tight">
                  {formatIDR(product.price_base)}
                </p>
                {product.original_price && (
                  <p className="text-[11px] text-[#A0959A] line-through font-medium">
                    {formatIDR(product.original_price)}
                  </p>
                )}
              </div>

              {/* Delivery / Status Note */}
              <p className="text-[10px] text-[#8A7880] font-medium truncate flex items-center gap-1">
                {isSoldOut ? (
                  <span className="text-zinc-500">Stok habis • Menunggu restock</span>
                ) : product.stock_type === 'ready-stock' ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <span>⚡</span> Siap kirim hari ini
                  </span>
                ) : (
                  <span>⏱️ Est. {product.lead_time_days[0]}–{product.lead_time_days[1]} hari</span>
                )}
              </p>
            </div>

            {/* Wishlist Heart Button (Bottom Right) */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label={isWishlisted ? `Hapus ${product.name} dari Wishlist` : `Simpan ${product.name} ke Wishlist`}
              className={[
                'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-75',
                isWishlisted
                  ? 'bg-[#FFF0F5] text-[#9E1A59] border border-[#9E1A59]/40 shadow-2xs'
                  : 'text-[#8A7880] hover:text-[#9E1A59] hover:bg-[#FFF0F5] border border-transparent hover:border-[#E8D5C0]/80',
              ].join(' ')}
            >
              <motion.svg
                animate={heartPulsing ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-4 h-4"
                fill={isWishlisted ? '#9E1A59' : 'none'}
                viewBox="0 0 24 24"
                stroke={isWishlisted ? '#9E1A59' : 'currentColor'}
                strokeWidth={isWishlisted ? 1.5 : 2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </motion.svg>
            </button>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
