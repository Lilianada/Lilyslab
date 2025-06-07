"use client";

import React, { Suspense, ReactNode } from "react";

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

/**
 * A component that wraps content in a Suspense boundary
 * This helps manage loading states and prevent layout shifts during hydration
 */
export function SuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/**
 * A specialized suspense boundary for data fetching components
 * Provides a standardized loading state for data fetching operations
 */
export function DataFetchingSuspense({
  children,
  loadingMessage = "Loading data...",
}: {
  children: ReactNode;
  loadingMessage?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex items-center justify-center py-8">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
            <p className="text-sm text-muted-foreground">{loadingMessage}</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
