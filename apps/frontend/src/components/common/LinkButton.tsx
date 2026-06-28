import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/utils'

import {
  BUTTON_ICON_SIZE,
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
  type ButtonVariantsOptions,
} from './buttonVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

type NativeAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>

export interface LinkButtonProps
  extends NativeAnchorProps, Pick<ButtonVariantsOptions, 'fullWidth'> {
  /** The destination URL or path.
   * - Relative paths (`/tools`) use React Router `<Link>` for client-side nav.
   * - Absolute URLs (`https://…`) and paths with `external: true` use `<a>`.
   */
  href: string
  /** Force render as a plain `<a>` tag. @default false for relative paths */
  external?: boolean
  /** Visual intent. @default 'primary' */
  variant?: ButtonVariant
  /** Size scale. @default 'md' */
  size?: ButtonSize
  /** Prevents interaction and visually dims the link */
  disabled?: boolean
  /** Lucide icon rendered before the label */
  leftIcon?: LucideIcon
  /** Lucide icon rendered after the label */
  rightIcon?: LucideIcon
  children: ReactNode
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function isExternalUrl(href: string): boolean {
  return /^https?:\/\//.test(href) || href.startsWith('//')
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * LinkButton — a button-styled navigation element.
 *
 * Renders as:
 *  - `<Link to={href}>` for relative paths (React Router — avoids full-page reload)
 *  - `<a href={href} target="_blank">` for absolute URLs or when `external=true`
 *
 * Supports all the same visual variants and sizes as `Button`.
 * For actions (onClick handlers with no URL), use `Button` instead.
 *
 * @example
 * // Internal navigation
 * <LinkButton href="/tools" variant="primary">
 *   Browse Tools
 * </LinkButton>
 *
 * @example
 * // External link with icon
 * <LinkButton href="https://github.com/toolnest" external leftIcon={GithubIcon} variant="outline">
 *   View on GitHub
 * </LinkButton>
 *
 * @example
 * // Link-style inline text link
 * <LinkButton href="/privacy" variant="link" size="sm">
 *   Privacy Policy
 * </LinkButton>
 *
 * @example
 * // Disabled state
 * <LinkButton href="/dashboard" disabled variant="secondary">
 *   Dashboard (coming soon)
 * </LinkButton>
 */
export function LinkButton({
  href,
  external,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  children,
  ...props
}: LinkButtonProps) {
  const iconSize = BUTTON_ICON_SIZE[size]

  const classes = buttonVariants({ variant, size, fullWidth, className })

  const disabledClasses = disabled ? cn('pointer-events-none opacity-50') : undefined

  const content = (
    <>
      {LeftIcon && (
        <LeftIcon size={iconSize} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      )}
      {children}
      {RightIcon && (
        <RightIcon size={iconSize} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      )}
    </>
  )

  const useExternal = external === true || isExternalUrl(href)

  if (useExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled || undefined}
        className={cn(classes, disabledClasses)}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      to={href}
      aria-disabled={disabled || undefined}
      className={cn(classes, disabledClasses)}
      {...(props as object)}
    >
      {content}
    </Link>
  )
}

LinkButton.displayName = 'LinkButton'
