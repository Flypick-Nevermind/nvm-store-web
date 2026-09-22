'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { PageShell } from '@/components/layouts/PageShell';
import { type OrderLookupData, orderLookupSchema } from '@/lib/schemas/checkout.schema';

export default function TrackIndexPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderLookupData>({ resolver: zodResolver(orderLookupSchema) });

  const onSubmit = (data: OrderLookupData) => {
    router.push(`/track/${data.order_id}`);
  };

  return (
    <PageShell>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <span className="text-5xl" aria-hidden="true">
            📦
          </span>
          <h1 className="text-2xl font-display font-black text-[#1A1A1A]">Lacak Pesananmu</h1>
          <p className="text-sm text-[#888] leading-relaxed">
            Masukkan Order ID yang kamu terima setelah checkout untuk melihat status pengirimanmu.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 bg-white rounded-2xl p-5 border border-[#C8C8C8]/50"
          style={{ boxShadow: '0 2px 16px 0 rgba(199,67,117,0.06)' }}
          noValidate
        >
          <Input
            id="track-order-id"
            label="Order ID"
            placeholder="NVM20260915ABC123"
            required
            hint="Kamu bisa temukan Order ID di chat WhatsApp konfirmasi"
            error={errors.order_id?.message}
            {...register('order_id')}
          />
          <Input
            id="track-whatsapp"
            label="Nomor WhatsApp"
            placeholder="081234567890"
            type="tel"
            inputMode="numeric"
            required
            error={errors.whatsapp_number?.message}
            {...register('whatsapp_number')}
          />
          <Button id="track-submit-btn" type="submit" variant="primary" size="lg" fullWidth>
            Cek Status Pesanan →
          </Button>
        </form>

        {/* Demo shortcut */}
        <div className="rounded-2xl bg-[#FDFD96]/30 border border-[#FDFD96] p-4">
          <p className="text-xs text-[#5C5C00] font-medium mb-2">✨ Demo — Coba contoh order:</p>
          <button
            onClick={() => router.push('/track/NVM20260915ABC123')}
            className="text-xs font-mono text-[#C74375] underline underline-offset-2"
          >
            /track/NVM20260915ABC123
          </button>
        </div>
      </div>
    </PageShell>
  );
}
