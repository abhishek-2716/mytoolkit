import { type KeyboardEvent, type ReactNode, useId, useState } from 'react'

import { cn } from '@/utils'

export interface TabItem {
  /** Unique tab identifier. */
  id: string
  /** Display label. */
  label: ReactNode
  /** Tab panel content. */
  content: ReactNode
  /** When true, the tab is not interactive. */
  disabled?: boolean
}

interface TabsProps {
  /** List of tabs. */
  items: TabItem[]
  /** Controlled active tab id. */
  activeId?: string
  /** Uncontrolled default active tab. Defaults to first tab. */
  defaultActiveId?: string
  /** Called when the active tab changes. */
  onChange?: (id: string) => void
  /** ARIA label for the tablist. */
  'aria-label'?: string
  className?: string
  /** Tab header bar class names. */
  tabListClassName?: string
  /** Tab panel class names. */
  panelClassName?: string
}

/**
 * Tabs
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Accessible tab interface.
 *
 * - Supports both controlled and uncontrolled modes
 * - ARIA: role="tablist", role="tab", role="tabpanel"
 * - Keyboard: Arrow Left/Right to navigate, Home/End, Space/Enter to activate
 * - Focus management: activated tab receives focus
 *
 * @example
 * // Uncontrolled
 * <Tabs items={[
 *   { id: 'a', label: 'Tab A', content: <p>Content A</p> },
 *   { id: 'b', label: 'Tab B', content: <p>Content B</p> },
 * ]} />
 *
 * // Controlled
 * <Tabs
 *   items={items}
 *   activeId={activeTab}
 *   onChange={setActiveTab}
 * />
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function Tabs({
  items,
  activeId,
  defaultActiveId,
  onChange,
  'aria-label': ariaLabel = 'Tabs',
  className,
  tabListClassName,
  panelClassName,
}: TabsProps) {
  const baseId = useId()

  const isControlled = activeId !== undefined
  // Internal state only used in uncontrolled mode
  const [internalActive, setInternalActive] = useState(
    () => defaultActiveId ?? items.at(0)?.id ?? ''
  )

  const currentId = isControlled ? activeId : internalActive

  const activateTab = (id: string) => {
    if (!isControlled) setInternalActive(id)
    onChange?.(id)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const activeTabs = items.filter((t) => !t.disabled)
    const currentTabIndex = activeTabs.findIndex((t) => t.id === currentId)

    let nextIndex: number

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentTabIndex + 1) % activeTabs.length
        break
      case 'ArrowLeft':
        nextIndex = (currentTabIndex - 1 + activeTabs.length) % activeTabs.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = activeTabs.length - 1
        break
      default:
        return
    }

    e.preventDefault()
    const nextTab = activeTabs[nextIndex]
    activateTab(nextTab.id)
    document.getElementById(`${baseId}-tab-${nextTab.id}`)?.focus()
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Tab list */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          'flex items-center gap-1 border-b border-border',
          tabListClassName
        )}
      >
        {items.map((tab) => {
          const isActive = tab.id === currentId
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              aria-disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => { if (!tab.disabled) activateTab(tab.id) }}
              onKeyDown={handleKeyDown}
              className={cn(
                'relative inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium -mb-px transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-t-md',
                isActive
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab panels */}
      {items.map((tab) => {
        const isActive = tab.id === currentId
        return (
          <div
            key={tab.id}
            id={`${baseId}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={!isActive}
            tabIndex={0}
            className={cn(
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              panelClassName
            )}
          >
            {isActive && tab.content}
          </div>
        )
      })}
    </div>
  )
}
