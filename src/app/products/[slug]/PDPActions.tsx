'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { formatIDR } from '@/lib/utils';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import type { Product, ProductColor, ProductVariant } from '@/types/api';

interface PDPActionsProps {
  product: Product;
}

export function PDPActions({ product }: PDPActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.openModal);

  const colors = product.colors || [];
  const variants = product.variants || [];

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    colors.length > 0 ? colors[0] : null
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const currentUnitPrice = product.price_base + (selectedVariant?.price_delta || 0);

  const buildCartPayload = () => ({
    productId: product.id,
    key: `${product.id}-${selectedVariant?.id || 'default'}-${selectedColor?.name || 'default'}`,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    price: currentUnitPrice,
    quantity,
    type: product.stock_type,
    color: selectedColor?.name,
    variant: selectedVariant?.name,
    price_import_duty: product.price_import_duty,
    price_shipping: product.price_shipping,
  });

  const handleBuyNow = () => {
    addItem(buildCartPayload());

    if (!isAuthenticated) {
      openAuthModal({
        redirectUrl: '/checkout',
        productName: product.name,
        title: 'Masuk untuk Checkout',
        message: `Kamu akan memesan ${product.name} (${[selectedColor?.name, selectedVariant?.name].filter(Boolean).join(' • ')}). Silakan masuk terlebih dahulu untuk melanjutkan ke pembayaran.`,
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
        {/* Sold out notice card */}
        <div className="p-4 rounded-2xl bg-[#F2EEEB] border border-[#E8D5C0] flex items-start gap-3">
          <span className="text-2xl shrink-0">⚠️</span>
          <div>
            <h4 className="text-sm font-bold text-[#1A1A1A]">Batch Ini Telah Habis Terjual (Sold Out)</h4>
            <p className="text-xs text-[#777] mt-1 leading-relaxed">
              Produk ini sangat diminati dan stok batch saat ini telah habis. Hubungi admin kami untuk memesan slot restock berikutnya!
            </p>
          </div>
        </div>

        {/* Desktop notification button */}
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

        {/* Mobile fixed bottom bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F2EEEB]/95 backdrop-blur-md border-t border-[#E8D5C0] px-4 py-3 z-40">
          <a
            href={`https://wa.me/6281234567890?text=Halo+Nevermind,+tolong+kabari+saya+jika+produk+${encodeURIComponent(
              product.name
            )}+sudah+restock!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#1A1A1A] text-white flex items-center justify-center gap-2"
          >
            <span>💬</span> Notifikasi Restock via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pt-1">
      {/* ── 1. Color Selector ── */}
      {colors.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              Pilihan Warna:
            </span>
            <span className="text-xs font-semibold text-[#9E1A59]">{selectedColor?.name}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {colors.map((color) => {
              const isSelected = selectedColor?.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
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
        </div>
      )}

      {/* ── 2. Variant / Model Selector ── */}
      {variants.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              Pilihan Varian / Tipe:
            </span>
            <span className="text-xs font-semibold text-[#1A1A1A]">{selectedVariant?.name}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
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

      {/* ── 3. Quantity Stepper & Price Summary ── */}
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

      {/* ── 4. Desktop Inline Buttons ── */}
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

      {/* ── 5. Mobile Fixed Bottom Bar ── */}
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
