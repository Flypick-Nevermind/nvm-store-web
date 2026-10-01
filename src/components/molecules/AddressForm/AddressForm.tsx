'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import type { Address, AddressInput } from '@/types/address';

interface AddressFormProps {
  initialData?: Address | null;
  onSubmit: (data: AddressInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddressFormProps) {
  const [label, setLabel] = useState(initialData?.label || 'Rumah');
  const [recipientName, setRecipientName] = useState(initialData?.recipient_name || '');
  const [whatsappNumber, setWhatsappNumber] = useState(initialData?.whatsapp_number || '');
  const [streetAddress, setStreetAddress] = useState(initialData?.street_address || '');
  const [district, setDistrict] = useState(initialData?.district || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [postalCode, setPostalCode] = useState(initialData?.postal_code || '');
  const [isDefault, setIsDefault] = useState(initialData?.is_default || false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setError('Nama penerima wajib diisi');
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.trim().length < 8) {
      setError('Nomor WhatsApp tidak valid');
      return;
    }
    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      setError('Alamat lengkap wajib diisi');
      return;
    }
    if (!district.trim() || !city.trim() || !postalCode.trim()) {
      setError('Kecamatan, kota, dan kode pos wajib diisi');
      return;
    }

    setError(null);
    onSubmit({
      label: label.trim() || 'Rumah',
      recipient_name: recipientName.trim(),
      whatsapp_number: whatsappNumber.trim(),
      street_address: streetAddress.trim(),
      district: district.trim(),
      city: city.trim(),
      postal_code: postalCode.trim(),
      is_default: isDefault,
    });
  };

  const QUICK_LABELS = ['Rumah', 'Kantor', 'Apartemen', 'Kos'];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
      {/* Quick Label Pills */}
      <div>
        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
          Label Alamat
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_LABELS.map((lbl) => (
            <button
              key={lbl}
              type="button"
              onClick={() => setLabel(lbl)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                label.toLowerCase() === lbl.toLowerCase()
                  ? 'bg-[#9E1A59] text-white'
                  : 'bg-[#FFF8E1] border border-[#E8D5C0] text-[#555] hover:border-[#9E1A59]'
              }`}
            >
              {lbl}
            </button>
          ))}
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Lainnya..."
            className="w-24 px-2.5 py-1 rounded-full text-xs border border-[#E8D5C0] focus:border-[#9E1A59] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Nama Penerima"
          placeholder="Rikha Amalia"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
        />
        <Input
          label="Nomor WhatsApp"
          placeholder="081234567890"
          type="tel"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          required
        />
      </div>

      <Input
        label="Alamat Lengkap (Jalan, No. Rumah, RT/RW)"
        placeholder="Jl. Cempaka No. 7, RT 02/RW 05"
        value={streetAddress}
        onChange={(e) => setStreetAddress(e.target.value)}
        required
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Input
          label="Kecamatan"
          placeholder="Kebayoran Baru"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
        />
        <Input
          label="Kota/Kabupaten"
          placeholder="Jakarta Selatan"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <div className="col-span-2 sm:col-span-1">
          <Input
            label="Kode Pos"
            placeholder="12140"
            inputMode="numeric"
            maxLength={5}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="pt-1">
        <Checkbox
          label="Jadikan sebagai alamat utama pengiriman"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
          ⚠️ {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8D5C0]">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold text-[#888] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          Batal
        </button>
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
          {initialData ? 'Simpan Perubahan' : 'Tambah Alamat'}
        </Button>
      </div>
    </form>
  );
}
