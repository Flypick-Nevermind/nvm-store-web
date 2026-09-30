'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/api';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (product: Product) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state;
          return { items: [product, ...state.items] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),

      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.some((i) => i.id === product.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== product.id) });
          return false;
        } else {
          set({ items: [product, ...items] });
          return true;
        }
      },

      isInWishlist: (productId) => get().items.some((i) => i.id === productId),

      clearWishlist: () => set({ items: [] }),

      totalItems: () => get().items.length,
    }),
    {
      name: 'nvm-wishlist',
    }
  )
);
