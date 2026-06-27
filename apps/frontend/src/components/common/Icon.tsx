import type { LucideIcon, LucideProps } from 'lucide-react'

/**
 * T-shirt size scale for icons.
 * Maps to pixel dimensions via sizeMap.
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Semantic color intent.
 * Maps to design-token CSS variables.
 */
export type IconColor =
  | 'default' // currentColor (inherits from parent)
  | 'inherit' // CSS inherit keyword
  | 'muted' // --color-foreground-muted
  | 'primary' // --color-primary
  | 'secondary' // --color-secondary-foreground
  | 'success' // --color-success
  | 'warning' // --color-warning
  | 'danger' // --color-danger
  | 'info' // --color-info
  | 'accent' // --color-accent

export interface IconProps extends Omit<LucideProps, 'size' | 'color'> {
  /** Lucide icon component to render */
  icon: LucideIcon
  /** Visual size — maps to pixels via sizeMap */
  size?: IconSize
  /** Semantic color intent */
  color?: IconColor
  /**
   * Accessible label.
   * Required when the icon is the sole content of an interactive element
   * (e.g., an icon-only button).
   */
  'aria-label'?: string
  /**
   * Mark the icon as decorative (purely visual, no semantic meaning).
   * When true, the element is hidden from assistive technology.
   * When false (default), aria-label is used for screen readers.
   */
  decorative?: boolean
}

/** Pixel size mapping — mirrors Icon Sizes in the design system docs */
const sizeMap: Record<IconSize, number> = {
  xs: 12, // Tight UI: status dots, inline badges
  sm: 14, // Small labels, compact controls
  md: 16, // Default — most UI icons
  lg: 20, // Navigation icons, prominent controls
  xl: 24, // Feature icons, empty states
  '2xl': 32, // Hero icons, large visual accents
}

/** CSS variable color mapping — all token-based, no hardcoded values */
const colorMap: Record<IconColor, string> = {
  default: 'currentColor',
  inherit: 'inherit',
  muted: 'var(--color-foreground-muted)',
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary-foreground)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  accent: 'var(--color-accent)',
}

/**
 * Icon — Accessible Lucide icon wrapper.
 *
 * Provides:
 *  • Consistent size scale across all icon usages
 *  • Semantic color intent via design tokens
 *  • ARIA accessibility (decorative vs. meaningful icons)
 *
 * @example
 * // Decorative icon alongside text (screen readers skip)
 * <Icon icon={SearchIcon} size="md" decorative />
 *
 * @example
 * // Standalone icon button label
 * <button aria-label="Close dialog">
 *   <Icon icon={XIcon} size="md" aria-label="Close dialog" />
 * </button>
 *
 * @example
 * // Semantic status icon
 * <Icon icon={CheckCircleIcon} size="lg" color="success" aria-label="Success" />
 */
export function Icon({
  icon: LucideIconComponent,
  size = 'md',
  color = 'default',
  decorative = false,
  className,
  'aria-label': ariaLabel,
  strokeWidth = 1.75,
  ...props
}: IconProps) {
  const isDecorative = decorative || !ariaLabel

  return (
    <LucideIconComponent
      size={sizeMap[size]}
      color={colorMap[color]}
      strokeWidth={strokeWidth}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={!isDecorative ? ariaLabel : undefined}
      role={!isDecorative ? 'img' : undefined}
      focusable={false}
      className={className}
      {...props}
    />
  )
}
