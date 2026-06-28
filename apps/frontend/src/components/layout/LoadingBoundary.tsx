import { type ReactNode, Suspense } from 'react'

import { PageLoader } from './PageLoader'

interface LoadingBoundaryProps {
  children: ReactNode
  /**
   * Custom fallback shown while children are suspended.
   * Defaults to a page-height spinner.
   */
  fallback?: ReactNode
  /**
   * Controls the built-in spinner size when no custom fallback is given.
   * @default 'section'
   */
  variant?: 'page' | 'section' | 'inline'
  /** Accessible label for the built-in spinner */
  label?: string
}

/**
 * LoadingBoundary — Suspense wrapper with a sensible default fallback.
 *
 * Wraps any component that suspends (lazy routes, data-fetching, etc.)
 * and shows a spinner until the content is ready.
 *
 * @example
 * // Lazy-loaded route (page-level spinner)
 * <LoadingBoundary variant="page">
 *   <Suspense-enabled component />
 * </LoadingBoundary>
 *
 * @example
 * // Inline data fetch (small spinner inside a card)
 * <LoadingBoundary variant="inline">
 *   <DataComponent />
 * </LoadingBoundary>
 *
 * @example
 * // Custom skeleton
 * <LoadingBoundary fallback={<MySkeleton />}>
 *   <DataComponent />
 * </LoadingBoundary>
 */
export function LoadingBoundary({
  children,
  fallback,
  variant = 'section',
  label,
}: LoadingBoundaryProps) {
  const defaultFallback = <PageLoader variant={variant} label={label} />

  return <Suspense fallback={fallback ?? defaultFallback}>{children}</Suspense>
}
