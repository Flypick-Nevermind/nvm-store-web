import { formatETA } from '@/lib/utils';

interface ETACalculatorProps {
  leadTimeDays: [number, number];
  className?: string;
}

export function ETACalculator({ leadTimeDays, className = '' }: ETACalculatorProps) {
  const etaString = formatETA(leadTimeDays);

  return (
    <div
      className={[
        'flex items-center gap-3 rounded-2xl bg-[#FDFD96]/40 border border-[#FDFD96] px-4 py-3',
        className,
      ].join(' ')}
    >
      <span className="text-2xl flex-shrink-0" aria-hidden="true">
        ✈️
      </span>
      <div className="flex flex-col gap-0">
        <span className="text-xs text-[#5C5C00] font-medium uppercase tracking-wide">
          Estimasi tiba
        </span>
        <span className="text-sm font-bold text-[#1A1A1A]">{etaString}</span>
        <span className="text-[10px] text-[#888]">Mulai dari tanggal konfirmasi pembayaran</span>
      </div>
    </div>
  );
}
