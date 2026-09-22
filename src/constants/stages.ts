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
    title: 'Pembayaran Dikonfirmasi',
    description: 'Pesananmu sudah dikonfirmasi dan dipesan ke supplier China.',
    icon: '✅',
  },
  {
    id: 2,
    title: 'Tiba & Lolos QC',
    description: 'Barang sudah tiba di gudang dan lolos Quality Check fisik oleh tim NEVERMIND.',
    icon: '🔍',
  },
  {
    id: 3,
    title: 'Transit Internasional',
    description: 'Barang sedang dalam perjalanan internasional dan proses pengurusan Bea Cukai.',
    icon: '✈️',
  },
  {
    id: 4,
    title: 'Sorting Hub Lokal',
    description: 'Barang sudah tiba di sorting hub lokal Jakarta, siap dikirim ke ekspedisi.',
    icon: '📦',
  },
  {
    id: 5,
    title: 'Menuju Rumahmu',
    description: 'Barangmu sedang dalam perjalanan! Cek resi ekspedisi untuk update real-time.',
    icon: '🚚',
  },
] as const;
