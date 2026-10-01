// NEVERMIND — Saved Address Types

export interface Address {
  id: string;
  label: string; // e.g., 'Rumah', 'Kantor', 'Apartemen', 'Kos'
  recipient_name: string;
  whatsapp_number: string;
  street_address: string;
  district: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

export type AddressInput = Omit<Address, 'id'>;
