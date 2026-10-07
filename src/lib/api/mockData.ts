// NEVERMIND — Dummy / Mock Data for Phase 1 MVP

import type { OrderDetailResponse, Product } from '@/types/api';

// ─── Mock Products (Cleared — Using Live Backend API) ────────────────────────

export const MOCK_PRODUCTS: Product[] = [];

// ─── Mock Order Detail ────────────────────────────────────────────────────────

export const MOCK_ORDER: OrderDetailResponse = {
  success: true,
  data: {
    order_id: 'NVM20260915ABC123',
    buyer_name: 'Rikha Amalia',
    items: [
      {
        product_id: 'prod-001',
        name: 'Mini Bow Tote — Cream',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80',
        quantity: 1,
        unit_price: 240000,
        type: 'pre-order',
      },
    ],
    total_amount: 240000,
    status: 'in_transit',
    current_stage: 3,
    tracking_number: undefined,
    qc_passed: true,
    eta_range: {
      from: '2026-10-01',
      to: '2026-10-08',
    },
    created_at: '2026-09-15T10:30:00Z',
    updated_at: '2026-09-18T14:00:00Z',
  },
};

// ─── Mock API Handlers ────────────────────────────────────────────────────────

export async function mockCreateOrder(_data: unknown): Promise<{
  success: boolean;
  data: { order_id: string; created_at: string; status: string; whatsapp_redirect_url: string };
}> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1200));
  const orderId = `NVM${Date.now().toString().slice(-8).toUpperCase()}`;
  return {
    success: true,
    data: {
      order_id: orderId,
      created_at: new Date().toISOString(),
      status: 'payment_confirmed',
      whatsapp_redirect_url: `https://wa.me/6281234567890?text=Order+${orderId}`,
    },
  };
}

export async function mockFetchOrder(orderId: string): Promise<OrderDetailResponse> {
  await new Promise((r) => setTimeout(r, 800));
  // Return the mock order but swap the ID for the requested one
  return {
    ...MOCK_ORDER,
    data: { ...MOCK_ORDER.data, order_id: orderId },
  };
}
