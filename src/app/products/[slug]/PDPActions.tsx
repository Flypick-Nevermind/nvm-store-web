'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import type { Product } from '@/types/api';

interface PDPActionsProps {
  product: Product;
}

export function PDPActions({ product }: PDPActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.openModal);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price_total,
      quantity: 1,
      type: product.stock_type,
    });

    if (!isAuthenticated) {
      openAuthModal({
        redirectUrl: '/checkout',
        productName: product.name,
        title: 'Masuk untuk Checkout',
        message: `Kamu akan memesan ${product.name}. Silakan masuk atau daftar akun terlebih dahulu untuk melanjutkan ke pembayaran.`,
      });
      return;
    }

    router.push('/checkout');
  };

  const handleAddToCart = () => {
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
    <>
      {/* Desktop inline CTA */}
      <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-2">
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
          className="flex-1"
        >
          {product.stock_type === 'pre-order' ? 'Pre-Order Sekarang' : 'Beli Sekarang'}
        </Button>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FFF8E1]/95 backdrop-blur-md border-t border-[#C8C8C8]/40 px-4 py-3 z-40">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            id={`pdp-add-cart-${product.id}`}
            variant="outline"
            size="lg"
            onClick={handleAddToCart}
            className="flex-1"
          >
            {addedFeedback ? '✓ Ditambahkan!' : '+ Keranjang'}
          </Button>
          <Button
            id={`pdp-buy-now-${product.id}`}
            variant="primary"
            size="lg"
            onClick={handleBuyNow}
            className="flex-1"
          >
            {product.stock_type === 'pre-order' ? 'Pre-Order Sekarang' : 'Beli Sekarang'}
          </Button>
        </div>
      </div>
    </>
  );
}
