'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F0E8] rounded-2xl md:rounded-3xl border border-[#C8C8C8]/40 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIdx]}
              alt={`${productName} — foto ${activeIdx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
          {activeIdx + 1}/{images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 px-1 overflow-x-auto no-scrollbar">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={[
                'relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-150 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C74375]/60',
                activeIdx === idx ? 'border-[#C74375] shadow-xs' : 'border-transparent hover:border-[#C8C8C8]/80',
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
