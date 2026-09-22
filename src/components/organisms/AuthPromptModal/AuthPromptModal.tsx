'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModalStore } from '@/store/authModalStore';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';

export function AuthPromptModal() {
  const router = useRouter();
  const {
    isOpen,
    redirectUrl,
    title,
    message,
    badgeText,
    productName,
    onCancelUrl,
    closeModal,
  } = useAuthModalStore();

  const handleClose = () => {
    closeModal();
    if (onCancelUrl) {
      router.push(onCancelUrl);
    }
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleProceedLogin = () => {
    closeModal();
    router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}&from=cart`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#C8C8C8]/40 z-10 overflow-hidden flex flex-col gap-5 text-center"
          >
            {/* Close 'X' Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Tutup notifikasi"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF8E1] hover:bg-[#FDFD96]/60 text-[#888] hover:text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer text-sm"
            >
              ✕
            </button>

            {/* Icon Graphic */}
            <div className="flex justify-center pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFF8E1] via-[#D8FFF7] to-[#FDFD96] border border-[#9DDED1] flex items-center justify-center shadow-xs">
                <span className="text-3xl" aria-hidden="true">🔒</span>
              </div>
            </div>

            {/* Header Text */}
            <div className="flex flex-col items-center gap-2">
              <Badge variant="yellow">{badgeText || '✨ Login Diperlukan'}</Badge>
              <h2
                id="auth-modal-title"
                className="text-xl sm:text-2xl font-display font-black text-[#1A1A1A] tracking-tight leading-tight"
              >
                {title || 'Masuk untuk Melanjutkan Checkout'}
              </h2>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed max-w-xs">
                {message ? (
                  message
                ) : productName ? (
                  <>
                    Untuk memesan <strong className="text-[#1A1A1A]">{productName}</strong>, silakan masuk atau daftar akun terlebih dahulu.
                  </>
                ) : (
                  'Untuk mengisi data pengiriman dan memproses pembayaran, silakan masuk ke akun NEVERMIND terlebih dahulu.'
                )}
              </p>
            </div>

            {/* Highlight Box */}
            <div className="rounded-2xl bg-[#FFF8E1] border border-[#FDFD96] p-3 text-left flex items-start gap-2.5 text-[11px] sm:text-xs text-[#7A6830]">
              <span className="text-base shrink-0 mt-0.5" aria-hidden="true">💡</span>
              <p>
                <strong>Belum punya akun?</strong> Tenang, kamu bisa mendaftar gratis dalam 30 detik atau coba <em>Mode Demo</em> instan!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                id="auth-modal-cancel-btn"
                type="button"
                variant="outline"
                size="md"
                onClick={handleClose}
                className="flex-1 order-2 sm:order-1 text-xs sm:text-sm"
              >
                Lanjut Belanja
              </Button>
              <Button
                id="auth-modal-login-btn"
                type="button"
                variant="primary"
                size="md"
                onClick={handleProceedLogin}
                className="flex-1 order-1 sm:order-2 text-xs sm:text-sm shadow-md shadow-[#C74375]/25"
              >
                Masuk Sekarang →
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
