import { PageShell } from '@/components/layouts/PageShell';

export default function ProductDetailLoading() {
  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-[#EADCCF]/60 rounded-md mb-6" />

        <article className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery Skeleton */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-3.5 items-center">
            <div className="w-full max-w-[500px] aspect-square rounded-3xl bg-gradient-to-br from-[#F5EFEA] via-[#EFE6DC] to-[#FAF4EE] border border-[#E8D5C0]" />
            {/* Thumbnails row */}
            <div className="flex gap-2.5 w-full max-w-[500px] justify-center mt-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-16 rounded-xl bg-[#EADCCF]/50 border border-[#E8D5C0]/60" />
              ))}
            </div>
          </div>

          {/* Right Column: Details Skeleton */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col gap-6">
            {/* Badges & Title */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-full bg-[#EADCCF]/70" />
                <div className="h-6 w-28 rounded-full bg-[#9E1A59]/15" />
              </div>
              <div className="h-8 w-3/4 rounded-lg bg-[#EADCCF]/80" />
              <div className="h-4 w-1/3 rounded-md bg-[#EADCCF]/50" />
            </div>

            {/* Price Row Skeleton */}
            <div className="p-4 rounded-2xl bg-[#F5EFEA]/60 border border-[#E8D5C0]/60 flex flex-col gap-2">
              <div className="h-8 w-44 rounded-lg bg-[#9E1A59]/20" />
              <div className="h-4 w-56 rounded-md bg-[#EADCCF]/50" />
            </div>

            {/* Variant Swatches Skeleton */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="h-4 w-32 rounded-md bg-[#EADCCF]/70" />
              <div className="grid grid-cols-4 gap-2.5">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-white border border-[#E8D5C0] p-1.5 flex items-center gap-2">
                    <div className="w-11 h-11 rounded-lg bg-[#EADCCF]/60" />
                    <div className="h-3 w-10 rounded bg-[#EADCCF]/50" />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="flex gap-3 pt-4 border-t border-[#E8D5C0]/60">
              <div className="h-13 flex-1 rounded-full bg-[#9E1A59]/25" />
              <div className="h-13 flex-1 rounded-full bg-[#EADCCF]/60" />
            </div>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
