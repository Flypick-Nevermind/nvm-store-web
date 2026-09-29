'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthPromptModal } from '@/components/organisms/AuthPromptModal';
import { RequestBagModal } from '@/components/organisms/RequestBagModal';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AuthPromptModal />
      <RequestBagModal />
    </QueryClientProvider>
  );
}
