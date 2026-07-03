import { MoonIcon, SunIcon } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'

import { cn } from '@/utils'

/**
 * ThemeToggle — single icon button that toggles between light and dark theme.
 *
 * Replaces the three-option ThemeSwitcher in compact/navbar contexts.
 * Clicking toggles between light ↔ dark. The icon reflects the *current*
 * resolved theme (sun = currently light, moon = currently dark).
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2',
        'text-foreground-muted transition-colors',
        'hover:text-foreground hover:bg-background/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'border border-border bg-muted',
        className
      )}
    >
      {isDark ? (
        <SunIcon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
