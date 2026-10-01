'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { type BuyerFormData, buyerFormSchema } from '@/lib/schemas/checkout.schema';
import { useAuthStore } from '@/store/authStore';

interface Step1ShippingProps {
  defaultValues?: Partial<BuyerFormData>;
  onNext: (data: BuyerFormData) => void;
}

export function Step1Shipping({ defaultValues, onNext }: Step1ShippingProps) {
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerFormSchema),
    defaultValues: {
      full_name: defaultValues?.full_name || user?.name || '',
      whatsapp_number: defaultValues?.whatsapp_number || user?.whatsapp_number || '',
      street_address: defaultValues?.street_address || '',
      district: defaultValues?.district || '',
      city: defaultValues?.city || '',
      postal_code: defaultValues?.postal_code || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-4">
        <Input
          label="Nama Lengkap"
          placeholder="Rikha Amalia"
          required
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Nomor WhatsApp"
          placeholder="081234567890"
          type="tel"
          inputMode="numeric"
          required
          hint="Format: 08... atau 628..."
          error={errors.whatsapp_number?.message}
          {...register('whatsapp_number')}
        />
        <Input
          label="Alamat Lengkap"
          placeholder="Jl. Cempaka No. 7, RT 02/RW 05"
          required
          error={errors.street_address?.message}
          {...register('street_address')}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Kecamatan"
            placeholder="Kebayoran Baru"
            required
            error={errors.district?.message}
            {...register('district')}
          />
          <Input
            label="Kota/Kabupaten"
            placeholder="Jakarta Selatan"
            required
            error={errors.city?.message}
            {...register('city')}
          />
        </div>
        <Input
          label="Kode Pos"
          placeholder="12140"
          inputMode="numeric"
          maxLength={5}
          required
          error={errors.postal_code?.message}
          {...register('postal_code')}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Checkbox
          label="Saya mengerti produk ini adalah Pre-Order dan membutuhkan waktu 2–3 minggu pengiriman dari China."
          error={errors.agree_po_terms?.message}
          {...register('agree_po_terms')}
        />
        <Checkbox
          label="Saya setuju bahwa pesanan Pre-Order tidak dapat dibatalkan setelah pembayaran dikonfirmasi."
          error={errors.agree_no_cancel?.message}
          {...register('agree_no_cancel')}
        />
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth>
        Lanjut ke Pembayaran →
      </Button>
    </form>
  );
}
