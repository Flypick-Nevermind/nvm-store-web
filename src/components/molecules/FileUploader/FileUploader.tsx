'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFileSize } from '@/lib/utils';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
  label?: string;
}

export function FileUploader({ onFileSelect, error, label = 'Upload Bukti Transfer' }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validate = (f: File): string | null => {
    if (!ALLOWED_TYPES.includes(f.type)) return 'Format file harus JPG, PNG, atau PDF';
    if (f.size > MAX_SIZE_BYTES) return 'Ukuran file maksimal 5MB';
    return null;
  };

  const processFile = (f: File) => {
    const err = validate(f);
    if (err) {
      setLocalError(err);
      setFile(null);
      setPreview(null);
      onFileSelect(null);
      return;
    }
    setLocalError(null);
    setFile(f);
    onFileSelect(f);

    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setLocalError(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayError = error ?? localError;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-[#1A1A1A]">
        {label} <span className="text-[#C74375]">*</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        id="proof-upload"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        className="sr-only"
        onChange={handleInputChange}
        aria-describedby={displayError ? 'upload-error' : 'upload-hint'}
      />

      {!file ? (
        <motion.div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          animate={{ borderColor: isDragging ? '#C74375' : displayError ? '#F87171' : '#C8C8C8' }}
          className={[
            'relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed',
            'p-8 cursor-pointer transition-colors duration-200',
            'hover:border-[#C74375]/60 hover:bg-[#C74375]/3',
            isDragging ? 'bg-[#C74375]/5 border-[#C74375]' : 'bg-white',
          ].join(' ')}
          role="button"
          aria-label="Upload bukti transfer"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <span className="text-4xl" aria-hidden="true">📤</span>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#1A1A1A]">
              Klik atau seret file ke sini
            </p>
            <p id="upload-hint" className="text-xs text-[#888] mt-0.5">
              JPG, PNG, PDF · Maks. 5MB
            </p>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-[#D8FFF7] bg-[#D8FFF7]/40 p-4 flex items-center gap-3"
          >
            {preview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={preview} alt="Preview bukti transfer" className="w-14 h-14 rounded-xl object-cover border border-[#C8C8C8]/40 flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#C74375]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl" aria-hidden="true">📄</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">{file.name}</p>
              <p className="text-xs text-[#888]">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={handleRemove}
              aria-label="Hapus file"
              className="w-8 h-8 rounded-full bg-white border border-[#C8C8C8] flex items-center justify-center flex-shrink-0 hover:border-red-300 hover:text-red-500 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      {displayError && (
        <p id="upload-error" className="text-xs text-red-500 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {displayError}
        </p>
      )}
    </div>
  );
}
