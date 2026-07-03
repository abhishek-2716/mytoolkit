import {
  type CSSProperties,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react'

import { cn } from '@/utils'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  /** The tooltip content. */
  content: ReactNode
  /** The trigger element. */
  children: ReactNode
  /** Preferred placement. Falls back to 'top' when it doesn't fit. */
  placement?: TooltipPlacement
  /** Delay before showing (ms). */
  delay?: number
  /** Delay before hiding (ms). */
  hideDelay?: number
  /** Extra class names on the tooltip bubble. */
  className?: string
  /** When true, the tooltip is disabled entirely. */
  disabled?: boolean
}

const PLACEMENT_CLASSES: Record<TooltipPlacement, { bubble: string; arrow: string }> = {
  top:    { bubble: 'bottom-full left-1/2 -translate-x-1/2 mb-2', arrow: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent' },
  bottom: { bubble: 'top-full left-1/2 -translate-x-1/2 mt-2',   arrow: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent' },
  left:   { bubble: 'right-full top-1/2 -translate-y-1/2 mr-2',  arrow: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent' },
  right:  { bubble: 'left-full top-1/2 -translate-y-1/2 ml-2',   arrow: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent' },
}

/**
 * Tooltip
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Accessible tooltip that appears on hover and focus.
 *
 * - Uses aria-describedby to associate the tooltip with the trigger
 * - Keyboard accessible: shows on focus, hides on blur / Escape
 * - Configurable placement and delay
 * - Does NOT trap focus
 *
 * @example
 * <Tooltip content="Copy to clipboard">
 *   <IconButton icon={Copy} aria-label="Copy" />
 * </Tooltip>
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 400,
  hideDelay = 100,
  className,
  disabled = false,
}: TooltipProps) {
  const tooltipId = useId()
  const [visible, setVisible] = useState(false)
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (disabled) return
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    showTimerRef.current = setTimeout(() => { setVisible(true) }, delay)
  }

  const hide = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    hideTimerRef.current = setTimeout(() => { setVisible(false) }, hideDelay)
  }

  const { bubble, arrow } = PLACEMENT_CLASSES[placement]

  const tooltipStyle: CSSProperties = { zIndex: 9999 }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Trigger — cloned with aria-describedby */}
      <span aria-describedby={visible ? tooltipId : undefined}>
        {children}
      </span>

      {/* Tooltip bubble */}
      {visible && !disabled && (
        <span
          id={tooltipId}
          role="tooltip"
          style={tooltipStyle}
          className={cn(
            'pointer-events-none absolute whitespace-nowrap',
            'rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-lg',
            'bg-foreground text-background',
            'animate-in fade-in-0 zoom-in-95 duration-100',
            bubble,
            className
          )}
        >
          {content}
          {/* Arrow */}
          <span
            className={cn(
              'absolute border-4 border-foreground',
              arrow
            )}
          />
        </span>
      )}
    </span>
  )
}
