'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { PageShell } from '@/components/layouts/PageShell';
import { OrderHistoryCard } from '@/components/molecules/OrderHistoryCard';
import { useOrderHistory } from '@/hooks/useOrderHistory';

export default function OrdersHistoryPage() {
  const router = useRouter();
  const {
    user,
    filteredOrders,
    counts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    copiedId,
    handleCopyOrderId,
    reorderSuccessId,
    deliveredSuccessId,
    handleConfirmDelivered,
    handleReorder,
  } = useOrderHistory();

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
          <div className="flex items-center gap-1 bg-[#F2EEEB] p-1 rounded-2xl border border-[#E8D5C0] overflow-x-auto">
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

        {/* Global Toast for Delivered Confirmation */}
        {deliveredSuccessId && (
          <div className="rounded-2xl bg-[#D8FFF7] border border-[#9DDED1] p-3.5 flex items-center justify-between text-xs text-[#1A6B5C] font-semibold animate-in fade-in duration-200">
            <span>🎉 Pesanan #{deliveredSuccessId} telah selesai dikonfirmasi! Terima kasih atas pembelianmu.</span>
            <span className="font-bold">Status: Selesai</span>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-4 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#F2EEEB] border border-[#E8D5C0] flex items-center justify-center text-3xl">
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
            {filteredOrders.map((order) => (
              <OrderHistoryCard
                key={order.order_id}
                order={order}
                copiedId={copiedId}
                onCopyOrderId={handleCopyOrderId}
                onReorder={handleReorder}
                onTrack={(orderId) => router.push(`/track/${orderId}`)}
                onConfirmDelivered={handleConfirmDelivered}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
