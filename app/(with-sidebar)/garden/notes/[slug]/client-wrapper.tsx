'use client';

import React, { ReactNode } from 'react';
import { ScrollProgress } from '@/components/ui/scroll-progress';

interface NotesClientWrapperProps {
  children: ReactNode;
}

export function NotesClientWrapper({ children }: NotesClientWrapperProps) {
  return (
    <>
      <ScrollProgress 
        color="bg-green" 
        height={3} 
        glow={true}
        glowColor="rgba(var(--green), 0.6)"
        glowIntensity="12px"
      />
      {children}
    </>
  );
}
