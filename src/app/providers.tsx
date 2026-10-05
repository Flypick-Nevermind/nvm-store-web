'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AddressBookModal } from '@/components/organisms/AddressBookModal';
import { AuthPromptModal } from '@/components/organisms/AuthPromptModal';
import { RequestBagModal } from '@/components/organisms/RequestBagModal';
import { useAddressStore } from '@/store/addressStore';
import { useAuthStore } from '@/store/authStore';

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

  // Load the user's saved addresses from the backend whenever the session changes.
  const userId = useAuthStore((s) => s.user?.id);
  const token = useAuthStore((s) => s.token);
  const syncAddresses = useAddressStore((s) => s.syncFromServer);
  useEffect(() => {
    if (userId && token) void syncAddresses();
  }, [userId, token, syncAddresses]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AuthPromptModal />
      <RequestBagModal />
      <AddressBookModal />
    </QueryClientProvider>
  );
}
