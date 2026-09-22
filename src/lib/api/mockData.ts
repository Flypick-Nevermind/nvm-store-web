// NEVERMIND — Dummy / Mock Data for Phase 1 MVP

import type { Product, OrderDetailResponse } from '@/types/api';

// ─── Mock Products ────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    slug: 'mini-bow-tote-cream',
    name: 'Mini Bow Tote — Cream',
    description:
      'Tas mini tote dengan aksen bow manis di bagian depan. Material premium faux leather, cocok untuk daily look maupun hang out. Ukuran kompak tapi muat essentials!',
    short_description: 'Tas mini tote bow Y2K aesthetic, faux leather premium.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    ],
    price_base: 185000,
    price_import_duty: 35000,
    price_shipping: 20000,
    price_total: 240000,
    stock_type: 'pre-order',
    lead_time_days: [14, 21],
    category: 'cute-finds',
    is_featured: true,
    tags: ['bow', 'tote', 'y2k', 'cream'],
    created_at: '2026-09-01T00:00:00Z',
    colors: [
      { name: 'Warm Cream', hex: '#FFF8E1' },
      { name: 'Blush Pink', hex: '#FFD1DC' },
      { name: 'Midnight Noir', hex: '#1A1A1A' },
    ],
    variants: [
      { id: 'regular', name: 'Regular Size' },
      { id: 'mini-petite', name: 'Mini Petite' },
      { id: 'pearl-strap', name: 'Bundle + Pearl Chain Strap', price_delta: 25000 },
    ],
  },
  {
    id: 'prod-002',
    slug: 'chrome-quilted-shoulder-bag',
    name: 'Chrome Quilted Shoulder Bag',
    description:
      'Shoulder bag dengan texture quilted metalik chrome yang stunning. Perfect untuk statement look Y2K. Chain strap adjustable, bisa jadi clutch atau crossbody.',
    short_description: 'Shoulder bag quilted chrome metalik, Y2K vibes.',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    ],
    price_base: 245000,
    price_import_duty: 45000,
    price_shipping: 20000,
    price_total: 310000,
    stock_type: 'ready-stock',
    lead_time_days: [3, 5],
    category: 'y2k-core',
    is_featured: true,
    tags: ['chrome', 'quilted', 'shoulder', 'metalik'],
    created_at: '2026-09-05T00:00:00Z',
    colors: [
      { name: 'Metallic Chrome', hex: '#C8C8C8' },
      { name: 'Cyber Aqua', hex: '#D8FFF7' },
      { name: 'Glossy Black', hex: '#111111' },
    ],
    variants: [
      { id: 'shoulder-std', name: 'Classic Shoulder' },
      { id: 'crossbody-ext', name: 'Crossbody (Long Strap)', price_delta: 20000 },
    ],
  },
  {
    id: 'prod-003',
    slug: 'aqua-jelly-mini-crossbody',
    name: 'Aqua Jelly Mini Crossbody',
    description:
      'Mini crossbody bag dari material jelly transparan warna aqua yang super cute. Trendy di TikTok & Reels! Adjustable strap, kapasitas compact.',
    short_description: 'Mini crossbody jelly transparan aqua, viral TikTok.',
    images: [
      'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=600&q=80',
    ],
    price_base: 135000,
    price_import_duty: 25000,
    price_shipping: 20000,
    price_total: 180000,
    stock_type: 'pre-order',
    lead_time_days: [14, 21],
    category: 'trending-now',
    is_featured: false,
    tags: ['jelly', 'crossbody', 'transparan', 'aqua'],
    created_at: '2026-09-10T00:00:00Z',
    colors: [
      { name: 'Aqua Mist', hex: '#9DDED1' },
      { name: 'Berry Jelly', hex: '#C74375' },
      { name: 'Clear Crystal', hex: '#EAEAEA' },
    ],
    variants: [
      { id: 'standard', name: 'Standard Bag' },
      { id: 'charm-bundle', name: 'Bundle + Y2K Keychain Charm', price_delta: 15000 },
    ],
  },
  {
    id: 'prod-004',
    slug: 'pastel-baguette-clutch',
    name: 'Pastel Baguette Clutch',
    description:
      'Baguette clutch warna pastel lemony yellow yang on-trend. Strap tali simpel, cocok buat brunch atau date. Material satin-like dengan inner pocket.',
    short_description: 'Baguette clutch pastel yellow satin-like, coquette vibes.',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    ],
    price_base: 160000,
    price_import_duty: 30000,
    price_shipping: 20000,
    price_total: 210000,
    stock_type: 'pre-order',
    lead_time_days: [14, 21],
    category: 'just-dropped',
    is_featured: true,
    tags: ['baguette', 'clutch', 'pastel', 'coquette'],
    created_at: '2026-09-15T00:00:00Z',
    colors: [
      { name: 'Lemon Pastel', hex: '#FDFD96' },
      { name: 'Lilac Haze', hex: '#DDA0DD' },
      { name: 'Soft Ivory', hex: '#FAF9F6' },
    ],
    variants: [
      { id: 'clutch-std', name: 'Classic Clutch' },
      { id: 'chain-strap', name: 'With Silver Chain Strap', price_delta: 20000 },
    ],
  },
  {
    id: 'prod-005',
    slug: 'fluffy-bear-bucket-bag',
    name: 'Fluffy Bear Bucket Bag',
    description:
      'Bucket bag bulu-bulu teddy bear yang ultra-cute. Warna warm beige, drawstring closure, dapat dipakai handheld atau shoulder. Limited stock!',
    short_description: 'Bucket bag fluffy teddy bear, hangout & casual vibes.',
    images: [
      'https://images.unsplash.com/photo-1555436169-14fb4e4d5c9c?w=600&q=80',
    ],
    price_base: 195000,
    price_import_duty: 38000,
    price_shipping: 20000,
    price_total: 253000,
    stock_type: 'ready-stock',
    lead_time_days: [3, 5],
    category: 'cute-finds',
    is_featured: false,
    tags: ['fluffy', 'bucket', 'teddy', 'casual'],
    created_at: '2026-09-12T00:00:00Z',
    colors: [
      { name: 'Teddy Beige', hex: '#D2B48C' },
      { name: 'Warm Cream', hex: '#FFF8E1' },
      { name: 'Choco Brown', hex: '#5C3826' },
    ],
    variants: [
      { id: 'medium', name: 'Medium Bucket' },
      { id: 'large-daily', name: 'Large Daily (+Rp 30.000)', price_delta: 30000 },
    ],
  },
  {
    id: 'prod-006',
    slug: 'retro-denim-mini-backpack',
    name: 'Retro Denim Mini Backpack',
    description:
      'Mini backpack dari denim washed dengan patch retro & pin aksesori. Zipper ganda, inner compartment tertata. Perfect untuk school look atau festival.',
    short_description: 'Mini backpack denim retro dengan patch & pin kawaii.',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80',
    ],
    price_base: 215000,
    price_import_duty: 40000,
    price_shipping: 20000,
    price_total: 275000,
    stock_type: 'pre-order',
    lead_time_days: [14, 21],
    category: 'y2k-core',
    is_featured: false,
    tags: ['denim', 'backpack', 'retro', 'y2k'],
    created_at: '2026-09-08T00:00:00Z',
    colors: [
      { name: 'Washed Light Blue', hex: '#A4C2E0' },
      { name: 'Deep Indigo', hex: '#2A4B7C' },
      { name: 'Washed Charcoal', hex: '#3A3A3A' },
    ],
    variants: [
      { id: 'standard', name: 'Standard Edition' },
      { id: 'pins-bundle', name: 'Bundle + 5 Y2K Enamel Pins', price_delta: 25000 },
    ],
  },
];

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

export async function mockCreateOrder(data: unknown): Promise<{
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
