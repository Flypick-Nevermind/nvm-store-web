'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_PRODUCTS } from '@/lib/api/mockData';

export function useNavbarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  // Sync searchQuery with URL query parameter
  useEffect(() => {
    const q = searchParams?.get('q') || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(q);
  }, [searchParams]);

  // Live auto-complete suggestions (min 2 chars)
  const liveSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [searchQuery]);

  // Submit search query
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    setIsSearchFocused(false);
    if (!q) {
      router.push('/products');
      return;
    }
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  // Close live preview on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    liveSearchResults,
    handleSearchSubmit,
    desktopSearchRef,
  };
}
