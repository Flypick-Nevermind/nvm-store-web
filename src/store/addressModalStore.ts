'use client';

import { create } from 'zustand';
import type { Address } from '@/types/address';

interface AddressModalStore {
  isOpen: boolean;
  editingAddress: Address | null;
  openModal: (addressToEdit?: Address | null) => void;
  closeModal: () => void;
}

export const useAddressModalStore = create<AddressModalStore>((set) => ({
  isOpen: false,
  editingAddress: null,
  openModal: (addressToEdit = null) => set({ isOpen: true, editingAddress: addressToEdit }),
  closeModal: () => set({ isOpen: false, editingAddress: null }),
}));
