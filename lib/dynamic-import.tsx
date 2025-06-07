"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

/**
 * Utility for dynamically importing components that should only render on the client
 * This helps prevent hydration issues with components that rely on browser APIs
 * 
 * @param importFn - A function that imports the component
 * @param options - Additional options for dynamic import
 * @returns A dynamically imported component that only renders on the client
 */
export function createClientComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options = { ssr: false }
) {
  return dynamic(importFn, { ssr: options.ssr });
}

/**
 * Example usage:
 * 
 * const ClientOnlyComponent = createClientComponent(() => import('./MyComponent'));
 * 
 * function MyPage() {
 *   return (
 *     <div>
 *       <h1>Server and Client Rendered</h1>
 *       <ClientOnlyComponent prop1="value1" /> // Only renders on client
 *     </div>
 *   );
 * }
 */
