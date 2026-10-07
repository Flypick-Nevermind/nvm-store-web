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

// ─── 1. Pilihan Opsi Produk (Warna, Ukuran, dll) ───
export interface ProductOptionValue {
  id: string;               // e.g. "aqua-mist"
  name: string;             // e.g. "Aqua Mist"
  subtitle?: string;        // e.g. "26 × 9 × 17 cm" (opsional, jika ukuran)
  hex?: string;             // e.g. "#9DDED1" (opsional, warna palet hex)
  image_index?: number;     // e.g. 0 (index foto di array images)
  image?: string;           // e.g. "https://..." (URL foto langsung untuk thumbnail opsi)
}

export interface ProductOption {
  id: string;               // e.g. "color" | "size" | "material"
  name: string;             // e.g. "Pilihan Warna" | "Pilihan Ukuran"
  type?: 'color' | 'size' | 'text'; // Tipe selector visual di FE
  values: ProductOptionValue[];
}

// ─── 2. SKU / Kombinasi Varian Terpilih & Harga ───
export interface ProductSku {
  id: string;               // e.g. "sku-jelly-tpu-aqua"
  options: Record<string, string>; // e.g. { color: "aqua-mist" }
  price_base: number;       // e.g. 185000 (Harga jual SKU ini)
  original_price?: number;  // e.g. 235000 (Harga coret jika ada)
  image_index?: number;     // e.g. 0 (Foto aktif saat SKU ini dipilih)
  image?: string;           // e.g. "https://..."
  stock?: number;           // e.g. 10 (Jumlah stok SKU ini)
}

// ─── 3. Informasi Spesifikasi Produk (PDP) ───
export interface ProductSpec {
  label: string;            // e.g. "Material", "Model", "Ukuran"
  value: string;            // e.g. "TPU Premium", "Jelly Firkin", "Medium (35×15×27 cm)"
}

// Backward-compat color & variant types for PDP
export interface ProductColor {
  name: string;
  hex: string;
  image_index?: number;
  image?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price_delta?: number;
  colors?: ProductColor[];
}

// ─── 4. Root Product Object ───
export interface Product {
  id: string;               // e.g. "prod-001"
  slug: string;             // e.g. "jelly-firkin-bag"
  name: string;             // e.g. "Jelly Firkin Bag — TPU"
  description: string;      // Deskripsi lengkap produk
  short_description?: string; // (Opsional) Ringkasan singkat untuk SEO & kartu preview
  images: string[];         // Array URL foto produk: ["https://...", ...]
  
  // Pricing
  price_base: number;       // Harga jual dasar (IDR)
  original_price?: number;  // (Opsional) Harga normal sebelum diskon (IDR)
  discount_percent?: number;// (Opsional) Persentase diskon, misal 20 untuk 20%
  price_import_duty: number;// Estimasi bea impor (IDR)
  price_shipping: number;   // Estimasi ongkir lokal (IDR)
  
  // Status & Logistik
  stock_type: ProductType;  // 'pre-order' | 'ready-stock' | 'sold-out'
  lead_time_days: [number, number]; // Estimasi hari PO, misal [14, 21]
  category: string;         // Slug kategori, misal: "cute-finds", "y2k-core", "trending-now"
  created_at: string;       // ISO Timestamp, e.g. "2026-09-10T00:00:00Z"
  
  // Varian Dinamis
  options?: ProductOption[];
  skus?: ProductSku[];

  // Detail Tambahan di Halaman Produk
  specs?: ProductSpec[];    // List spesifikasi
  notes?: string[];         // (Opsional) List catatan/ketentuan produk
  tags?: string[];          // (Opsional) Tags produk, e.g. ["Top Handle Bag"]

  // Backward compatibility
  colors?: ProductColor[];
  variants?: ProductVariant[];
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
