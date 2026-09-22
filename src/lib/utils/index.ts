// NEVERMIND — Utility Helpers

/**
 * Format IDR currency
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ETA date range in Indonesian
 * @param leadTimeDays  Tuple [min, max] in days, e.g. [14, 21]
 * @param from          Optional start date (defaults to today)
 */
export function formatETA(
  leadTimeDays: [number, number],
  from: Date = new Date()
): string {
  const [minDays, maxDays] = leadTimeDays;

  const dateFrom = new Date(from);
  dateFrom.setDate(dateFrom.getDate() + minDays);

  const dateTo = new Date(from);
  dateTo.setDate(dateTo.getDate() + maxDays);

  const fmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long' });
  const fmtYear = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Same month → "14 – 21 Oktober"
  if (dateFrom.getMonth() === dateTo.getMonth()) {
    const dayFrom = dateFrom.getDate();
    const [, monthYear] = fmt.format(dateTo).split(' ');
    const yearStr = dateTo.getFullYear() !== new Date().getFullYear()
      ? ` ${dateTo.getFullYear()}`
      : '';
    return `${dayFrom} – ${dateTo.getDate()} ${monthYear}${yearStr}`;
  }

  return `${fmt.format(dateFrom)} – ${fmtYear.format(dateTo)}`;
}

/**
 * Format WhatsApp number for wa.me link
 * Handles "08..." → "628..."
 */
export function formatWANumber(number: string): string {
  const digits = number.replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (digits.startsWith('62')) return digits;
  return digits;
}

/**
 * Copy text to clipboard with graceful fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const success = document.execCommand('copy');
    document.body.removeChild(el);
    return success;
  }
}

/**
 * Format file size in human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generate a short readable Order ID for display
 */
export function formatOrderId(orderId: string): string {
  return `#NVM-${orderId.slice(-6).toUpperCase()}`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
