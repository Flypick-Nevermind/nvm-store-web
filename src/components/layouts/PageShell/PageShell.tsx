import type { ReactNode } from 'react';
import { Footer } from '@/components/organisms/Footer';
import { Navbar } from '@/components/organisms/Navbar';

interface PageShellProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export function PageShell({ children, showNavbar = true, showFooter = true }: PageShellProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      {showNavbar && <Navbar />}
      <main className={`flex-1 ${showNavbar ? 'pt-20 sm:pt-22' : ''}`} id="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
