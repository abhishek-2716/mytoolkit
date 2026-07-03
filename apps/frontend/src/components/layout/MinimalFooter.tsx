import { appConfig } from '@/config'

interface MinimalFooterProps {
  /** Tagline text shown after the copyright notice. @default 'Free Online Productivity Tools' */
  tagline?: string
  /** Additional class names for the footer element. */
  className?: string
}

/**
 * MinimalFooter — a single-line copyright footer.
 *
 * Used by layouts that don't need the full site footer (ToolLayout,
 * BlogLayout, LegalLayout). PublicLayout uses the full Footer instead.
 */
export function MinimalFooter({
  tagline = 'Free Online Productivity Tools',
  className,
}: MinimalFooterProps) {
  return (
    <footer role="contentinfo" className={className ?? 'border-t border-border bg-surface'}>
      <div className="container py-10">
        <p className="text-center type-caption text-foreground-muted">
          © {new Date().getFullYear()} {appConfig.name}
          {tagline ? ` \u2014 ${tagline}` : ''}
        </p>
      </div>
    </footer>
  )
}
