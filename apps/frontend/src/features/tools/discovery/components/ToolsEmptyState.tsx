import { SearchIcon } from 'lucide-react'

import { cn } from '@/utils'
import { ROUTES } from '@/constants'

interface ToolsEmptyStateProps {
  query?: string
  categoryName?: string
  onClear: () => void
  onSearch?: (term: string) => void
}

const SUGGESTIONS = ['JSON', 'CSV', 'PDF', 'UUID', 'Image', 'Hash', 'QR Code', 'Base64']

/**
 * ToolsEmptyState
 * Shown when search or filter returns no results.
 * Includes popular search suggestions for quick recovery.
 */
export function ToolsEmptyState({ query, categoryName, onClear, onSearch }: ToolsEmptyStateProps) {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasFilter = query || categoryName

  const handleSuggestion = (term: string) => {
    if (onSearch) {
      onSearch(term)
    } else {
      onClear()
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <SearchIcon className="w-8 h-8 text-foreground-muted" aria-hidden="true" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        {query ? (
          <>
            <p className="text-base font-semibold text-foreground">
              No tool found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-foreground-muted">
              Try a different search term or browse by category.
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-foreground">
              No tools in{' '}
              {categoryName ? (
                <span className="capitalize">{categoryName}</span>
              ) : (
                'this category'
              )}{' '}
              yet
            </p>
            <p className="text-sm text-foreground-muted">
              New tools are added regularly. Check back soon!
            </p>
          </>
        )}
      </div>

      {/* Suggestions */}
      {query && (
        <div className="space-y-2">
          <p className="text-xs text-foreground-muted">Try searching:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => { handleSuggestion(term) }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  'bg-muted text-foreground-secondary border border-border',
                  'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
                  'transition-colors duration-150'
                )}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {hasFilter && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
              'bg-primary text-primary-foreground text-sm font-medium',
              'hover:bg-primary/90 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
            )}
          >
            Clear filters
          </button>
        )}
        <a
          href={ROUTES.TOOLS}
          className={cn(
            'text-sm font-medium text-primary hover:underline',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded'
          )}
        >
          Browse all tools →
        </a>
      </div>
    </div>
  )
}

