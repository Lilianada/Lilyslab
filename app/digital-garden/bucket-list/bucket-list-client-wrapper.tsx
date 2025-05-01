'use client';

import React, { ReactNode } from 'react';
import { ScrollProgress } from '@/components/ui/scroll-progress';

interface BucketListClientWrapperProps {
  children: ReactNode;
}

export function BucketListClientWrapper({ children }: BucketListClientWrapperProps) {
  return (
    <>
      <ScrollProgress 
        color="bg-extra-lavender" 
        height={3} 
        glow={true}
        glowColor="rgba(var(--extra-lavender), 0.6)"
        glowIntensity="12px"
      />
      {children}
    </>
  );
}
