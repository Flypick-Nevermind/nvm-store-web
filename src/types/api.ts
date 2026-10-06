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

export type ProductType = 'pre-order' | 'ready-stock' | 'sold-out';

// ─── Product ────────────────────────────────────────────────

export interface ProductColor {
  name: string;
  hex: string;
  /** Index into Product.images shown when this color is selected. */
  image_index?: number;
  /** Direct thumbnail URL for this color option */
  image?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price_delta?: number;
  /** Colors available for this specific variant (falls back to Product.colors). */
  colors?: ProductColor[];
}

export interface ProductOptionValue {
  id: string;
  name: string;
  subtitle?: string; // e.g. "26 × 9 × 17 cm"
  hex?: string; // for color swatches
  image_index?: number;
  /** Direct thumbnail URL for this option value */
  image?: string;
}

export interface ProductOption {
  id: string; // e.g. 'material' | 'size' | 'color'
  name: string; // e.g. 'Pilihan Bahan' | 'Pilihan Ukuran' | 'Pilihan Warna'
  type?: 'text' | 'color' | 'size';
  values: ProductOptionValue[];
}

export interface ProductSku {
  id: string;
  options: Record<string, string>; // e.g. { material: 'tpu', size: 'medium', color: 'aqua-mist' }
  price_base: number;
  original_price?: number;
  price_import_duty?: number;
  price_shipping?: number;
  image_index?: number;
  stock_type?: ProductType;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  images: string[];
  video_url?: string;
  price_base: number; // Harga tas (IDR)
  price_import_duty: number; // Estimasi bea impor (IDR)
  price_shipping: number; // Estimasi ongkir lokal (IDR)
  price_total: number; // Total (IDR)
  original_price?: number; // Harga normal sebelum diskon (IDR)
  discount_percent?: number; // Persentase diskon (%)
  stock_type: ProductType;
  lead_time_days: [number, number]; // e.g. [14, 21]
  category: string;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  colors?: ProductColor[];
  variants?: ProductVariant[];
  options?: ProductOption[];
  skus?: ProductSku[];
  specs?: ProductSpec[];
  notes?: string[];
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
    image?: string;
  }>;
  payment_method?: string;
  payment_proof_url?: string;
  voucher_code?: string;
  discount_amount?: number;
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
    whatsapp_number?: string;
    items: OrderItem[];
    total_amount: number;
    payment_method?: string;
    payment_proof_url?: string;
    address?: {
      street: string;
      district: string;
      city: string;
      postal_code: string;
    };
    voucher_code?: string;
    discount_amount?: number;
    status: OrderStatus;
    current_stage: 1 | 2 | 3 | 4 | 5 | 6;
    tracking_number?: string;
    qc_passed: boolean;
    received_at?: string;
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
  color?: string;
  variant?: string;
  selected_options?: Record<string, string>;
  key?: string;
  price_import_duty?: number;
  price_shipping?: number;
}

// ─── Customer Review ────────────────────────────────────────

export interface CustomerReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 - 5
  title: string;
  comment: string;
  variantName?: string;
  date: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  avatarUrl?: string;
  images?: string[];
}
