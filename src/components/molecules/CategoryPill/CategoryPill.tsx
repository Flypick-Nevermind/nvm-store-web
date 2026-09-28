'use client';

import { motion } from 'framer-motion';
import type { Category, CategoryId } from '@/constants/categories';

interface CategoryPillProps {
  category: Category;
  isActive: boolean;
  onClick: (id: CategoryId) => void;
}

export function CategoryPill({ category, isActive, onClick }: CategoryPillProps) {
  return (
    <motion.button
      id={`category-pill-${category.id}`}
      whileTap={{ scale: 0.93 }}
      onClick={() => onClick(category.id)}
      className={[
        'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E1A59]/50',
        isActive
          ? 'bg-[#9E1A59] text-white shadow-md'
          : 'bg-white border border-[#E8D5C0] text-[#1A1A1A] hover:border-[#9E1A59]/50 hover:text-[#9E1A59]',
      ].join(' ')}
      aria-pressed={isActive}
      aria-label={`Filter: ${category.label}`}
    >
      <span aria-hidden="true">{category.emoji}</span>
      {category.label}
    </motion.button>
  );
}
