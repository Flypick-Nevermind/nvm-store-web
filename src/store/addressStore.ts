'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAddressApi, fetchAddressesApi } from '@/lib/api/address';
import { getUserIdFromToken } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { Address, AddressInput } from '@/types/address';

interface AddressStore {
  addresses: Address[];
  selectedAddressId: string | null;
  defaultAddressId: string | null;
  isSyncing: boolean;
  /** Load addresses from backend for the logged-in user (no-op for guest/demo). */
  syncFromServer: () => Promise<void>;
  addAddress: (address: AddressInput) => Address;
  updateAddress: (id: string, updates: Partial<AddressInput>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectAddress: (id: string | null) => void;
  getDefaultAddress: () => Address | undefined;
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr_1',
    label: 'Rumah',
    recipient_name: 'Jessica Tanuwijaya',
    whatsapp_number: '081298765432',
    street_address: 'Jl. Senopati No. 45, RT 03/RW 02',
    district: 'Kebayoran Baru',
    city: 'Jakarta Selatan',
    postal_code: '12190',
    is_default: true,
  },
  {
    id: 'addr_2',
    label: 'Kantor',
    recipient_name: 'Jessica (Office)',
    whatsapp_number: '081298765432',
    street_address: 'Gedung The Breeze Lt. 3, BSD Green Office Park',
    district: 'Cisauk',
    city: 'Kab. Tangerang',
    postal_code: '15345',
    is_default: false,
  },
];

/** Returns the real backend user id, or null for guest / demo sessions. */
function getRemoteUserId(): string | null {
  const { user, token, isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated || !user || !token || token === 'demo_jwt_token') return null;
  // Older sessions stored a generated fake id (usr_<timestamp>); prefer the id inside the JWT.
  return getUserIdFromToken(token) ?? user.id;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: DEFAULT_ADDRESSES,
      selectedAddressId: 'addr_1',
      defaultAddressId: 'addr_1',
      isSyncing: false,

      syncFromServer: async () => {
        const userId = getRemoteUserId();
        if (!userId) return;
        set({ isSyncing: true });
        try {
          const remote = await fetchAddressesApi(userId);
          set((state) => {
            const defaultId =
              remote.find((a) => a.id === state.defaultAddressId)?.id ?? remote[0]?.id ?? null;
            const list = remote.map((a) => ({ ...a, is_default: a.id === defaultId }));
            const selected =
              list.find((a) => a.id === state.selectedAddressId)?.id ?? defaultId;
            return {
              addresses: list,
              defaultAddressId: defaultId,
              selectedAddressId: selected,
              isSyncing: false,
            };
          });
        } catch {
          set({ isSyncing: false });
        }
      },

      addAddress: (input) => {
        const newAddress: Address = {
          ...input,
          id: `addr_${Date.now()}`,
        };

        set((state) => {
          let updated = [...state.addresses];
          if (newAddress.is_default) {
            updated = updated.map((a) => ({ ...a, is_default: false }));
          }
          return {
            addresses: [newAddress, ...updated],
            selectedAddressId: newAddress.id,
            defaultAddressId: newAddress.is_default ? newAddress.id : state.defaultAddressId,
          };
        });

        // Persist to backend, then refresh list so ids match the server.
        const userId = getRemoteUserId();
        if (userId) {
          createAddressApi(userId, input)
            .then(() => get().syncFromServer())
            .catch(() => {
              // Keep optimistic local copy if the request fails.
            });
        }

        return newAddress;
      },

      updateAddress: (id, updates) => {
        set((state) => {
          const updated = state.addresses.map((addr) => {
            if (addr.id === id) {
              return { ...addr, ...updates };
            }
            if (updates.is_default) {
              return { ...addr, is_default: false };
            }
            return addr;
          });
          return { addresses: updated };
        });
      },

      deleteAddress: (id) => {
        set((state) => {
          const filtered = state.addresses.filter((a) => a.id !== id);
          // If deleted address was default and items remain, make first one default
          if (filtered.length > 0 && !filtered.some((a) => a.is_default)) {
            filtered[0].is_default = true;
          }
          return {
            addresses: filtered,
            selectedAddressId:
              state.selectedAddressId === id ? filtered[0]?.id || null : state.selectedAddressId,
          };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            is_default: a.id === id,
          })),
          defaultAddressId: id,
          selectedAddressId: id,
        }));
      },

      selectAddress: (id) => {
        set({ selectedAddressId: id });
      },

      getDefaultAddress: () => {
        const list = get().addresses;
        return list.find((a) => a.is_default) || list[0];
      },
    }),
    {
      name: 'nvm-addresses',
    }
  )
);
