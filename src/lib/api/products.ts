// NEVERMIND — Products API Service & Transformer

import { apiClient } from './client';
import type { Product } from '@/types/api';

export interface BackendProductCategory {
  product_category_id: string;
  product_id: string;
  product_category_type_id: string;
  ms_nevermind_product_category_type?: {
    product_category_type_id: string;
    product_category_type_name: string;
  };
}

export interface BackendProductVariantImage {
  product_variant_image_id: string;
  product_variant_image_value: string;
}

export interface BackendProductVariant {
  product_variant_id: string;
  product_id: string;
  product_variant_name: string;
  product_variant_description?: string;
  product_variant_price: string | number;
  product_variant_original_price?: string | number;
  product_variant_qty: number;
  is_active?: boolean;
  ms_nevermind_product_variant_images?: BackendProductVariantImage[];
}

export interface BackendProduct {
  product_id: string;
  product_name: string;
  product_description: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  stock_type?: 'ready-stock' | 'pre-order' | 'sold-out';
  lead_time_days?: [number, number];
  price_base?: number | string;
  original_price?: number | string;
  discount_percent?: number | string;
  price_import_duty?: number;
  price_shipping?: number;
  variant_label?: string;
  specs?: Array<{ label: string; value: string }>;
  notes?: string[];
  tags?: string[];
  short_description?: string;
  ms_nevermind_product_categories?: BackendProductCategory[];
  ms_nevermind_product_variants?: BackendProductVariant[] | BackendProductVariant;
  all_variants?: BackendProductVariant[];
}

export interface BackendProductsResponse {
  success: boolean;
  status: number;
  message: string;
  data: BackendProduct[];
}

export interface BackendProductDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: BackendProduct;
}

function getColorHexByName(name: string): string {
  const n = name.trim().toLowerCase();
  const map: Record<string, string> = {
    white: '#FFFFFF',
    putih: '#FFFFFF',
    black: '#1A1A1A',
    hitam: '#1A1A1A',
    blue: '#4A90E2',
    biru: '#4A90E2',
    pink: '#FFB6C1',
    merahmuda: '#FFB6C1',
    green: '#558B2F',
    hijau: '#558B2F',
    maroon: '#800000',
    purple: '#8E44AD',
    ungu: '#8E44AD',
    lime: '#CDDC39',
    yellow: '#FDFD96',
    kuning: '#FDFD96',
    cream: '#F2EEEB',
    krem: '#F2EEEB',
    silver: '#C8C8C8',
    perak: '#C8C8C8',
    brown: '#5C3826',
    cokelat: '#5C3826',
    grey: '#888888',
    gray: '#888888',
    abu: '#888888',
  };

  for (const [key, hex] of Object.entries(map)) {
    if (n.includes(key)) return hex;
  }
  return '#E8D5C0';
}

/**
 * Transforms backend product DTO into frontend Product model
 */
export function transformBackendProduct(bp: BackendProduct): Product {
  const rawVariants: BackendProductVariant[] = Array.isArray(bp.all_variants) && bp.all_variants.length > 0
    ? bp.all_variants
    : Array.isArray(bp.ms_nevermind_product_variants)
      ? bp.ms_nevermind_product_variants
      : bp.ms_nevermind_product_variants
        ? [bp.ms_nevermind_product_variants]
        : [];

  // Extract all images across variants
  const allImages: string[] = [];
  for (const v of rawVariants) {
    const vImgs = v.ms_nevermind_product_variant_images
      ?.map((img) => img.product_variant_image_value)
      .filter((url) => Boolean(url) && (url.startsWith('http') || url.startsWith('/'))) || [];
    for (const url of vImgs) {
      if (!allImages.includes(url)) allImages.push(url);
    }
  }

  const defaultImage = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80';
  const images = allImages.length > 0 ? allImages : [defaultImage];

  // Map variants to options & skus
  const colorValues = rawVariants.map((v, idx) => {
    const vImg = v.ms_nevermind_product_variant_images?.[0]?.product_variant_image_value;
    const colorSlug = v.product_variant_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const hex = getColorHexByName(v.product_variant_name);

    return {
      id: colorSlug,
      name: v.product_variant_name,
      hex,
      image: vImg,
      image_index: vImg && allImages.includes(vImg) ? allImages.indexOf(vImg) : idx,
    };
  });

  const rawOriginalPrice = typeof bp.original_price === 'string'
    ? parseInt(bp.original_price, 10)
    : typeof bp.original_price === 'number'
      ? bp.original_price
      : undefined;

  const rawDiscountPercent = typeof bp.discount_percent === 'string'
    ? parseInt(bp.discount_percent, 10)
    : typeof bp.discount_percent === 'number'
      ? bp.discount_percent
      : undefined;

  const skus = rawVariants.map((v, idx) => {
    const vImg = v.ms_nevermind_product_variant_images?.[0]?.product_variant_image_value;
    const colorSlug = v.product_variant_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const rawPrice = typeof v.product_variant_price === 'string'
      ? parseInt(v.product_variant_price, 10)
      : Number(v.product_variant_price) || 185000;

    const skuOriginalPrice = typeof v.product_variant_original_price === 'string'
      ? parseInt(v.product_variant_original_price, 10)
      : typeof v.product_variant_original_price === 'number'
        ? v.product_variant_original_price
        : rawOriginalPrice;

    return {
      id: v.product_variant_id,
      options: { color: colorSlug },
      price_base: rawPrice,
      original_price: skuOriginalPrice,
      image: vImg,
      image_index: vImg && allImages.includes(vImg) ? allImages.indexOf(vImg) : idx,
      stock: typeof v.product_variant_qty === 'number' ? v.product_variant_qty : 10,
    };
  });

  const prices = skus.map((s) => s.price_base);
  const minPrice = prices.length > 0
    ? Math.min(...prices)
    : (typeof bp.price_base === 'number' ? bp.price_base : 185000);

  const calculatedDiscount = rawOriginalPrice && rawOriginalPrice > minPrice
    ? Math.round(((rawOriginalPrice - minPrice) / rawOriginalPrice) * 100)
    : undefined;

  const discountPercent = rawDiscountPercent ?? calculatedDiscount;

  const categoryType = bp.ms_nevermind_product_categories?.[0]?.ms_nevermind_product_category_type?.product_category_type_name;
  const categoryName = categoryType ? categoryType.toLowerCase() : 'tas-wanita';

  const baseSlug = bp.product_name
    ? bp.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : 'product';
  const slug = `${baseSlug}-${bp.product_id.toLowerCase()}`;

  // Specs directly from backend database
  const specs: Array<{ label: string; value: string }> = Array.isArray(bp.specs) && bp.specs.length > 0
    ? bp.specs
        .filter((s) => Boolean(s?.label && s?.value))
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
    : [];

  // Notes directly from backend database
  const notes: string[] = Array.isArray(bp.notes) && bp.notes.length > 0
    ? bp.notes
        .map((n) => (typeof n === 'string' ? n.trim() : String(n)))
        .filter(Boolean)
    : [];

  return {
    id: bp.product_id,
    slug,
    name: bp.product_name || 'NEVERMIND Collection',
    description: bp.product_description || 'Koleksi pilihan eksklusif dari NEVERMIND.',
    short_description: bp.short_description || bp.product_description?.slice(0, 100) || 'Koleksi pilihan eksklusif dari NEVERMIND.',
    images,
    price_base: minPrice,
    original_price: rawOriginalPrice,
    discount_percent: discountPercent,
    price_import_duty: bp.price_import_duty ?? Math.round(minPrice * 0.1),
    price_shipping: bp.price_shipping ?? 20000,
    stock_type: bp.stock_type || (rawVariants.some((v) => (v.product_variant_qty ?? 0) > 0) ? 'pre-order' : 'sold-out'),
    lead_time_days: bp.lead_time_days || [14, 21],
    category: categoryName,
    tags: Array.isArray(bp.tags) ? bp.tags : [],
    created_at: bp.created_at || new Date().toISOString(),
    options: colorValues.length > 0 ? [
      {
        id: 'color',
        name: bp.variant_label || 'Pilihan Warna',
        type: 'color',
        values: colorValues,
      },
    ] : undefined,
    skus: skus.length > 0 ? skus : undefined,
    colors: colorValues.length > 0 ? colorValues.map((cv) => ({
      name: cv.name,
      hex: cv.hex || '#E8D5C0',
      image: cv.image,
      image_index: cv.image_index,
    })) : undefined,
    specs: specs.length > 0 ? specs : undefined,
    notes: notes.length > 0 ? notes : undefined,
  };
}

/**
 * Fetch all products from Railway backend
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await apiClient<BackendProductsResponse>('/products', {
      method: 'GET',
      cache: 'no-store',
    });

    if (res.success && Array.isArray(res.data)) {
      return res.data
        .filter((p) => p.is_active !== false)
        .map(transformBackendProduct);
    }
  } catch (err) {
    console.error('⚠️ Gagal mengambil produk live dari backend:', err);
  }

  return [];
}

/**
 * Fetch a single product by slug or id, fetching full detail with all variants from backend
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const allProducts = await getProducts();
  const matched = allProducts.find((p) => p.slug === slug || p.id === slug);

  // If matched product is from backend, query /products/:id directly to ensure all variants are loaded
  const productId = matched?.id || (slug.match(/PID-[a-z0-9]+/i)?.[0]);
  if (productId && productId.startsWith('PID-')) {
    try {
      const detailRes = await apiClient<BackendProductDetailResponse>(`/products/${productId}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (detailRes.success && detailRes.data) {
        return transformBackendProduct(detailRes.data);
      }
    } catch (err) {
      console.warn('⚠️ Gagal mengambil detail produk lengkap dari backend:', err);
    }
  }

  return matched;
}
