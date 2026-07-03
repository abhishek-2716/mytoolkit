import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRightIcon, ClockIcon, SearchIcon, TrendingUpIcon, XIcon } from 'lucide-react'

import { useRecentSearches } from '@/features/tools/discovery/hooks/useRecentSearches'

import { useDebounce } from '@/hooks'

import { cn } from '@/utils'
import { buildToolPath, ROUTES } from '@/constants'

import type { ToolMeta } from '@/registry'
import { getPopularTools, searchTools } from '@/registry'

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

/* ─── Highlight helper ───────────────────────────────────────────────────── */

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary rounded-sm font-semibold not-italic px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

/* ─── Popular searches ───────────────────────────────────────────────────── */

const POPULAR_SEARCHES = ['JSON', 'PDF', 'UUID', 'Image', 'Hash', 'QR Code', 'Base64', 'Regex']

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * GlobalSearchModal
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Command-palette–style search modal.
 *
 * Features:
 *  - Live search suggestions with text highlighting
 *  - Keyboard navigation: ↑/↓ to move, Enter to open, Escape to close
 *  - Enter on exact title match → navigates directly to tool page
 *  - Enter on partial match → navigates to search results page
 *  - Recent searches (persisted in localStorage)
 *  - Popular search chips
 *  - Accessible: focus trap, ARIA combobox, role=listbox
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const navigate = useNavigate()
  const inputId = useId()
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLUListElement>(null)

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const debouncedQuery = useDebounce(query, 150)
  const { searches: recentSearches, addSearch, removeSearch } = useRecentSearches()

  /* ── Compute results ─────────────────────────────────────────────────── */
  const results: ToolMeta[] = useMemo(
    () => debouncedQuery.trim().length >= 1 ? searchTools(debouncedQuery, 8) : [],
    [debouncedQuery]
  )

  const popularTools = useMemo(() => getPopularTools().slice(0, 6), [])
  const showResults = debouncedQuery.trim().length >= 1
  const hasResults = results.length > 0
  const totalItems = showResults ? results.length : 0

  /* ── Reset state on open ─────────────────────────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(-1)
      // Defer focus to next tick to avoid scroll issues
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isOpen])

  /* ── Global Ctrl+K / Cmd+K shortcut ──────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        }
        // Opening is handled by the parent
      }
    }
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('keydown', handler); }
  }, [isOpen, onClose])

  /* ── Scroll active item into view ────────────────────────────────────── */
  useEffect(() => {
    if (activeIndex < 0 || !resultsRef.current) return
    const items = resultsRef.current.querySelectorAll('[role="option"]')
    const item = items[activeIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  /* ── Navigation helpers ──────────────────────────────────────────────── */
  const navigateToTool = useCallback(
    (tool: ToolMeta) => {
      addSearch(tool.title)
      onClose()
      void navigate(buildToolPath(tool.slug))
    },
    [addSearch, navigate, onClose]
  )

  const navigateToSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return
      addSearch(q.trim())
      onClose()
      void navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(q.trim())}`)
    },
    [addSearch, navigate, onClose]
  )

  const handleSubmit = useCallback(() => {
    if (activeIndex >= 0 && results[activeIndex]) {
      navigateToTool(results[activeIndex])
      return
    }

    if (!query.trim()) return

    // Exact match: navigate directly to tool
    const q = query.trim().toLowerCase()
    const exactMatch = results.find((t) => t.title.toLowerCase() === q || t.slug === q)
    if (exactMatch) {
      navigateToTool(exactMatch)
      return
    }

    // First result: navigate directly if very close match
    if (results.length === 1) {
      navigateToTool(results[0])
      return
    }

    // Otherwise: go to search results page
    navigateToSearch(query)
  }, [activeIndex, query, results, navigateToTool, navigateToSearch])

  /* ── Keyboard handler ────────────────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
          break
        case 'Enter':
          e.preventDefault()
          handleSubmit()
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [totalItems, handleSubmit, onClose]
  )

  /* ── Backdrop click ──────────────────────────────────────────────────── */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) { onClose() }
    },
    [onClose]
  )

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4',
            'bg-black/50 backdrop-blur-sm'
          )}
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-label="Search tools"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'w-full max-w-xl rounded-2xl shadow-2xl border border-border',
              'bg-background overflow-hidden'
            )}
            role="search"
          >
            {/* ── Input row ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <SearchIcon
                size={18}
                className="shrink-0 text-foreground-muted"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id={inputId}
                type="search"
                role="combobox"
                aria-expanded={showResults && hasResults}
                aria-controls={listboxId}
                aria-activedescendant={
                  activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
                }
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(-1)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search 150+ tools…"
                className={cn(
                  'flex-1 bg-transparent text-foreground placeholder:text-foreground-muted',
                  'text-base outline-none border-none ring-0',
                  '[&::-webkit-search-cancel-button]:hidden'
                )}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setActiveIndex(-1)
                    inputRef.current?.focus()
                  }}
                  className="shrink-0 p-1 rounded-md text-foreground-muted hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Clear search"
                >
                  <XIcon size={16} aria-hidden="true" />
                </button>
              )}
              <kbd
                aria-hidden="true"
                className="hidden sm:inline-flex shrink-0 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground-muted"
              >
                Esc
              </kbd>
            </div>

            {/* ── Results / Default panel ────────────────────────────────── */}
            <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
              {showResults ? (
                /* ── Search results ── */
                hasResults ? (
                  <ul
                    ref={resultsRef}
                    id={listboxId}
                    role="listbox"
                    aria-label="Search results"
                    className="py-2"
                  >
                    {results.map((tool, i) => {
                      const Icon = tool.icon
                      return (
                        <li key={tool.id} role="none">
                          <button
                            id={`search-result-${i}`}
                            role="option"
                            aria-selected={activeIndex === i}
                            type="button"
                            onClick={() => { navigateToTool(tool) }}
                            onMouseEnter={() => { setActiveIndex(i) }}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                              'transition-colors duration-100',
                              activeIndex === i
                                ? 'bg-primary/8 text-foreground'
                                : 'hover:bg-muted/60 text-foreground'
                            )}
                          >
                            {/* Icon */}
                            <span
                              className={cn(
                                'shrink-0 flex items-center justify-center w-8 h-8 rounded-lg',
                                'bg-primary/10 text-primary'
                              )}
                              aria-hidden="true"
                            >
                              <Icon size={16} />
                            </span>

                            {/* Text */}
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-medium text-foreground truncate">
                                <HighlightText text={tool.shortTitle} query={debouncedQuery} />
                              </span>
                              <span className="block text-xs text-foreground-muted truncate mt-0.5">
                                <HighlightText
                                  text={tool.shortDescription}
                                  query={debouncedQuery}
                                />
                              </span>
                            </span>

                            {/* Badges */}
                            <span className="shrink-0 flex items-center gap-1.5">
                              {tool.status === 'coming-soon' && (
                                <span className="text-[10px] font-medium text-foreground-muted bg-muted px-1.5 py-0.5 rounded-full">
                                  Soon
                                </span>
                              )}
                              {tool.isNew && (
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                              {tool.isPopular && (
                                <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded-full">
                                  Popular
                                </span>
                              )}
                              <ArrowRightIcon
                                size={12}
                                className={cn(
                                  'text-foreground-muted transition-transform duration-100',
                                  activeIndex === i ? 'translate-x-0.5' : ''
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </button>
                        </li>
                      )
                    })}

                    {/* View all results */}
                    <li role="none" className="border-t border-border mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => { navigateToSearch(query) }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                          'hover:bg-muted/60 transition-colors duration-100'
                        )}
                      >
                        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-foreground-muted">
                          <SearchIcon size={16} aria-hidden="true" />
                        </span>
                        <span className="flex-1 text-sm text-foreground-secondary">
                          Search all tools for{' '}
                          <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
                        </span>
                        <ArrowRightIcon size={12} className="text-foreground-muted" aria-hidden="true" />
                      </button>
                    </li>
                  </ul>
                ) : (
                  /* ── No results ── */
                  <div className="px-4 py-8 text-center space-y-4">
                    <p className="text-sm font-medium text-foreground">
                      No tool found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-foreground-muted">Try searching:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {POPULAR_SEARCHES.slice(0, 5).map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => { setQuery(term) }}
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
                    <button
                      type="button"
                      onClick={() => { navigateToSearch(query) }}
                      className="text-xs text-primary hover:underline"
                    >
                      Browse all tools →
                    </button>
                  </div>
                )
              ) : (
                /* ── Default panel: recent + popular ── */
                <div className="py-3 space-y-1">
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div className="px-4 pb-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                          Recent
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            recentSearches.forEach((s) => { removeSearch(s); })
                          }}
                          className="text-[11px] text-foreground-muted hover:text-foreground transition-colors"
                          aria-label="Clear recent searches"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.slice(0, 5).map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => { setQuery(term) }}
                            className={cn(
                              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs',
                              'bg-muted text-foreground-secondary border border-border',
                              'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
                              'transition-colors duration-150'
                            )}
                          >
                            <ClockIcon size={10} aria-hidden="true" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular tools */}
                  <div className="px-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted mb-1.5 flex items-center gap-1.5">
                      <TrendingUpIcon size={11} aria-hidden="true" />
                      Popular
                    </p>
                    <ul>
                      {popularTools.map((tool) => {
                        const Icon = tool.icon
                        return (
                          <li key={tool.id}>
                            <button
                              type="button"
                              onClick={() => { navigateToTool(tool) }}
                              className={cn(
                                'w-full flex items-center gap-3 py-2 text-left',
                                'hover:text-primary transition-colors duration-100 group'
                              )}
                            >
                              <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary" aria-hidden="true">
                                <Icon size={14} />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block text-sm font-medium text-foreground group-hover:text-primary truncate transition-colors">
                                  {tool.shortTitle}
                                </span>
                              </span>
                              <ArrowRightIcon size={11} className="shrink-0 text-foreground-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* Popular search chips */}
                  <div className="px-4 pt-2 pb-1 border-t border-border/50">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted mb-2">
                      Try searching
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => { setQuery(term) }}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium',
                            'bg-muted/60 text-foreground-secondary border border-border',
                            'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
                            'transition-colors duration-150'
                          )}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <div className="px-4 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-[11px] text-foreground-muted" aria-hidden="true">
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">↑</kbd>
                  <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
                  open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
                  close
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] text-foreground-muted hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      </>
    </AnimatePresence>,
    document.body
  )
}
