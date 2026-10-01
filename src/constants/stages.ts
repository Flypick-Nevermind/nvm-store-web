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
    title: 'Dalam Pengantaran Kurir Lokal',
    description: 'Barang tiba di Indonesia dan sedang dalam perjalanan diantar oleh kurir ekspedisi ke alamatmu.',
    icon: '🚚',
  },
  {
    id: 6,
    title: 'Paket Telah Diterima (Selesai)',
    description: 'Paket telah sampai di alamat tujuan dan diterima dengan baik oleh pembeli.',
    icon: '🎉',
  },
] as const;
