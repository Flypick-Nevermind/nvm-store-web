'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-3.5 max-w-[460px] mx-auto w-full group">
      {/* Main image container with controlled max-height */}
      <div className="relative aspect-[4/5] max-h-[480px] w-full overflow-hidden bg-[#F5F0E8] rounded-3xl border border-[#C8C8C8]/50 shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIdx]}
              alt={`${productName} — foto ${activeIdx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 460px"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next navigation arrows (if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1A1A1A] shadow-md backdrop-blur-xs flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer text-base"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1A1A1A] shadow-md backdrop-blur-xs flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer text-base"
            >
              ›
            </button>
          </>
        )}

        {/* Image counter pill */}
        <div className="absolute bottom-3.5 right-3.5 bg-black/60 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-md tracking-wider">
          {activeIdx + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 px-0.5 overflow-x-auto no-scrollbar justify-center sm:justify-start">
          {images.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={[
                'relative flex-shrink-0 w-16 h-20 sm:w-18 sm:h-22 rounded-2xl overflow-hidden border-2 transition-all duration-150 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375]/60',
                activeIdx === idx
                  ? 'border-[#C74375] shadow-xs scale-102 ring-2 ring-[#C74375]/20'
                  : 'border-[#C8C8C8]/50 opacity-70 hover:opacity-100 hover:border-[#C8C8C8]',
              ].join(' ')}
              aria-label={`Lihat foto ${idx + 1}`}
              aria-pressed={activeIdx === idx}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
