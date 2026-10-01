'use client';

import type { Address } from '@/types/address';

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

export function AddressCard({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={onSelect}
      className={[
        'rounded-2xl p-4 transition-all border-2 text-left relative flex flex-col justify-between gap-3',
        onSelect ? 'cursor-pointer' : '',
        isSelected
          ? 'border-[#9E1A59] bg-[#FFF0F5]/50 shadow-xs'
          : 'border-[#E8D5C0] bg-white hover:border-[#9E1A59]/40',
      ].join(' ')}
    >
      <div className="flex flex-col gap-1.5">
        {/* Header: Label, Badges, Radio check */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isSelected ? 'border-[#9E1A59]' : 'border-[#BBB]'
              }`}
            >
              {isSelected && <span className="w-2 h-2 rounded-full bg-[#9E1A59]" />}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              {address.label}
            </span>
            {address.is_default && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#9E1A59] text-white">
                UTAMA
              </span>
            )}
          </div>

          {/* Action buttons */}
          {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="flex items-center gap-1.5 text-xs text-[#888]"
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="hover:text-[#9E1A59] hover:underline px-1 py-0.5 cursor-pointer font-semibold text-[11px]"
              >
                Ubah
              </button>
            )}
            {onDelete && !address.is_default && (
              <button
                type="button"
                onClick={onDelete}
                className="hover:text-red-600 hover:underline px-1 py-0.5 cursor-pointer font-semibold text-[11px]"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Recipient info */}
        <div>
          <p className="text-xs font-bold text-[#1A1A1A]">
            {address.recipient_name}{' '}
            <span className="font-normal text-[#888]">({address.whatsapp_number})</span>
          </p>
          <p className="text-xs text-[#555] mt-1 leading-relaxed">
            {address.street_address}, Kec. {address.district}, {address.city}, {address.postal_code}
          </p>
        </div>
      </div>

      {/* Footer set default action if not default */}
      {!address.is_default && onSetDefault && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        <div
          className="pt-2 border-t border-[#E8D5C0]/60 flex items-center justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onSetDefault}
            className="text-[11px] font-semibold text-[#888] hover:text-[#9E1A59] cursor-pointer"
          >
            Jadikan Alamat Utama
          </button>
        </div>
      )}
    </div>
  );
}
