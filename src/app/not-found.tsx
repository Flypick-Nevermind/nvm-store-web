'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PageShell } from '@/components/layouts/PageShell';
import { BRAND } from '@/constants/brand';

export default function NotFound() {
  return (
    <PageShell>
      <section className="min-h-[75vh] bg-[#F2EEEB] py-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full mx-auto text-center"
        >
          {/* Friendly Icon / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] border border-[#9E1A59]/20 text-xs font-black tracking-widest uppercase mb-6">
            <span>🌸</span> HALAMAN SEDANG DIPERSIAPKAN
          </div>

          {/* Visual 404 Accent */}
          <div className="relative mb-6 select-none">
            <span className="font-display font-black text-7xl sm:text-9xl text-[#9E1A59]/15 tracking-tighter block">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl sm:text-5xl">👜</span>
            </div>
          </div>

          {/* Heading & Friendly Subtitle */}
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#1A1A1A] tracking-tight mb-3">
            Oops! Halaman Belum Tersedia
          </h1>
          <p className="text-sm sm:text-base text-[#666] max-w-lg mx-auto leading-relaxed mb-8">
            Halaman yang kamu cari sedang dalam proses kurasi atau tautan telah berpindah.
            Jangan khawatir, kamu tetap bisa menjelajahi koleksi tas viral NEVERMIND lainnya!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#9E1A59] text-white text-xs font-bold tracking-wide hover:bg-[#7A1244] transition-all shadow-md text-center"
            >
              ← Kembali ke Beranda
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-[#E8D5C0] text-[#1A1A1A] hover:bg-[#FAF0F3] hover:text-[#9E1A59] text-xs font-bold tracking-wide transition-all shadow-2xs text-center"
            >
              ✨ Lihat Semua Produk
            </Link>
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}?text=Halo+Nevermind,+saya+ingin+bertanya+tentang+produk`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-[#E8D5C0] text-[#9E1A59] hover:bg-[#9E1A59] hover:text-white text-xs font-bold tracking-wide transition-all shadow-2xs text-center flex items-center justify-center gap-1.5"
            >
              <span>💬</span> Chat Admin WA
            </a>
          </div>

          {/* Popular Destinations Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5C0] shadow-sm text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E1A59] mb-4 text-center sm:text-left">
              Halaman Populer yang Bisa Kamu Kunjungi:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/best-seller"
                className="p-3.5 rounded-2xl border border-[#E8D5C0] bg-[#F2EEEB]/50 hover:bg-[#F2EEEB] hover:border-[#9E1A59] transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-white border border-[#E8D5C0] flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                  👑
                </span>
                <div>
                  <h2 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#9E1A59] transition-colors">
                    Best Sellers
                  </h2>
                  <p className="text-[11px] text-[#888]">Produk paling laris & favorit</p>
                </div>
              </Link>

              <Link
                href="/flash-sale"
                className="p-3.5 rounded-2xl border border-[#E8D5C0] bg-[#F2EEEB]/50 hover:bg-[#F2EEEB] hover:border-[#9E1A59] transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-white border border-[#E8D5C0] flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                  ⚡
                </span>
                <div>
                  <h2 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#9E1A59] transition-colors">
                    Flash Sale
                  </h2>
                  <p className="text-[11px] text-[#888]">Promo diskon waktu terbatas</p>
                </div>
              </Link>

              <Link
                href="/new-arrivals"
                className="p-3.5 rounded-2xl border border-[#E8D5C0] bg-[#F2EEEB]/50 hover:bg-[#F2EEEB] hover:border-[#9E1A59] transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-white border border-[#E8D5C0] flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                  ✨
                </span>
                <div>
                  <h2 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#9E1A59] transition-colors">
                    New Arrivals
                  </h2>
                  <p className="text-[11px] text-[#888]">Rilisan tas terbaru dari China</p>
                </div>
              </Link>

              <Link
                href="/category"
                className="p-3.5 rounded-2xl border border-[#E8D5C0] bg-[#F2EEEB]/50 hover:bg-[#F2EEEB] hover:border-[#9E1A59] transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-white border border-[#E8D5C0] flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                  👜
                </span>
                <div>
                  <h2 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#9E1A59] transition-colors">
                    Kategori Produk
                  </h2>
                  <p className="text-[11px] text-[#888]">Tote, shoulder, crossbody, mini</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
