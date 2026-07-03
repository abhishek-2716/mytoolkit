import { type KeyboardEvent, useCallback, useId, useMemo, useRef } from 'react'

import type { ToolCategorySlug } from '@/constants'

import { activeCategories } from '@/registry'

interface CategoryFilterTabsProps {
  selected: ToolCategorySlug | null
  onChange: (slug: ToolCategorySlug | null) => void
  /** Whether to show tool counts per category. Default: true */
  showCounts?: boolean
  /** Tool count per category slug. */
  counts?: Partial<Record<ToolCategorySlug, number>>
}

/**
 * CategoryFilterTabs
 * ══════════════════════════════════════════════════════════════════════════
 *
 * A horizontal scrollable filter bar for category filtering.
 *
 * Features:
 *  - "All" tab shows the total count
 *  - Per-category counts (optional)
 *  - Keyboard navigation: Left/Right arrows, Home/End
 *  - Active tab indicator (animated underline)
 *  - Overflow scroll on narrow screens with fade edges
 *  - ARIA: role="tablist" with proper tab/tabpanel semantics
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function CategoryFilterTabs({
  selected,
  onChange,
  showCounts = true,
  counts = {},
}: CategoryFilterTabsProps) {
  const tablistId = useId()
  const tablistRef = useRef<HTMLDivElement>(null)

  const allCount = Object.values(counts).reduce((sum, n) => sum + n, 0)

  const categories = activeCategories

  // Build tab items: "All" + each active category
  const tabs = useMemo(() => [
    { id: 'all', label: 'All Tools', count: allCount || undefined, slug: null as ToolCategorySlug | null },
    ...categories.map((cat) => ({
      id: cat.slug,
      label: cat.shortName,
      count: counts[cat.slug],
      slug: cat.slug,
    })),
  ], [allCount, categories, counts])

  const currentIndex = selected === null ? 0 : tabs.findIndex((t) => t.slug === selected)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null

      if (e.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length
      } else if (e.key === 'Home') {
        nextIndex = 0
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1
      } else {
        return
      }

      e.preventDefault()
      const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]')
      buttons?.[nextIndex]?.focus()
      onChange(tabs[nextIndex].slug)
    },
    [tabs, onChange]
  )

  return (
    <div className="relative">
      {/* Fade edges on overflow */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10"
        aria-hidden="true"
      />

      {/* Scrollable tab list */}
      <div
        ref={tablistRef}
        role="tablist"
        id={tablistId}
        aria-label="Filter tools by category"
        className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 px-1"
      >
        {tabs.map((tab, i) => {
          const isSelected = i === currentIndex
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => { onChange(tab.slug); }}
              onKeyDown={(e) => { handleKeyDown(e, i); }}
              className={[
                'flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {tab.label}
              {showCounts && tab.count !== undefined && tab.count > 0 && (
                <span
                  className={[
                    'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold tabular-nums',
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted-foreground/20 text-muted-foreground',
                  ].join(' ')}
                  aria-label={`${tab.count} tools`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
