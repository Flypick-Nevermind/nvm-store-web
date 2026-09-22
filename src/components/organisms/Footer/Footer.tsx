import Link from 'next/link';
import { Logo } from '@/components/atoms/Logo';
import { BRAND } from '@/constants/brand';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <Logo size="lg" variant="light" showTagline />
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mt-1">
              Platform cross-border curated fashion untuk Gen Z. Tas trendi dari China, langsung ke
              tanganmu — transparan & tanpa drama.
            </p>
          </div>

          {/* Links: Toko */}
          <nav aria-label="Menu toko">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C74375] mb-3">Toko</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Katalog Produk' },
                { href: '/checkout', label: 'Keranjang & Checkout' },
                { href: '/track', label: 'Lacak Status Order' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links: Info */}
          <nav aria-label="Menu info">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C74375] mb-3">
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
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links: Customer Care */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C74375] mb-3">
              Customer Care
            </p>
            <p className="text-xs text-white/60 mb-2">
              Ada pertanyaan? Chat admin kami di WhatsApp:
            </p>
            <Link
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#C74375] text-white text-xs font-semibold transition-all duration-200"
            >
              <span>💬 WhatsApp Admin</span>
              <span className="opacity-60" aria-hidden="true">
                ↗
              </span>
            </Link>
            <p className="text-[11px] text-white/40 mt-3">Senin – Minggu: 09.00 – 21.00 WIB</p>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">© {year} NEVERMIND. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/30 uppercase tracking-widest font-mono">
              {BRAND.tagline}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
