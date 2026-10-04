'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { BRAND } from '@/constants/brand';
import { formatIDR } from '@/lib/utils';
import type { OrderRecord } from '@/store/ordersStore';

const STAGE_CONFIG: Record<
  number,
  { label: string; badgeVariant: 'yellow' | 'aqua' | 'silver' | 'primary'; icon: string }
> = {
  1: { label: 'Pembayaran Terverifikasi', badgeVariant: 'yellow', icon: '💳' },
  2: { label: 'Dipesan ke Supplier China', badgeVariant: 'silver', icon: '🏭' },
  3: { label: 'Warehouse China & Lolos QC', badgeVariant: 'aqua', icon: '🔍' },
  4: { label: 'Penerbangan & Bea Cukai', badgeVariant: 'silver', icon: '✈️' },
  5: { label: 'Kurir Lokal Mengantar', badgeVariant: 'yellow', icon: '🚚' },
  6: { label: 'Paket Telah Diterima', badgeVariant: 'aqua', icon: '🎉' },
};

const PAYMENT_LABELS: Record<string, string> = {
  bca: 'Bank BCA (Transfer)',
  mandiri: 'Bank Mandiri (Transfer)',
  qris: 'QRIS Instant',
};

interface OrderHistoryCardProps {
  order: OrderRecord;
  copiedId: string | null;
  onCopyOrderId: (id: string) => void;
  onReorder: (order: OrderRecord) => void;
  onTrack: (orderId: string) => void;
  onConfirmDelivered?: (orderId: string) => void;
}

export function OrderHistoryCard({
  order,
  copiedId,
  onCopyOrderId,
  onReorder,
  onTrack,
  onConfirmDelivered,
}: OrderHistoryCardProps) {
  const stageInfo = STAGE_CONFIG[order.current_stage] || {
    label: `Tahap ${order.current_stage}`,
    badgeVariant: 'silver',
    icon: '📦',
  };

  const orderDate = new Date(order.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const receivedDate = order.received_at
    ? new Date(order.received_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const firstProductSlug =
    order.items[0]?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
    order.items[0]?.product_id;

  return (
    <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-5 sm:p-6 shadow-xs flex flex-col gap-4 hover:border-[#9E1A59]/40 transition-colors">
      {/* Top Bar: Date, Order ID & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#E8D5C0]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs text-[#888]">{orderDate}</span>
          <span className="text-[#C8C8C8]">•</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs sm:text-sm text-[#1A1A1A]">
              #{order.order_id}
            </span>
            <button
              type="button"
              onClick={() => onCopyOrderId(order.order_id)}
              className="text-[11px] text-[#9E1A59] hover:underline cursor-pointer flex items-center gap-0.5"
              title="Salin Order ID"
            >
              {copiedId === order.order_id ? '✓ Tersalin' : '📋 Salin'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={stageInfo.badgeVariant}>
            <span>{stageInfo.icon}</span>
            <span>{stageInfo.label}</span>
          </Badge>
          {order.qc_passed && (
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#D8FFF7] text-[#1A6B5C] font-bold border border-[#9DDED1]">
              QC Passed
            </span>
          )}
          {order.tracking_number && (
            <span className="hidden md:inline-block font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#F2EEEB] text-[#9E1A59] font-bold border border-[#E8D5C0]">
              Resi: {order.tracking_number}
            </span>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-3">
        {order.items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-3.5 py-1 border-b border-[#F5F0E8] last:border-b-0"
          >
            {/* Thumbnail */}
            <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#F2EEEB] border border-[#E8D5C0] shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
            </div>

            {/* Title & info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F2EEEB] text-[#9E1A59] border border-[#E8D5C0]">
                  {item.type === 'pre-order' ? 'PO 14-21 Hari' : 'Ready Stock'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] truncate mt-0.5">
                {item.name}
              </p>
              <p className="text-xs text-[#888] mt-0.5">
                {item.quantity} barang × {formatIDR(item.unit_price)}
              </p>
            </div>

            {/* Price */}
            <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] shrink-0">
              {formatIDR(item.unit_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Completed delivery notification */}
      {order.current_stage === 6 && (
        <div className="p-3 rounded-2xl bg-[#D8FFF7]/70 border border-[#9DDED1] flex items-center justify-between text-xs text-[#1A6B5C]">
          <div className="flex items-center gap-2">
            <span className="text-base">🎉</span>
            <div>
              <p className="font-bold">Paket telah diterima dengan sukses!</p>
              {receivedDate && <p className="text-[11px] text-[#11493E]">Tiba pada: {receivedDate}</p>}
            </div>
          </div>
          <Link
            href={`/products/${firstProductSlug}`}
            className="px-2.5 py-1 rounded-xl bg-white border border-[#9DDED1] hover:bg-[#D8FFF7] font-bold text-[11px] text-[#1A6B5C] transition-colors whitespace-nowrap"
          >
            Beri Ulasan ⭐
          </Link>
        </div>
      )}

      {/* Bottom Bar: Total, Payment Method & Action Buttons */}
      <div className="pt-3 border-t border-[#E8D5C0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-[#888]">
            Metode Bayar:{' '}
            <span className="font-semibold text-[#1A1A1A]">
              {PAYMENT_LABELS[order.payment_method || 'bca'] || 'Transfer Bank'}
            </span>
            {order.voucher_code && (
              <span className="ml-2 text-[#25D366] font-semibold">
                (Voucher: {order.voucher_code})
              </span>
            )}
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xs text-[#888]">Total Belanja:</span>
            <span className="text-base sm:text-lg font-black text-[#9E1A59]">
              {formatIDR(order.total_amount)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WA Admin Contact */}
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}?text=Halo%20NEVERMIND,%20mau%20tanya%20tentang%20pesanan%20saya%20nomor%20${order.order_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl border border-[#C8C8C8]/60 hover:bg-gray-50 text-xs font-semibold text-[#555] transition-colors"
          >
            💬 Bantuan
          </a>

          {/* Confirm Delivered Button (when at stage 5) */}
          {order.current_stage === 5 && onConfirmDelivered && (
            <button
              type="button"
              onClick={() => onConfirmDelivered(order.order_id)}
              className="px-3.5 py-2 rounded-xl bg-[#1A6B5C] hover:bg-[#11493E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>✓</span>
              <span>Konfirmasi Diterima</span>
            </button>
          )}

          {/* Reorder Button */}
          <button
            type="button"
            onClick={() => onReorder(order)}
            className="px-3.5 py-2 rounded-xl bg-[#F2EEEB] hover:bg-[#EAE4DF] border border-[#E8D5C0] text-xs font-bold text-[#9E1A59] transition-colors cursor-pointer"
          >
            🔁 Beli Lagi
          </button>

          {/* Track Shipment Button */}
          <Button variant="primary" size="sm" onClick={() => onTrack(order.order_id)}>
            Lacak Pengiriman →
          </Button>
        </div>
      </div>
    </div>
  );
}
