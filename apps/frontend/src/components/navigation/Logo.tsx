import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/utils'
import { appConfig } from '@/config'

/* ─── Types ──────────────────────────────────────────────────────────────── */

/**
 * Controls which parts of the Logo are rendered.
 *
 * | Variant | Shows               |
 * |---------|---------------------|
 * | icon    | SVG mark only       |
 * | text    | Brand name only     |
 * | full    | Icon + brand name   |
 */
export type LogoVariant = 'icon' | 'text' | 'full'

/**
 * Controls the overall scale of the Logo.
 *
 * | Size | Icon   | Text          |
 * |------|--------|----------------|
 * | sm   | 24px   | text-sm        |
 * | md   | 28px   | text-base      |
 * | lg   | 32px   | text-xl        |
 */
export type LogoSize = 'sm' | 'md' | 'lg'

export interface LogoProps extends ComponentPropsWithoutRef<'a'> {
  /** What to render. @default 'full' */
  variant?: LogoVariant
  /** Scale preset. @default 'md' */
  size?: LogoSize
  /** When true, wraps in a React Router `<Link>`. @default true */
  asLink?: boolean
  /** Accessible name override (screen reader). Defaults to app name. */
  'aria-label'?: string
}

/* ─── Style maps ─────────────────────────────────────────────────────────── */

const iconSizeMap: Record<LogoSize, number> = { sm: 24, md: 28, lg: 32 }

const textSizeMap: Record<LogoSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

/* ─── SVG Icon Mark ──────────────────────────────────────────────────────── */

/**
 * MyToolsHub brand mark — a stylized toolbox inside a rounded square.
 * The icon is purely decorative when paired with the text variant.
 */
function LogoMark({ size = 'md' }: { size?: LogoSize }) {
  const px = iconSizeMap[size]
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Rounded background */}
      <rect width="32" height="32" rx="8" className="fill-primary" />
      {/* Toolbox handle — hollow U-arch */}
      <path
        d="M13 16 L13 12 Q13 9 16 9 Q19 9 19 12 L19 16 L17 16 L17 12 Q17 10.5 16 10.5 Q15 10.5 15 12 L15 16 Z"
        className="fill-primary-foreground"
        opacity="0.95"
      />
      {/* Toolbox body */}
      <rect x="5" y="16" width="22" height="12" rx="2" className="fill-primary-foreground" opacity="0.9" />
      {/* Compartment divider */}
      <rect x="5" y="21" width="22" height="1.5" className="fill-primary" opacity="0.35" />
      {/* Center latch */}
      <rect x="14" y="19.5" width="4" height="3" rx="0.75" className="fill-primary" opacity="0.55" />
    </svg>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Logo — MyToolsHub brand identity component.
 *
 * Renders a link to the home page with the brand mark and/or name.
 * Supports three variants: icon-only, text-only, and full (icon + text).
 *
 * @example
 * // Full logo in header
 * <Logo />
 *
 * @example
 * // Icon only (e.g. compact mobile header)
 * <Logo variant="icon" size="sm" />
 *
 * @example
 * // Non-link (e.g. loading screens)
 * <Logo asLink={false} />
 */
export function Logo({
  variant = 'full',
  size = 'md',
  asLink = true,
  className,
  'aria-label': ariaLabel,
  ...props
}: LogoProps) {
  const label = ariaLabel ?? `${appConfig.name} — ${appConfig.description}`

  const content = (
    <>
      {(variant === 'icon' || variant === 'full') && <LogoMark size={size} />}

      {(variant === 'text' || variant === 'full') && (
        <span className={cn('font-bold tracking-tight text-foreground', textSizeMap[size])}>
          {appConfig.name}
        </span>
      )}
    </>
  )

  const sharedClasses = cn(
    'inline-flex items-center gap-2 select-none outline-none',
    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm',
    className
  )

  if (!asLink) {
    return (
      <div className={sharedClasses} aria-label={label} role="img">
        {content}
      </div>
    )
  }

  return (
    <Link
      to="/"
      aria-label={label}
      className={cn(sharedClasses, 'hover:opacity-90 transition-opacity')}
      {...props}
    >
      {content}
    </Link>
  )
}
