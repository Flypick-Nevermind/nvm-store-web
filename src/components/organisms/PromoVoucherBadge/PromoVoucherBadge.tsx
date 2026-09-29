'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BRAND } from '@/constants/brand';
import { buildVoucherWhatsAppUrl } from '@/constants/payment';

const VOUCHER_CODE = 'NVM5';

export function PromoVoucherBadge() {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const dismissed = sessionStorage.getItem('nvm_voucher_tab_closed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const copyCode = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(VOUCHER_CODE);
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nvm_applied_voucher', VOUCHER_CODE);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleTabClick = () => {
    copyCode();
    setIsModalOpen(true);
  };

  const handleCloseTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('nvm_voucher_tab_closed', 'true');
  };

  if (!mounted || !isVisible) return null;

  const waClaimUrl = buildVoucherWhatsAppUrl({
    whatsappNumber: BRAND.whatsappNumber,
    voucherCode: VOUCHER_CODE,
  });

  return (
    <>
      {/* Vertical Floating Tab on Left Edge */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40 select-none"
          >
            <div className="relative group">
              {/* Circular White Close Button overlapping top-right */}
              <button
                type="button"
                onClick={handleCloseTab}
                aria-label="Tutup voucher promo"
                title="Tutup voucher"
                className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.15)] flex items-center justify-center text-[#DABACA] hover:text-[#9E1A59] hover:scale-105 active:scale-95 transition-all cursor-pointer z-30 border border-black/[0.03]"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Vertical Pink Tab */}
              <button
                type="button"
                onClick={handleTabClick}
                aria-label="Buka voucher Get 5% OFF"
                className="flex items-center justify-center bg-[#F9D4E3] hover:bg-[#F3C5D8] active:brightness-95 text-black transition-all rounded-r-[4px] shadow-[2px_4px_14px_rgba(0,0,0,0.08)] cursor-pointer py-4 px-1.5 w-[36px] sm:w-[40px]"
                style={{
                  minHeight: '150px',
                }}
              >
                <span
                  className="font-bold text-xs sm:text-[13px] tracking-wider uppercase whitespace-nowrap text-black select-none"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright',
                    letterSpacing: '0.04em',
                  }}
                >
                  Get 5% OFF
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal / Flyout when tab is clicked */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            {/* Backdrop click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FFFDF9] border border-[#E8D5C0] shadow-2xl p-6 overflow-hidden z-10"
            >
              {/* Close Button X */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF6F0] hover:bg-[#E8D5C0] text-[#666] hover:text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="flex flex-col items-center text-center">
                <span className="w-14 h-14 rounded-2xl bg-[#F9D4E3] text-[#9E1A59] flex items-center justify-center text-2xl shadow-inner mb-3">
                  🎟️
                </span>

                <span className="inline-block px-3 py-1 rounded-full bg-[#FFF0F5] text-[#9E1A59] text-[11px] font-bold uppercase tracking-wider mb-2 border border-[#F48FB1]/40">
                  Promo Eksklusif
                </span>

                <h3 className="font-display font-black text-2xl text-[#1A1A1A]">
                  Get 5% OFF
                </h3>
                <p className="text-xs text-[#666] mt-1 max-w-xs leading-relaxed">
                  Gunakan kode voucher di bawah ini saat checkout atau chat ke admin WhatsApp untuk dapatkan potongan 5% semua tas.
                </p>

                {/* Promo Code Box */}
                <div className="w-full mt-4 p-3 rounded-2xl bg-[#FFF8E1] border-2 border-dashed border-[#9E1A59]/30 flex items-center justify-between gap-3">
                  <div className="text-left pl-1">
                    <span className="text-[10px] text-[#8A7880] uppercase tracking-wider font-semibold block">
                      Kode Promo
                    </span>
                    <span className="font-mono font-black text-lg text-[#1A1A1A] tracking-wider">
                      {VOUCHER_CODE}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copyCode}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isCopied
                        ? 'bg-[#25D366] text-white'
                        : 'bg-[#9E1A59] text-white hover:bg-[#7A1244] active:scale-95'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <span>✓</span>
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>

                {isCopied && (
                  <p className="text-[11px] text-[#25D366] font-semibold mt-2">
                    ✓ Kode otomatis tersimpan & siap dipakai di checkout!
                  </p>
                )}

                {/* Buttons */}
                <div className="w-full flex flex-col gap-2 mt-5">
                  <Link
                    href="/checkout"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 rounded-full bg-[#9E1A59] hover:bg-[#7A1244] text-white text-xs font-bold tracking-wide transition-all shadow-md text-center"
                  >
                    Gunakan Saat Checkout →
                  </Link>

                  <a
                    href={waClaimUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                    </svg>
                    <span>Klaim ke Admin via WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
