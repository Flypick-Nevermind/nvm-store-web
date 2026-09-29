'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PageShell } from '@/components/layouts/PageShell';
import { BRAND } from '@/constants/brand';

type SupportTopic = 'faqs' | 'about' | 'contact' | 'shipping' | 'refund';

interface TopicMeta {
  id: SupportTopic;
  title: string;
  badge: string;
  icon: string;
}

const TOPICS: TopicMeta[] = [
  { id: 'faqs', title: 'Tanya Jawab (FAQs)', badge: 'BANTUAN', icon: '❓' },
  { id: 'about', title: 'Tentang NEVERMIND', badge: 'BRAND STORY', icon: '💖' },
  { id: 'contact', title: 'Hubungi Kami', badge: 'CUSTOMER CARE', icon: '💬' },
  { id: 'shipping', title: 'Kebijakan Pengiriman', badge: 'LOGISTIK', icon: '🚚' },
  { id: 'refund', title: 'Kebijakan Refund & Garansi', badge: 'JAMINAN', icon: '🛡️' },
];

export default function SupportPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (Array.isArray(params?.slug) ? params?.slug[0] : params?.slug) as SupportTopic;

  const activeTopic = TOPICS.some((t) => t.id === slug) ? slug : 'faqs';

  const handleTabChange = (topicId: SupportTopic) => {
    router.push(`/support/${topicId}`);
  };

  return (
    <PageShell>
      {/* ── Main Layout: Sidebar Tabs + Content ─────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E8D5C0] shadow-xs sticky top-[calc(7rem+1.5rem)] lg:top-[calc(11.25rem+1.5rem)]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E1A59] mb-4 px-2">
              Pilih Topik Bantuan
            </p>

            <nav className="flex flex-col gap-2">
              {TOPICS.map((topic) => {
                const isSelected = activeTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTabChange(topic.id)}
                    className={[
                      'w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer border',
                      isSelected
                        ? 'bg-[#9E1A59] text-white border-[#9E1A59] shadow-sm'
                        : 'bg-[#FFF8E1]/60 text-[#1A1A1A] border-[#E8D5C0] hover:bg-[#FFF8E1] hover:border-[#9E1A59]',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{topic.icon}</span>
                      <span>{topic.title}</span>
                    </div>
                    <span className="text-xs">{isSelected ? '→' : '›'}</span>
                  </button>
                );
              })}
            </nav>

            {/* Direct WhatsApp Callout */}
            <div className="mt-6 pt-5 border-t border-[#E8D5C0]/80">
              <p className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-2">
                Butuh Bantuan Langsung?
              </p>
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}?text=Halo+Nevermind,+saya+butuh+bantuan+mengenai+pesanan`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] text-white hover:bg-black text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>💬</span> Chat Admin WhatsApp
              </a>
              <p className="text-[10px] text-[#888] mt-2 text-center">
                Respon cepat setiap hari: 09.00 – 21.00 WIB
              </p>
            </div>
          </div>

          {/* Right Topic Details */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5C0] shadow-xs">
            {/* 1. FAQs Content */}
            {activeTopic === 'faqs' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] font-black tracking-widest uppercase mb-2 inline-block">
                  FAQ
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mb-6">
                  Pertanyaan Sering Diajukan (FAQs)
                </h2>

                <div className="flex flex-col gap-4">
                  <div className="p-5 rounded-2xl bg-[#FFF8E1]/50 border border-[#E8D5C0]">
                    <h3 className="font-bold text-sm text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                      <span className="text-[#9E1A59]">Q:</span> Apa bedanya Pre-Order dan Ready Stock?
                    </h3>
                    <p className="text-xs text-[#666] leading-relaxed">
                      Barang <strong>Ready Stock</strong> sudah tiba di warehouse lokal Indonesia dan siap dikirim dalam 1–2 hari kerja. Sedangkan barang <strong>Pre-Order (PO)</strong> akan dikurasi dan dikirim langsung dari China dengan estimasi tiba 14–21 hari kerja.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FFF8E1]/50 border border-[#E8D5C0]">
                    <h3 className="font-bold text-sm text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                      <span className="text-[#9E1A59]">Q:</span> Apakah harga sudah termasuk bea cukai & pajak impor?
                    </h3>
                    <p className="text-xs text-[#666] leading-relaxed">
                      Ya! Semua harga yang tertera di NEVERMIND adalah <strong>harga All-In</strong>. Kamu tidak akan dikenakan biaya tambahan saat paket tiba di depan rumahmu.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FFF8E1]/50 border border-[#E8D5C0]">
                    <h3 className="font-bold text-sm text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                      <span className="text-[#9E1A59]">Q:</span> Bagaimana cara melacak status pesanan saya?
                    </h3>
                    <p className="text-xs text-[#666] leading-relaxed">
                      Kamu bisa memasukkan Order ID kamu di menu <Link href="/track" className="text-[#9E1A59] font-bold underline">Lacak Pesanan</Link> untuk melihat timeline pengiriman dari China ke warehouse lokal hingga kurir ekspedisi.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FFF8E1]/50 border border-[#E8D5C0]">
                    <h3 className="font-bold text-sm text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                      <span className="text-[#9E1A59]">Q:</span> Apakah produk asli sesuai foto (Real Picture)?
                    </h3>
                    <p className="text-xs text-[#666] leading-relaxed">
                      100% Real Picture! Setiap item melalui proses <strong>Double Quality Control</strong> di warehouse China dan Indonesia sebelum dikirimkan ke pelanggan.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. About Us Content */}
            {activeTopic === 'about' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] font-black tracking-widest uppercase mb-2 inline-block">
                  BRAND STORY
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mb-4">
                  Tentang NEVERMIND
                </h2>
                <p className="text-sm text-[#9E1A59] font-bold italic mb-6">
                  &ldquo;too cute, too care ♡&rdquo;
                </p>

                <div className="space-y-4 text-xs sm:text-sm text-[#555] leading-relaxed">
                  <p>
                    NEVERMIND lahir dari kecintaan Gen Z pada fashion tas yang unik, viral di media sosial, dan tidak pasaran. Kami melihat betapa sulitnya mendapatkan tas tren terbaru dari desainer indie di Guangzhou, Shanghai, dan Hangzhou tanpa repot urusan bea cukai, kurs mata uang, atau risiko barang tidak sesuai.
                  </p>
                  <p>
                    Sebagai platform jastip modern cross-border, kami menghubungkan pecinta fashion Indonesia langsung ke produsen dan studio desain terpercaya di China dengan sistem kurasi yang ketat dan transparan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#E8D5C0]">
                  <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] text-center">
                    <p className="text-2xl font-black text-[#9E1A59]">2,500+</p>
                    <p className="text-[11px] font-bold text-[#888] mt-1">Tas Terkirim</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] text-center">
                    <p className="text-2xl font-black text-[#9E1A59]">4.9 / 5.0</p>
                    <p className="text-[11px] font-bold text-[#888] mt-1">Rating Kepuasan</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] text-center">
                    <p className="text-2xl font-black text-[#9E1A59]">100%</p>
                    <p className="text-[11px] font-bold text-[#888] mt-1">Garansi QC Fisik</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Contact Us Content */}
            {activeTopic === 'contact' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] font-black tracking-widest uppercase mb-2 inline-block">
                  HUBUNGI KAMI
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mb-4">
                  Hubungi Tim Support
                </h2>
                <p className="text-xs sm:text-sm text-[#666] leading-relaxed mb-6">
                  Punya pertanyaan seputar tas idamanmu, konfirmasi pembayaran, atau butuh bantuan pelacakan pesanan? Tim kami siap membantumu!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0]">
                    <span className="text-2xl mb-2 block">💬</span>
                    <h3 className="font-bold text-sm text-[#1A1A1A]">WhatsApp Official</h3>
                    <p className="text-xs text-[#777] mt-1 mb-3">
                      Chat langsung untuk respon cepat dari admin jastip kami.
                    </p>
                    <a
                      href={`https://wa.me/${BRAND.whatsappNumber}?text=Halo+Nevermind,+saya+ingin+bertanya+tentang+layanan+jastip`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9E1A59] text-white text-xs font-bold hover:bg-[#7A1244] transition-colors"
                    >
                      Buka Chat WhatsApp →
                    </a>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0]">
                    <span className="text-2xl mb-2 block">✉️</span>
                    <h3 className="font-bold text-sm text-[#1A1A1A]">Email Customer Service</h3>
                    <p className="text-xs text-[#777] mt-1 mb-3">
                      Untuk kerjasama, partnership, atau kendala formal.
                    </p>
                    <a
                      href="mailto:hello@nevermind.co"
                      className="text-xs font-bold text-[#9E1A59] hover:underline"
                    >
                      hello@nevermind.co
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Shipping Policy Content */}
            {activeTopic === 'shipping' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] font-black tracking-widest uppercase mb-2 inline-block">
                  PENGIRIMAN
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mb-4">
                  Kebijakan Pengiriman (Shipping Policy)
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-[#555] leading-relaxed">
                  <div className="p-4 rounded-2xl border border-[#E8D5C0] bg-[#FFF8E1]/30">
                    <h3 className="font-bold text-sm text-[#1A1A1A] mb-1">⚡ Ready Stock</h3>
                    <p className="text-xs text-[#666]">
                      Barang yang berstatus Ready Stock akan dipacking dan diserahkan ke kurir ekspedisi (J&T, SiCepat, Anteraja) dalam 1–2 hari kerja setelah pembayaran terkonfirmasi.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#E8D5C0] bg-[#FFF8E1]/30">
                    <h3 className="font-bold text-sm text-[#1A1A1A] mb-1">⏳ Pre-Order (PO) Cross-Border</h3>
                    <p className="text-xs text-[#666]">
                      Estimasi durasi total berkisar 14–21 hari kerja, meliputi: kurasi dari supplier China (2–4 hari) → QC & packing warehouse China (2 hari) → pengiriman kargo & bea cukai resmi (7–10 hari) → QC warehouse lokal & kirim ke alamatmu (2–3 hari).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#E8D5C0] bg-[#FFF8E1]/30">
                    <h3 className="font-bold text-sm text-[#1A1A1A] mb-1">📦 Nomor Resi</h3>
                    <p className="text-xs text-[#666]">
                      Nomor resi lokal akan diupdate secara otomatis melalui WhatsApp dan dapat dilacak di halaman Lacak Order setelah paket lulus QC akhir.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. Refund Policy Content */}
            {activeTopic === 'refund' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="px-3 py-1 rounded-full bg-[#9E1A59]/10 text-[#9E1A59] text-[10px] font-black tracking-widest uppercase mb-2 inline-block">
                  GARANSI
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A] mb-4">
                  Kebijakan Refund & Garansi
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-[#555] leading-relaxed">
                  <p>
                    Kepuasan kamu adalah prioritas utama kami. Kami memberikan garansi penukaran produk atau pengembalian dana (refund) 100% apabila:
                  </p>

                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#666]">
                    <li>Produk yang kamu terima mengalami cacat fisik mayor (rusak, resleting jebol, kulit sobek).</li>
                    <li>Produk yang diterima salah model atau salah warna dari pesananmu.</li>
                    <li>Paket hilang dalam perjalanan kargo resmi.</li>
                  </ul>

                  <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#E8D5C0] mt-4">
                    <h3 className="font-bold text-xs text-[#9E1A59] uppercase tracking-wider mb-1">
                      Syarat Klaim Garansi:
                    </h3>
                    <p className="text-xs text-[#666]">
                      Wajib menyertakan <strong>video unboxing</strong> tanpa jeda saat pertama kali membuka paket, dan mengajukan klaim maksimal 2x24 jam sejak paket berstatus diterima.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
