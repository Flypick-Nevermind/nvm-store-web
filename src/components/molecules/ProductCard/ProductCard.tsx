'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { formatIDR } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types/api';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
      price: product.price_total,
      quantity: 1,
      type: product.stock_type,
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const isSoldOut = product.stock_type === 'sold-out';

  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex flex-col h-full group"
      aria-label={product.name}
    >
      <motion.article
        className="flex flex-col h-full relative rounded-[1.25rem] overflow-hidden bg-white border border-[#E8D5C0] cursor-pointer"
        style={{ boxShadow: '0 2px 16px 0 rgba(184,38,94,0.06)' }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4, boxShadow: '0 8px 32px 0 rgba(184,38,94,0.14)' }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Image — 3:4 ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF0F3] shrink-0">
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

          {/* Sold out visual center tag */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none z-5">
              <span className="px-3 py-1 rounded-full bg-black/80 text-white text-[10px] font-black tracking-widest uppercase border border-white/30 shadow-lg">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Badges on image: Stock & Discount Sticker */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5">
            <Badge
              variant={
                isSoldOut
                  ? 'sold-out'
                  : product.stock_type === 'pre-order'
                  ? 'yellow'
                  : 'aqua'
              }
            >
              {isSoldOut ? '❌ Sold Out' : product.stock_type === 'pre-order' ? '⏳ Pre-Order' : '✅ Ready'}
            </Badge>

            {product.discount_percent && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9E1A59] text-white text-[10px] font-black tracking-wide shadow-md border border-white/40 backdrop-blur-xs transform -rotate-1 group-hover:rotate-0 transition-transform">
                <span className="text-[11px] leading-none">🔥</span>
                <span>-{product.discount_percent}%</span>
              </div>
            )}
          </div>

          {/* Wishlist Floating Button (Top-Right of Image) */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? `Hapus ${product.name} dari Wishlist` : `Simpan ${product.name} ke Wishlist`}
            className={[
              'absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer',
              'backdrop-blur-md shadow-xs active:scale-80 hover:scale-110',
              isWishlisted
                ? 'bg-[#FFF0F5] text-[#9E1A59] border border-[#9E1A59]/40 shadow-xs'
                : 'bg-white/85 text-[#8A7880] hover:text-[#9E1A59] hover:bg-white border border-white/60',
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

          {/* Feedback Toast */}
          <AnimatePresence>
            {wishlistToast && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-2.5 z-20 px-2.5 py-1 rounded-lg bg-[#1A1A1A]/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-xs shadow-md pointer-events-none"
              >
                {wishlistToast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Add overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="quick-add"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-0 inset-x-0 p-3 z-10"
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
                      'w-full py-2.5 px-4 rounded-xl text-sm font-semibold',
                      'transition-all duration-150 cursor-pointer shadow-sm',
                      addedFeedback
                        ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                        : 'bg-[#9E1A59] text-white hover:bg-[#7A1244]',
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

        {/* Info */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5">
          <h3 className="text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-end justify-between gap-2 mt-auto">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <p className="text-[#9E1A59] font-black text-sm sm:text-base">
                  {formatIDR(product.price_total)}
                </p>
                {product.original_price && (
                  <p className="text-[11px] text-[#A0959A] line-through font-medium">
                    {formatIDR(product.original_price)}
                  </p>
                )}
                {product.discount_percent && (
                  <span className="text-[9px] font-extrabold text-[#9E1A59] bg-[#FAF0F3] px-1.5 py-0.5 rounded border border-[#9E1A59]/20">
                    -{product.discount_percent}%
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#8A7880] font-medium min-h-[1rem] flex items-center">
                {isSoldOut
                  ? '❌ Stok habis • Menunggu restock'
                  : product.stock_type === 'pre-order'
                  ? `⏱ Est. ${product.lead_time_days[0]}–${product.lead_time_days[1]} hari`
                  : '⚡ Siap dikirim hari ini'}
              </p>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
