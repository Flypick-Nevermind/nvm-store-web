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
  { id: 'all', label: 'Semua', emoji: '✨' },
  { id: 'trending-now', label: 'Trending Now', emoji: '🔥' },
  { id: 'y2k-core', label: 'Y2K Core', emoji: '💿' },
  { id: 'just-dropped', label: 'Just Dropped', emoji: '🆕' },
  { id: 'under-300k', label: 'Under Rp300K', emoji: '💸' },
  { id: 'cute-finds', label: 'Cute Finds', emoji: '🎀' },
] as const;

export type StockFilter = 'all' | 'pre-order' | 'ready-stock';

export const STOCK_FILTERS: { id: StockFilter; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'pre-order', label: 'Pre-Order' },
  { id: 'ready-stock', label: 'Ready Stock' },
];
