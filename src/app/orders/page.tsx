'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { PageShell } from '@/components/layouts/PageShell';
import { BRAND } from '@/constants/brand';
import { formatIDR } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { type OrderRecord, useOrdersStore } from '@/store/ordersStore';

type FilterTab = 'all' | 'processing' | 'completed';

const STAGE_CONFIG: Record<
  number,
  { label: string; badgeVariant: 'yellow' | 'aqua' | 'silver' | 'primary'; icon: string }
> = {
  1: { label: 'Pembayaran Terverifikasi', badgeVariant: 'yellow', icon: '💳' },
  2: { label: 'Dipesan ke Supplier China', badgeVariant: 'silver', icon: '🏭' },
  3: { label: 'Warehouse China & Lolos QC', badgeVariant: 'aqua', icon: '🔍' },
  4: { label: 'Penerbangan & Bea Cukai', badgeVariant: 'silver', icon: '✈️' },
  5: { label: 'Tiba & Kurir Lokal', badgeVariant: 'aqua', icon: '🚚' },
};

const PAYMENT_LABELS: Record<string, string> = {
  bca: 'Bank BCA (Transfer)',
  mandiri: 'Bank Mandiri (Transfer)',
  qris: 'QRIS Instant',
};

export default function OrdersHistoryPage() {
  const router = useRouter();
  const allOrders = useOrdersStore((s) => s.orders);
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);

  // Filter orders by tab & search query
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // Tab filter
      if (activeTab === 'processing' && order.current_stage >= 5) return false;
      if (activeTab === 'completed' && order.current_stage < 5) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.order_id.toLowerCase().includes(q);
        const matchesBuyer = order.buyer_name.toLowerCase().includes(q);
        const matchesItem = order.items.some((i) => i.name.toLowerCase().includes(q));
        if (!matchesId && !matchesBuyer && !matchesItem) return false;
      }

      return true;
    });
  }, [allOrders, activeTab, searchQuery]);

  const counts = useMemo(() => {
    const processing = allOrders.filter((o) => o.current_stage < 5).length;
    const completed = allOrders.filter((o) => o.current_stage >= 5).length;
    return { all: allOrders.length, processing, completed };
  }, [allOrders]);

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReorder = (order: OrderRecord) => {
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

    setReorderSuccessId(order.order_id);
    setTimeout(() => setReorderSuccessId(null), 2500);
  };

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-2">
          <nav className="flex items-center gap-1.5 text-xs text-[#8A7880]">
            <Link href="/" className="hover:text-[#9E1A59] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#1A1A1A]">Riwayat Pembelian</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A]">
                  Riwayat Pembelian
                </h1>
                <span className="text-2xl" aria-hidden="true">
                  🛍️
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#888] mt-1">
                {user ? `Halo, ${user.name}! ` : ''}Pantau status pengiriman, detail invoice, dan
                pesan ulang tas favoritmu.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/track')}
              className="self-start sm:self-auto cursor-pointer"
            >
              🔍 Lacak via Order ID
            </Button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8D5C0]">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#FFF8E1] p-1 rounded-2xl border border-[#E8D5C0] overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#9E1A59] text-white shadow-xs'
                  : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              Semua ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('processing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'processing'
                  ? 'bg-[#9E1A59] text-white shadow-xs'
                  : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              Diproses ({counts.processing})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-[#9E1A59] text-white shadow-xs'
                  : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              Selesai ({counts.completed})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari order ID atau nama tas..."
              className="w-full h-9 pl-8 pr-3 text-xs bg-white rounded-xl border border-[#C8C8C8]/60 focus:outline-none focus:border-[#9E1A59] focus:ring-1 focus:ring-[#9E1A59]/30 transition-all text-[#1A1A1A]"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-[#888]">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-[#888] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Global Toast for Reorder */}
        {reorderSuccessId && (
          <div className="rounded-2xl bg-[#D8FFF7] border border-[#9DDED1] p-3.5 flex items-center justify-between text-xs text-[#1A6B5C] font-semibold animate-in fade-in duration-200">
            <span>✨ Item pesanan berhasil ditambahkan kembali ke keranjang belanja!</span>
            <Link
              href="/checkout"
              className="underline underline-offset-2 font-bold hover:text-[#11493E]"
            >
              Buka Keranjang →
            </Link>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-4 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FFF8E1] border border-[#E8D5C0] flex items-center justify-center text-3xl">
              🛍️
            </div>
            <div>
              <p className="text-base font-bold text-[#1A1A1A]">Belum Ada Pesanan yang Cocok</p>
              <p className="text-xs sm:text-sm text-[#888] mt-1 max-w-sm">
                {searchQuery
                  ? `Tidak ada pesanan dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
                  : 'Pesanan yang kamu buat di website NEVERMIND akan tersimpan dan tampil lengkap di sini.'}
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => router.push('/')}>
              Jelajahi Koleksi Tas →
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => {
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

              return (
                <div
                  key={order.order_id}
                  className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-5 sm:p-6 shadow-xs flex flex-col gap-4 hover:border-[#9E1A59]/40 transition-colors"
                >
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
                          onClick={() => handleCopyOrderId(order.order_id)}
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
                        <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#FFF8E1] border border-[#E8D5C0] shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>

                        {/* Title & info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#FFF8E1] text-[#9E1A59] border border-[#E8D5C0]">
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

                      {/* Reorder Button */}
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="px-3.5 py-2 rounded-xl bg-[#FFF8E1] hover:bg-[#FFEFC4] border border-[#E8D5C0] text-xs font-bold text-[#9E1A59] transition-colors cursor-pointer"
                      >
                        🔁 Beli Lagi
                      </button>

                      {/* Track Shipment Button */}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push(`/track/${order.order_id}`)}
                      >
                        Lacak Pengiriman →
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
