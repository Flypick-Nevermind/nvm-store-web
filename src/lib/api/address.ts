// NEVERMIND — Address API Service (GET /address/{user_id}, POST /address)

import { apiClient } from './client';
import type { Address, AddressInput } from '@/types/address';

interface BackendAddress {
  user_address_id?: string;
  address_id?: string;
  id?: string;
  user_id?: string;
  user_address_label?: string;
  user_address_recipient_name?: string;
  user_address_recipient_number?: string;
  user_address_detail?: string;
  user_address_province?: string;
  user_address_city?: string;
  user_address_subdistrict?: string;
  user_address_village?: string;
  user_address_postal_code?: string;
}

interface BackendAddressListResponse {
  success: boolean;
  status: number;
  message: string;
  data: BackendAddress[] | null;
}

interface BackendAddressCreateResponse {
  success: boolean;
  status: number;
  message: string;
  data?: BackendAddress | { user_address_id?: string; address_id?: string; id?: string } | null;
}

function mapFromBackend(raw: BackendAddress, index: number): Address {
  return {
    id: raw.user_address_id || raw.address_id || raw.id || `srv_${index}_${raw.user_address_postal_code || ''}`,
    label: raw.user_address_label || 'Rumah',
    recipient_name: raw.user_address_recipient_name || '',
    whatsapp_number: raw.user_address_recipient_number || '',
    street_address: raw.user_address_detail || '',
    province: raw.user_address_province || '',
    city: raw.user_address_city || '',
    district: raw.user_address_subdistrict || '',
    village: raw.user_address_village || '',
    postal_code: raw.user_address_postal_code || '',
    is_default: false,
  };
}

export async function fetchAddressesApi(userId: string): Promise<Address[]> {
  const res = await apiClient<BackendAddressListResponse>(`/address/${encodeURIComponent(userId)}`);
  return (res.data ?? []).map(mapFromBackend);
}

export async function createAddressApi(userId: string, input: AddressInput): Promise<void> {
  await apiClient<BackendAddressCreateResponse>('/address', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      user_address_label: input.label,
      user_address_recipient_name: input.recipient_name,
      user_address_recipient_number: input.whatsapp_number,
      user_address_detail: input.street_address,
      user_address_province: input.province || '',
      user_address_city: input.city,
      user_address_subdistrict: input.district,
      user_address_village: input.village || '',
      user_address_postal_code: input.postal_code,
    }),
  });
}
