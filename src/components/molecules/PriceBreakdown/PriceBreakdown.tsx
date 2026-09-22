import { formatIDR } from '@/lib/utils';

interface PriceBreakdownProps {
  priceBase: number;
  priceImportDuty: number;
  priceShipping: number;
  priceTotal: number;
}

interface LineItemProps {
  label: string;
  value: number;
  isTotal?: boolean;
  hint?: string;
}

function LineItem({ label, value, isTotal = false, hint }: LineItemProps) {
  return (
    <div
      className={[
        'flex items-start justify-between gap-2',
        isTotal ? 'pt-3 mt-3 border-t border-[#C8C8C8]/50' : '',
      ].join(' ')}
    >
      <div className="flex flex-col gap-0">
        <span className={isTotal ? 'text-sm font-bold text-[#1A1A1A]' : 'text-sm text-[#444]'}>
          {label}
        </span>
        {hint && <span className="text-[10px] text-[#888]">{hint}</span>}
      </div>
      <span
        className={
          isTotal
            ? 'text-base font-extrabold text-[#C74375]'
            : 'text-sm font-semibold text-[#1A1A1A]'
        }
      >
        {formatIDR(value)}
      </span>
    </div>
  );
}

export function PriceBreakdown({
  priceBase,
  priceImportDuty,
  priceShipping,
  priceTotal,
}: PriceBreakdownProps) {
  return (
    <div
      className="rounded-2xl border border-[#C8C8C8]/60 bg-white/80 p-4 flex flex-col gap-3"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base" aria-hidden="true">
          💸
        </span>
        <h3 className="text-sm font-bold text-[#1A1A1A]">Rincian Harga</h3>
        <span className="text-[10px] text-[#C74375] font-semibold bg-[#C74375]/10 px-2 py-0.5 rounded-full ml-auto">
          Transparan ✓
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <LineItem label="Harga Tas" value={priceBase} hint="Harga dari supplier China" />
        <LineItem
          label="Estimasi Bea Impor"
          value={priceImportDuty}
          hint="Tergantung regulasi bea cukai"
        />
        <LineItem label="Estimasi Ongkir Lokal" value={priceShipping} hint="Jakarta & sekitarnya" />
        <LineItem label="Total Bayar" value={priceTotal} isTotal />
      </div>

      <p className="text-[10px] text-[#888] text-center mt-1 leading-relaxed">
        Tidak ada biaya tersembunyi. Harga yang kamu lihat = harga yang kamu bayar.
      </p>
    </div>
  );
}
