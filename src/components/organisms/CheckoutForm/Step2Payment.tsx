'use client';

import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import { BankCard } from '@/components/molecules/BankCard';
import { BANK_ACCOUNTS, QRIS_IMAGE_PATH } from '@/constants/payment';

interface Step2PaymentProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function Step2Payment({
  selectedMethod,
  onSelectMethod,
  onNext,
  onBack,
}: Step2PaymentProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-bold text-[#1A1A1A]">Pilih Metode Pembayaran</h2>
        <p className="text-sm text-[#888]">Pilih salah satu rekening atau QRIS di bawah ini.</p>
      </div>

      <div className="flex flex-col gap-3">
        {BANK_ACCOUNTS.map((acc) => {
          const isSelected = selectedMethod === acc.id;
          return (
            // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={acc.id}
              onClick={() => onSelectMethod(acc.id)}
              className={[
                'rounded-2xl transition-all cursor-pointer border-2 p-1.5',
                isSelected
                  ? 'border-[#9E1A59] bg-[#FFF0F5]/40 shadow-xs'
                  : 'border-transparent hover:border-[#E8D5C0]',
              ].join(' ')}
            >
              <div className="flex items-center gap-2 px-3 pt-2">
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#9E1A59]' : 'border-[#BBB]'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#9E1A59]" />}
                </span>
                <span className="text-xs font-bold text-[#1A1A1A]">Transfer Bank {acc.bank}</span>
              </div>
              <BankCard
                bank={acc.bank}
                accountNumber={acc.accountNumber}
                accountHolder={acc.accountHolder}
              />
            </div>
          );
        })}

        {/* QRIS */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
        <div
          onClick={() => onSelectMethod('qris')}
          className={[
            'rounded-2xl transition-all cursor-pointer border-2 p-4 flex flex-col items-center gap-2 bg-white',
            selectedMethod === 'qris'
              ? 'border-[#9E1A59] bg-[#FFF0F5]/40 shadow-xs'
              : 'border-[#C8C8C8]/60 hover:border-[#E8D5C0]',
          ].join(' ')}
        >
          <div className="w-full flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'qris' ? 'border-[#9E1A59]' : 'border-[#BBB]'
                }`}
              >
                {selectedMethod === 'qris' && (
                  <span className="w-2 h-2 rounded-full bg-[#9E1A59]" />
                )}
              </span>
              <p className="text-xs font-bold text-[#1A1A1A]">Pembayaran Instan QRIS</p>
            </div>
            <span className="text-[10px] font-bold text-[#1A6B5C] bg-[#D8FFF7] px-2 py-0.5 rounded-full">
              Semua E-Wallet & M-Banking
            </span>
          </div>

          <div className="relative w-44 h-44 my-1">
            <Image
              src={QRIS_IMAGE_PATH}
              alt="QRIS NEVERMIND — scan untuk bayar"
              fill
              className="object-contain"
              onError={() => {}}
            />
          </div>
          <p className="text-xs text-[#888] text-center">
            Screenshot QRIS → buka m-banking / e-wallet → upload & scan QR
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#FDFD96]/40 border border-[#FDFD96] p-4">
        <p className="text-xs text-[#5C5C00] leading-relaxed">
          ⚠️ <strong>Penting:</strong> Transfer sesuai total yang tertera. Jangan tambah atau kurangi
          nominal agar pesananmu langsung otomatis terverifikasi.
        </p>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={onNext}>
        Sudah Transfer, Upload Bukti →
      </Button>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-[#888] hover:text-[#9E1A59] transition-colors cursor-pointer self-center"
        >
          ← Kembali ke Data Pengiriman
        </button>
      )}
    </div>
  );
}
