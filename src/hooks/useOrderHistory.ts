'use client';

import { useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { type OrderRecord, useOrdersStore } from '@/store/ordersStore';

export type OrderFilterTab = 'all' | 'processing' | 'completed';

export function useOrderHistory() {
  const allOrders = useOrdersStore((s) => s.orders);
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

  const [activeTab, setActiveTab] = useState<OrderFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);

  // Filter orders by tab & search query
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // Tab filter
      if (activeTab === 'processing' && order.current_stage >= 5) return false;
      if (activeTab === 'completed' && order.current_stage < 5) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.order_id.toLowerCase().includes(q);
        const matchesBuyer = order.buyer_name.toLowerCase().includes(q);
        const matchesItem = order.items.some((i) => i.name.toLowerCase().includes(q));
        if (!matchesId && !matchesBuyer && !matchesItem) return false;
      }

      return true;
    });
  }, [allOrders, activeTab, searchQuery]);

  const counts = useMemo(() => {
    const processing = allOrders.filter((o) => o.current_stage < 5).length;
    const completed = allOrders.filter((o) => o.current_stage >= 5).length;
    return { all: allOrders.length, processing, completed };
  }, [allOrders]);

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      const slug =
        item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
        item.product_id;
      addItem({
        productId: item.product_id,
        slug,
        name: item.name,
        price: item.unit_price,
        image: item.image,
        quantity: item.quantity,
        type: item.type,
      });
    });

    setReorderSuccessId(order.order_id);
    setTimeout(() => setReorderSuccessId(null), 2500);
  };

  return {
    user,
    allOrders,
    filteredOrders,
    counts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    copiedId,
    handleCopyOrderId,
    reorderSuccessId,
    handleReorder,
  };
}
