// NEVERMIND — Product Category Pills

export type CategoryId =
  | 'all'
  | 'trending-now'
  | 'y2k-core'
  | 'just-dropped'
  | 'under-300k'
  | 'cute-finds';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Semua Koleksi', emoji: '✨' },
  { id: 'trending-now', label: 'Trending in China', emoji: '🌐' },
  { id: 'y2k-core', label: 'Y2K Finds', emoji: '⭐️' },
  { id: 'just-dropped', label: 'Limited Drops', emoji: '🤍' },
  { id: 'cute-finds', label: 'From China, With Love', emoji: '✈️' },
  { id: 'under-300k', label: 'Under Rp300K', emoji: '💸' },
] as const;

export type StockFilter = 'all' | 'ready-stock' | 'pre-order' | 'sold-out';

export const STOCK_FILTERS: { id: StockFilter; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'ready-stock', label: 'Ready Stock' },
  { id: 'pre-order', label: 'Pre-Order' },
  { id: 'sold-out', label: 'Sold Out' },
];
