import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, ClockIcon, StarIcon, ZapIcon } from 'lucide-react'

import { ROUTES } from '@/constants'

import type { ToolMeta } from '@/registry'

export type ToolCardVariant = 'default' | 'compact' | 'featured'

interface ToolCardProps {
  tool: ToolMeta
  variant?: ToolCardVariant
  showCategory?: boolean
  categoryColorClass?: string
}

export const ToolCard = memo(function ToolCard({
  tool,
  variant = 'default',
  showCategory = false,
  categoryColorClass,
}: ToolCardProps) {
  const Icon = tool.icon
  const isComingSoon = tool.status === 'coming-soon'
  const href = `${ROUTES.TOOLS}/${tool.slug}`

  /* ── compact variant ───────────────────────────────────────────────── */
  if (variant === 'compact') {
    const compactContent = (
      <article
        className={[
          'group flex items-center gap-3 rounded-xl border p-3',
          'bg-card text-card-foreground transition-all duration-200',
          isComingSoon
            ? 'border-border/40 opacity-55 cursor-default'
            : 'border-border/60 hover:border-primary/35 hover:bg-primary/[0.025] hover:shadow-sm cursor-pointer',
        ].join(' ')}
        aria-label={tool.title}
      >
        <div
          className={[
            'flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg transition-transform duration-200',
            !isComingSoon ? 'group-hover:scale-105' : '',
            categoryColorClass ?? 'bg-primary/10 text-primary',
          ].filter(Boolean).join(' ')}
          aria-hidden="true"
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-150">
              {tool.shortTitle}
            </h3>
            {tool.isNew && (
              <span className="flex-shrink-0 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">New</span>
            )}
          </div>
          <p className="text-xs text-foreground-muted truncate mt-0.5 leading-relaxed">
            {tool.shortDescription}
          </p>
        </div>
        {isComingSoon ? (
          <span className="flex-shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Soon
          </span>
        ) : (
          <ArrowRightIcon className="flex-shrink-0 w-4 h-4 text-foreground-muted/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150" aria-hidden="true" />
        )}
      </article>
    )

    if (isComingSoon) return <div className="w-full cursor-default">{compactContent}</div>
    return (
      <Link
        to={href}
        className="flex w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 rounded-xl no-underline"
        aria-label={`${tool.title} - ${tool.shortDescription}`}
      >
        {compactContent}
      </Link>
    )
  }

  /* ── default / featured variants ──────────────────────────────────── */
  const isFeatured = variant === 'featured'
  const iconSize = isFeatured ? 'w-12 h-12' : 'w-10 h-10'
  const iconInner = isFeatured ? 'w-6 h-6' : 'w-5 h-5'
  const pad = isFeatured ? 'p-5' : 'p-4'

  const statusChip = isComingSoon ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/25 text-amber-700 dark:text-amber-400 border border-amber-300/50 dark:border-amber-700/40">
      <ClockIcon className="w-2.5 h-2.5" aria-hidden="true" />
      Soon
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50 dark:border-emerald-700/40">
      <ZapIcon className="w-2.5 h-2.5" aria-hidden="true" />
      Instant
    </span>
  )

  const badges = (
    <div className="flex items-center gap-1.5 flex-wrap min-h-5">
      {tool.isPopular && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          Popular
        </span>
      )}
      {tool.isNew && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          New
        </span>
      )}
      {tool.isTrending && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          Trending
        </span>
      )}
      {tool.status === 'beta' && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          Beta
        </span>
      )}
      {tool.isPremium && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          <StarIcon className="w-2.5 h-2.5" aria-hidden="true" />
          Premium
        </span>
      )}
    </div>
  )

  const content = (
    <article
      className={[
        'group relative flex flex-col w-full rounded-2xl border overflow-hidden',
        'bg-card text-card-foreground h-full transition-all duration-200',
        isComingSoon
          ? 'border-border/40 opacity-55 cursor-default'
          : 'border-border/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 cursor-pointer',
      ].join(' ')}
      aria-label={tool.title}
    >
      {/* Header row: icon + status chip */}
      <div className={`flex items-start justify-between ${pad} pb-0`}>
        <div
          className={[
            'flex items-center justify-center rounded-xl transition-transform duration-200',
            !isComingSoon ? 'group-hover:scale-110' : '',
            iconSize,
            categoryColorClass ?? 'bg-primary/10 text-primary',
          ].filter(Boolean).join(' ')}
          aria-hidden="true"
        >
          <Icon className={iconInner} />
        </div>
        {statusChip}
      </div>

      {/* Body */}
      <div className={`flex flex-col flex-1 ${pad} pt-3`}>
        <h3
          className={[
            'font-bold text-foreground leading-snug',
            isFeatured ? 'text-base' : 'text-sm',
            !isComingSoon ? 'group-hover:text-primary transition-colors duration-150' : '',
          ].filter(Boolean).join(' ')}
        >
          {tool.shortTitle}
        </h3>

        <p
          className={[
            'mt-1.5 text-foreground-muted leading-relaxed line-clamp-2 flex-1',
            isFeatured ? 'text-sm' : 'text-xs',
          ].join(' ')}
        >
          {tool.shortDescription}
        </p>

        {/* Footer: badges + category */}
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          {badges}
          {showCategory && (
            <span className="flex-shrink-0 text-[10px] text-foreground-muted/70 capitalize ml-auto font-medium tracking-wide">
              {tool.category}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent line — slides in on hover */}
      {!isComingSoon && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-primary/70 to-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          aria-hidden="true"
        />
      )}
    </article>
  )

  if (isComingSoon) {
    return (
      <div className="block w-full h-full cursor-default" title="Coming soon - not yet available">
        {content}
      </div>
    )
  }

  return (
    <Link
      to={href}
      className="block w-full h-full no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-2xl"
      aria-label={`${tool.title} - ${tool.shortDescription}`}
    >
      {content}
    </Link>
  )
})
