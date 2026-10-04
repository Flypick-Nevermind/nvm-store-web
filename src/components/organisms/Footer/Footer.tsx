import Link from 'next/link';
import { Logo } from '@/components/atoms/Logo';
import { BRAND } from '@/constants/brand';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F2EEEB] text-[#1A1A1A] border-t border-[#E8D5C0] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <Logo size="lg" variant="dark" showTagline />
            <p className="text-sm text-[#7A6E72] leading-relaxed max-w-sm mt-1">
              The first Gen Z jastip for China&apos;s trendiest bags. Curated cross-border fashion
              langsung ke tanganmu — transparan, full QC fisik, tanpa drama.
            </p>
            {/* Social Icons row */}
            <div className="flex items-center gap-3 pt-2 text-[#9E1A59]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white border border-[#E8D5C0] flex items-center justify-center hover:bg-[#9E1A59] hover:text-white transition-all shadow-2xs"
              >
                📷
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-white border border-[#E8D5C0] flex items-center justify-center hover:bg-[#9E1A59] hover:text-white transition-all shadow-2xs"
              >
                🎵
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-8 h-8 rounded-full bg-white border border-[#E8D5C0] flex items-center justify-center hover:bg-[#9E1A59] hover:text-white transition-all shadow-2xs"
              >
                📌
              </a>
              <a
                href="mailto:hello@nevermind.co"
                aria-label="Email"
                className="w-8 h-8 rounded-full bg-white border border-[#E8D5C0] flex items-center justify-center hover:bg-[#9E1A59] hover:text-white transition-all shadow-2xs"
              >
                ✉️
              </a>
            </div>
          </div>

          {/* Links: Toko */}
          <nav aria-label="Menu toko">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E1A59] mb-3">Toko</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Katalog Produk' },
                { href: '/checkout', label: 'Keranjang & Checkout' },
                { href: '/track', label: 'Lacak Status Order' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#555] hover:text-[#9E1A59] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links: Info */}
          <nav aria-label="Menu info">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E1A59] mb-3">
              Jaminan & Info
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '#cara-order', label: 'Cara Order Pre-Order' },
                { href: '#qc-policy', label: 'Standar QC Fisik' },
                { href: '#faq', label: 'Tanya Jawab (FAQ)' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#555] hover:text-[#9E1A59] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links: Customer Care */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E1A59] mb-3">
              Customer Care
            </p>
            <p className="text-xs text-[#7A6E72] mb-2">
              Ada pertanyaan? Chat admin kami di WhatsApp:
            </p>
            <Link
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E8D5C0] text-[#9E1A59] hover:bg-[#9E1A59] hover:text-white text-xs font-semibold transition-all duration-200 shadow-2xs"
            >
              <span>💬 WhatsApp Admin</span>
              <span className="opacity-60" aria-hidden="true">
                ↗
              </span>
            </Link>
            <p className="text-[11px] text-[#8A7880] mt-3">Senin – Minggu: 09.00 – 21.00 WIB</p>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-[#E8D5C0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8A7880]">© {year} NEVERMIND. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#9E1A59] font-medium tracking-widest lowercase">
              too cute, too care ♡
            </span>
            <span className="text-base text-[#D6D8DB]" aria-hidden="true">
              ✦
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
