'use client';

import React, { ReactNode } from 'react';
import { ScrollProgress } from '@/components/ui/scroll-progress';

interface WritingClientWrapperProps {
  children: ReactNode;
}

export function WritingClientWrapper({ children }: WritingClientWrapperProps) {
  return (
    <>
      <ScrollProgress color="bg-primary" height={3} />
      {children}
    </>
  );
}
