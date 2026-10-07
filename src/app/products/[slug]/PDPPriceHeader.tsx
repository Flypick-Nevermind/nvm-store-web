'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/atoms/Badge/Badge';
import type { Product, ProductSku } from '@/types/api';

interface PDPPriceHeaderProps {
  product: Product;
}

export function PDPPriceHeader({ product }: PDPPriceHeaderProps) {
  const skus = product.skus || [];
  const prices = skus.map((s) => s.price_base);
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.price_base;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price_base;
  const hasRange = minPrice !== maxPrice;

  // Initial state based on product data
  const [activePrice, setActivePrice] = useState<number>(minPrice);
  const [activeOriginalPrice, setActiveOriginalPrice] = useState<number | undefined>(product.original_price);
  const [activeDiscount, setActiveDiscount] = useState<number | undefined>(product.discount_percent);
  const [selectedVariantName, setSelectedVariantName] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleVariantChange = (e: Event) => {
      const detail = (e as CustomEvent<{
        unitPrice: number;
        originalPrice?: number;
        discountPercent?: number;
        variantName?: string;
        isUserAction?: boolean;
      }>).detail;

      if (!detail) return;
      if (detail.isUserAction) {
        setHasInteracted(true);
      }
      setActivePrice(detail.unitPrice);
      setActiveOriginalPrice(detail.originalPrice);
      setActiveDiscount(detail.discountPercent);
      if (detail.variantName) {
        setSelectedVariantName(detail.variantName);
      }
    };

    window.addEventListener('pdp-variant-change', handleVariantChange);
    return () => window.removeEventListener('pdp-variant-change', handleVariantChange);
  }, []);

  const currentSavings = activeOriginalPrice && activeOriginalPrice > activePrice
    ? activeOriginalPrice - activePrice
    : undefined;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header Badges: Stock Status & Dynamic Discount */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant={
            product.stock_type === 'sold-out'
              ? 'sold-out'
              : product.stock_type === 'pre-order'
                ? 'yellow'
                : 'aqua'
          }
        >
          {product.stock_type === 'sold-out'
            ? 'Sold Out'
            : product.stock_type === 'pre-order'
              ? 'Pre-Order'
              : 'Ready Stock'}
        </Badge>
        {activeDiscount && activeDiscount > 0 && (
          <Badge variant="primary" className="transition-all duration-300">
            🔥 Diskon {activeDiscount}%
          </Badge>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#1A1A1A] leading-snug">
        {product.name}
      </h1>

      {/* Rating & Review Anchor */}
      <a
        href="#customer-reviews"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#888] hover:text-[#9E1A59] transition-colors group w-fit cursor-pointer"
      >
        <div className="flex items-center text-[#F59E0B] text-sm">
          <span>★★★★★</span>
        </div>
        <span className="font-bold text-[#1A1A1A]">4.9</span>
        <span>·</span>
        <span className="underline underline-offset-2 group-hover:text-[#9E1A59]">
          Lihat Ulasan Pembeli
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D8FFF7] text-[#1A6B5C] font-bold">
          ✓ Terverifikasi
        </span>
      </a>

      {/* Dynamic Price Row */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          {hasRange && !hasInteracted ? (
            <p className="text-2xl sm:text-3xl font-extrabold text-[#9E1A59] transition-all">
              Rp {minPrice.toLocaleString('id-ID')} – Rp {maxPrice.toLocaleString('id-ID')}
            </p>
          ) : (
            <p className="text-2xl sm:text-3xl font-extrabold text-[#9E1A59] transition-all">
              Rp {activePrice.toLocaleString('id-ID')}
            </p>
          )}

          {activeOriginalPrice && (
            <p className="text-base sm:text-lg text-[#A0959A] line-through font-semibold transition-all">
              Rp {activeOriginalPrice.toLocaleString('id-ID')}
            </p>
          )}

          {activeDiscount && activeDiscount > 0 && (
            <span className="text-xs font-black text-[#9E1A59] bg-[#FAF0F3] px-2.5 py-0.5 rounded-full border border-[#9E1A59]/30 transition-all">
              HEMAT {activeDiscount}%
            </span>
          )}

          {hasInteracted && selectedVariantName && (
            <span className="text-xs font-medium text-[#8A7880] bg-[#F2EEEB] px-2 py-0.5 rounded-md">
              Varian: {selectedVariantName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#8A7880] font-medium bg-[#F2EEEB] px-2.5 py-1 rounded-full border border-[#E8D5C0]">
            Ongkir & biaya dihitung saat checkout
          </span>
          {currentSavings && currentSavings > 0 && (
            <span className="text-xs text-[#1A6B5C] font-semibold bg-[#D8FFF7] px-2.5 py-1 rounded-full border border-[#9DDED1] transition-all">
              {hasRange && !hasInteracted
                ? `Hemat s.d. Rp ${(product.original_price! - minPrice).toLocaleString('id-ID')}!`
                : `Hemat Rp ${currentSavings.toLocaleString('id-ID')}!`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
