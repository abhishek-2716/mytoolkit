import { createContext, type ReactNode, useContext, useState } from 'react'

import { createToolStore, type UseToolStore } from './createToolStore'

/**
 * Tool Store Context
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Distributes the isolated tool store to all engine child components
 * without prop drilling.
 *
 * The ToolEngine component:
 *  1. Creates a store instance via createToolStore() (once, in useState)
 *  2. Provides it via ToolStoreProvider
 *
 * All engine child components consume it via useToolStoreContext().
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToolStoreContext = createContext<UseToolStore<any, any> | null>(null)

ToolStoreContext.displayName = 'ToolStoreContext'

/* ─── Provider ───────────────────────────────────────────────────────────── */

interface ToolStoreProviderProps {
  children: ReactNode
}

/**
 * Creates the store instance and provides it to children.
 * The store is created once per mount — navigating away and back
 * creates a fresh store.
 */
export function ToolStoreProvider({ children }: ToolStoreProviderProps) {
  // Create the store instance exactly once per mount
  const [useStore] = useState(() => createToolStore())

  return (
    <ToolStoreContext.Provider value={useStore}>
      {children}
    </ToolStoreContext.Provider>
  )
}

/* ─── Hook ───────────────────────────────────────────────────────────── */

/**
 * Access the tool store inside any engine child component.
 * Must be called inside a ToolStoreProvider (i.e., inside ToolEngine).
 *
 * @throws if called outside a ToolEngine component tree
 *
 * @example
 * const status = useToolStoreContext()((s) => s.status)
 * const reset = useToolStoreContext()((s) => s.reset)
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useToolStoreContext<TInput = unknown, TResult = unknown>(): UseToolStore<
  TInput,
  TResult
> {
  const store = useContext(ToolStoreContext)
  if (!store) {
    throw new Error(
      '[ToolEngine] useToolStoreContext must be called inside a <ToolEngine> component tree.\n' +
        'Make sure your component is rendered as a child of ToolEngine.'
    )
  }
  return store as UseToolStore<TInput, TResult>
}
