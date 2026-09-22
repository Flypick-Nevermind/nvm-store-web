'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/layouts/PageShell';
import { Button } from '@/components/atoms/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') ?? '';
  const waUrl   = searchParams.get('wa') ?? '';

  useEffect(() => {
    // Auto-redirect to WA after 3s
    if (waUrl) {
      const t = setTimeout(() => {
        window.open(decodeURIComponent(waUrl), '_blank');
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [waUrl]);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center gap-6 text-center">
      <div className="w-full bg-white rounded-3xl border border-[#C8C8C8]/50 p-6 sm:p-10 shadow-xs flex flex-col items-center gap-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        className="w-24 h-24 rounded-full bg-[#D8FFF7] flex items-center justify-center"
      >
        <span className="text-5xl" aria-hidden="true">🎉</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl font-display font-black text-[#1A1A1A]">
          Pesanan Berhasil!
        </h1>
        <p className="text-sm text-[#888] leading-relaxed">
          Terima kasih sudah order di NEVERMIND! Tim kami akan segera mengkonfirmasi pembayaranmu.
        </p>
      </motion.div>

      {orderId && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-2xl bg-white border border-[#C8C8C8]/50 p-4 flex flex-col gap-1"
        >
          <p className="text-xs text-[#888] font-medium uppercase tracking-wider">Order ID</p>
          <p className="font-mono font-extrabold text-[#C74375] text-lg tracking-wide">
            #{orderId}
          </p>
          <p className="text-xs text-[#888]">Simpan ID ini untuk melacak pesananmu</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full rounded-2xl bg-[#FDFD96]/40 border border-[#FDFD96] p-4"
      >
        <p className="text-xs text-[#5C5C00] leading-relaxed">
          ⏳ Otomatis mengarahkan ke WhatsApp Admin dalam 3 detik untuk konfirmasi...
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full flex flex-col gap-3"
      >
        {waUrl && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => window.open(decodeURIComponent(waUrl), '_blank')}
          >
            💬 Hubungi Admin WhatsApp
          </Button>
        )}
        {orderId && (
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => router.push(`/track/${orderId}`)}
          >
            Lacak Pesananku →
          </Button>
        )}
        <Button variant="outline" size="md" fullWidth onClick={() => router.push('/')}>
          Kembali ke Katalog
        </Button>
      </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <PageShell showFooter={false}>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </PageShell>
  );
}
