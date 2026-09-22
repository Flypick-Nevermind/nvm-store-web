import { z } from 'zod';

// ─── Checkout / Buyer Form ────────────────────────────────────────────────────

export const buyerFormSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(80, 'Nama terlalu panjang'),

  whatsapp_number: z
    .string()
    .regex(
      /^(08|628|8)\d{7,12}$/,
      'Format nomor WA tidak valid (contoh: 081234567890)'
    ),

  street_address: z
    .string()
    .min(10, 'Alamat terlalu pendek, tambahkan detail lebih lengkap')
    .max(250, 'Alamat terlalu panjang'),

  district: z.string().min(2, 'Isi kecamatan').max(60),

  city: z.string().min(2, 'Isi kota/kabupaten').max(60),

  postal_code: z
    .string()
    .regex(/^\d{5}$/, 'Kode pos harus 5 digit angka'),

  agree_po_terms: z.literal(true, 'Kamu harus menyetujui syarat Pre-Order 2–3 minggu'),

  agree_no_cancel: z.literal(true, 'Kamu harus menyetujui syarat non-cancellation'),
});

export type BuyerFormData = z.infer<typeof buyerFormSchema>;

// ─── Order Lookup (Tracking Page) ────────────────────────────────────────────

export const orderLookupSchema = z.object({
  order_id: z
    .string()
    .min(4, 'Order ID tidak valid')
    .max(40, 'Order ID tidak valid'),

  whatsapp_number: z
    .string()
    .regex(
      /^(08|628|8)\d{7,12}$/,
      'Format nomor WA tidak valid'
    ),
});

export type OrderLookupData = z.infer<typeof orderLookupSchema>;

// ─── Transfer Proof Upload ────────────────────────────────────────────────────

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const proofFileSchema = z.object({
  file: z
    .custom<File>((v) => v instanceof File, 'File tidak valid')
    .refine(
      (f) => ALLOWED_TYPES.includes(f.type),
      'Format file harus JPG, PNG, atau PDF'
    )
    .refine(
      (f) => f.size <= MAX_SIZE_BYTES,
      'Ukuran file maksimal 5MB'
    ),
});

export type ProofFileData = z.infer<typeof proofFileSchema>;
