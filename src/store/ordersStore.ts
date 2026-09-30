'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BRAND } from '@/constants/brand';
import { MOCK_ORDER } from '@/lib/api/mockData';
import type { CreateOrderDTO, OrderDetailResponse, OrderItem, OrderStatus } from '@/types/api';

export type OrderRecord = OrderDetailResponse['data'];

interface OrdersStore {
  orders: OrderRecord[];
  addOrder: (dto: CreateOrderDTO) => OrderRecord;
  getOrder: (orderId: string) => OrderRecord | undefined;
  updateOrderStage: (orderId: string, stage: 1 | 2 | 3 | 4 | 5, trackingNumber?: string) => void;
  getUserOrders: (whatsappNumber?: string) => OrderRecord[];
}

function generateOrderId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NVM-2026-${rand}`;
}

function calculateEtaRange(): { from: string; to: string } {
  const now = new Date();
  const fromDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const toDate = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
  return {
    from: fromDate.toISOString().split('T')[0],
    to: toDate.toISOString().split('T')[0],
  };
}

const INITIAL_ORDERS: OrderRecord[] = [
  MOCK_ORDER.data,
  {
    order_id: 'NVM-2026-DEMO',
    buyer_name: 'Jessica Tanuwijaya',
    whatsapp_number: '081298765432',
    items: [
      {
        product_id: 'prod-002',
        name: 'Chrome Quilted Shoulder Bag — Metallic Silver',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
        quantity: 1,
        unit_price: 310000,
        type: 'ready-stock',
      },
    ],
    total_amount: 310000,
    payment_method: 'qris',
    status: 'out_for_delivery',
    current_stage: 5,
    tracking_number: 'SPXID0294829104',
    qc_passed: true,
    eta_range: {
      from: new Date().toISOString().split('T')[0],
      to: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,

      addOrder: (dto) => {
        const orderId = generateOrderId();
        const now = new Date().toISOString();
        const eta = calculateEtaRange();

        const orderItems: OrderItem[] = dto.items.map((i) => ({
          product_id: i.product_id,
          name: i.name,
          image: i.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80',
          quantity: i.quantity,
          unit_price: i.unit_price,
          type: i.type,
        }));

        const newOrder: OrderRecord = {
          order_id: orderId,
          buyer_name: dto.buyer_name,
          whatsapp_number: dto.whatsapp_number,
          items: orderItems,
          total_amount: dto.total_amount,
          payment_method: dto.payment_method || 'bca',
          payment_proof_url: dto.payment_proof_url,
          address: dto.address,
          voucher_code: dto.voucher_code,
          discount_amount: dto.discount_amount,
          status: 'payment_confirmed',
          current_stage: 1,
          tracking_number: undefined,
          qc_passed: false,
          eta_range: eta,
          created_at: now,
          updated_at: now,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      getOrder: (orderId) => {
        const cleanId = orderId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const found = get().orders.find(
          (o) => o.order_id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanId
        );
        if (found) return found;

        // Auto-seed so any order accessed (demo/mock) is always tracked
        const fallback: OrderRecord = {
          ...MOCK_ORDER.data,
          order_id: orderId,
        };
        set((state) => ({ orders: [fallback, ...state.orders] }));
        return fallback;
      },

      updateOrderStage: (orderId, stage, trackingNumber) => {
        const stageStatusMap: Record<number, OrderStatus> = {
          1: 'payment_confirmed',
          2: 'ordered_to_supplier',
          3: 'qc_passed',
          4: 'customs_cleared',
          5: 'out_for_delivery',
        };

        const cleanId = orderId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        set((state) => {
          const exists = state.orders.some(
            (o) => o.order_id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanId
          );

          if (!exists) {
            const newRecord: OrderRecord = {
              ...MOCK_ORDER.data,
              order_id: orderId,
              current_stage: stage,
              status: stageStatusMap[stage] || 'payment_confirmed',
              qc_passed: stage >= 3,
              tracking_number: trackingNumber || (stage === 5 ? 'SPXID0294829104' : undefined),
              updated_at: new Date().toISOString(),
            };
            return { orders: [newRecord, ...state.orders] };
          }

          return {
            orders: state.orders.map((o) => {
              if (o.order_id.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanId) {
                return {
                  ...o,
                  current_stage: stage,
                  status: stageStatusMap[stage] || o.status,
                  qc_passed: stage >= 3,
                  tracking_number:
                    stage === 5
                      ? trackingNumber || o.tracking_number || 'SPXID0294829104'
                      : undefined,
                  updated_at: new Date().toISOString(),
                };
              }
              return o;
            }),
          };
        });
      },

      getUserOrders: (whatsappNumber) => {
        if (!whatsappNumber) return get().orders;
        const cleanPhone = whatsappNumber.replace(/\D/g, '');
        return get().orders.filter(
          (o) => o.whatsapp_number && o.whatsapp_number.replace(/\D/g, '') === cleanPhone
        );
      },
    }),
    {
      name: 'nvm-orders-storage',
    }
  )
);
