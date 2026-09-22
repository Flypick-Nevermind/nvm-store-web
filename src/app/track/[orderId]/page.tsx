import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageShell } from '@/components/layouts/PageShell';
import { TrackingContent } from './TrackingContent';
import { WhatsAppFAB } from '@/components/organisms/WhatsAppFAB';

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Lacak Order #${orderId}`,
    description: 'Pantau status pengiriman pesananmu di NEVERMIND secara real-time.',
  };
}

export default async function TrackingPage({ params }: Props) {
  const { orderId } = await params;

  return (
    <PageShell>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-xl font-display font-bold text-[#1A1A1A]">
            Lacak Pesanan
          </h1>
          <p className="text-sm text-[#888]">
            Order ID: <span className="font-mono font-bold text-[#C74375]">#{orderId}</span>
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-3 border-[#C74375] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <TrackingContent orderId={orderId} />
        </Suspense>
      </div>

      <WhatsAppFAB orderId={orderId} />
    </PageShell>
  );
}
