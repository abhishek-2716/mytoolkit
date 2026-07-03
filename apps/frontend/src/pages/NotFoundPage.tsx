import { Link } from 'react-router-dom'
import { ArrowLeftIcon, HomeIcon, SearchIcon, WrenchIcon } from 'lucide-react'

import { MetaTags } from '@/components/seo'
import { ROUTES } from '@/constants'
import { getFeaturedTools } from '@/registry'

const popularTools = getFeaturedTools().slice(0, 4)

/** NotFoundPage — 404 */
export default function NotFoundPage() {
  return (
    <>
      <MetaTags
        title="Page Not Found (404)"
        description="The page you are looking for does not exist. Browse our free online tools instead."
        noIndex
      />
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">

          {/* Error code */}
          <div className="text-8xl font-extrabold text-primary/20 select-none" aria-hidden="true">
            404
          </div>

          {/* Heading */}
          <h1 className="mt-2 text-2xl font-bold text-foreground">Page not found</h1>
          <p className="mt-3 text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Primary actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <HomeIcon className="w-4 h-4" aria-hidden="true" />
              Go Home
            </Link>
            <Link
              to={ROUTES.TOOLS}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <WrenchIcon className="w-4 h-4" aria-hidden="true" />
              Browse Tools
            </Link>
            <Link
              to={ROUTES.SEARCH}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
              Search
            </Link>
          </div>

          {/* Popular tools */}
          {popularTools.length > 0 && (
            <div className="mt-12">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Popular Tools
              </p>
              <div className="grid grid-cols-2 gap-2">
                {popularTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.id}
                      to={`${ROUTES.TOOLS}/${tool.slug}`}
                      className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary/30 transition-colors text-left"
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium text-foreground truncate">{tool.shortTitle}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Back link */}
          <button
            type="button"
            onClick={() => { window.history.back() }}
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" aria-hidden="true" />
            Go back
          </button>
        </div>
      </main>
    </>
  )
}
