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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pb-24 md:pb-16">
      {/* Left Column: Tracking Timeline & QC */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* 5-Stage Stepper */}
        <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-[#1A1A1A] mb-6">Status Pengiriman Real-Time</h2>
          <StepperProgress currentStage={order.current_stage} />
        </div>

        {/* QC Trust Card */}
        {order.qc_passed && (
          <div className="rounded-3xl bg-gradient-to-br from-[#D8FFF7] to-[#B8EFE7] border border-[#9DDED1] p-6 flex gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl" aria-hidden="true">🔍</span>
            </div>
            <div>
              <p className="text-base font-bold text-[#1A6B5C]">Lolos Quality Check Fisik NEVERMIND</p>
              <p className="text-xs sm:text-sm text-[#2D8A76] mt-1 leading-relaxed">
                Barang pesananmu sudah melalui tahap inspeksi fisik teliti oleh tim NEVERMIND di warehouse China & Indonesia. Kualitas bahan, ritsleting, dan jahitan 100% aman! 💪
              </p>
            </div>
          </div>
        )}

        {/* Resi tracker (when available) */}
        {order.tracking_number && (
          <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-6 shadow-xs">
            <p className="text-xs font-bold text-[#888] uppercase tracking-wider mb-1">Nomor Resi Ekspedisi</p>
            <p className="font-mono font-bold text-[#1A1A1A] text-lg">{order.tracking_number}</p>
            <p className="text-xs text-[#888] mt-1">Gunakan nomor ini untuk pelacakan langsung di website ekspedisi lokal.</p>
          </div>
        )}
      </div>

      {/* Right Column: Order Items & Summary */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {/* ETA */}
        {order.eta_range && (
          <div className="rounded-3xl bg-[#FDFD96]/40 border border-[#FDFD96] p-5 flex items-center gap-3.5 shadow-xs">
            <span className="text-3xl flex-shrink-0" aria-hidden="true">✈️</span>
            <div>
              <p className="text-xs text-[#5C5C00] font-bold uppercase tracking-wider">Estimasi Tiba di Alamatmu</p>
              <p className="text-base font-extrabold text-[#1A1A1A] mt-0.5">
                {new Date(order.eta_range.from).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                {' – '}
                {new Date(order.eta_range.to).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}

        {/* Order summary card */}
        <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#C8C8C8]/30">
            <span className="text-xs font-bold text-[#888] uppercase tracking-wider">Rincian Item Pesanan</span>
            <Badge variant={order.qc_passed ? 'aqua' : 'silver'}>
              {order.qc_passed ? '✅ QC Lolos' : '⏳ Menunggu QC'}
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.product_id} className="flex items-center gap-3.5 py-1 border-b border-[#C8C8C8]/20 last:border-b-0">
                <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#F5F0E8] flex-shrink-0 border border-[#C8C8C8]/40">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.name}</p>
                  <p className="text-xs text-[#888] mt-0.5">
                    Jumlah: <span className="font-semibold text-[#1A1A1A]">x{item.quantity}</span> · {formatIDR(item.unit_price)}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1A1A1A]">
                  {formatIDR(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#C8C8C8]/40 pt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-[#1A1A1A]">Total Dibayar</span>
            <span className="text-lg font-black text-[#C74375]">{formatIDR(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
