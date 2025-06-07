'use client';

import { useEffect, useState, ReactNode } from 'react';

interface SafeHydrationProps {
  children: ReactNode;
  fallback?: ReactNode;
  ssrOnly?: boolean;
}

/**
 * Component that safely handles hydration by ensuring consistent renders
 * between server and client, or by only rendering on one side.
 * 
 * @param children - Content to render
 * @param fallback - Content to show until hydration is complete
 * @param ssrOnly - If true, only renders on server and removes on client
 */
export function SafeHydration({ 
  children, 
  fallback = null,
  ssrOnly = false 
}: SafeHydrationProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  
  // After hydration, update state
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // For SSR-only content, show on server but hide on client
  if (ssrOnly) {
    return (
      <>
        {!isHydrated && children}
        {isHydrated && null}
      </>
    );
  }
  
  // For client-only content, replace with fallback on server
  return (
    <>
      {isHydrated ? children : fallback}
    </>
  );
}
