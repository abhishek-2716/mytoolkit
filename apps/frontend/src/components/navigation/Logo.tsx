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
 * ToolNest brand mark — a stylized wrench inside a rounded square.
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
      {/* Wrench handle */}
      <path
        d="M20.5 8.5C22.4 10.4 22.4 13.6 20.5 15.5L15.5 20.5C13.6 22.4 10.4 22.4 8.5 20.5C6.6 18.6 6.6 15.4 8.5 13.5L10.3 11.7L12.1 13.5L10.3 15.3C9.3 16.3 9.3 17.9 10.3 18.9C11.3 19.9 12.9 19.9 13.9 18.9L18.9 13.9C19.9 12.9 19.9 11.3 18.9 10.3L17.8 9.2L19.4 7.6L20.5 8.5Z"
        className="fill-primary-foreground"
        opacity="0.95"
      />
      {/* Nest dot — top right accent */}
      <circle cx="22" cy="10" r="3" className="fill-primary-foreground" opacity="0.7" />
    </svg>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Logo — ToolNest brand identity component.
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
