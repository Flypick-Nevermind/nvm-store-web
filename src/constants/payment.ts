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
}) => {
  const msg = encodeURIComponent(
    `Halo NEVERMIND! 👋\n\n` +
      `Saya sudah melakukan transfer untuk pesanan berikut:\n\n` +
      `🧾 *Order ID:* ${params.orderId}\n` +
      `👤 *Nama:* ${params.buyerName}\n` +
      `🛍️ *Item:* ${params.items}\n` +
      `💰 *Total:* ${params.totalAmount}\n\n` +
      `Bukti transfer sudah saya upload. Mohon dikonfirmasi ya! 🙏`
  );
  return `https://wa.me/${params.whatsappNumber}?text=${msg}`;
};

// Support WA template (for tracking page FAB)
export const buildSupportWhatsAppUrl = (params: {
  whatsappNumber: string;
  orderId: string;
}) => {
  const msg = encodeURIComponent(
    `Halo NEVERMIND! 👋\n\n` +
      `Saya mau tanya status order saya:\n` +
      `🧾 *Order ID:* ${params.orderId}\n\n` +
      `Bisa di-update statusnya? Terima kasih! 🙏`
  );
  return `https://wa.me/${params.whatsappNumber}?text=${msg}`;
};
