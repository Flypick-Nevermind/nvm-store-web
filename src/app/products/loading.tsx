import { PageShell } from '@/components/layouts/PageShell';
import { ProductCardSkeleton } from '@/components/molecules/ProductCard';

export default function ProductsLoading() {
  return (
    <PageShell>
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
        aria-label="Memuat katalog produk"
      >
        {/* Sleek Minimalist Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 mb-8 border-b border-[#E8D5C0]/80">
          <div className="h-4 w-32 bg-[#EADCCF]/70 rounded-md animate-pulse" />
          <div className="h-8 w-48 bg-[#EADCCF]/40 rounded-full animate-pulse" />
        </div>

        {/* Skeleton Grid (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <ProductCardSkeleton key={key} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
