import type { ReactNode } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';

interface PageShellProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function PageShell({ children, showFooter = true }: PageShellProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main className="flex-1 pt-16" id="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
