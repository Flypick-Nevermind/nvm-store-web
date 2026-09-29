'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BRAND } from '@/constants/brand';
import { buildRequestBagWhatsAppUrl } from '@/constants/payment';
import { useRequestBagModalStore } from '@/store/requestBagModalStore';

const BUDGET_OPTIONS = [
  'Bebas / Rekomendasi Admin',
  'Di bawah Rp 200.000',
  'Rp 200.000 – Rp 350.000',
  'Rp 350.000 – Rp 500.000',
  'Di atas Rp 500.000',
];

export function RequestBagModal() {
  const { isOpen, initialBagName, closeModal } = useRequestBagModalStore();

  const [bagName, setBagName] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [budget, setBudget] = useState(BUDGET_OPTIONS[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialBagName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBagName(initialBagName);
    }
  }, [initialBagName]);

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const waUrl = buildRequestBagWhatsAppUrl({
      whatsappNumber: BRAND.whatsappNumber,
      bagName: bagName.trim() || undefined,
      referenceUrl: referenceUrl.trim() || undefined,
      budget: budget !== BUDGET_OPTIONS[0] ? budget : undefined,
      notes: notes.trim() || undefined,
    });

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    closeModal();
  };

  const handleDirectChat = () => {
    const directUrl = `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
      'Halo Admin NEVERMIND! ✨ Saya mau tanya dan request jastip tas yang belum ada di katalog website. Bisa dibantu? ♡'
    )}`;
    window.open(directUrl, '_blank', 'noopener,noreferrer');
    closeModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E8D5C0] shadow-2xl p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:bg-[#FFF8E1] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              aria-label="Tutup modal"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex flex-col gap-1.5 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] font-black tracking-widest uppercase self-start border border-[#9E1A59]/20">
                ✨ CUSTOM JASTIP FINDER
              </span>
              <h3 className="text-2xl font-display font-black text-[#1A1A1A] tracking-tight">
                Request a Bag
              </h3>
              <p className="text-xs text-[#666] leading-relaxed">
                Punya foto atau link tas dari <strong>XiaoHongShu (RED)</strong>,{' '}
                <strong>TikTok</strong>, atau <strong>Pinterest</strong>? Kirim ke tim kurasi
                NEVERMIND, kami carikan langsung dari supplier China dengan garansi QC fisik!
              </p>
            </div>

            {/* Quick 3-Step Preview */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] mb-5 text-center">
              <div className="flex flex-col items-center">
                <span className="text-lg">📸</span>
                <span className="text-[10px] font-bold text-[#1A1A1A] mt-1">
                  1. Kirim Foto/Link
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg">🔍</span>
                <span className="text-[10px] font-bold text-[#1A1A1A] mt-1">2. QC & Cek Harga</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg">🚚</span>
                <span className="text-[10px] font-bold text-[#1A1A1A] mt-1">3. Jastip All-In</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendToWhatsApp} className="flex flex-col gap-4">
              {/* Bag Name / Description */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="req-bag-name" className="text-xs font-bold text-[#1A1A1A]">
                  Nama / Model Tas yang Dicari <span className="text-red-500">*</span>
                </label>
                <input
                  id="req-bag-name"
                  type="text"
                  required
                  placeholder="Contoh: Jelly Mini Bag Y2K atau Shoulder Bag Silver"
                  value={bagName}
                  onChange={(e) => setBagName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-xs text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all"
                />
              </div>

              {/* Link / Photo Reference URL */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="req-ref-url" className="text-xs font-bold text-[#1A1A1A]">
                  Link Referensi / Post Media Sosial (Opsional)
                </label>
                <input
                  id="req-ref-url"
                  type="text"
                  placeholder="Contoh: link TikTok, XiaoHongShu, Pinterest, dsb."
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-xs text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all"
                />
                <span className="text-[10px] text-[#888]">
                  *Kamu juga bisa langsung kirim foto tasnya di chat WhatsApp nanti.
                </span>
              </div>

              {/* Budget Range */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="req-budget" className="text-xs font-bold text-[#1A1A1A]">
                  Estimasi Budget Kamu
                </label>
                <select
                  id="req-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-xs text-[#1A1A1A] bg-white focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all cursor-pointer"
                >
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="req-notes" className="text-xs font-bold text-[#1A1A1A]">
                  Catatan Tambahan (Warna / Ukuran / Detail Khusus)
                </label>
                <textarea
                  id="req-notes"
                  rows={2}
                  placeholder="Contoh: Mau yang warna krem atau baby pink, ukuran muat payung lipat..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-xs text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#9E1A59] focus:ring-2 focus:ring-[#9E1A59]/15 transition-all resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold tracking-wide transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Kirim Request ke WhatsApp Admin</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectChat}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#666] hover:text-[#9E1A59] transition-colors cursor-pointer text-center"
                >
                  Atau langsung chat Admin tanpa isi form →
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
