import { create } from 'zustand';

interface OpenModalOptions {
  redirectUrl?: string;
  title?: string;
  message?: string;
  badgeText?: string;
  productName?: string;
  onCancelUrl?: string;
}

interface AuthModalState {
  isOpen: boolean;
  redirectUrl: string;
  title?: string;
  message?: string;
  badgeText?: string;
  productName?: string;
  onCancelUrl?: string;
  openModal: (options?: OpenModalOptions) => void;
  closeModal: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  redirectUrl: '/checkout',
  title: undefined,
  message: undefined,
  badgeText: undefined,
  productName: undefined,
  onCancelUrl: undefined,
  openModal: (options) =>
    set({
      isOpen: true,
      redirectUrl: options?.redirectUrl || '/checkout',
      title: options?.title,
      message: options?.message,
      badgeText: options?.badgeText,
      productName: options?.productName,
      onCancelUrl: options?.onCancelUrl,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      title: undefined,
      message: undefined,
      badgeText: undefined,
      productName: undefined,
      onCancelUrl: undefined,
    }),
}));
