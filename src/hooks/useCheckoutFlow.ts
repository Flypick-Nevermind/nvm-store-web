'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BRAND } from '@/constants/brand';
import { buildWhatsAppRedirectUrl } from '@/constants/payment';
import { useCreateOrder } from '@/lib/api/orders';
import type { BuyerFormData } from '@/lib/schemas/checkout.schema';
import { formatIDR } from '@/lib/utils';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';

export function useCheckoutFlow() {
  const router = useRouter();
  const {
    step,
    setStep,
    buyerData,
    setBuyerData,
    setOrderId,
    setProofFile,
    paymentMethod,
    setPaymentMethod,
  } = useCheckoutStore();

  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.openModal);
  const createOrder = useCreateOrder();

  const [mounted, setMounted] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // Restore voucher from session storage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedVoucher = sessionStorage.getItem('nvm_applied_voucher');
      if (savedVoucher && savedVoucher.toUpperCase() === 'NVM5') {
        setAppliedVoucher('NVM5');
      }
    }
  }, []);

  const subtotal = totalPrice;
  const importDutyTotal = items.reduce(
    (sum, item) => sum + (item.price_import_duty ?? 35000) * item.quantity,
    0
  );
  const shippingTotal = items.length > 0 ? 20000 : 0;
  const isVoucher5 = appliedVoucher?.toUpperCase() === 'NVM5';
  const discountAmount = isVoucher5 ? Math.round(subtotal * 0.05) : 0;
  const finalTotal = Math.max(0, subtotal + importDutyTotal + shippingTotal - discountAmount);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'NVM5') {
      setAppliedVoucher('NVM5');
      setVoucherError(null);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nvm_applied_voucher', 'NVM5');
      }
    } else {
      setVoucherError('Kode voucher tidak valid atau sudah kedaluwarsa.');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('nvm_applied_voucher');
    }
  };

  // Auth guard
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      openAuthModal({
        redirectUrl: '/checkout',
        title: 'Masuk untuk Melanjutkan Checkout',
        message:
          'Untuk mengisi data pengiriman dan memproses pembayaran, silakan masuk ke akun NEVERMIND terlebih dahulu.',
        onCancelUrl: '/',
      });
    }
  }, [mounted, isAuthenticated, openAuthModal]);

  const handleStep1 = (data: BuyerFormData) => {
    setBuyerData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2 = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3 = async (file: File) => {
    if (!buyerData) return;
    setProofFile(file);

    try {
      const result = await createOrder.mutateAsync({
        buyer_name: buyerData.full_name,
        whatsapp_number: buyerData.whatsapp_number,
        address: {
          street: buyerData.street_address,
          district: buyerData.district,
          city: buyerData.city,
          postal_code: buyerData.postal_code,
        },
        items: items.map((i) => ({
          product_id: i.productId,
          name: i.name,
          quantity: i.quantity,
          unit_price: i.price,
          type: i.type,
          image: i.image,
        })),
        agreed_to_terms: true,
        total_amount: finalTotal,
        payment_method: paymentMethod || 'bca',
        payment_proof_url: file ? URL.createObjectURL(file) : undefined,
        voucher_code: appliedVoucher || undefined,
        discount_amount: discountAmount > 0 ? discountAmount : undefined,
      });

      const orderId = result.data.order_id;
      setOrderId(orderId);
      clearCart();

      // Build WA redirect
      const waUrl = buildWhatsAppRedirectUrl({
        whatsappNumber: BRAND.whatsappNumber,
        orderId,
        buyerName: buyerData.full_name,
        items: items.map((i) => `${i.name} (x${i.quantity})`).join(', '),
        totalAmount: formatIDR(finalTotal),
        subtotal: formatIDR(subtotal),
        shippingFee: formatIDR(shippingTotal),
        importDuty: importDutyTotal > 0 ? formatIDR(importDutyTotal) : undefined,
        voucherCode: appliedVoucher || undefined,
        discountAmount: discountAmount > 0 ? formatIDR(discountAmount) : undefined,
      });

      router.push(`/checkout/success?orderId=${orderId}&wa=${encodeURIComponent(waUrl)}`);
    } catch {
      alert('Terjadi kesalahan. Coba lagi atau hubungi admin.');
    }
  };

  return {
    step,
    setStep,
    items,
    totalPrice,
    subtotal,
    importDutyTotal,
    shippingTotal,
    totalQuantity,
    updateQuantity,
    removeItem,
    buyerData,
    paymentMethod,
    setPaymentMethod,
    voucherInput,
    setVoucherInput,
    appliedVoucher,
    voucherError,
    setVoucherError,
    handleApplyVoucher,
    handleRemoveVoucher,
    discountAmount,
    finalTotal,
    handleStep1,
    handleStep2,
    handleStep3,
    isSubmitting: createOrder.isPending,
    mounted,
  };
}
