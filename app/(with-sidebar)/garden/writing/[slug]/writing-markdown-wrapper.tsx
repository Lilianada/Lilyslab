"use client"

import dynamic from "next/dynamic"
import React, { Suspense } from 'react';

// Lazy load the MarkdownRenderer component
const MarkdownRenderer = dynamic(() => import("@/app/components/MarkdownRenderer"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="h-4 bg-muted rounded w-4/6"></div>
    </div>
  ),
})

interface WritingMarkdownWrapperProps {
  content: string;
}

export function WritingMarkdownWrapper({ content }: WritingMarkdownWrapperProps) {
  return (
    <article className="mt-8">
      <Suspense fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/6"></div>
        </div>
      }>
        <MarkdownRenderer content={content} />
      </Suspense>
    </article>
  );
}
