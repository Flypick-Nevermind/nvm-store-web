import { create } from 'zustand';

interface RequestBagModalState {
  isOpen: boolean;
  initialBagName?: string;
  openModal: (initialBagName?: string) => void;
  closeModal: () => void;
}

export const useRequestBagModalStore = create<RequestBagModalState>((set) => ({
  isOpen: false,
  initialBagName: undefined,
  openModal: (initialBagName) => set({ isOpen: true, initialBagName }),
  closeModal: () => set({ isOpen: false, initialBagName: undefined }),
}));
