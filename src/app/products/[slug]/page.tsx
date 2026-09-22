import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';
import { PageShell } from '@/components/layouts/PageShell';
import { ETACalculator } from '@/components/molecules/ETACalculator';
import { PriceBreakdown } from '@/components/molecules/PriceBreakdown';
import { Badge } from '@/components/atoms/Badge';
import { ProductGallery } from '@/components/organisms/ProductGallery';
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

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 md:pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#888]">
          <Link href="/" className="hover:text-[#C74375] transition-colors">Katalog</Link>
          <span>/</span>
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium truncate max-w-[220px]">{product.name}</span>
        </nav>

        <article className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Gallery (sticky on desktop) */}
          <div className="md:col-span-6 lg:col-span-7 md:sticky md:top-24">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Details & Purchase sidebar */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={product.stock_type === 'pre-order' ? 'yellow' : 'aqua'}>
                  {product.stock_type === 'pre-order' ? '⏳ Pre-Order' : '✅ Ready Stock'}
                </Badge>
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="silver">#{tag}</Badge>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] leading-snug">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#C74375]">
                Rp {product.price_total.toLocaleString('id-ID')}
              </p>
            </div>

            {/* ETA */}
            {product.stock_type === 'pre-order' && (
              <ETACalculator leadTimeDays={product.lead_time_days} />
            )}

            {/* Actions (desktop inline + mobile sticky) */}
            <PDPActions product={product} />

            {/* Description */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#C8C8C8]/30">
              <h2 className="text-sm font-bold text-[#1A1A1A]">Deskripsi Produk</h2>
              <p className="text-sm text-[#444] leading-relaxed">{product.description}</p>
            </div>

            {/* Price Breakdown */}
            <PriceBreakdown
              priceBase={product.price_base}
              priceImportDuty={product.price_import_duty}
              priceShipping={product.price_shipping}
              priceTotal={product.price_total}
            />

            {/* QC guarantee */}
            <div className="rounded-2xl bg-[#D8FFF7] border border-[#9DDED1] p-4 flex items-start gap-3.5 shadow-xs">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">🔍</span>
              <div>
                <p className="text-sm font-bold text-[#1A6B5C]">QC Fisik Terverifikasi</p>
                <p className="text-xs text-[#2D8A76] mt-0.5 leading-relaxed">
                  Setiap barang lolos inspeksi fisik tim NEVERMIND di China & Indonesia sebelum dikirim ke kamu. Tidak sesuai = full refund.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
