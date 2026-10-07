'use client';

export function ProductCardSkeleton() {
  return (
    <article className="flex flex-col h-full relative rounded-2xl overflow-hidden bg-white border border-[#E8D5C0] shadow-xs select-none">
      {/* ── Image Area (Square 1:1) ─────────────────────────── */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#F5EFEA] via-[#EFE6DC] to-[#FAF4EE] shrink-0 animate-pulse">
        {/* Floating badge placeholders */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <div className="h-5 w-16 rounded-full bg-white/70 backdrop-blur-xs" />
        </div>
        {/* Wishlist placeholder icon */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/70 backdrop-blur-xs" />
      </div>

      {/* ── Product Info Section ───────────────────────────── */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3 bg-white">
        {/* Title skeleton (2 lines) */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-4 bg-[#EADCCF]/70 rounded-md w-5/6 animate-pulse" />
          <div className="h-4 bg-[#EADCCF]/50 rounded-md w-3/5 animate-pulse" />
        </div>

        {/* Price & ETA skeleton */}
        <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-[#F2EEEB]">
          <div className="space-y-1.5 w-full">
            <div className="h-5 bg-[#9E1A59]/15 rounded-md w-2/5 animate-pulse" />
            <div className="h-3 bg-[#EADCCF]/50 rounded-md w-3/5 animate-pulse" />
          </div>
        </div>
      </div>
    </article>
  );
}
