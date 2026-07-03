import { useEffect,useId, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface ToolSearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  isSearching?: boolean
  placeholder?: string
  /** Focus the input on mount (uses useEffect, not raw autoFocus). */
  focusOnMount?: boolean
  /** Size variant. Default: 'md' */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ToolSearchBar
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Reusable search input for tool discovery.
 *
 * Features:
 *  - Animated search icon
 *  - Clear button (only shown when value is non-empty)
 *  - Loading spinner when isSearching is true
 *  - Keyboard: Escape clears the field
 *  - ARIA: combobox role with live region for result count announcements
 *  - Three size variants: sm (compact header), md (page filter), lg (hero)
 *
 * Architecture:
 *  This component is purely presentational. It delegates:
 *  - Debouncing → useToolSearch hook (in the parent)
 *  - URL state sync → useToolFilters hook (in the parent)
 *  - Result fetching → searchTools() from registry
 *  This keeps the component swappable when backend search is introduced.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolSearchBar({
  value,
  onChange,
  onClear,
  isSearching = false,
  placeholder = 'Search tools...',
  focusOnMount = false,
  size = 'md',
}: ToolSearchBarProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusOnMount) {
      inputRef.current?.focus()
    }
  }, [focusOnMount])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClear()
      inputRef.current?.blur()
    }
  }

  const sizeClasses = {
    sm: { wrapper: 'h-9', icon: 'w-4 h-4 left-2.5', input: 'pl-8 pr-8 text-sm', clear: 'right-2' },
    md: { wrapper: 'h-11', icon: 'w-5 h-5 left-3', input: 'pl-10 pr-10 text-sm', clear: 'right-2.5' },
    lg: { wrapper: 'h-14', icon: 'w-6 h-6 left-4', input: 'pl-12 pr-12 text-base', clear: 'right-3' },
  }[size]

  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>

      {/* Search icon or spinner */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${sizeClasses.icon} text-muted-foreground pointer-events-none`}
        aria-hidden="true"
      >
        {isSearching ? (
          <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <Search />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        role="combobox"
        aria-expanded="false"
        aria-controls={`${inputId}-listbox`}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck="false"
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={[
          `${sizeClasses.wrapper} w-full rounded-xl border border-border bg-background`,
          `${sizeClasses.input} text-foreground placeholder:text-muted-foreground`,
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
          'transition-all duration-150',
        ].join(' ')}
      />

      {/* Clear button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className={`absolute top-1/2 -translate-y-1/2 ${sizeClasses.clear} p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors`}
          aria-label="Clear search"
        >
          <X className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
      )}
    </div>
  )
}
