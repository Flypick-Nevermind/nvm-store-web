'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/api';

const getItemKey = (item: CartItem): string =>
  item.key || `${item.productId}-${item.variant || 'default'}-${item.color || 'default'}`;

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (keyOrProductId: string) => void;
  updateQuantity: (keyOrProductId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const key = getItemKey(item);
          const fullItem = { ...item, key };
          const existingIndex = state.items.findIndex((i) => getItemKey(i) === key);

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + item.quantity,
            };
            return { items: updated };
          }

          return { items: [...state.items, fullItem] };
        }),

      removeItem: (keyOrProductId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => (i.key || getItemKey(i)) !== keyOrProductId && i.productId !== keyOrProductId
          ),
        })),

      updateQuantity: (keyOrProductId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter(
                  (i) => (i.key || getItemKey(i)) !== keyOrProductId && i.productId !== keyOrProductId
                )
              : state.items.map((i) =>
                  (i.key || getItemKey(i)) === keyOrProductId || i.productId === keyOrProductId
                    ? { ...i, quantity: qty }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'nvm-cart',
    }
  )
);
