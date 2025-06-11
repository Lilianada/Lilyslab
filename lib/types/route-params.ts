/**
 * Common type definitions for Next.js route parameters
 * 
 * These types help ensure consistency across dynamic routes
 * and reduce duplication of type definitions.
 */

/**
 * Base params interface for slug-based dynamic routes
 */
export interface SlugParams {
  slug: string;
}

/**
 * Params type for page components with slug-based routes
 * In Next.js App Router, both params and searchParams must be Promises to satisfy PageProps
 */
export interface RouteParams {
  params: Promise<SlugParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Next.js 15 compatible PageProps type
 */
export interface NextPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Specific params type for writing routes
 */
export type WritingRouteParams = RouteParams;

/**
 * Specific params type for draft routes
 */
export type NoteRouteParams = RouteParams;
