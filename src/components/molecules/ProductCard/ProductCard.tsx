'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { formatIDR } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/api';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

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

  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex flex-col h-full group"
      aria-label={product.name}
    >
      <motion.article
        className="flex flex-col h-full relative rounded-[1.25rem] overflow-hidden bg-white cursor-pointer"
        style={{ boxShadow: '0 2px 16px 0 rgba(199,67,117,0.07)' }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4, boxShadow: '0 8px 32px 0 rgba(199,67,117,0.14)' }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Image — 3:4 ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F0E8] shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Stock badge */}
          <div className="absolute top-2.5 left-2.5">
            <Badge variant={product.stock_type === 'pre-order' ? 'yellow' : 'aqua'}>
              {product.stock_type === 'pre-order' ? '⏳ Pre-Order' : '✅ Ready'}
            </Badge>
          </div>

          {/* Quick Add overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="quick-add"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-0 inset-x-0 p-3"
              >
                <button
                  id={`quick-add-${product.id}`}
                  onClick={handleQuickAdd}
                  className={[
                    'w-full py-2.5 px-4 rounded-xl text-sm font-semibold',
                    'transition-all duration-150 cursor-pointer shadow-sm',
                    addedFeedback
                      ? 'bg-[#D8FFF7] text-[#1A6B5C] border border-[#9DDED1]'
                      : 'bg-[#C74375] text-white hover:bg-[#A33360]',
                  ].join(' ')}
                  aria-label={`Tambah ${product.name} ke keranjang`}
                >
                  {addedFeedback ? '✓ Ditambahkan!' : '+ Tambah ke Keranjang'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5">
          <h3 className="text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex flex-col gap-0.5 mt-auto">
            <p className="text-[#C74375] font-bold text-sm sm:text-base">
              {formatIDR(product.price_total)}
            </p>
            <p className="text-[10px] text-[#888] font-medium min-h-[1rem] flex items-center">
              {product.stock_type === 'pre-order'
                ? `⏱ Est. ${product.lead_time_days[0]}–${product.lead_time_days[1]} hari`
                : '⚡ Siap dikirim hari ini'}
            </p>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
