import { forwardRef } from 'react'
import { SearchIcon } from 'lucide-react'

import { Input, type InputProps } from './Input'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SearchInputProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  /**
   * Called when Enter is pressed in the search field.
   * Useful for triggering a search when the user presses Return.
   * Note: real-time search should use `onChange` instead.
   */
  onSearch?: (value: string) => void
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * SearchInput — a text input styled for search interactions.
 *
 * Features:
 *  - Search icon on the left
 *  - Clear button appears when the field has content (`clearable`)
 *  - `onSearch` callback fires when Enter is pressed
 *  - Correct `type="search"` semantics + `role="searchbox"` is derived from type
 *
 * Do NOT implement search logic here — connect to a search provider in
 * the feature layer.
 *
 * @example
 * // Basic search field
 * <SearchInput placeholder="Search tools…" />
 *
 * @example
 * // Controlled with clear and Enter handler
 * <SearchInput
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery('')}
 *   onSearch={(q) => router.push(`/search?q=${q}`)}
 *   clearable
 * />
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { onSearch, onKeyDown, ...props },
  ref
) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch((e.target as HTMLInputElement).value)
    }
    onKeyDown?.(e)
  }

  return (
    <Input
      ref={ref}
      type="search"
      leftIcon={SearchIcon}
      clearable={props.clearable ?? true}
      autoComplete="off"
      spellCheck={false}
      onKeyDown={handleKeyDown}
      aria-label={props['aria-label'] ?? 'Search'}
      {...props}
    />
  )
})

SearchInput.displayName = 'SearchInput'
