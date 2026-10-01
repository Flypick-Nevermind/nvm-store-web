'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address, AddressInput } from '@/types/address';

interface AddressStore {
  addresses: Address[];
  selectedAddressId: string | null;
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

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: DEFAULT_ADDRESSES,
      selectedAddressId: 'addr_1',

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
          };
        });

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
