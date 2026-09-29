// NEVERMIND — Payment Constants
// ⚠️  Replace all placeholder values with real account details before production

export const BANK_ACCOUNTS = [
  {
    id: 'bca',
    bank: 'BCA',
    accountNumber: '1234567890',
    accountHolder: 'NEVERMIND STORE',
    logo: '🏦',
  },
  {
    id: 'mandiri',
    bank: 'Mandiri',
    accountNumber: '0987654321',
    accountHolder: 'NEVERMIND STORE',
    logo: '🏦',
  },
] as const;

export const QRIS_IMAGE_PATH = '/assets/qris.png';

// WhatsApp redirect template
export const buildWhatsAppRedirectUrl = (params: {
  whatsappNumber: string;
  orderId: string;
  buyerName: string;
  items: string;
  totalAmount: string;
  voucherCode?: string;
  discountAmount?: string;
}) => {
  const voucherLine =
    params.voucherCode && params.discountAmount
      ? `🏷️ *Voucher:* ${params.voucherCode} (-${params.discountAmount})\n`
      : '';

  const msg = encodeURIComponent(
    `Halo NEVERMIND! 👋\n\n` +
      `Saya sudah melakukan transfer untuk pesanan berikut:\n\n` +
      `🧾 *Order ID:* ${params.orderId}\n` +
      `👤 *Nama:* ${params.buyerName}\n` +
      `🛍️ *Item:* ${params.items}\n` +
      voucherLine +
      `💰 *Total:* ${params.totalAmount}\n\n` +
      `Bukti transfer sudah saya upload. Mohon dikonfirmasi ya! 🙏`
  );
  return `https://wa.me/${params.whatsappNumber}?text=${msg}`;
};

// Voucher WA claim template
export const buildVoucherWhatsAppUrl = (params: { whatsappNumber: string; voucherCode: string }) => {
  const msg = encodeURIComponent(
    `Halo NEVERMIND! 👋\n\n` +
      `Saya ingin klaim promo voucher diskon 5% dengan kode *${params.voucherCode}* untuk belanja tas original.\n\n` +
      `Bisa dibantu prosesnya min? Terima kasih! 🙏`
  );
  return `https://wa.me/${params.whatsappNumber}?text=${msg}`;
};

// Support WA template (for tracking page FAB)
export const buildSupportWhatsAppUrl = (params: { whatsappNumber: string; orderId: string }) => {
  const msg = encodeURIComponent(
    `Halo NEVERMIND! 👋\n\n` +
      `Saya mau tanya status order saya:\n` +
      `🧾 *Order ID:* ${params.orderId}\n\n` +
      `Bisa di-update statusnya? Terima kasih! 🙏`
  );
  return `https://wa.me/${params.whatsappNumber}?text=${msg}`;
};

// Request a Bag WA template
export const buildRequestBagWhatsAppUrl = (params: {
  whatsappNumber: string;
  bagName?: string;
  referenceUrl?: string;
  budget?: string;
  notes?: string;
}) => {
  let text = `Halo Admin NEVERMIND! ✨\n\nSaya ingin request jastip tas yang belum ada di website:`;

  if (params.bagName?.trim()) {
    text += `\n\n👜 *Nama/Model Tas:* ${params.bagName.trim()}`;
  }
  if (params.referenceUrl?.trim()) {
    text += `\n🔗 *Link/Foto Referensi:* ${params.referenceUrl.trim()}`;
  }
  if (params.budget?.trim()) {
    text += `\n💰 *Estimasi Budget:* ${params.budget.trim()}`;
  }
  if (params.notes?.trim()) {
    text += `\n📝 *Catatan:* ${params.notes.trim()}`;
  }

  text += `\n\nBisa tolong dibantu carikan dari supplier China? Terima kasih banyak! ♡`;

  return `https://wa.me/${params.whatsappNumber}?text=${encodeURIComponent(text)}`;
};
