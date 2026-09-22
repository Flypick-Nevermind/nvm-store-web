'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

interface BankCardProps {
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

export function BankCard({ bank, accountNumber, accountHolder }: BankCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(accountNumber);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="rounded-2xl border border-[#C8C8C8]/60 bg-white p-4 flex items-center justify-between gap-3"
      style={{ boxShadow: '0 2px 12px 0 rgba(199,67,117,0.05)' }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-bold text-[#888] uppercase tracking-wider">{bank}</span>
        <span className="font-mono text-lg font-extrabold text-[#1A1A1A] tracking-widest">
          {accountNumber}
        </span>
        <span className="text-xs text-[#888]">a.n. {accountHolder}</span>
      </div>

      <button
        id={`copy-bank-${bank.toLowerCase()}`}
        onClick={handleCopy}
        aria-label={`Salin nomor rekening ${bank}`}
        className={[
          'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold',
          'transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375]/40',
          copied
            ? 'bg-[#D8FFF7] text-[#1A6B5C] border-[#9DDED1]'
            : 'bg-[#C74375]/8 text-[#C74375] border-[#C74375]/30 hover:bg-[#C74375] hover:text-white hover:border-[#C74375]',
        ].join(' ')}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="copied"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-6" />
              </svg>
              Tersalin!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <rect x="3" y="3" width="8" height="8" rx="1.5" />
                <path d="M6 3V2a1 1 0 011-1h5a1 1 0 011 1v8a1 1 0 01-1 1h-1" />
              </svg>
              Salin
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
