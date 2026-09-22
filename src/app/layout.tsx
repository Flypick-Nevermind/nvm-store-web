import type { Metadata, Viewport } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nevermind.store'),
  title: {
    default: 'NEVERMIND — Too cute, too care?',
    template: '%s | NEVERMIND',
  },
  description:
    'Platform cross-border curated fashion untuk Gen Z. Tas trendi dari China, tanpa biaya tersembunyi. See it. Pick it. Get it.',
  keywords: ['tas import', 'fashion gen z', 'y2k bag', 'pre order tas china', 'nevermind store'],
  authors: [{ name: 'NEVERMIND Store' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'NEVERMIND',
    title: 'NEVERMIND — Too cute, too care?',
    description:
      'Tas trendi dari China, langsung ke tanganmu. Curated, transparan, no hidden fees.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEVERMIND — Too cute, too care?',
    description: 'Tas trendi dari China, langsung ke tanganmu.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#C74375',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
