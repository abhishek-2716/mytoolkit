import type { ComponentPropsWithoutRef } from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'

import { cn } from '@/utils'
import type { ThemeValue } from '@/config'

import { Icon } from './Icon'

/* ─── Option definitions ──────────────────────────────────────────────────── */

interface ThemeOption {
  value: ThemeValue
  label: string
  icon: typeof SunIcon
  /** Concise description read by screen readers */
  description: string
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: SunIcon,
    description: 'Switch to light theme',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: MoonIcon,
    description: 'Switch to dark theme',
  },
  {
    value: 'system',
    label: 'System',
    icon: MonitorIcon,
    description: 'Follow operating system theme setting',
  },
]

/* ─── Props ───────────────────────────────────────────────────────────────── */

export interface ThemeSwitcherProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * When true, renders icon-only buttons (labels are visually hidden but
   * remain accessible to screen readers via aria-label).
   * Default: false
   */
  compact?: boolean
}

/* ─── Component ───────────────────────────────────────────────────────────── */

/**
 * ThemeSwitcher — segmented control for selecting the application theme.
 *
 * Renders three buttons — Light, Dark, System — in a pill container.
 * The active option is highlighted with an elevated background.
 *
 * Architecture notes:
 *  • Consumes useTheme() — never reads localStorage or the DOM directly.
 *  • The Icon component handles all accessibility for the icon elements.
 *  • Each button uses aria-pressed to communicate selection state.
 *  • Keyboard navigation is handled by the browser's default tab order.
 *
 * @example
 * // Full labels (default)
 * <ThemeSwitcher />
 *
 * @example
 * // Icon-only (compact mode, e.g. mobile header)
 * <ThemeSwitcher compact />
 *
 * @example
 * // Custom positioning
 * <ThemeSwitcher className="absolute bottom-4 right-4" />
 */
export function ThemeSwitcher({ compact = false, className, ...props }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Application theme"
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-border bg-muted p-1',
        className
      )}
      {...props}
    >
      {THEME_OPTIONS.map(({ value, label, icon, description }) => {
        const isActive = theme === value

        return (
          <button
            key={value}
            type="button"
            onClick={() => {
              setTheme(value)
            }}
            aria-pressed={isActive}
            aria-label={description}
            title={description}
            className={cn(
              // Layout
              'inline-flex items-center gap-1.5 rounded-md',
              compact ? 'p-2' : 'px-3 py-1.5',
              // Typography
              'type-label transition-colors',
              // Active state
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : [
                    'text-foreground-muted',
                    'hover:text-foreground hover:bg-background/60',
                    'focus-visible:text-foreground',
                  ]
            )}
          >
            <Icon icon={icon} size="sm" decorative />
            {compact ? <span className="sr-only">{label}</span> : <span>{label}</span>}
          </button>
        )
      })}
    </div>
  )
}
