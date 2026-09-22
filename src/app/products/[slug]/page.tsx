import type { Metadata } from 'next';
import Image from 'next/image';
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
      <article className="max-w-md mx-auto pb-24">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Content */}
        <div className="px-4 pt-5 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={product.stock_type === 'pre-order' ? 'yellow' : 'aqua'}>
                {product.stock_type === 'pre-order' ? '⏳ Pre-Order' : '✅ Ready Stock'}
              </Badge>
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="silver">#{tag}</Badge>
              ))}
            </div>
            <h1 className="text-xl font-display font-bold text-[#1A1A1A] leading-snug">
              {product.name}
            </h1>
            <p className="text-2xl font-extrabold text-[#C74375]">
              Rp {product.price_total.toLocaleString('id-ID')}
            </p>
          </div>

          {/* ETA */}
          {product.stock_type === 'pre-order' && (
            <ETACalculator leadTimeDays={product.lead_time_days} />
          )}

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-bold text-[#1A1A1A]">Deskripsi</h2>
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
          <div className="rounded-2xl bg-[#D8FFF7] border border-[#9DDED1] p-4 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">🔍</span>
            <div>
              <p className="text-sm font-bold text-[#1A6B5C]">QC Fisik Terverifikasi</p>
              <p className="text-xs text-[#2D8A76] mt-0.5 leading-relaxed">
                Setiap barang lolos inspeksi fisik tim NEVERMIND sebelum dikirim ke kamu. Tidak sesuai = full refund.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <PDPActions product={product} />
      </article>
    </PageShell>
  );
}
