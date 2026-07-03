import type { StructuredResultItem } from '../../types/tool-result.types'
import { ToolSuccessActions } from '../actions/ToolSuccessActions'

interface ToolStructuredResultProps {
  items: StructuredResultItem[]
  onReset: () => void
  /** Optional text to copy (e.g., summary output). */
  copyText?: string
}

/**
 * ToolStructuredResult
 * Renders a grid of key-value stat items.
 * Used by resultType: 'structured' (e.g., Word Counter output).
 */
export function ToolStructuredResult({ items, onReset, copyText }: ToolStructuredResultProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      {/* Success indicator */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
          Analysis complete
        </p>
      </div>

      {/* Stats grid */}
      <dl
        className={`grid gap-3 ${
          items.length <= 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : items.length <= 4
              ? 'grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3'
        }`}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border"
          >
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {item.label}
            </dt>
            <dd
              className={`text-2xl font-bold tabular-nums ${
                item.valueColorClass ?? 'text-primary'
              }`}
            >
              {typeof item.value === 'number'
                ? item.value.toLocaleString()
                : item.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Actions */}
      {(copyText !== undefined) && (
        <ToolSuccessActions copyText={copyText} onReset={onReset} />
      )}
      {copyText === undefined && (
        <ToolSuccessActions onReset={onReset} />
      )}
    </div>
  )
}
