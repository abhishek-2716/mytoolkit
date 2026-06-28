import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils'

import { type CardPadding, cardVariants, type SurfaceVariant } from './cardVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SectionCardProps extends HTMLAttributes<HTMLElement> {
  /**
   * Visual surface treatment.
   * @default 'default'
   */
  variant?: SurfaceVariant
  /**
   * Internal padding.
   * @default 'lg'
   */
  padding?: CardPadding
  /**
   * Section heading shown above children.
   */
  title?: string
  /**
   * Supplementary label beneath the title.
   */
  description?: string
  /**
   * Slot rendered to the right of title/description.
   * Ideal for a primary action button.
   */
  action?: ReactNode
  /**
   * Renders as the given element.
   * @default 'section'
   */
  as?: 'section' | 'div' | 'article'
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * SectionCard — a full-width page section container with a header row.
 *
 * Use for dashboard widgets, settings pages, and content groups where
 * a clearly labelled card-like section is needed.
 *
 * @example
 * <SectionCard
 *   title="API Keys"
 *   description="Manage your programmatic access tokens."
 *   action={<Button size="sm">Generate key</Button>}
 * >
 *   <APIKeyTable />
 * </SectionCard>
 */
export function SectionCard({
  variant = 'default',
  padding = 'lg',
  title,
  description,
  action,
  as: Tag = 'section',
  className,
  children,
  ...props
}: SectionCardProps) {
  const hasHeader = title != null || action != null

  return (
    <Tag className={cardVariants({ variant, padding: 'none', radius: 'xl', className })} {...props}>
      {hasHeader && (
        <div
          className={cn(
            'flex items-start justify-between gap-4',
            padding === 'none'
              ? 'px-0 pt-0'
              : padding === 'xs'
                ? 'px-2 pt-2'
                : padding === 'sm'
                  ? 'px-3 pt-3'
                  : padding === 'md'
                    ? 'px-4 pt-4'
                    : padding === 'lg'
                      ? 'px-6 pt-6'
                      : 'px-8 pt-8',
            description == null && 'pb-4 border-b border-border'
          )}
        >
          <div className="min-w-0 flex-1">
            {title != null && <h2 className="text-h5 font-semibold text-foreground">{title}</h2>}
            {description != null && (
              <p className="text-body-sm text-foreground-secondary mt-1">{description}</p>
            )}
          </div>
          {action != null && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {hasHeader && <div className={cn(description != null && 'border-b border-border mt-4')} />}

      <div
        className={cn(
          padding === 'none'
            ? ''
            : padding === 'xs'
              ? 'p-2'
              : padding === 'sm'
                ? 'p-3'
                : padding === 'md'
                  ? 'p-4'
                  : padding === 'lg'
                    ? 'p-6'
                    : 'p-8',
          hasHeader && padding !== 'none' && 'pt-4'
        )}
      >
        {children}
      </div>
    </Tag>
  )
}

SectionCard.displayName = 'SectionCard'
