import { lazy, Suspense, useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { isToolImplemented, toolPageRouter } from '@/features/tools/tool-router'
import { ToolBadge } from '@/features/tools/engine/components/meta/ToolBadge'
import { ToolSEOHead } from '@/features/tools/engine/components/meta/ToolSEOHead'

import { useRecentTools } from '@/hooks'
import { ROUTES } from '@/constants'

import type { ToolMeta } from '@/registry'
import { getRelatedTools, getToolBySlug } from '@/registry'

/**
 * ToolDetailPage
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Routes to the correct tool implementation page.
 *
 * Logic:
 *  1. Unknown slug          → 404
 *  2. Implemented tool      → lazy-load the tool's page component
 *  3. Coming-soon tool      → render coming-soon preview
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function ToolDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { addRecentTool } = useRecentTools()

  const tool = getToolBySlug(slug)

  // Track visit for recently used — only for implemented, active tools
  useEffect(() => {
    if (tool && isToolImplemented(slug) && tool.status === 'active') {
      addRecentTool(slug)
    }
  }, [slug, tool, addRecentTool])

  // Unknown slug — hard 404
  if (!tool) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />
  }

  // Implemented tool — render via tool router
  if (isToolImplemented(slug)) {
    const ToolPage = lazy(toolPageRouter[slug])
    return (
      <>
        <ToolSEOHead tool={tool} />
        <Suspense fallback={<ToolPageSkeleton />}>
          <ToolPage />
        </Suspense>
      </>
    )
  }

  // Coming-soon or not yet implemented
  return <ComingSoonPage tool={tool} />
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */

function ToolPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-muted rounded w-48" />
              <div className="h-8 bg-muted rounded w-72" />
              <div className="h-4 bg-muted rounded w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-64 bg-muted rounded-xl" />
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  )
}

/* ─── Coming Soon ────────────────────────────────────────────────────────── */

function ComingSoonPage({ tool }: { tool: ToolMeta }) {
  const Icon = tool.icon
  const related = getRelatedTools(tool.id).slice(0, 4)

  return (
    <>
      <ToolSEOHead tool={tool} />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Icon className="w-8 h-8" aria-hidden="true" />
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <ToolBadge variant="coming-soon" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{tool.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            {tool.description}
          </p>

          {/* Notify CTA placeholder */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={ROUTES.TOOLS}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Available Tools
            </Link>
          </div>

          {/* Related tools */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-foreground mb-4">While you wait...</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                {related.map((rel) => {
                  const RelIcon = rel.icon
                  return (
                    <Link
                      key={rel.id}
                      to={`${ROUTES.TOOLS}/${rel.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-left"
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary/10 text-primary">
                        <RelIcon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{rel.shortTitle}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
