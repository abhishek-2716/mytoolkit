import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utils'

import { Container, type ContainerWidth } from './Container'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface PageWrapperProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Maximum content width for this page.
   * @default 'default'
   */
  width?: ContainerWidth
  /**
   * Vertical padding preset.
   * - 'default' — standard page padding (py-12 md:py-16)
   * - 'compact' — less padding (py-8)
   * - 'none'    — no vertical padding (manage manually)
   */
  spacing?: 'default' | 'compact' | 'none'
  children: ReactNode
}

/* ─── Spacing classes ────────────────────────────────────────────────────── */

const spacingClasses: Record<NonNullable<PageWrapperProps['spacing']>, string> = {
  default: 'py-12 md:py-16',
  compact: 'py-8',
  none: '',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * PageWrapper — standard page content container.
 *
 * Composes a `Container` with consistent vertical spacing.
 * Use inside `<main>` for all non-hero page content.
 *
 * Designed to slot inside layouts. The layout provides the header/footer
 * shell; PageWrapper provides the inner page structure.
 *
 * @example
 * // Standard page
 * export function AboutPage() {
 *   return (
 *     <PageWrapper>
 *       <h1 className="type-h1">About ToolNest</h1>
 *       <p className="type-body-md">…</p>
 *     </PageWrapper>
 *   )
 * }
 *
 * @example
 * // Narrow reading page (e.g. legal pages)
 * <PageWrapper width="narrow" spacing="default">
 *   <article>…</article>
 * </PageWrapper>
 *
 * @example
 * // Full-width tool page
 * <PageWrapper width="fluid" spacing="none">
 *   <ToolCanvas />
 * </PageWrapper>
 */
export function PageWrapper({
  width = 'default',
  spacing = 'default',
  className,
  children,
  ...props
}: PageWrapperProps) {
  return (
    <div className={cn(spacingClasses[spacing], className)} {...props}>
      <Container width={width}>{children}</Container>
    </div>
  )
}
