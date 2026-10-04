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

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addItemToCart = useCartStore((s) => s.addItem);

  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const handleMoveToCart = (product: Product) => {
    addItemToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price_total,
      quantity: 1,
      type: product.stock_type,
    });

    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleMoveAllToCart = () => {
    items.forEach((product) => {
      addItemToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price_total,
        quantity: 1,
        type: product.stock_type,
      });
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Wishlist">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[#F2EEEB] border-l border-[#E8D5C0] shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E8D5C0] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl text-[#9E1A59]">♡</span>
                <h2 className="font-display font-black text-lg sm:text-xl text-[#1A1A1A] tracking-tight">
                  Wishlist Saya
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#9E1A59] text-white">
                  {items.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="text-[11px] font-semibold text-[#888] hover:text-red-500 transition-colors px-2 py-1"
                  >
                    Kosongkan
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:bg-[#FFF0F5] transition-colors"
                  aria-label="Tutup Wishlist"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#FFF0F5] border border-[#F48FB1]/40 flex items-center justify-center text-3xl shadow-inner">
                    🤍
                  </div>
                  <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                    Wishlist Kamu Masih Kosong
                  </h3>
                  <p className="text-xs text-[#8A7880] max-w-xs leading-relaxed">
                    Nemu tas yang kamu taksir? Klik tombol hati <strong>♡</strong> di foto produk untuk menyimpannya ke sini.
                  </p>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9E1A59] text-white text-xs font-bold hover:bg-[#7A1244] transition-all shadow-xs cursor-pointer"
                  >
                    <span>Cari Tas Impian</span>
                    <span>→</span>
                  </Link>
                </div>
              ) : (
                items.map((product) => {
                  const isAdded = addedItemIds[product.id];
                  const isSoldOut = product.stock_type === 'sold-out';

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E8D5C0] flex gap-3 shadow-xs relative group"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#FAF0F3] shrink-0 border border-[#E8D5C0]"
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Info & Actions */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={onClose}
                              className="font-bold text-xs text-[#1A1A1A] hover:text-[#9E1A59] line-clamp-2 leading-snug transition-colors"
                            >
                              {product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(product.id)}
                              className="text-[#BBB] hover:text-red-500 transition-colors p-1 -mr-1"
                              aria-label={`Hapus ${product.name} dari Wishlist`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <Badge
                              variant={
                                isSoldOut
                                  ? 'sold-out'
                                  : product.stock_type === 'pre-order'
                                  ? 'yellow'
                                  : 'aqua'
                              }
                            >
                              {isSoldOut ? 'Sold Out' : product.stock_type === 'pre-order' ? 'Pre-Order' : 'Ready'}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="font-extrabold text-sm text-[#9E1A59]">
                            {formatIDR(product.price_total)}
                          </p>

                          {!isSoldOut && (
                            <button
                              type="button"
                              onClick={() => handleMoveToCart(product)}
                              className={[
                                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-2xs',
                                isAdded
                                  ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                                  : 'bg-[#9E1A59] text-white hover:bg-[#7A1244]',
                              ].join(' ')}
                            >
                              {isAdded ? '✓ Di Keranjang' : '+ Keranjang'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-[#E8D5C0] bg-white flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="w-full py-3 rounded-full bg-[#9E1A59] hover:bg-[#7A1244] text-white text-xs font-bold tracking-wide transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>🛍️</span>
                  <span>Pindahkan Semua ke Keranjang</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-center text-xs font-semibold text-[#888] hover:text-[#1A1A1A] transition-colors"
                >
                  Lanjut Belanja
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
