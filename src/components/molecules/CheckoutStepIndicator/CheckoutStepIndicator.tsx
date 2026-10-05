'use client';

const STEPS = [
  { id: 1, label: 'Data Diri' },
  { id: 2, label: 'Pembayaran' },
  { id: 3, label: 'Konfirmasi' },
];

interface CheckoutStepIndicatorProps {
  current: number;
  /** Called when a completed step is clicked, to jump back. */
  onStepClick?: (step: number) => void;
}

export function CheckoutStepIndicator({ current, onStepClick }: CheckoutStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6" aria-label="Langkah checkout">
      {STEPS.map((s, idx) => (
        <div key={s.id} className="flex items-center">
          <button
            type="button"
            disabled={!(onStepClick && current > s.id)}
            onClick={() => onStepClick?.(s.id)}
            aria-label={current > s.id ? `Kembali ke langkah ${s.label}` : s.label}
            className={`flex flex-col items-center gap-1 ${onStepClick && current > s.id ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
          >
            <div
              className={[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                current > s.id
                  ? 'bg-[#9E1A59] text-white'
                  : current === s.id
                    ? 'bg-[#9E1A59] text-white ring-4 ring-[#9E1A59]/20'
                    : 'bg-[#C8C8C8]/30 text-[#C8C8C8]',
              ].join(' ')}
              aria-current={current === s.id ? 'step' : undefined}
            >
              {current > s.id ? (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 14 14"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
                </svg>
              ) : (
                s.id
              )}
            </div>
            <span
              className={`text-[10px] font-medium whitespace-nowrap ${current >= s.id ? 'text-[#9E1A59]' : 'text-[#C8C8C8]'}`}
            >
              {s.label}
            </span>
          </button>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-px w-12 mx-1 mb-4 transition-colors duration-300 ${current > s.id ? 'bg-[#9E1A59]' : 'bg-[#C8C8C8]/40'}`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}
