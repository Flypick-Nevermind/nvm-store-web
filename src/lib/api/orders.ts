'use client';

import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { BRAND } from '@/constants/brand';
import { useOrdersStore } from '@/store/ordersStore';
import type { CreateOrderDTO, CreateOrderResponse, OrderDetailResponse } from '@/types/api';

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const orderKeys = {
  all: ['orders'] as const,
  detail: (id: string) => [...orderKeys.all, id] as const,
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateOrder(): UseMutationResult<CreateOrderResponse, Error, CreateOrderDTO> {
  return useMutation({
    mutationFn: async (dto: CreateOrderDTO) => {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 700));

      const created = useOrdersStore.getState().addOrder(dto);

      return {
        success: true,
        data: {
          order_id: created.order_id,
          created_at: created.created_at,
          status: created.status,
          whatsapp_redirect_url: `https://wa.me/${BRAND.whatsappNumber}?text=Halo+NEVERMIND!+Order+${created.order_id}`,
        },
      };
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
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 300));

      const found = useOrdersStore.getState().getOrder(orderId);
      if (!found) {
        throw new Error('Order tidak ditemukan');
      }

      return {
        success: true,
        data: found,
      };
    },
    enabled: enabled && !!orderId,
    staleTime: 30_000,
    retry: 1,
  });
}
