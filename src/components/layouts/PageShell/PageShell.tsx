import type { ReactNode } from 'react';
import { Footer } from '@/components/organisms/Footer';
import { Navbar } from '@/components/organisms/Navbar';

interface PageShellProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function PageShell({
  children,
  showNavbar = true,
  showFooter = true,
  className = '',
}: PageShellProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      {showNavbar && <Navbar />}
      <main
        className={`flex-1 ${showNavbar ? 'pt-[7rem] lg:pt-[11.25rem]' : ''} ${className}`}
        id="main-content"
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
