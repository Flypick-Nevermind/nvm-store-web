'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { PageShell } from '@/components/layouts/PageShell';
import { ProductCard, ProductCardSkeleton } from '@/components/molecules/ProductCard';
import { useProducts } from '@/hooks/useProducts';

export default function FlashSalePage() {
  const [notifyInput, setNotifyInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { data: allProducts = [], isLoading } = useProducts();

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyInput.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <PageShell>
      {/* ── Breadcrumb ────────────────────────────────────────── */}
      <div className="bg-[#F2EEEB] border-b border-[#E8D5C0] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#8A7880]">
            <Link href="/" className="hover:text-[#9E1A59] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#1A1A1A] font-semibold">Flash Sale (Coming Soon)</span>
          </nav>
        </div>
      </div>

      {/* ── Coming Soon Teaser Hero ───────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2EEEB] via-[#F8F5F2] to-white py-16 sm:py-24 border-b border-[#E8D5C0]">
        {/* Decorative background glow accents */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#9E1A59]/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-32 w-72 h-72 bg-[#D8FFF7]/40 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Teaser Badges */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 flex-wrap justify-center mb-5"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#9E1A59] text-white text-xs font-black tracking-wider uppercase shadow-sm">
              <span className="animate-pulse">⚡</span> COMING SOON
            </span>
            <Badge variant="yellow">🔒 Konsep Sedang Dirancang</Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-[#1A1A1A] tracking-tight leading-tight max-w-2xl mb-5"
          >
            Flash Sale Eksklusif <br />
            <span className="text-[#9E1A59] drop-shadow-xs">Segera Hadir! ✨</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="text-base sm:text-lg text-[#666] max-w-xl leading-relaxed mb-8"
          >
            Kami sedang mematangkan konsep Flash Sale paling seru dengan kurasi tas aesthetic pilihan & harga kejutan yang belum pernah ada sebelumnya. Stay tuned ya!
          </motion.p>

          {/* Notification Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="w-full max-w-md bg-white p-5 sm:p-6 rounded-2xl border border-[#E8D5C0] shadow-md"
          >
            {isSubscribed ? (
              <div className="py-3 px-4 bg-[#D8FFF7]/60 border border-[#9DDED1] rounded-xl text-center">
                <span className="text-2xl block mb-1">🎉</span>
                <p className="text-sm font-bold text-[#1A6B5C]">
                  Yeay! Kamu Sudah Terdaftar!
                </p>
                <p className="text-xs text-[#1A6B5C]/80 mt-0.5">
                  Kami akan mengabarimu segera begitu tanggal Flash Sale pertama diumumkan ♡
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 justify-center text-xs font-bold text-[#1A1A1A]">
                  <span>🔔</span>
                  <span>Beri Tahu Saya Saat Flash Sale Dimulai</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nomor WhatsApp atau Email kamu..."
                    value={notifyInput}
                    onChange={(e) => setNotifyInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8D5C0] text-sm text-[#1A1A1A] placeholder:text-[#AAA] focus:outline-none focus:border-[#9E1A59] focus:ring-1 focus:ring-[#9E1A59] bg-[#FAF8F5]"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="whitespace-nowrap px-5"
                  >
                    Ingatkan Saya
                  </Button>
                </div>
                <p className="text-[11px] text-[#888]">
                  Bebas spam • Kamu hanya akan menerima info eksklusif peluncuran Flash Sale.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Sneak Peek Teaser Highlights ─────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#F8F5F2] border-b border-[#E8D5C0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9E1A59] block mb-1">
              Bocoran Konsep
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A]">
              Apa yang Sedang Kami Rancang?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] shadow-xs flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0F3] text-[#9E1A59] text-2xl flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="font-bold text-base text-[#1A1A1A]">
                Surprise Drop Hours
              </h3>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
                Flash Sale di waktu terbatas dengan slot countdown khusus untuk pengalaman belanja seru & mendebarkan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] shadow-xs flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0F3] text-[#9E1A59] text-2xl flex items-center justify-center font-bold">
                🏷️
              </div>
              <h3 className="font-bold text-base text-[#1A1A1A]">
                Special Discount Badges
              </h3>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
                Potongan harga spesial langsung nempel di produk pilihan terbaik, tanpa ribet klaim voucher.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8D5C0] shadow-xs flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0F3] text-[#9E1A59] text-2xl flex items-center justify-center font-bold">
                ✨
              </div>
              <h3 className="font-bold text-base text-[#1A1A1A]">
                Curated Viral Bags
              </h3>
              <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
                Hanya tas-tas pilihan paling dicari dan tren Y2K terkini yang akan masuk ke dalam radar flash sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sambil Menunggu, Intip Koleksi Diskon Kami ────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#9E1A59] block mb-1">
                Belanja Sekarang
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A]">
                Koleksi Tas dengan Diskon Spesial 🔥
              </h2>
              <p className="text-xs sm:text-sm text-[#888] mt-1">
                Sambil menunggu flash sale, kamu sudah bisa menikmati diskon langsung di setiap produk berikut:
              </p>
            </div>
            <Link
              href="/new-arrivals"
              className="text-xs font-bold text-[#9E1A59] hover:text-[#7A1244] underline underline-offset-4 shrink-0"
            >
              Lihat Semua Koleksi →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading
              ? [1, 2, 3, 4].map((key) => <ProductCardSkeleton key={key} />)
              : allProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/new-arrivals">
              <Button variant="outline" size="lg" className="px-8">
                Jelajahi Semua Produk New Arrivals ✨
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
