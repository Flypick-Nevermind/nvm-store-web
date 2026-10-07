'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { ProductCard, ProductCardSkeleton } from '@/components/molecules/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useRequestBagModalStore } from '@/store/requestBagModalStore';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>(
    'default'
  );
  const openRequestBag = useRequestBagModalStore((state) => state.openModal);

  const { data: allProducts = [], isLoading } = useProducts();

  // Keep searchInput synced with URL query
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(query);
  }, [query]);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    // Filter by search query if present
    if (query.trim()) {
      const qLower = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.short_description?.toLowerCase().includes(qLower) ||
          p.category?.toLowerCase().includes(qLower) ||
          p.colors?.some((c) => c.name.toLowerCase().includes(qLower))
      );
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price_base - b.price_base);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price_base - a.price_base);
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [allProducts, query, sortBy]);

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
      aria-label="All products"
    >
      {/* Search Result Banner (when query exists) */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-white border border-[#E8D5C0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="text-xs text-[#888]">Hasil pencarian untuk:</p>
              <p className="text-sm font-extrabold text-[#1A1A1A]">
                &quot;<span className="text-[#9E1A59]">{query}</span>&quot;
                <span className="text-xs font-semibold text-[#888] ml-2">
                  ({filtered.length} tas ditemukan)
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="self-start sm:self-auto text-xs font-bold text-[#9E1A59] bg-[#FFF0F5] hover:bg-[#FCE4EC] border border-[#F48FB1]/40 px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>✕</span>
            <span>Hapus Filter Pencarian</span>
          </button>
        </motion.div>
      )}

      {/* Sleek Minimalist Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 mb-8 border-b border-[#E8D5C0]/80">
        <div className="flex items-center gap-3">
          <p className="text-xs font-bold text-[#8A7880] uppercase tracking-widest shrink-0">
            {isLoading ? 'Memuat...' : `${filtered.length} Products`}
          </p>

          {/* Inline Filter Input on Page */}
          <div className="relative w-48 sm:w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = searchInput.trim();
                  router.push(val ? `/products?q=${encodeURIComponent(val)}` : '/products');
                }
              }}
              placeholder="Filter nama tas / model..."
              className="w-full pl-7 pr-7 py-1 text-xs rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#9E1A59] focus:ring-1 focus:ring-[#9E1A59]/20 transition-all shadow-xs"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#888]">
              🔍
            </span>
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  router.push('/products');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#888] hover:text-[#1A1A1A] cursor-pointer"
                title="Hapus filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#888] hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold rounded-full border border-[#E8D5C0] bg-white text-[#1A1A1A] hover:border-[#9E1A59] focus:outline-none focus:border-[#9E1A59] transition-all cursor-pointer shadow-xs appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239E1A59' stroke-width='2.5'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
              aria-label="Sort by"
            >
              <option value="default">Default</option>
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga: Low → High</option>
              <option value="price-desc">Harga: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <ProductCardSkeleton key={key} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <motion.div
            key={sortBy + query}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Request a Bag Strip */}
          <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white via-[#FAF6F0] to-[#FAF0F3] border border-[#E8D5C0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9E1A59] text-white text-[10px] font-black uppercase tracking-wider">
                  <span>📸</span> On-Demand Sourcing
                </span>
                <span className="text-[10px] font-bold text-[#5C5C00] bg-[#FDFD96] px-2 py-0.5 rounded-full border border-[#E0E040]">
                  Upload Foto Bebas
                </span>
              </div>
              <h3 className="font-display font-black text-lg sm:text-xl text-[#1A1A1A]">
                Tidak Menemukan Model Tas yang Kamu Cari?
              </h3>
              <p className="text-xs sm:text-sm text-[#666] mt-1.5 max-w-xl leading-relaxed">
                Punya foto tas dari TikTok, Pinterest, atau XiaoHongShu? Cukup upload foto
                referensinya. Tim kami siap carikan tas impian original bergaransi langsung dari
                supplier China bebas bea cukai.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openRequestBag(query || undefined)}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#9E1A59] via-[#A81B61] to-[#7A1244] hover:from-[#7A1244] hover:to-[#9E1A59] text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-white/20 group"
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:rotate-12 transition-transform">
                📸
              </span>
              <span>REQUEST BAG SEKARANG</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FDFD96] text-[#5C5C00] tracking-normal leading-none shadow-2xs">
                Upload Foto
              </span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 gap-4 text-center bg-[#F2EEEB] rounded-3xl border border-[#E8D5C0]">
          <span className="text-5xl" aria-hidden="true">
            🔍
          </span>
          <p className="font-display font-black text-lg text-[#1A1A1A]">
            {query
              ? `Tidak ada tas yang cocok dengan "${query}"`
              : 'Belum ada produk yang tersedia'}
          </p>
          <p className="text-xs sm:text-sm text-[#888] max-w-md leading-relaxed">
            {query
              ? 'Coba periksa ejaan, gunakan kata kunci yang lebih umum (seperti: bow, tote, quilted, mini), atau minta tim kami mencarikannya langsung.'
              : 'Tas yang kamu cari belum ada di katalog? Jangan khawatir, kamu bisa langsung request ke tim kami.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {query ? (
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="px-5 py-2.5 rounded-full border border-[#9E1A59] text-[#9E1A59] text-xs font-bold tracking-wide hover:bg-[#FFF0F5] transition-colors cursor-pointer"
              >
                Lihat Semua Koleksi Tas
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSortBy('default')}
                className="px-5 py-2 rounded-full border border-[#9E1A59] text-[#9E1A59] text-xs font-bold tracking-wide hover:bg-[#FFF0F5] transition-colors cursor-pointer"
              >
                Reset Sorting
              </button>
            )}
            <button
              type="button"
              onClick={() => openRequestBag(query || undefined)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#9E1A59] to-[#7A1244] text-white text-xs font-black tracking-wider uppercase hover:shadow-md transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>📸</span>
              <span>Request Tas (Upload Foto)</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function AllProductsPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-[#888]">Memuat katalog produk...</div>
        }
      >
        <ProductsContent />
      </Suspense>
    </PageShell>
  );
}
