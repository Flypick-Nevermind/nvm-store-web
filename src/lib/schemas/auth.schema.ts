import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email atau nomor WhatsApp wajib diisi')
    .refine(
      (val) => {
        // Can be email or phone number
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isPhone = /^(08|62|\+62)[0-9]{8,13}$/.test(val.replace(/\s|-/g, ''));
        return isEmail || isPhone;
      },
      'Masukkan format email atau nomor WhatsApp yang valid (contoh: 08123456789 atau user@mail.com)'
    ),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter'),
  remember_me: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(50, 'Nama terlalu panjang'),
  whatsapp_number: z
    .string()
    .min(9, 'Nomor WhatsApp tidak valid')
    .regex(/^(08|62|\+62)[0-9]{8,13}$/, 'Format nomor WhatsApp tidak valid (contoh: 08123456789)'),
  email: z
    .string()
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter'),
  terms: z.literal(true, 'Kamu harus menyetujui Syarat & Ketentuan'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
