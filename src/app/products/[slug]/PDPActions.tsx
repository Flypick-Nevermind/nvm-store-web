'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/api';

interface PDPActionsProps {
  product: Product;
}

export function PDPActions({ product }: PDPActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

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
          + Keranjang
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
            + Keranjang
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
