'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { PageShell } from '@/components/layouts/PageShell';
import { type OrderLookupData, orderLookupSchema } from '@/lib/schemas/checkout.schema';
import { useOrdersStore } from '@/store/ordersStore';
import { formatIDR } from '@/lib/utils';

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
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col gap-8">
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

        {/* Recent orders from local storage */}
        <RecentOrdersTracker onSelectOrder={(id) => router.push(`/track/${id}`)} />
      </div>
    </PageShell>
  );
}

function RecentOrdersTracker({ onSelectOrder }: { onSelectOrder: (id: string) => void }) {
  const orders = useOrdersStore((s) => s.orders);

  if (!orders || orders.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white border border-[#C8C8C8]/50 p-5 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-[#E8D5C0] pb-2">
        <p className="text-xs font-bold text-[#888] uppercase tracking-wider">
          Pesanan Tersimpan ({orders.length})
        </p>
        <Link
          href="/orders"
          className="text-[11px] text-[#9E1A59] font-bold hover:underline"
        >
          Lihat Semua Riwayat →
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {orders.slice(0, 5).map((ord) => (
          <button
            key={ord.order_id}
            type="button"
            onClick={() => onSelectOrder(ord.order_id)}
            className="flex items-center justify-between p-3 rounded-xl bg-[#FFF8E1]/50 hover:bg-[#FFF8E1] border border-[#E8D5C0]/60 transition-all text-left cursor-pointer group"
          >
            <div>
              <p className="text-xs font-mono font-bold text-[#1A1A1A] group-hover:text-[#9E1A59]">
                {ord.order_id}
              </p>
              <p className="text-[11px] text-[#888] mt-0.5">
                {ord.buyer_name} · {ord.items.length} item
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.current_stage === 6 ? 'bg-[#D8FFF7] text-[#1A6B5C]' : 'bg-[#FFF8E1] text-[#9E1A59] border border-[#E8D5C0]'}`}>
                {ord.current_stage === 6 ? 'Selesai 🎉' : `Tahap ${ord.current_stage}/6`}
              </span>
              <p className="text-[11px] font-bold text-[#1A1A1A] mt-0.5">
                {formatIDR(ord.total_amount)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
