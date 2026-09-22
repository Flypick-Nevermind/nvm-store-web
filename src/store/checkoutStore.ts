'use client';

import { create } from 'zustand';
import type { BuyerFormData } from '@/lib/schemas/checkout.schema';

type CheckoutStep = 1 | 2 | 3;

interface CheckoutStore {
  step: CheckoutStep;
  buyerData: BuyerFormData | null;
  orderId: string | null;
  proofFile: File | null;
  setStep: (step: CheckoutStep) => void;
  setBuyerData: (data: BuyerFormData) => void;
  setOrderId: (id: string) => void;
  setProofFile: (file: File) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()((set) => ({
  step: 1,
  buyerData: null,
  orderId: null,
  proofFile: null,

  setStep: (step) => set({ step }),
  setBuyerData: (data) => set({ buyerData: data }),
  setOrderId: (id) => set({ orderId: id }),
  setProofFile: (file) => set({ proofFile: file }),
  reset: () =>
    set({ step: 1, buyerData: null, orderId: null, proofFile: null }),
}));
