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
 */
export interface RouteParams {
  params: SlugParams;
}

/**
 * Specific params type for writing routes
 */
export type WritingRouteParams = RouteParams;

/**
 * Specific params type for draft routes
 */
export type DraftRouteParams = RouteParams;
