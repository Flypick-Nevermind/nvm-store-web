'use client';

import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import type { CreateOrderDTO, CreateOrderResponse, OrderDetailResponse } from '@/types/api';
import { mockCreateOrder, mockFetchOrder } from './mockData';

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const orderKeys = {
  all: ['orders'] as const,
  detail: (id: string) => [...orderKeys.all, id] as const,
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateOrder(): UseMutationResult<CreateOrderResponse, Error, CreateOrderDTO> {
  return useMutation({
    mutationFn: async (dto: CreateOrderDTO) => {
      // TODO: Replace with real API call in Phase 2
      // const res = await fetch('/api/v1/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(dto),
      // });
      // if (!res.ok) throw new Error('Order creation failed');
      // return res.json();
      return mockCreateOrder(dto) as Promise<CreateOrderResponse>;
    },
  });
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useOrderDetail(
  orderId: string,
  enabled = true
): UseQueryResult<OrderDetailResponse, Error> {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      // TODO: Replace with real API call in Phase 2
      // const res = await fetch(`/api/v1/orders/${orderId}`);
      // if (!res.ok) throw new Error('Order not found');
      // return res.json();
      return mockFetchOrder(orderId);
    },
    enabled: enabled && !!orderId,
    staleTime: 30_000, // 30s
    retry: 2,
  });
}
