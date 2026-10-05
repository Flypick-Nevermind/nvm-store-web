import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/atoms/Badge';
import { PageShell } from '@/components/layouts/PageShell';
import { ETACalculator } from '@/components/molecules/ETACalculator';
import { ProductCard } from '@/components/molecules/ProductCard';
import { CustomerReviews } from '@/components/organisms/CustomerReviews';
import { ProductGallery } from '@/components/organisms/ProductGallery';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';
import { PDPActions } from './PDPActions';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Produk tidak ditemukan | NEVERMIND' };
  return {
    title: product.name,
    description: product.short_description,
    openGraph: {
      title: `${product.name} | NEVERMIND`,
      description: product.short_description,
      images: [{ url: product.images[0], width: 600, height: 800, alt: product.name }],
    },
  };
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs text-[#8A7880]"
        >
          <Link href="/" className="hover:text-[#9E1A59] transition-colors">
            Katalog
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium truncate max-w-[220px]">{product.name}</span>
        </nav>

        <article className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Compact, elegant Gallery (sticky on desktop) */}
          <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-48 flex justify-center">
            <ProductGallery
              images={product.images}
              productName={product.name}
              discountPercent={product.discount_percent}
            />
          </div>

          {/* Right Column: Details & Purchase sidebar */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    product.stock_type === 'sold-out'
                      ? 'sold-out'
                      : product.stock_type === 'pre-order'
                        ? 'yellow'
                        : 'aqua'
                  }
                >
                  {product.stock_type === 'sold-out'
                    ? 'Sold Out'
                    : product.stock_type === 'pre-order'
                      ? 'Pre-Order'
                      : 'Ready Stock'}
                </Badge>
                {product.discount_percent && (
                  <Badge variant="primary">
                    🔥 Diskon {product.discount_percent}%
                  </Badge>
                )}
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="silver">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#1A1A1A] leading-snug">
                {product.name}
              </h1>

              {/* Rating & Review Anchor */}
              <a
                href="#customer-reviews"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#888] hover:text-[#9E1A59] transition-colors group w-fit cursor-pointer"
              >
                <div className="flex items-center text-[#F59E0B] text-sm">
                  <span>★★★★★</span>
                </div>
                <span className="font-bold text-[#1A1A1A]">4.9</span>
                <span>·</span>
                <span className="underline underline-offset-2 group-hover:text-[#9E1A59]">
                  Lihat Ulasan Pembeli
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D8FFF7] text-[#1A6B5C] font-bold">
                  ✓ Terverifikasi
                </span>
              </a>

              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#9E1A59]">
                    Rp {product.price_base.toLocaleString('id-ID')}
                  </p>
                  {product.original_price && (
                    <p className="text-base sm:text-lg text-[#A0959A] line-through font-semibold">
                      Rp {product.original_price.toLocaleString('id-ID')}
                    </p>
                  )}
                  {product.discount_percent && (
                    <span className="text-xs font-black text-[#9E1A59] bg-[#FAF0F3] px-2.5 py-0.5 rounded-full border border-[#9E1A59]/30">
                      HEMAT {product.discount_percent}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[#8A7880] font-medium bg-[#F2EEEB] px-2.5 py-1 rounded-full border border-[#E8D5C0]">
                    Ongkir & biaya dihitung saat checkout
                  </span>
                  {product.original_price && (
                    <span className="text-xs text-[#1A6B5C] font-semibold bg-[#D8FFF7] px-2.5 py-1 rounded-full border border-[#9DDED1]">
                      Hemat Rp {(product.original_price - product.price_base).toLocaleString('id-ID')}!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ETA */}
            {product.stock_type === 'pre-order' && (
              <ETACalculator leadTimeDays={product.lead_time_days} />
            )}

            {/* Actions (desktop inline + mobile sticky) */}
            <PDPActions product={product} />

            {/* Benefit badges from Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8D5C0] text-[11px] text-[#444]">
                <span className="text-base">🚚</span>
                <span className="font-semibold">
                  FREE SHIPPING{' '}
                  <span className="text-[10px] text-[#888] font-normal block">
                    for selected items
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8D5C0] text-[11px] text-[#444]">
                <span className="text-base">🛍️</span>
                <span className="font-semibold">
                  AUTHENTIC SOURCE{' '}
                  <span className="text-[10px] text-[#888] font-normal block">from China</span>
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8D5C0] text-[11px] text-[#444]">
                <span className="text-base">💌</span>
                <span className="font-semibold">
                  CURATED SERVICE{' '}
                  <span className="text-[10px] text-[#888] font-normal block">with love ♡</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E8D5C0]">
              <h2 className="text-sm font-bold text-[#1A1A1A]">Deskripsi Produk</h2>
              <p className="text-sm text-[#555] leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications Card */}
            <div className="rounded-2xl bg-white border border-[#E8D5C0] p-4 shadow-xs flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider text-[#888]">
                Informasi & Spesifikasi
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col">
                  <span className="text-[#888]">Kategori</span>
                  <span className="font-semibold text-[#1A1A1A] capitalize">
                    {product.category.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#888]">Tipe Pengiriman</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {product.stock_type === 'sold-out'
                      ? 'Stok Habis (Menunggu Jadwal Restock)'
                      : product.stock_type === 'pre-order'
                        ? `Kurasi PO (${product.lead_time_days[0]}–${product.lead_time_days[1]} hari)`
                        : 'Ready Stock (Kirim Hari Ini)'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#888]">Asal Produk</span>
                  <span className="font-semibold text-[#1A1A1A]">Guangzhou / Hangzhou, China</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#888]">Jaminan Kualitas</span>
                  <span className="font-semibold text-[#1A6B5C]">
                    100% Real Picture & QC Passed
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping & Fees info note */}
            <div className="rounded-2xl border border-[#E8D5C0] bg-white/90 p-4 flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">
                  📦
                </span>
                <h3 className="text-xs font-bold text-[#1A1A1A]">Informasi Ongkir & Biaya Tambahan</h3>
                <span className="text-[10px] text-[#9E1A59] font-semibold bg-[#9E1A59]/10 px-2 py-0.5 rounded-full ml-auto">
                  Transparan ✓
                </span>
              </div>
              <p className="text-xs text-[#8A7880] leading-relaxed">
                Harga di atas merupakan harga asli produk. Ongkos kirim domestik dan estimasi bea masuk dihitung secara transparan saat checkout sebelum pembayaran.
              </p>
            </div>

            {/* QC Guarantee Card */}
            <div className="rounded-2xl bg-[#D8FFF7] border border-[#9DDED1] p-4 flex items-start gap-3.5 shadow-xs">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">
                🔍
              </span>
              <div>
                <p className="text-sm font-bold text-[#1A6B5C]">QC Fisik Terverifikasi</p>
                <p className="text-xs text-[#2D8A76] mt-0.5 leading-relaxed">
                  Setiap barang lolos inspeksi fisik tim NEVERMIND di China & Indonesia sebelum
                  dikirim ke kamu. Tidak sesuai foto atau cacat produksi = Garansi Full Refund.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Customer Reviews Section */}
        <CustomerReviews
          productId={product.id}
          productName={product.name}
          variants={product.variants}
        />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#E8D5C0] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9E1A59] uppercase tracking-wider">
                  Koleksi Terkait
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#1A1A1A]">
                  Kamu Mungkin Juga Suka ✨
                </h2>
              </div>
              <Link href="/" className="text-xs font-semibold text-[#9E1A59] hover:underline">
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 items-stretch">
              {relatedProducts.map((relProduct) => (
                <div key={relProduct.id} className="h-full flex flex-col">
                  <ProductCard product={relProduct} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
