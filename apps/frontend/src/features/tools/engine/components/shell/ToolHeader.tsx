import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon, ChevronRightIcon, ShareIcon } from 'lucide-react'

import { ROUTES } from '@/constants'
import { getCategoryMeta } from '@/registry'
import type { ToolMeta } from '@/registry'

import { ToolBadge } from '../meta/ToolBadge'

interface ToolHeaderProps {
  tool: ToolMeta
}

/**
 * ToolHeader
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Renders breadcrumbs, tool title, description, badges, tags, and a share
 * button. All data comes from ToolMeta — no props beyond the tool object.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolHeader({ tool }: ToolHeaderProps) {
  const Icon = tool.icon
  const category = getCategoryMeta(tool.category)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: tool.title, text: tool.shortDescription, url })
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    }
  }

  return (
    <header className="mb-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-4 flex-wrap">
        <Link to={ROUTES.HOME} className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRightIcon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
        <Link to={ROUTES.TOOLS} className="hover:text-foreground transition-colors">Tools</Link>
        {category && (
          <>
            <ChevronRightIcon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <Link
              to={`/category/${category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRightIcon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
        <span className="text-foreground font-medium truncate max-w-[180px]">{tool.shortTitle}</span>
      </nav>

      <div className="flex items-start gap-4">
        {/* Tool icon */}
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tool.isNew && <ToolBadge variant="new" />}
            {tool.status === 'beta' && <ToolBadge variant="beta" />}
            {tool.isPremium && <ToolBadge variant="premium" />}
            {tool.isPopular && <ToolBadge variant="popular" />}
            <ToolBadge variant="difficulty" value={tool.difficulty} />
            {tool.estimatedTimeSec !== undefined && (
              <ToolBadge variant="time" value={`~${tool.estimatedTimeSec}s`} />
            )}
          </div>

          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {tool.title}
            </h1>
            <button
              type="button"
              onClick={() => { void handleShare() }}
              aria-label="Share this tool"
              title={copied ? 'Link copied!' : 'Share this tool'}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              {copied
                ? <><CheckIcon className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />Copied!</>
                : <><ShareIcon className="w-3.5 h-3.5" aria-hidden="true" />Share</>
              }
            </button>
          </div>

          {/* Description */}
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            {tool.description}
          </p>

          {/* Tags */}
          {tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3" aria-label="Tool tags">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
