import type { ReactNode } from 'react'

import type { LayoutMode } from '../../types/tool-result.types'

interface ToolBodyProps {
  /** The input zone (left/top). */
  inputSlot: ReactNode
  /** The result zone (right/bottom). */
  resultSlot: ReactNode
  layoutMode: LayoutMode
}

/**
 * ToolBody
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Manages the layout of input and result zones.
 *
 *  'split' — input and result side by side (text tools)
 *  'stack' — input on top, result below (file tools)
 *  'form'  — form on left, result on right (generator tools)
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolBody({ inputSlot, resultSlot, layoutMode }: ToolBodyProps) {
  if (layoutMode === 'stack') {
    return (
      <div className="space-y-6">
        <section aria-label="Input">{inputSlot}</section>
        <section aria-label="Result">{resultSlot}</section>
      </div>
    )
  }

  // 'split' and 'form' both use a two-column layout on larger screens
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section aria-label="Input">{inputSlot}</section>
      <section aria-label="Result">{resultSlot}</section>
    </div>
  )
}
