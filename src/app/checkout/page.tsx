'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { PageShell } from '@/components/layouts/PageShell';
import { CheckoutStepIndicator } from '@/components/molecules/CheckoutStepIndicator';
import {
  CheckoutOrderSummary,
  Step1Shipping,
  Step2Payment,
  Step3UploadProof,
} from '@/components/organisms/CheckoutForm';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    step,
    setStep,
    items,
    totalPrice,
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
    handleApplyVoucher,
    handleRemoveVoucher,
    discountAmount,
    finalTotal,
    handleStep1,
    handleStep2,
    handleStep3,
    isSubmitting,
    mounted,
  } = useCheckoutFlow();

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
            <CheckoutStepIndicator current={step} />

            <div className="bg-white rounded-3xl border border-[#C8C8C8]/50 p-5 sm:p-7 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                >
                  {step === 1 && (
                    <Step1Shipping defaultValues={buyerData || undefined} onNext={handleStep1} />
                  )}
                  {step === 2 && (
                    <Step2Payment
                      selectedMethod={paymentMethod}
                      onSelectMethod={setPaymentMethod}
                      onNext={handleStep2}
                    />
                  )}
                  {step === 3 && (
                    <Step3UploadProof onSubmit={handleStep3} isLoading={isSubmitting} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Order Summary Card (Sticky on Desktop) */}
          <CheckoutOrderSummary
            items={items}
            step={step}
            totalQuantity={totalQuantity}
            totalPrice={totalPrice}
            discountAmount={discountAmount}
            finalTotal={finalTotal}
            appliedVoucher={appliedVoucher}
            voucherInput={voucherInput}
            voucherError={voucherError}
            onEditItems={() => setStep(1)}
            onVoucherInputChange={setVoucherInput}
            onApplyVoucher={handleApplyVoucher}
            onRemoveVoucher={handleRemoveVoucher}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        </div>
      </div>
    </PageShell>
  );
}
