'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { AddressCard } from '@/components/molecules/AddressCard';
import { AddressForm } from '@/components/molecules/AddressForm';
import { useAddressModalStore } from '@/store/addressModalStore';
import { useAddressStore } from '@/store/addressStore';
import type { Address, AddressInput } from '@/types/address';

export function AddressBookModal() {
  const { isOpen, closeModal, editingAddress } = useAddressModalStore();
  const {
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
  } = useAddressStore();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Address | null>(null);

  // Sync edit mode from modal store if provided
  const isEditing = !!currentEdit || !!editingAddress;
  const activeEditData = currentEdit || editingAddress;

  const handleClose = () => {
    setIsAddingNew(false);
    setCurrentEdit(null);
    closeModal();
  };

  const handleSave = (data: AddressInput) => {
    if (activeEditData) {
      updateAddress(activeEditData.id, data);
    } else {
      addAddress(data);
    }
    setIsAddingNew(false);
    setCurrentEdit(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E8D5C0] shadow-2xl p-6 sm:p-7 z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D5C0] mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">
                  {isAddingNew
                    ? 'Tambah Alamat Baru'
                    : isEditing
                      ? 'Ubah Alamat Pengiriman'
                      : 'Buku Alamat Tersimpan'}
                </h2>
                <p className="text-xs text-[#888]">
                  {isAddingNew || isEditing
                    ? 'Isi detail alamat pengantaran paketmu.'
                    : 'Pilih atau kelola alamat tujuan pengiriman pesanan.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:bg-[#FFF0F5] transition-colors cursor-pointer text-sm"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto pr-1">
            {isAddingNew || isEditing ? (
              <AddressForm
                initialData={activeEditData}
                onSubmit={handleSave}
                onCancel={() => {
                  setIsAddingNew(false);
                  setCurrentEdit(null);
                }}
              />
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-[#888] uppercase tracking-wider">
                    Daftar Alamat ({addresses.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(true)}
                    className="text-xs font-bold text-[#9E1A59] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>+</span> Tambah Alamat Baru
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#888] flex flex-col items-center gap-2">
                    <span className="text-3xl">📭</span>
                    <p>Belum ada alamat tersimpan.</p>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(true)}
                      className="mt-2 px-4 py-2 rounded-xl bg-[#9E1A59] text-white text-xs font-bold"
                    >
                      Tambah Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {addresses.map((addr) => (
                      <AddressCard
                        key={addr.id}
                        address={addr}
                        isSelected={selectedAddressId === addr.id}
                        onSelect={() => selectAddress(addr.id)}
                        onEdit={() => setCurrentEdit(addr)}
                        onDelete={() => deleteAddress(addr.id)}
                        onSetDefault={() => setDefaultAddress(addr.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
