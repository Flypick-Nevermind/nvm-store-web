'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { formatIDR } from '@/lib/utils';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import type {
  Product,
  ProductColor,
  ProductOptionValue,
  ProductSku,
  ProductVariant,
} from '@/types/api';

interface PDPActionsProps {
  product: Product;
}

export function PDPActions({ product }: PDPActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.openModal);

  const hasOptions = Boolean(product.options && product.options.length > 0);
  const options = useMemo(() => product.options || [], [product.options]);
  const skus = useMemo(() => product.skus || [], [product.skus]);

  // ── Multi-attribute options state ──
  const initialOptions = useMemo(() => {
    if (!hasOptions) return {};
    const init: Record<string, string> = {};
    for (const opt of options) {
      if (opt.values.length > 0) {
        init[opt.id] = opt.values[0].id;
      }
    }
    return init;
  }, [hasOptions, options]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);

  // ── Legacy variants & colors state ──
  const legacyVariants = useMemo(() => product.variants || [], [product.variants]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    legacyVariants.length > 0 ? legacyVariants[0] : null
  );

  const legacyColors: ProductColor[] = useMemo(
    () => selectedVariant?.colors ?? product.colors ?? [],
    [selectedVariant, product.colors]
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    legacyColors.length > 0 ? legacyColors[0] : null
  );

  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // ── Matched SKU for multi-attribute products ──
  const matchedSku = useMemo<ProductSku | null>(() => {
    if (!hasOptions || skus.length === 0) return null;
    return (
      skus.find((sku) =>
        Object.entries(selectedOptions).every(([optId, valId]) => sku.options[optId] === valId)
      ) ?? null
    );
  }, [hasOptions, skus, selectedOptions]);

  // Determine current unit price & original price
  const currentUnitPrice = hasOptions
    ? (matchedSku?.price_base ?? product.price_base)
    : product.price_base + (selectedVariant?.price_delta || 0);

  const currentOriginalPrice = hasOptions
    ? (matchedSku?.original_price ?? product.original_price)
    : product.original_price;

  // Check if this product has price variation across options/SKUs
  const hasPriceVariation = useMemo(() => {
    if (hasOptions && skus.length > 1) {
      const firstPrice = skus[0].price_base;
      return skus.some((s) => s.price_base !== firstPrice);
    }
    if (legacyVariants.length > 1) {
      return legacyVariants.some((v) => (v.price_delta || 0) > 0);
    }
    return false;
  }, [hasOptions, skus, legacyVariants]);

  // Tell gallery which image to jump to
  const notifyGalleryImage = (imageIndex?: number) => {
    if (typeof imageIndex === 'number' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pdp-select-image', { detail: imageIndex }));
    }
  };

  // Broadcast selected variant and pricing to header & gallery
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const discount = (currentOriginalPrice && currentOriginalPrice > currentUnitPrice)
      ? Math.round(((currentOriginalPrice - currentUnitPrice) / currentOriginalPrice) * 100)
      : undefined;

    let activeName: string | undefined;
    if (hasOptions) {
      const colorValId = selectedOptions['color'];
      const colorOpt = options.find((o) => o.id === 'color');
      const val = colorOpt?.values.find((v) => v.id === colorValId);
      activeName = val?.name;
    } else {
      activeName = selectedColor?.name ?? selectedVariant?.name;
    }

    window.dispatchEvent(
      new CustomEvent('pdp-variant-change', {
        detail: {
          unitPrice: currentUnitPrice,
          originalPrice: currentOriginalPrice,
          discountPercent: discount,
          variantName: activeName,
          matchedSku,
          isUserAction: true,
        },
      })
    );
  }, [currentUnitPrice, currentOriginalPrice, selectedOptions, selectedColor, selectedVariant, hasOptions, options, matchedSku]);

  // Helper to check if a specific option value has at least one valid SKU with prior selections
  const isOptionValueAvailable = (optId: string, valId: string): boolean => {
    if (!hasOptions || skus.length === 0) return true;
    const otherSelections: Record<string, string> = {};
    for (const [k, v] of Object.entries(selectedOptions)) {
      if (k !== optId) otherSelections[k] = v;
    }
    return skus.some(
      (sku) =>
        sku.options[optId] === valId &&
        Object.entries(otherSelections).every(([k, v]) => sku.options[k] === v)
    );
  };

  // Select an option value in multi-attribute mode
  const handleSelectOption = (optId: string, value: ProductOptionValue) => {
    const nextOptions = { ...selectedOptions, [optId]: value.id };

    for (const opt of options) {
      if (opt.id === optId) continue;
      const currentVal = nextOptions[opt.id];
      const isValid = skus.some(
        (sku) =>
          sku.options[optId] === value.id &&
          sku.options[opt.id] === currentVal &&
          Object.entries(nextOptions).every(([k, v]) => k === opt.id || sku.options[k] === v)
      );
      if (!isValid && opt.values.length > 0) {
        const validVal = opt.values.find((candidate) =>
          skus.some(
            (sku) =>
              sku.options[optId] === value.id &&
              sku.options[opt.id] === candidate.id
          )
        );
        if (validVal) {
          nextOptions[opt.id] = validVal.id;
        }
      }
    }

    setSelectedOptions(nextOptions);

    if (value.image_index !== undefined) {
      notifyGalleryImage(value.image_index);
    } else {
      const candidateSku = skus.find((sku) =>
        Object.entries(nextOptions).every(([k, v]) => sku.options[k] === v)
      );
      if (candidateSku?.image_index !== undefined) {
        notifyGalleryImage(candidateSku.image_index);
      }
    }
  };

  // Legacy selection handlers
  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    if (color.image_index !== undefined) notifyGalleryImage(color.image_index);
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    const nextColors = variant.colors ?? product.colors ?? [];
    const next = nextColors.find((c) => c.name === selectedColor?.name) ?? nextColors[0] ?? null;
    setSelectedColor(next);
    if (next?.image_index !== undefined) notifyGalleryImage(next.image_index);
  };

  // Build cart item payload
  const buildCartPayload = () => {
    if (hasOptions) {
      const colorVal = options.find((o) => o.id === 'color')?.values.find((v) => v.id === selectedOptions['color']);

      // Format non-color options cleanly if multiple options exist
      const nonColorOptions = options
        .filter((o) => o.id !== 'color')
        .map((opt) => {
          const valObj = opt.values.find((v) => v.id === selectedOptions[opt.id]);
          return valObj ? valObj.name : null;
        })
        .filter(Boolean);

      const formattedVariant = nonColorOptions.length > 0 ? nonColorOptions.join(' • ') : undefined;

      const formattedOptionsMap: Record<string, string> = {};
      for (const opt of options) {
        const valObj = opt.values.find((v) => v.id === selectedOptions[opt.id]);
        if (valObj) formattedOptionsMap[opt.name] = valObj.name;
      }

      const activeImage =
        (matchedSku?.image_index !== undefined && product.images[matchedSku.image_index]) ||
        (colorVal?.image_index !== undefined && product.images[colorVal.image_index]) ||
        product.images[0];

      return {
        productId: product.id,
        key: `${product.id}-${matchedSku?.id || Object.values(selectedOptions).join('-')}`,
        slug: product.slug,
        name: product.name,
        image: activeImage,
        price: currentUnitPrice,
        quantity,
        type: product.stock_type,
        color: colorVal?.name,
        variant: formattedVariant,
        selected_options: formattedOptionsMap,
        price_import_duty: product.price_import_duty,
        price_shipping: product.price_shipping,
      };
    }

    // Legacy fallback
    return {
      productId: product.id,
      key: `${product.id}-${selectedVariant?.id || 'default'}-${selectedColor?.name || 'default'}`,
      slug: product.slug,
      name: product.name,
      image:
        (selectedColor?.image_index !== undefined && product.images[selectedColor.image_index]) ||
        product.images[0],
      price: currentUnitPrice,
      quantity,
      type: product.stock_type,
      color: selectedColor?.name,
      variant: selectedVariant?.name,
      price_import_duty: product.price_import_duty,
      price_shipping: product.price_shipping,
    };
  };

  const handleBuyNow = () => {
    addItem(buildCartPayload());

    if (!isAuthenticated) {
      const summaryText = hasOptions
        ? Object.entries(selectedOptions)
            .map(([optId, valId]) => {
              const opt = options.find((o) => o.id === optId);
              const val = opt?.values.find((v) => v.id === valId);
              return val?.name;
            })
            .filter(Boolean)
            .join(' • ')
        : [selectedColor?.name, selectedVariant?.name].filter(Boolean).join(' • ');

      openAuthModal({
        redirectUrl: '/checkout',
        productName: product.name,
        title: 'Masuk untuk Checkout',
        message: `Kamu akan memesan ${product.name} (${summaryText}). Silakan masuk terlebih dahulu untuk melanjutkan ke pembayaran.`,
      });
      return;
    }

    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addItem(buildCartPayload());
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const isSoldOut = product.stock_type === 'sold-out';

  if (isSoldOut) {
    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="p-4 rounded-2xl bg-[#F2EEEB] border border-[#E8D5C0] flex items-start gap-3">
          <span className="text-2xl shrink-0">⚠️</span>
          <div>
            <h4 className="text-sm font-bold text-[#1A1A1A]">
              Batch Ini Telah Habis Terjual (Sold Out)
            </h4>
            <p className="text-xs text-[#777] mt-1 leading-relaxed">
              Produk ini sangat diminati dan stok batch saat ini telah habis. Hubungi admin kami
              untuk memesan slot restock berikutnya!
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-2 pt-1">
          <a
            href={`https://wa.me/6281234567890?text=Halo+Nevermind,+tolong+kabari+saya+jika+produk+${encodeURIComponent(
              product.name
            )}+sudah+restock!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-center bg-[#1A1A1A] text-white hover:bg-black transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>💬</span> Ingatkan Saya Saat Restock (WhatsApp)
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pt-1">
      {/* ── Dynamic Multi-Attribute Options (Bahan, Ukuran, Warna, dll) ── */}
      {hasOptions ? (
        <div className="flex flex-col gap-5">
          {options.map((opt, optIndex) => {
            const currentSelectedValId = selectedOptions[opt.id];
            const currentSelectedVal = opt.values.find((v) => v.id === currentSelectedValId);

            return (
              <div key={opt.id} className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                    {options.length > 1 && (
                      <span className="w-4 h-4 rounded-full bg-[#1A1A1A] text-white text-[10px] inline-flex items-center justify-center font-mono">
                        {optIndex + 1}
                      </span>
                    )}
                    <span>{opt.name}:</span>
                  </span>
                  <span className="text-xs font-semibold text-[#9E1A59]">
                    {currentSelectedVal?.name}
                  </span>
                </div>

                {/* Option Rendering by Type */}
                {opt.type === 'color' ? (
                  (() => {
                    const hasThumbnails = opt.values.some(
                      (v) =>
                        v.image ||
                        (v.image_index !== undefined && product.images[v.image_index])
                    );

                    if (hasThumbnails) {
                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {opt.values.map((val) => {
                            const isSelected = currentSelectedValId === val.id;
                            const isAvailable = isOptionValueAvailable(opt.id, val.id);
                            const thumbnailImg =
                              val.image ||
                              (val.image_index !== undefined && product.images[val.image_index]
                                ? product.images[val.image_index]
                                : undefined);

                            return (
                              <button
                                key={val.id}
                                type="button"
                                onClick={() => handleSelectOption(opt.id, val)}
                                className={[
                                  'group relative flex items-center gap-2.5 p-2 rounded-2xl border text-xs transition-all cursor-pointer text-left',
                                  isSelected
                                    ? 'border-[#9E1A59] bg-[#FAF0F3] text-[#9E1A59] shadow-xs ring-2 ring-[#9E1A59]/25 font-bold'
                                    : isAvailable
                                      ? 'border-[#E8D5C0] bg-white text-[#333] hover:border-[#888] hover:bg-[#FAF0F3]/40'
                                      : 'border-[#E8D5C0]/60 bg-[#F9F9F9] text-[#AAA] opacity-60 hover:opacity-100',
                                ].join(' ')}
                                aria-pressed={isSelected}
                                aria-label={`Pilih warna ${val.name}${!isAvailable ? ' (Kombinasi terbatas)' : ''}`}
                              >
                                {thumbnailImg ? (
                                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#F2EEEB] shrink-0 border border-black/10">
                                    <Image
                                      src={thumbnailImg}
                                      alt={val.name}
                                      fill
                                      unoptimized
                                      sizes="48px"
                                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                  </div>
                                ) : (
                                  <span
                                    className="w-5 h-5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                                    style={{ backgroundColor: val.hex || '#EAEAEA' }}
                                  />
                                )}

                                <div className="flex flex-col min-w-0 pr-1">
                                  <span className="truncate text-xs">{val.name}</span>
                                  {!isAvailable && !isSelected && (
                                    <span className="text-[10px] text-[#A0959A] font-normal leading-tight">
                                      • PO
                                    </span>
                                  )}
                                </div>

                                {isSelected && (
                                  <span className="ml-auto w-4 h-4 rounded-full bg-[#9E1A59] text-white flex items-center justify-center shrink-0 text-[10px]">
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {opt.values.map((val) => {
                          const isSelected = currentSelectedValId === val.id;
                          const isAvailable = isOptionValueAvailable(opt.id, val.id);

                          return (
                            <button
                              key={val.id}
                              type="button"
                              onClick={() => handleSelectOption(opt.id, val)}
                              className={[
                                'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer',
                                isSelected
                                  ? 'border-[#9E1A59] bg-[#F2EEEB] text-[#9E1A59] shadow-xs ring-2 ring-[#9E1A59]/20 scale-102 font-bold'
                                  : isAvailable
                                    ? 'border-[#E8D5C0] bg-white text-[#444] hover:border-[#888] hover:bg-[#FAF0F3]'
                                    : 'border-[#E8D5C0]/60 bg-[#F9F9F9] text-[#AAA] opacity-60 hover:opacity-100',
                              ].join(' ')}
                              aria-pressed={isSelected}
                              aria-label={`Pilih warna ${val.name}${!isAvailable ? ' (Kombinasi terbatas)' : ''}`}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-black/15 shrink-0 shadow-2xs"
                                style={{ backgroundColor: val.hex || '#EAEAEA' }}
                              />
                              <span>{val.name}</span>
                              {isSelected && <span className="text-[#9E1A59] text-xs">✓</span>}
                              {!isAvailable && !isSelected && (
                                <span className="text-[9px] text-[#A0959A] font-normal">• PO</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()
                ) : opt.type === 'size' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {opt.values.map((val) => {
                      const isSelected = currentSelectedValId === val.id;
                      const isAvailable = isOptionValueAvailable(opt.id, val.id);

                      return (
                        <button
                          key={val.id}
                          type="button"
                          onClick={() => handleSelectOption(opt.id, val)}
                          className={[
                            'flex flex-col items-start p-3 rounded-2xl border text-xs transition-all cursor-pointer text-left',
                            isSelected
                              ? 'border-[#9E1A59] bg-white ring-2 ring-[#9E1A59]/25 shadow-xs'
                              : isAvailable
                                ? 'border-[#E8D5C0] bg-white/70 hover:border-[#888] hover:bg-white'
                                : 'border-[#E8D5C0]/60 bg-[#FAFAFA] text-[#AAA]',
                          ].join(' ')}
                          aria-pressed={isSelected}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span
                              className={[
                                'font-bold uppercase tracking-wide',
                                isSelected ? 'text-[#9E1A59]' : 'text-[#1A1A1A]',
                              ].join(' ')}
                            >
                              {val.name}
                            </span>
                            <span
                              className={[
                                'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px]',
                                isSelected
                                  ? 'border-[#9E1A59] bg-[#9E1A59] text-white'
                                  : 'border-[#E8D5C0]',
                              ].join(' ')}
                            >
                              {isSelected ? '✓' : ''}
                            </span>
                          </div>
                          {val.subtitle && (
                            <span className="text-[10px] text-[#8A7880] font-medium leading-tight">
                              {val.subtitle}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Standard / Material option buttons */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {opt.values.map((val) => {
                      const isSelected = currentSelectedValId === val.id;
                      const isAvailable = isOptionValueAvailable(opt.id, val.id);

                      return (
                        <button
                          key={val.id}
                          type="button"
                          onClick={() => handleSelectOption(opt.id, val)}
                          className={[
                            'flex items-center justify-between p-3 rounded-2xl border text-xs transition-all cursor-pointer text-left',
                            isSelected
                              ? 'border-[#9E1A59] bg-white ring-2 ring-[#9E1A59]/25 shadow-xs'
                              : isAvailable
                                ? 'border-[#E8D5C0] bg-white/70 hover:border-[#888] hover:bg-white'
                                : 'border-[#E8D5C0]/60 bg-[#FAFAFA] text-[#AAA]',
                          ].join(' ')}
                          aria-pressed={isSelected}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span
                              className={[
                                'font-bold text-xs',
                                isSelected ? 'text-[#9E1A59]' : 'text-[#1A1A1A]',
                              ].join(' ')}
                            >
                              {val.name}
                            </span>
                            {val.subtitle && (
                              <span className="text-[10px] text-[#8A7880] mt-0.5 line-clamp-1">
                                {val.subtitle}
                              </span>
                            )}
                          </div>
                          <span
                            className={[
                              'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px]',
                              isSelected
                                ? 'border-[#9E1A59] bg-[#9E1A59] text-white'
                                : 'border-[#E8D5C0]',
                            ].join(' ')}
                          >
                            {isSelected ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Legacy Variants & Colors fallback ── */
        <div className="flex flex-col gap-5">
          {legacyVariants.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Pilihan Varian / Tipe:
                </span>
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  {selectedVariant?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {legacyVariants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleSelectVariant(variant)}
                      className={[
                        'flex items-center justify-between p-3 rounded-2xl border text-xs transition-all cursor-pointer text-left',
                        isSelected
                          ? 'border-[#9E1A59] bg-white ring-2 ring-[#9E1A59]/25 shadow-xs'
                          : 'border-[#E8D5C0] bg-white/70 hover:border-[#888] hover:bg-white',
                      ].join(' ')}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={[
                            'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px]',
                            isSelected
                              ? 'border-[#9E1A59] bg-[#9E1A59] text-white'
                              : 'border-[#E8D5C0]',
                          ].join(' ')}
                        >
                          {isSelected ? '✓' : ''}
                        </span>
                        <span
                          className={[
                            'font-semibold truncate',
                            isSelected ? 'text-[#1A1A1A]' : 'text-[#555]',
                          ].join(' ')}
                        >
                          {variant.name}
                        </span>
                      </div>

                      {variant.price_delta ? (
                        <span className="text-[11px] font-bold text-[#9E1A59] shrink-0 ml-2">
                          +{formatIDR(variant.price_delta)}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {legacyColors.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Pilihan Warna:
                </span>
                <span className="text-xs font-semibold text-[#9E1A59]">{selectedColor?.name}</span>
              </div>

              {(() => {
                const hasThumbnails = legacyColors.some(
                  (c) => c.image || (c.image_index !== undefined && product.images[c.image_index])
                );

                if (hasThumbnails) {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {legacyColors.map((color) => {
                        const isSelected = selectedColor?.name === color.name;
                        const thumbnailImg =
                          color.image ||
                          (color.image_index !== undefined && product.images[color.image_index]
                            ? product.images[color.image_index]
                            : undefined);

                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => handleSelectColor(color)}
                            className={[
                              'group relative flex items-center gap-2.5 p-2 rounded-2xl border text-xs transition-all cursor-pointer text-left',
                              isSelected
                                ? 'border-[#9E1A59] bg-[#FAF0F3] text-[#9E1A59] shadow-xs ring-2 ring-[#9E1A59]/25 font-bold'
                                : 'border-[#E8D5C0] bg-white text-[#333] hover:border-[#888] hover:bg-[#FAF0F3]/40',
                            ].join(' ')}
                            aria-pressed={isSelected}
                            aria-label={`Pilih warna ${color.name}`}
                          >
                            {thumbnailImg ? (
                              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#F2EEEB] shrink-0 border border-black/10">
                                <Image
                                  src={thumbnailImg}
                                  alt={color.name}
                                  fill
                                  unoptimized
                                  sizes="48px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                            ) : (
                              <span
                                className="w-5 h-5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                                style={{ backgroundColor: color.hex }}
                              />
                            )}

                            <span className="truncate text-xs">{color.name}</span>
                            {isSelected && (
                              <span className="ml-auto w-4 h-4 rounded-full bg-[#9E1A59] text-white flex items-center justify-center shrink-0 text-[10px]">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div className="flex items-center gap-3 flex-wrap">
                    {legacyColors.map((color) => {
                      const isSelected = selectedColor?.name === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => handleSelectColor(color)}
                          className={[
                            'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer',
                            isSelected
                              ? 'border-[#9E1A59] bg-[#F2EEEB] text-[#9E1A59] shadow-xs ring-2 ring-[#9E1A59]/20 scale-102'
                              : 'border-[#E8D5C0] bg-white text-[#444] hover:border-[#888] hover:bg-[#FAF0F3]',
                          ].join(' ')}
                          aria-pressed={isSelected}
                          aria-label={`Pilih warna ${color.name}`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/15 shrink-0 shadow-2xs"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                          {isSelected && <span className="text-[#9E1A59] text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ── Dynamic Price Display for Selected Combination (only if price varies) ── */}
      {hasPriceVariation && (
        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C0] flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8A7880] uppercase tracking-wider font-bold">
              Harga Varian Terpilih:
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg sm:text-xl font-black text-[#9E1A59]">
                {formatIDR(currentUnitPrice)}
              </span>
              {currentOriginalPrice && currentOriginalPrice > currentUnitPrice && (
                <>
                  <span className="text-xs text-[#A0959A] line-through font-semibold">
                    {formatIDR(currentOriginalPrice)}
                  </span>
                  <span className="text-[10px] font-black text-[#9E1A59] bg-[#FAF0F3] px-2 py-0.5 rounded-full border border-[#9E1A59]/30">
                    -{Math.round(((currentOriginalPrice - currentUnitPrice) / currentOriginalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {product.stock_type === 'ready-stock' ? '✓ Ready Stock' : '⏳ Pre-Order'}
            </span>
          </div>
        </div>
      )}

      {/* ── Quantity Stepper & Subtotal Summary ── */}
      <div className="flex items-center justify-between pt-1 pb-1 border-t border-b border-[#E8D5C0] py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#8A7880] uppercase tracking-wider">Jumlah:</span>
          <div className="flex items-center bg-[#F2EEEB] border border-[#E8D5C0] rounded-xl overflow-hidden h-9">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:text-[#9E1A59] font-bold text-sm transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Kurangi jumlah"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#1A1A1A]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-8 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:text-[#9E1A59] font-bold text-sm transition-colors cursor-pointer"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-[#8A7880] block">Subtotal:</span>
          <span className="text-base sm:text-lg font-black text-[#9E1A59]">
            {formatIDR(currentUnitPrice * quantity)}
          </span>
        </div>
      </div>

      {/* ── Desktop Inline Buttons ── */}
      <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-1">
        <Button
          id={`pdp-add-cart-desktop-${product.id}`}
          variant="outline"
          size="lg"
          onClick={handleAddToCart}
          className="flex-1"
        >
          {addedFeedback ? '✓ Ditambahkan!' : '+ Keranjang'}
        </Button>
        <Button
          id={`pdp-buy-now-desktop-${product.id}`}
          variant="primary"
          size="lg"
          onClick={handleBuyNow}
          className="flex-1 shadow-md shadow-[#9E1A59]/25"
        >
          {product.stock_type === 'pre-order' ? 'Pre-Order Sekarang' : 'Beli Sekarang'}
        </Button>
      </div>

      {/* ── Mobile Fixed Bottom Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F2EEEB]/95 backdrop-blur-md border-t border-[#E8D5C0] px-4 py-3 z-40">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-[#8A7880] block truncate">
              Total ({quantity} item)
            </span>
            <span className="text-sm font-extrabold text-[#9E1A59] truncate block">
              {formatIDR(currentUnitPrice * quantity)}
            </span>
          </div>

          <Button
            id={`pdp-add-cart-${product.id}`}
            variant="outline"
            size="md"
            onClick={handleAddToCart}
            className="px-3 text-xs"
          >
            {addedFeedback ? '✓' : '+ Keranjang'}
          </Button>
          <Button
            id={`pdp-buy-now-${product.id}`}
            variant="primary"
            size="md"
            onClick={handleBuyNow}
            className="px-4 text-xs font-bold shadow-xs"
          >
            {product.stock_type === 'pre-order' ? 'Pre-Order' : 'Beli'}
          </Button>
        </div>
      </div>
    </div>
  );
}

