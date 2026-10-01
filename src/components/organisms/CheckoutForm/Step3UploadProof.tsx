'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { FileUploader } from '@/components/molecules/FileUploader';

interface Step3UploadProofProps {
  onSubmit: (file: File) => void;
  isLoading: boolean;
}

export function Step3UploadProof({ onSubmit, isLoading }: Step3UploadProofProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!file) {
      setError('Upload bukti transfer dulu ya!');
      return;
    }
    setError(null);
    onSubmit(file);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold text-[#1A1A1A]">Upload Bukti Transfer</h2>
        <p className="text-sm text-[#888]">Foto / screenshot bukti transfer dari app bankmu.</p>
      </div>

      <FileUploader onFileSelect={setFile} error={error ?? undefined} />

      <Button
        id="checkout-submit-btn"
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Memproses...' : 'Konfirmasi & Hubungi Admin 🚀'}
      </Button>
    </div>
  );
}
