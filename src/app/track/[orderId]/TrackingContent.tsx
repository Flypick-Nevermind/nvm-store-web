'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { StepperProgress } from '@/components/molecules/StepperProgress';
import { orderKeys, useOrderDetail } from '@/lib/api/orders';
import { useOrdersStore } from '@/store/ordersStore';
import { useCartStore } from '@/store/cartStore';
import { formatIDR } from '@/lib/utils';
import type { OrderDetailResponse } from '@/types/api';

interface TrackingContentProps {
  orderId: string;
}

const STAGE_LABELS: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: '1. Pembayaran Terverifikasi',
  2: '2. Dipesan ke Supplier China',
  3: '3. Warehouse China & Lolos QC',
  4: '4. Penerbangan Kargo & Bea Cukai',
  5: '5. Dalam Pengantaran Kurir Lokal',
  6: '6. Paket Telah Diterima (Selesai)',
};

const PAYMENT_LABELS: Record<string, string> = {
  bca: 'Bank BCA (Virtual/Transfer)',
  mandiri: 'Bank Mandiri (Transfer)',
  qris: 'QRIS Instant',
};

export function TrackingContent({ orderId }: TrackingContentProps) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useOrderDetail(orderId);
  const updateOrderStage = useOrdersStore((s) => s.updateOrderStage);
  const confirmOrderDelivered = useOrdersStore((s) => s.confirmOrderDelivered);
  const addItem = useCartStore((s) => s.addItem);
  const [reorderSuccess, setReorderSuccess] = useState(false);

  // Directly subscribe to Zustand state for instantaneous reactivity
  const cleanId = orderId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const storeOrder = useOrdersStore((s) =>
    s.orders.find((o) => o.order_id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanId)
  );

  const order = storeOrder || data?.data;

  const handleStageSelect = (stage: 1 | 2 | 3 | 4 | 5 | 6) => {
    const targetId = order?.order_id || orderId;
    updateOrderStage(
      targetId,
      stage,
      stage >= 5 ? order?.tracking_number || 'SPXID0294829104' : undefined
    );

    // Sync Tanstack Query data directly
    queryClient.setQueryData(
      orderKeys.detail(orderId),
      (old: OrderDetailResponse | undefined): OrderDetailResponse | undefined => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            current_stage: stage,
            qc_passed: stage >= 3,
            tracking_number: stage >= 5 ? old.data.tracking_number || 'SPXID0294829104' : undefined,
            received_at: stage === 6 ? old.data.received_at || new Date().toISOString() : undefined,
            status: stage === 6 ? 'delivered' : old.data.status,
          },
        };
      }
    );
  };

  const handleConfirmDelivered = () => {
    const targetId = order?.order_id || orderId;
    confirmOrderDelivered(targetId);
    handleStageSelect(6);
  };

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((item) => {
      const slug =
        item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
        item.product_id;
      addItem({
        productId: item.product_id,
        slug,
        name: item.name,
        price: item.unit_price,
        image: item.image,
        quantity: item.quantity,
        type: item.type,
      });
    });
    setReorderSuccess(true);
    setTimeout(() => setReorderSuccess(false), 3000);
  };

  if (isLoading && !order) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-[#C8C8C8]/20 animate-pulse" />
        ))}
      </div>
    );
  }

  if ((isError && !order) || !order) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="text-5xl" aria-hidden="true">
          🔍
        </span>
        <p className="text-base font-semibold text-[#1A1A1A]">Order tidak ditemukan</p>
        <p className="text-sm text-[#888]">Periksa kembali Order ID kamu ya.</p>
      </div>
    );
  }

  const firstProductSlug =
    order.items[0]?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
    order.items[0]?.product_id;

  const receivedDate = order.received_at
    ? new Date(order.received_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-16">
      {/* Toast Notification for Reorder */}
      {reorderSuccess && (
        <div className="rounded-2xl bg-[#D8FFF7] border border-[#9DDED1] p-3.5 flex items-center justify-between text-xs text-[#1A6B5C] font-semibold animate-in fade-in duration-200">
          <span>✨ Item pesanan berhasil dimasukkan ke keranjang belanja!</span>
          <Link
            href="/checkout"
            className="underline underline-offset-2 font-bold hover:text-[#11493E]"
          >
            Buka Keranjang →
          </Link>
        </div>
      )}

      {/* Interactive Simulator Bar (Demo Mode for testing before backend) */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🎛️</span>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Simulator Tahapan Pesanan (Demo Testing)
              </p>
            </div>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Klik salah satu tahapan di bawah untuk mensimulasikan update status pesanan dari backend/admin:
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {([1, 2, 3, 4, 5, 6] as const).map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => handleStageSelect(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  order.current_stage === stage
                    ? 'bg-[#9E1A59] text-white shadow-sm ring-2 ring-[#9E1A59]/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {stage === 6 ? 'Tahap 6 (Selesai 🎉)' : `Tahap ${stage}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Tracking Timeline & QC */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 6-Stage Stepper */}
          <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">Status Pengiriman Real-Time</h2>
                <p className="text-xs text-[#888] mt-0.5">
                  Posisi saat ini:{' '}
                  <span className="font-semibold text-[#9E1A59]">{STAGE_LABELS[order.current_stage]}</span>
                </p>
              </div>
              <Badge variant={order.current_stage === 6 ? 'aqua' : 'yellow'}>
                {order.current_stage === 6 ? 'Pesanan Selesai 🎉' : `Tahap ${order.current_stage} dari 6`}
              </Badge>
            </div>
            <StepperProgress currentStage={order.current_stage} />
          </div>

          {/* Celebratory Banner (ONLY shown on Stage 6: Paket Diterima) */}
          {order.current_stage === 6 && (
            <div className="rounded-3xl bg-gradient-to-br from-[#D8FFF7] via-[#C5F7EE] to-[#A3EFE2] border-2 border-[#1A6B5C]/30 p-6 sm:p-7 shadow-sm flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A6B5C] text-white flex items-center justify-center flex-shrink-0 text-2xl shadow-xs">
                  🎉
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1A6B5C] bg-white/70 px-2 py-0.5 rounded-full">
                      Status Akhir
                    </span>
                    {receivedDate && (
                      <span className="text-[11px] text-[#2D8A76] font-medium">
                        Diterima: {receivedDate}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-[#11493E] mt-1">
                    Paket Telah Sampai & Diterima dengan Selamat!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2D8A76] mt-1 leading-relaxed">
                    Terima kasih banyak telah mempercayakan koleksi tas trendi impianmu kepada NEVERMIND! Semoga kamu suka tas barunya. 🥰
                  </p>
                </div>
              </div>

              {/* Action buttons on Stage 6 */}
              <div className="pt-2 border-t border-[#1A6B5C]/20 flex flex-wrap items-center gap-3">
                <Link
                  href={`/products/${firstProductSlug}#reviews`}
                  className="px-4 py-2.5 rounded-xl bg-[#1A6B5C] hover:bg-[#11493E] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <span>⭐</span>
                  <span>Tulis Ulasan & Beri Rating</span>
                </Link>
                <button
                  type="button"
                  onClick={handleReorder}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#D8FFF7] border border-[#1A6B5C]/40 text-[#1A6B5C] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🔁</span>
                  <span>Beli Lagi Tas Ini</span>
                </button>
              </div>
            </div>
          )}

          {/* Resi tracker & Delivery Confirmation Button (shown on Stage 5: Kurir Lokal) */}
          {order.current_stage === 5 && (
            <div className="rounded-3xl bg-white border-2 border-[#9E1A59]/40 p-6 shadow-xs animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold text-[#9E1A59] uppercase tracking-wider">
                    🚚 Nomor Resi Ekspedisi Lokal (SPX / J&T)
                  </p>
                  <Badge variant="aqua">Sedang Diantar</Badge>
                </div>
                <p className="font-mono font-bold text-[#1A1A1A] text-xl">
                  {order.tracking_number || 'SPXID0294829104'}
                </p>
                <p className="text-xs text-[#888] mt-1.5 leading-relaxed">
                  Paket sudah tiba di warehouse Indonesia dan sedang diantar kurir ekspedisi ke alamatmu.
                </p>
              </div>

              {/* Confirm Delivery CTA */}
              <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A]">Paket sudah sampai di tanganmu?</p>
                  <p className="text-[11px] text-[#888] mt-0.5">
                    Klik konfirmasi bila kamu sudah menerima barang dengan baik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmDelivered}
                  className="px-4 py-2.5 rounded-xl bg-[#1A6B5C] hover:bg-[#11493E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>✓</span>
                  <span>Konfirmasi Paket Diterima</span>
                </button>
              </div>
            </div>
          )}

          {/* QC Trust Card (Baru muncul mulai Tahap 3: Warehouse China & Lolos QC) */}
          {order.current_stage >= 3 && (
            <div className="rounded-3xl bg-gradient-to-br from-[#D8FFF7] to-[#B8EFE7] border border-[#9DDED1] p-6 flex gap-4 shadow-xs animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl" aria-hidden="true">
                  🔍
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-[#1A6B5C]">
                  Lolos Quality Check Fisik di Warehouse China
                </p>
                <p className="text-xs sm:text-sm text-[#2D8A76] mt-1 leading-relaxed">
                  Barang pesananmu sudah tiba di Warehouse NEVERMIND di China dan melalui inspeksi fisik teliti oleh tim kami. Kualitas bahan, ritsleting, dan jahitan dipastikan 100% aman sebelum diterbangkan ke Indonesia! 💪
                </p>
              </div>
            </div>
          )}

          {/* Buyer & Shipping Address Details */}
          <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider pb-2 border-b border-[#E8D5C0]">
              📍 Informasi Pengiriman
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#888]">Penerima</p>
                <p className="font-semibold text-[#1A1A1A] mt-0.5">{order.buyer_name}</p>
                <p className="text-xs text-[#888] mt-1">WhatsApp</p>
                <p className="font-semibold text-[#1A1A1A] mt-0.5">{order.whatsapp_number}</p>
              </div>
              <div>
                <p className="text-xs text-[#888]">Alamat Lengkap</p>
                {order.address ? (
                  <p className="font-medium text-[#1A1A1A] mt-0.5 leading-relaxed text-xs">
                    {order.address.street}, Kec. {order.address.district}, {order.address.city}, {order.address.postal_code}
                  </p>
                ) : (
                  <p className="text-xs text-[#888] italic mt-0.5">Tersimpan di kontak admin</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items & Summary */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* ETA */}
          {order.eta_range && (
            <div className="rounded-3xl bg-[#FDFD96]/40 border border-[#FDFD96] p-5 flex items-center gap-3.5 shadow-xs">
              <span className="text-3xl flex-shrink-0" aria-hidden="true">
                ✈️
              </span>
              <div>
                <p className="text-xs text-[#5C5C00] font-bold uppercase tracking-wider">
                  Estimasi Tiba di Alamatmu
                </p>
                <p className="text-base font-extrabold text-[#1A1A1A] mt-0.5">
                  {order.current_stage === 6 ? (
                    <span className="text-[#1A6B5C]">Sudah Sampai di Tujuan 🎉</span>
                  ) : (
                    <>
                      {new Date(order.eta_range.from).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                      })}
                      {' – '}
                      {new Date(order.eta_range.to).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Order summary card */}
          <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#C8C8C8]/30">
              <span className="text-xs font-bold text-[#888] uppercase tracking-wider">
                Rincian Item Pesanan
              </span>
              {order.current_stage >= 3 && (
                <Badge variant="aqua">✅ QC Lolos</Badge>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-3.5 py-1 border-b border-[#C8C8C8]/20 last:border-b-0"
                >
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#F5F0E8] flex-shrink-0 border border-[#C8C8C8]/40">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.name}</p>
                    <p className="text-xs text-[#888] mt-0.5">
                      Jumlah: <span className="font-semibold text-[#1A1A1A]">x{item.quantity}</span> ·{' '}
                      {formatIDR(item.unit_price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {formatIDR(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment & Voucher Breakdown */}
            <div className="border-t border-[#E8D5C0] pt-3 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center text-[#888]">
                <span>Metode Pembayaran</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {PAYMENT_LABELS[order.payment_method || 'bca'] || 'Transfer Bank'}
                </span>
              </div>
              {order.voucher_code && (
                <div className="flex justify-between items-center text-[#25D366]">
                  <span>Voucher Diskon ({order.voucher_code})</span>
                  <span className="font-semibold">
                    - {formatIDR(order.discount_amount || 0)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-[#E8D5C0] pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-[#1A1A1A]">Total Pesanan</span>
              <span className="text-lg font-black text-[#9E1A59]">
                {formatIDR(order.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
