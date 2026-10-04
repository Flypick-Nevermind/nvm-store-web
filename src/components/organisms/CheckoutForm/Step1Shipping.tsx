'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { AddressCard } from '@/components/molecules/AddressCard';
import { type BuyerFormData, buyerFormSchema } from '@/lib/schemas/checkout.schema';
import { useAddressModalStore } from '@/store/addressModalStore';
import { useAddressStore } from '@/store/addressStore';
import { useAuthStore } from '@/store/authStore';
import type { Address } from '@/types/address';

interface Step1ShippingProps {
  defaultValues?: Partial<BuyerFormData>;
  onNext: (data: BuyerFormData) => void;
}

export function Step1Shipping({ defaultValues, onNext }: Step1ShippingProps) {
  const user = useAuthStore((s) => s.user);
  const { addresses, addAddress, getDefaultAddress } = useAddressStore();
  const openAddressModal = useAddressModalStore((s) => s.openModal);

  const defaultSaved = getDefaultAddress();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultSaved?.id || null
  );
  const [isManualInput, setIsManualInput] = useState(false);
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerFormSchema),
    defaultValues: {
      full_name:
        defaultValues?.full_name || defaultSaved?.recipient_name || user?.name || '',
      whatsapp_number:
        defaultValues?.whatsapp_number ||
        defaultSaved?.whatsapp_number ||
        user?.whatsapp_number ||
        '',
      street_address: defaultValues?.street_address || defaultSaved?.street_address || '',
      district: defaultValues?.district || defaultSaved?.district || '',
      city: defaultValues?.city || defaultSaved?.city || '',
      postal_code: defaultValues?.postal_code || defaultSaved?.postal_code || '',
    },
  });

  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setIsManualInput(false);
    setValue('full_name', addr.recipient_name, { shouldValidate: true });
    setValue('whatsapp_number', addr.whatsapp_number, { shouldValidate: true });
    setValue('street_address', addr.street_address, { shouldValidate: true });
    setValue('district', addr.district, { shouldValidate: true });
    setValue('city', addr.city, { shouldValidate: true });
    setValue('postal_code', addr.postal_code, { shouldValidate: true });
  };

  const handleSwitchToManual = () => {
    setSelectedAddressId(null);
    setIsManualInput(true);
    setValue('street_address', '');
    setValue('district', '');
    setValue('city', '');
    setValue('postal_code', '');
  };

  const handleFormSubmit = (data: BuyerFormData) => {
    if (saveToAddressBook && isManualInput) {
      addAddress({
        label: 'Alamat Tambahan',
        recipient_name: data.full_name,
        whatsapp_number: data.whatsapp_number,
        street_address: data.street_address,
        district: data.district,
        city: data.city,
        postal_code: data.postal_code,
        is_default: false,
      });
    }
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5" noValidate>
      {/* Saved Address Book Selector */}
      {addresses.length > 0 && (
        <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-[#F2EEEB]/60 border border-[#E8D5C0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#888] uppercase tracking-wider flex items-center gap-1.5">
              <span>📍</span>
              <span>Pilih dari Buku Alamat</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAddressModal()}
                className="text-xs font-bold text-[#9E1A59] hover:underline cursor-pointer"
              >
                Kelola Alamat ➔
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                isSelected={selectedAddressId === addr.id && !isManualInput}
                onSelect={() => handleSelectSavedAddress(addr)}
              />
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSwitchToManual}
              className={`font-bold hover:underline cursor-pointer ${
                isManualInput ? 'text-[#9E1A59]' : 'text-[#888]'
              }`}
            >
              ✍️ Gunakan Alamat Lain (Ketik Manual)
            </button>
            <button
              type="button"
              onClick={() => openAddressModal()}
              className="text-xs font-semibold text-[#888] hover:text-[#1A1A1A] cursor-pointer"
            >
              + Tambah Alamat Baru
            </button>
          </div>
        </div>
      )}

      {/* Inputs Section */}
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

      {/* Save to address book checkbox for manual input */}
      {isManualInput && (
        <div className="p-3 rounded-xl bg-[#F2EEEB] border border-[#E8D5C0]">
          <Checkbox
            label="Simpan alamat ini ke Buku Alamat Saya untuk checkout berikutnya"
            checked={saveToAddressBook}
            onChange={(e) => setSaveToAddressBook(e.target.checked)}
          />
        </div>
      )}

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
