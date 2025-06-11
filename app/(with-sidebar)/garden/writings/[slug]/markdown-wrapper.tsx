"use client"

import dynamic from "next/dynamic"
import React, { Suspense } from 'react';
import { MarkdownSkeleton } from '@/components/markdown/markdown-renderer';

// Lazy load the MarkdownRenderer component
const MarkdownRenderer = dynamic(() => import("@/components/markdown"), {
  loading: () => <MarkdownSkeleton />,
})

interface WritingMarkdownWrapperProps {
  content: string;
}

export function WritingMarkdownWrapper({ content }: WritingMarkdownWrapperProps) {
  return (
    <Suspense fallback={<MarkdownSkeleton />}>
      <MarkdownRenderer content={content} />
    </Suspense>
  );
}
