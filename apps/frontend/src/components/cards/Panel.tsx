import type { HTMLAttributes } from 'react'

import { cn } from '@/utils'

import { type CardPadding, cardVariants, type SurfaceVariant } from './cardVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual treatment. Panels default to 'filled' for a slightly sunken look.
   * @default 'filled'
   */
  variant?: SurfaceVariant
  /**
   * Internal padding.
   * @default 'md'
   */
  padding?: CardPadding
  /**
   * Optional panel title, rendered as a visible heading above children.
   */
  title?: string
  /**
   * When true, renders a title with a bottom divider.
   */
  titled?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Panel — a secondary container used for settings blocks, info sidebars,
 * and grouped fields.
 *
 * Less prominent than Card — no elevation, uses 'filled' by default.
 *
 * @example
 * // Settings section
 * <Panel title="Notifications" titled>
 *   <Toggle label="Email notifications" />
 *   <Toggle label="Push notifications" />
 * </Panel>
 *
 * @example
 * // Inline info block
 * <Panel variant="muted">
 *   <p className="text-body-sm text-foreground-secondary">Read-only mode active.</p>
 * </Panel>
 */
export function Panel({
  variant = 'filled',
  padding = 'md',
  title,
  titled = false,
  className,
  children,
  ...props
}: PanelProps) {
  const showTitle = (titled || title != null) && title != null

  return (
    <div className={cardVariants({ variant, padding: 'none', radius: 'md', className })} {...props}>
      {showTitle && (
        <div className="px-4 py-3 border-b border-border">
          <p className="text-label font-medium text-foreground-secondary tracking-wide uppercase text-caption">
            {title}
          </p>
        </div>
      )}
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
                    : 'p-8'
        )}
      >
        {children}
      </div>
    </div>
  )
}

Panel.displayName = 'Panel'
