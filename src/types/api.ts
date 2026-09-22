// NEVERMIND — TypeScript API DTOs & Shared Types

export type OrderStatus =
  | 'payment_confirmed'
  | 'ordered_to_supplier'
  | 'qc_passed'
  | 'in_transit'
  | 'customs_cleared'
  | 'at_local_hub'
  | 'out_for_delivery'
  | 'delivered';

export type ProductType = 'pre-order' | 'ready-stock';

// ─── Product ────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  images: string[];
  video_url?: string;
  price_base: number;        // Harga tas (IDR)
  price_import_duty: number; // Estimasi bea impor (IDR)
  price_shipping: number;    // Estimasi ongkir lokal (IDR)
  price_total: number;       // Total (IDR)
  stock_type: ProductType;
  lead_time_days: [number, number]; // e.g. [14, 21]
  category: string;
  is_featured: boolean;
  tags: string[];
  created_at: string;
}

// ─── Order ──────────────────────────────────────────────────

export interface OrderItem {
  product_id: string;
  name: string;
  image: string;
  quantity: number;
  unit_price: number;
  type: ProductType;
}

export interface CreateOrderDTO {
  buyer_name: string;
  whatsapp_number: string;
  address: {
    street: string;
    district: string;
    city: string;
    postal_code: string;
  };
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    type: ProductType;
  }>;
  agreed_to_terms: boolean;
  total_amount: number;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    order_id: string;
    created_at: string;
    status: OrderStatus;
    whatsapp_redirect_url: string;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: {
    order_id: string;
    buyer_name: string;
    items: OrderItem[];
    total_amount: number;
    status: OrderStatus;
    current_stage: 1 | 2 | 3 | 4 | 5;
    tracking_number?: string;
    qc_passed: boolean;
    eta_range: { from: string; to: string };
    created_at: string;
    updated_at: string;
  };
}

// ─── Cart ───────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: ProductType;
  eta?: string;
}
