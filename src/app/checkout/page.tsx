'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { PageShell } from '@/components/layouts/PageShell';
import { BankCard } from '@/components/molecules/BankCard';
import { FileUploader } from '@/components/molecules/FileUploader';
import { BRAND } from '@/constants/brand';
import { BANK_ACCOUNTS, buildWhatsAppRedirectUrl, QRIS_IMAGE_PATH } from '@/constants/payment';
import { useCreateOrder } from '@/lib/api/orders';
import { type BuyerFormData, buyerFormSchema } from '@/lib/schemas/checkout.schema';
import { formatIDR } from '@/lib/utils';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Data Diri' },
  { id: 2, label: 'Pembayaran' },
  { id: 3, label: 'Konfirmasi' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6" aria-label="Langkah checkout">
      {STEPS.map((s, idx) => (
        <div key={s.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                current > s.id
                  ? 'bg-[#9E1A59] text-white'
                  : current === s.id
                    ? 'bg-[#9E1A59] text-white ring-4 ring-[#9E1A59]/20'
                    : 'bg-[#C8C8C8]/30 text-[#C8C8C8]',
              ].join(' ')}
              aria-current={current === s.id ? 'step' : undefined}
            >
              {current > s.id ? (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 14 14"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
                </svg>
              ) : (
                s.id
              )}
            </div>
            <span
              className={`text-[10px] font-medium whitespace-nowrap ${current >= s.id ? 'text-[#9E1A59]' : 'text-[#C8C8C8]'}`}
            >
              {s.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-px w-12 mx-1 mb-4 transition-colors duration-300 ${current > s.id ? 'bg-[#9E1A59]' : 'bg-[#C8C8C8]/40'}`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1 — Buyer Form ──────────────────────────────────────────────────────

function Step1Form({ onNext }: { onNext: (data: BuyerFormData) => void }) {
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerFormSchema),
    defaultValues: {
      full_name: user?.name || '',
      whatsapp_number: user?.whatsapp_number || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-4">
        <Input
          label="Nama Lengkap"
          placeholder="Rikha Amalia"
          required
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Nomor WhatsApp"
          placeholder="081234567890"
          type="tel"
          inputMode="numeric"
          required
          hint="Format: 08... atau 628..."
          error={errors.whatsapp_number?.message}
          {...register('whatsapp_number')}
        />
        <Input
          label="Alamat Lengkap"
          placeholder="Jl. Cempaka No. 7, RT 02/RW 05"
          required
          error={errors.street_address?.message}
          {...register('street_address')}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Kecamatan"
            placeholder="Kebayoran Baru"
            required
            error={errors.district?.message}
            {...register('district')}
          />
          <Input
            label="Kota/Kabupaten"
            placeholder="Jakarta Selatan"
            required
            error={errors.city?.message}
            {...register('city')}
          />
        </div>
        <Input
          label="Kode Pos"
          placeholder="12140"
          inputMode="numeric"
          maxLength={5}
          required
          error={errors.postal_code?.message}
          {...register('postal_code')}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Checkbox
          label="Saya mengerti produk ini adalah Pre-Order dan membutuhkan waktu 2–3 minggu pengiriman dari China."
          error={errors.agree_po_terms?.message}
          {...register('agree_po_terms')}
        />
        <Checkbox
          label="Saya setuju bahwa pesanan Pre-Order tidak dapat dibatalkan setelah pembayaran dikonfirmasi."
          error={errors.agree_no_cancel?.message}
          {...register('agree_no_cancel')}
        />
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth>
        Lanjut ke Pembayaran →
      </Button>
    </form>
  );
}

// ─── Step 2 — Payment Instructions ───────────────────────────────────────────

function Step2Payment({
  selectedMethod,
  onSelectMethod,
  onNext,
}: {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-bold text-[#1A1A1A]">Pilih Metode Pembayaran</h2>
        <p className="text-sm text-[#888]">Pilih salah satu rekening atau QRIS di bawah ini.</p>
      </div>

      <div className="flex flex-col gap-3">
        {BANK_ACCOUNTS.map((acc) => {
          const isSelected = selectedMethod === acc.id;
          return (
            <div
              key={acc.id}
              onClick={() => onSelectMethod(acc.id)}
              className={[
                'rounded-2xl transition-all cursor-pointer border-2 p-1.5',
                isSelected ? 'border-[#9E1A59] bg-[#FFF0F5]/40 shadow-xs' : 'border-transparent hover:border-[#E8D5C0]',
              ].join(' ')}
            >
              <div className="flex items-center gap-2 px-3 pt-2">
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#9E1A59]' : 'border-[#BBB]'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#9E1A59]" />}
                </span>
                <span className="text-xs font-bold text-[#1A1A1A]">Transfer Bank {acc.bank}</span>
              </div>
              <BankCard
                bank={acc.bank}
                accountNumber={acc.accountNumber}
                accountHolder={acc.accountHolder}
              />
            </div>
          );
        })}

        {/* QRIS */}
        <div
          onClick={() => onSelectMethod('qris')}
          className={[
            'rounded-2xl transition-all cursor-pointer border-2 p-4 flex flex-col items-center gap-2 bg-white',
            selectedMethod === 'qris'
              ? 'border-[#9E1A59] bg-[#FFF0F5]/40 shadow-xs'
              : 'border-[#C8C8C8]/60 hover:border-[#E8D5C0]',
          ].join(' ')}
        >
          <div className="w-full flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'qris' ? 'border-[#9E1A59]' : 'border-[#BBB]'
                }`}
              >
                {selectedMethod === 'qris' && <span className="w-2 h-2 rounded-full bg-[#9E1A59]" />}
              </span>
              <p className="text-xs font-bold text-[#1A1A1A]">Pembayaran Instan QRIS</p>
            </div>
            <span className="text-[10px] font-bold text-[#1A6B5C] bg-[#D8FFF7] px-2 py-0.5 rounded-full">
              Semua E-Wallet & M-Banking
            </span>
          </div>

          <div className="relative w-44 h-44 my-1">
            <Image
              src={QRIS_IMAGE_PATH}
              alt="QRIS NEVERMIND — scan untuk bayar"
              fill
              className="object-contain"
              onError={() => {}}
            />
          </div>
          <p className="text-xs text-[#888] text-center">
            Screenshot QRIS → buka m-banking / e-wallet → upload & scan QR
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#FDFD96]/40 border border-[#FDFD96] p-4">
        <p className="text-xs text-[#5C5C00] leading-relaxed">
          ⚠️ <strong>Penting:</strong> Transfer sesuai total yang tertera. Jangan tambah atau kurangi
          nominal agar pesananmu langsung otomatis terverifikasi.
        </p>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={onNext}>
        Sudah Transfer, Upload Bukti →
      </Button>
    </div>
  );
}

// ─── Step 3 — Proof Upload & Submit ──────────────────────────────────────────

function Step3Upload({
  onSubmit,
  isLoading,
}: {
  onSubmit: (file: File) => void;
  isLoading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!file) {
      setError('Upload bukti transfer dulu ya!');
      return;
    }
    setError(null);
    onSubmit(file);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold text-[#1A1A1A]">Upload Bukti Transfer</h2>
        <p className="text-sm text-[#888]">Foto / screenshot bukti transfer dari app bankmu.</p>
      </div>

      <FileUploader onFileSelect={setFile} error={error ?? undefined} />

      <Button
        id="checkout-submit-btn"
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Memproses...' : 'Konfirmasi & Hubungi Admin 🚀'}
      </Button>
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────

export default function CheckoutPage() {
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

  const isVoucher5 = appliedVoucher?.toUpperCase() === 'NVM5';
  const discountAmount = isVoucher5 ? Math.round(totalPrice * 0.05) : 0;
  const finalTotal = Math.max(0, totalPrice - discountAmount);

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
        voucherCode: appliedVoucher || undefined,
        discountAmount: discountAmount > 0 ? formatIDR(discountAmount) : undefined,
      });

      router.push(`/checkout/success?orderId=${orderId}&wa=${encodeURIComponent(waUrl)}`);
    } catch {
      alert('Terjadi kesalahan. Coba lagi atau hubungi admin.');
    }
  };

  if (!mounted) {
    return (
      <PageShell showFooter={false}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-7 w-40 bg-[#C8C8C8]/40 rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-white rounded-3xl border border-[#C8C8C8]/50 p-6" />
              <div className="lg:col-span-5 h-80 bg-white rounded-3xl border border-[#C8C8C8]/50 p-6" />
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (items.length === 0) {
    return (
      <PageShell showFooter={false}>
        <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
          <span className="text-6xl" aria-hidden="true">
            🛒
          </span>
          <h1 className="text-2xl font-display font-bold text-[#1A1A1A]">Keranjangmu kosong</h1>
          <p className="text-sm text-[#888]">
            Tambahkan produk favoritmu dari katalog sebelum checkout ya!
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push('/')}>
            Lihat Katalog Sekarang
          </Button>
        </div>
      </PageShell>
    );
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PageShell showFooter={false}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A]">
            Checkout Pesanan
          </h1>
          <p className="text-xs sm:text-sm text-[#888] mt-1">
            Selesaikan pembelianmu dengan aman dalam 3 langkah mudah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 3-Step Wizard */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            <StepIndicator current={step} />

            <div className="bg-white rounded-3xl border border-[#C8C8C8]/50 p-5 sm:p-7 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                >
                  {step === 1 && <Step1Form onNext={handleStep1} />}
                  {step === 2 && (
                    <Step2Payment
                      selectedMethod={paymentMethod}
                      onSelectMethod={setPaymentMethod}
                      onNext={handleStep2}
                    />
                  )}
                  {step === 3 && (
                    <Step3Upload onSubmit={handleStep3} isLoading={createOrder.isPending} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Order Summary Card (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-4 order-1 lg:order-2">
            <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8D5C0]">
                <p className="text-xs font-bold text-[#8A7880] uppercase tracking-wider">
                  Ringkasan Pesanan ({totalQuantity} item)
                </p>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-[#9E1A59] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    ✏️ Ubah Item
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                {items.map((item) => {
                  const itemIdentifier = item.key || item.productId;
                  return (
                    <div
                      key={itemIdentifier}
                      className="flex items-center gap-3 py-2 border-b border-[#E8D5C0] last:border-b-0"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FFF8E1] shrink-0 border border-[#E8D5C0]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-[#FFF8E1] text-[#1A1A1A] border border-[#E8D5C0] mb-0.5">
                          {item.type === 'pre-order' ? 'PO 14-21 Hari' : 'Ready Stock'}
                        </span>
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.name}</p>
                        {(item.color || item.variant) && (
                          <p className="text-[11px] text-[#9E1A59] font-semibold truncate">
                            {[item.color, item.variant].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        <p className="text-xs text-[#8A7880]">{formatIDR(item.price)}</p>
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center gap-1.5">
                          {/* Stepper */}
                          <div className="flex items-center bg-[#FFF8E1] border border-[#E8D5C0] rounded-lg overflow-hidden h-7">
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemIdentifier, item.quantity - 1)}
                              className="w-6 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:text-[#9E1A59] font-bold text-xs transition-colors cursor-pointer"
                              aria-label="Kurangi kuantitas"
                              title={item.quantity === 1 ? 'Hapus barang' : 'Kurangi kuantitas'}
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-[#1A1A1A]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemIdentifier, item.quantity + 1)}
                              className="w-6 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:text-[#9E1A59] font-bold text-xs transition-colors cursor-pointer"
                              aria-label="Tambah kuantitas"
                            >
                              +
                            </button>
                          </div>

                          {/* Delete action */}
                          <button
                            type="button"
                            onClick={() => removeItem(itemIdentifier)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#888] hover:text-[#9E1A59] hover:bg-[#9E1A59]/10 transition-colors cursor-pointer"
                            title="Hapus barang dari keranjang"
                            aria-label={`Hapus ${item.name}`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[#9E1A59]">
                          {formatIDR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Voucher Promo Section */}
              <div className="pt-3 border-t border-[#E8D5C0]">
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF0F5] border border-[#F48FB1]/50">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎟️</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black font-mono text-[#9E1A59]">
                            {appliedVoucher}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#9E1A59] text-white">
                            -5%
                          </span>
                        </div>
                        <p className="text-[10px] text-[#25D366] font-bold">Voucher hemat diterapkan!</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-[11px] font-bold text-[#888] hover:text-[#9E1A59] hover:underline cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => {
                          setVoucherInput(e.target.value.toUpperCase());
                          setVoucherError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyVoucher();
                          }
                        }}
                        placeholder="Kode promo (cth: NVM5)"
                        className="flex-1 min-w-0 px-3 py-2 text-xs font-mono font-bold bg-[#FAF6F0] rounded-xl border border-[#E8D5C0] focus:border-[#9E1A59] focus:outline-none uppercase placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:text-[#999]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        className="shrink-0 px-3.5 py-2 text-xs font-bold bg-[#9E1A59] text-white rounded-xl hover:bg-[#7A1244] active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Pakai
                      </button>
                    </div>
                    {voucherError ? (
                      <p className="text-[10px] text-red-500 font-medium pl-1">{voucherError}</p>
                    ) : (
                      <p className="text-[10px] text-[#888] pl-1">
                        Punya voucher? Masukkan kode <span className="font-bold text-[#9E1A59]">NVM5</span> untuk diskon 5%.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="border-t border-[#E8D5C0] pt-3 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-center text-[#666]">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-[#1A1A1A]">{formatIDR(totalPrice)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[#25D366] font-bold">
                    <span className="flex items-center gap-1">
                      <span>🏷️ Diskon Promo ({appliedVoucher})</span>
                    </span>
                    <span>- {formatIDR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-[#E8D5C0]/60">
                  <span className="text-base font-bold text-[#1A1A1A]">Total Pembayaran</span>
                  <span className="text-lg font-black text-[#9E1A59]">{formatIDR(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Trust badge note */}
            <div className="rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] p-4 text-xs text-[#8A7880] leading-relaxed flex items-start gap-2.5">
              <span className="text-base shrink-0" aria-hidden="true">
                🔒
              </span>
              <p>
                Transaksi aman & terenkripsi. Konfirmasi instan langsung diteruskan ke WhatsApp
                admin NEVERMIND.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
