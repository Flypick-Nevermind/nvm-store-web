// NEVERMIND — Order Tracking Stage Config

export interface TrackingStage {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const TRACKING_STAGES: TrackingStage[] = [
  {
    id: 1,
    title: 'Pembayaran Terverifikasi',
    description: 'Pembayaran sudah diterima dan pesanan langsung diproses tim.',
    icon: '💳',
  },
  {
    id: 2,
    title: 'Dipesan ke Supplier China',
    description: 'Barang sedang diproses dan dikirim supplier menuju Warehouse NEVERMIND di China.',
    icon: '🏭',
  },
  {
    id: 3,
    title: 'Warehouse China & Lolos QC',
    description: 'Barang tiba di Warehouse China dan lolos Quality Check fisik teliti sebelum dikirim.',
    icon: '🔍',
  },
  {
    id: 4,
    title: 'Penerbangan Kargo & Bea Cukai',
    description: 'Barang dalam penerbangan internasional ke Indonesia & proses clearance Bea Cukai.',
    icon: '✈️',
  },
  {
    id: 5,
    title: 'Tiba di Indonesia & Kurir Lokal',
    description: 'Barang sudah tiba di Indonesia dan diserahkan ke kurir ekspedisi lokal menuju alamatmu.',
    icon: '🚚',
  },
] as const;
