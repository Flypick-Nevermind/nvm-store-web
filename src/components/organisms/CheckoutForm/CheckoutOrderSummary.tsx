'use client';

import Image from 'next/image';
import { formatIDR } from '@/lib/utils';
import type { CartItem } from '@/types/api';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  step: number;
  totalQuantity: number;
  totalPrice: number;
  discountAmount: number;
  finalTotal: number;
  appliedVoucher: string | null;
  voucherInput: string;
  voucherError: string | null;
  onEditItems: () => void;
  onVoucherInputChange: (val: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
  onUpdateQuantity: (key: string, qty: number) => void;
  onRemoveItem: (key: string) => void;
}

export function CheckoutOrderSummary({
  items,
  step,
  totalQuantity,
  totalPrice,
  discountAmount,
  finalTotal,
  appliedVoucher,
  voucherInput,
  voucherError,
  onEditItems,
  onVoucherInputChange,
  onApplyVoucher,
  onRemoveVoucher,
  onUpdateQuantity,
  onRemoveItem,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-4 order-1 lg:order-2">
      <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8D5C0]">
          <p className="text-xs font-bold text-[#8A7880] uppercase tracking-wider">
            Ringkasan Pesanan ({totalQuantity} item)
          </p>
          {step > 1 && (
            <button
              type="button"
              onClick={onEditItems}
              className="text-xs font-semibold text-[#9E1A59] hover:underline flex items-center gap-1 cursor-pointer"
            >
              ✏️ Ubah Item
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
          {items.map((item) => {
            const itemIdentifier = item.key || item.productId;
            return (
              <div
                key={itemIdentifier}
                className="flex items-center gap-3 py-2 border-b border-[#E8D5C0] last:border-b-0"
              >
                {/* Thumbnail */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#F2EEEB] shrink-0 border border-[#E8D5C0]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-[#F2EEEB] text-[#1A1A1A] border border-[#E8D5C0] mb-0.5">
                    {item.type === 'pre-order' ? 'PO 14-21 Hari' : 'Ready Stock'}
                  </span>
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.name}</p>
                  {(item.color || item.variant) && (
                    <p className="text-[11px] text-[#9E1A59] font-semibold truncate">
                      {[item.color, item.variant].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  <p className="text-xs text-[#8A7880]">{formatIDR(item.price)}</p>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    {/* Stepper */}
                    <div className="flex items-center bg-[#F2EEEB] border border-[#E8D5C0] rounded-lg overflow-hidden h-7">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(itemIdentifier, item.quantity - 1)}
                        className="w-6 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:text-[#9E1A59] font-bold text-xs transition-colors cursor-pointer"
                        aria-label="Kurangi kuantitas"
                        title={item.quantity === 1 ? 'Hapus barang' : 'Kurangi kuantitas'}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(itemIdentifier, item.quantity + 1)}
                        className="w-6 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:text-[#9E1A59] font-bold text-xs transition-colors cursor-pointer"
                        aria-label="Tambah kuantitas"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(itemIdentifier)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#888] hover:text-[#9E1A59] hover:bg-[#9E1A59]/10 transition-colors cursor-pointer"
                      title="Hapus barang dari keranjang"
                      aria-label={`Hapus ${item.name}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <span className="text-xs font-bold text-[#9E1A59]">
                    {formatIDR(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Voucher Promo Section */}
        <div className="pt-3 border-t border-[#E8D5C0]">
          {appliedVoucher ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF0F5] border border-[#F48FB1]/50">
              <div className="flex items-center gap-2">
                <span className="text-base">🎟️</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black font-mono text-[#9E1A59]">
                      {appliedVoucher}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#9E1A59] text-white">
                      -5%
                    </span>
                  </div>
                  <p className="text-[10px] text-[#25D366] font-bold">Voucher hemat diterapkan!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemoveVoucher}
                className="text-[11px] font-bold text-[#888] hover:text-[#9E1A59] hover:underline cursor-pointer"
              >
                Hapus
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => onVoucherInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onApplyVoucher();
                    }
                  }}
                  placeholder="Kode voucher promo"
                  className="flex-1 min-w-0 px-3 py-2 text-xs font-mono font-bold bg-[#FAF6F0] rounded-xl border border-[#E8D5C0] focus:border-[#9E1A59] focus:outline-none uppercase placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:text-[#999]"
                />
                <button
                  type="button"
                  onClick={onApplyVoucher}
                  className="shrink-0 px-3.5 py-2 text-xs font-bold bg-[#9E1A59] text-white rounded-xl hover:bg-[#7A1244] active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  Pakai
                </button>
              </div>
              {voucherError ? (
                <p className="text-[10px] text-red-500 font-medium pl-1">{voucherError}</p>
              ) : (
                <p className="text-[10px] text-[#888] pl-1">
                  Punya kode voucher promo? Masukkan di atas.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Price Calculation Breakdown */}
        <div className="border-t border-[#E8D5C0] pt-3 flex flex-col gap-1.5 text-xs">
          <div className="flex justify-between items-center text-[#666]">
            <span>Subtotal Produk</span>
            <span className="font-semibold text-[#1A1A1A]">{formatIDR(totalPrice)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-[#25D366] font-bold">
              <span className="flex items-center gap-1">
                <span>🏷️ Diskon Promo ({appliedVoucher})</span>
              </span>
              <span>- {formatIDR(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-[#E8D5C0]/60">
            <span className="text-base font-bold text-[#1A1A1A]">Total Pembayaran</span>
            <span className="text-lg font-black text-[#9E1A59]">{formatIDR(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Trust badge note */}
      <div className="rounded-2xl bg-[#F2EEEB] border border-[#E8D5C0] p-4 text-xs text-[#8A7880] leading-relaxed flex items-start gap-2.5">
        <span className="text-base shrink-0" aria-hidden="true">
          🔒
        </span>
        <p>
          Transaksi aman & terenkripsi. Konfirmasi instan langsung diteruskan ke WhatsApp admin
          NEVERMIND.
        </p>
      </div>
    </div>
  );
}
