'use client';

import dynamic from 'next/dynamic';

// Import the ViewCounterWrapper component with SSR disabled
const ViewCounterClient = dynamic(
  () => import('@/components/metrics/view-counter-wrapper').then(mod => mod.ViewCounterWrapper),
  { ssr: false }
);

export function ClientViewCounter() {
  return <ViewCounterClient />;
}
