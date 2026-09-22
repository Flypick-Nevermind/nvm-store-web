import Link from 'next/link';
import { Logo } from '@/components/atoms/Logo';
import { BRAND } from '@/constants/brand';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white mt-auto">
      <div className="max-w-md mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Brand section */}
        <div className="flex flex-col gap-3">
          <Logo size="md" variant="light" showTagline />
          <p className="text-sm text-white/60 leading-relaxed max-w-[280px]">
            Platform cross-border curated fashion untuk Gen Z. Tas trendi dari China, langsung ke tanganmu — transparan & tanpa drama.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-6">
          <nav aria-label="Menu toko">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C74375] mb-3">Toko</p>
            <ul className="flex flex-col gap-2">
              {[
                { href: '/',         label: 'Katalog' },
                { href: '/checkout', label: 'Checkout' },
                { href: '/track',    label: 'Lacak Order' },
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

          <nav aria-label="Menu info">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C74375] mb-3">Info</p>
            <ul className="flex flex-col gap-2">
              {[
                { href: '#cara-order',   label: 'Cara Order' },
                { href: '#faq',          label: 'FAQ' },
                { href: `https://wa.me/${BRAND.whatsappNumber}`, label: 'Hubungi Kami', external: true },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                    {l.external && <span className="ml-1 opacity-50" aria-hidden="true">↗</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-white/40">
            © {year} NEVERMIND. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">
              {BRAND.tagline}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
