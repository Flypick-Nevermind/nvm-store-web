// NEVERMIND — Products Query Hook

import { useQuery } from '@tanstack/react-query';
import { getProductBySlug, getProducts } from '@/lib/api/products';
import type { Product } from '@/types/api';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
    refetchOnMount: true,
  });
}

export function useProductDetail(slug: string) {
  return useQuery<Product | undefined>({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    refetchOnMount: true,
  });
}
