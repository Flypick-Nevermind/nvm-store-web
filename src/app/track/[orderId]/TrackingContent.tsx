'use client';

import { useOrderDetail } from '@/lib/api/orders';
import { StepperProgress } from '@/components/molecules/StepperProgress';
import { Badge } from '@/components/atoms/Badge';
import { formatIDR } from '@/lib/utils';
import Image from 'next/image';

interface TrackingContentProps {
  orderId: string;
}

export function TrackingContent({ orderId }: TrackingContentProps) {
  const { data, isLoading, isError } = useOrderDetail(orderId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-[#C8C8C8]/20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="text-5xl" aria-hidden="true">🔍</span>
        <p className="text-base font-semibold text-[#1A1A1A]">Order tidak ditemukan</p>
        <p className="text-sm text-[#888]">Periksa kembali Order ID kamu ya.</p>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Order summary card */}
      <div className="rounded-2xl bg-white border border-[#C8C8C8]/50 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#888] uppercase tracking-wider">Detail Pesanan</span>
          <Badge variant={order.qc_passed ? 'aqua' : 'silver'}>
            {order.qc_passed ? '✅ QC Lolos' : '⏳ Menunggu QC'}
          </Badge>
        </div>
        {order.items.map((item) => (
          <div key={item.product_id} className="flex items-center gap-3">
            <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-[#F5F0E8] flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.name}</p>
              <p className="text-xs text-[#888]">x{item.quantity} · {formatIDR(item.unit_price)}</p>
            </div>
          </div>
        ))}
        <div className="border-t border-[#C8C8C8]/40 pt-2 flex justify-between items-center">
          <span className="text-sm font-bold">Total</span>
          <span className="text-sm font-extrabold text-[#C74375]">{formatIDR(order.total_amount)}</span>
        </div>
      </div>

      {/* ETA */}
      {order.eta_range && (
        <div className="rounded-2xl bg-[#FDFD96]/40 border border-[#FDFD96] px-4 py-3 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0" aria-hidden="true">✈️</span>
          <div>
            <p className="text-xs text-[#5C5C00] font-medium uppercase tracking-wide">Estimasi tiba</p>
            <p className="text-sm font-bold text-[#1A1A1A]">
              {new Date(order.eta_range.from).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
              {' – '}
              {new Date(order.eta_range.to).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* 5-Stage Stepper */}
      <div className="rounded-2xl bg-white border border-[#C8C8C8]/50 p-5">
        <h2 className="text-sm font-bold text-[#1A1A1A] mb-5">Status Pengiriman</h2>
        <StepperProgress currentStage={order.current_stage} />
      </div>

      {/* QC Trust Card */}
      {order.qc_passed && (
        <div className="rounded-2xl bg-gradient-to-br from-[#D8FFF7] to-[#B8EFE7] border border-[#9DDED1] p-5 flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl" aria-hidden="true">🔍</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A6B5C]">Lolos Quality Check NEVERMIND</p>
            <p className="text-xs text-[#2D8A76] mt-1 leading-relaxed">
              Barangmu sudah diinspeksi fisik oleh tim NEVERMIND dan dinyatakan sesuai deskripsi. Kualitas terjamin! 💪
            </p>
          </div>
        </div>
      )}

      {/* Resi tracker (when available) */}
      {order.tracking_number && (
        <div className="rounded-2xl bg-white border border-[#C8C8C8]/50 p-4">
          <p className="text-xs font-bold text-[#888] uppercase tracking-wider mb-1">Nomor Resi</p>
          <p className="font-mono font-bold text-[#1A1A1A] text-base">{order.tracking_number}</p>
          <p className="text-xs text-[#888] mt-0.5">Cek di website ekspedisi untuk update real-time</p>
        </div>
      )}
    </div>
  );
}
