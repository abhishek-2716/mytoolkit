import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from 'lucide-react'

import { cn } from '@/utils'

import { IconButton } from '../common/IconButton'
import {
  BACKDROP_ANIMATION,
  DRAWER_ANIMATIONS,
  type DrawerPlacement,
  type DrawerSize,
  drawerVariants,
} from './overlayVariants'
import { useFocusTrap } from './useOverlay'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  /** Side to slide in from. @default 'right' */
  placement?: DrawerPlacement
  /** Width (left/right) or height (top/bottom) preset. @default 'md' */
  size?: DrawerSize
  /** ID matching the DrawerHeader title for aria-labelledby */
  titleId?: string
  /** Close on backdrop click. @default true */
  closeOnBackdrop?: boolean
  /** Close on Escape. @default true */
  closeOnEscape?: boolean
  children: React.ReactNode
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Drawer — a slide-in panel overlay for secondary content and navigation.
 *
 * Renders into a portal. Traps focus. Locks scroll. Accessible.
 *
 * @example
 * const drawer = useDrawer()
 *
 * <Button onClick={drawer.open}>Settings</Button>
 *
 * <Drawer isOpen={drawer.isOpen} onClose={drawer.close} placement="right">
 *   <DrawerHeader onClose={drawer.close} titleId={drawer.titleId}>
 *     <DrawerTitle>Settings</DrawerTitle>
 *   </DrawerHeader>
 *   <DrawerBody>…settings content…</DrawerBody>
 *   <DrawerFooter>
 *     <Button onClick={drawer.close}>Done</Button>
 *   </DrawerFooter>
 * </Drawer>
 */
export function Drawer({
  isOpen,
  onClose,
  placement = 'right',
  size = 'md',
  titleId,
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className,
}: DrawerProps) {
  const { containerRef, handleKeyDown } = useFocusTrap(isOpen)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      requestAnimationFrame(() => containerRef.current?.focus())
    } else {
      previousFocusRef.current?.focus()
    }
  }, [isOpen, containerRef])

  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      handleKeyDown(e)
    },
    [closeOnEscape, onClose, handleKeyDown],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleGlobalKeyDown])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="drawer-backdrop"
          className="fixed inset-0 z-[var(--z-modal-backdrop)]"
          {...BACKDROP_ANIMATION}
        >
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-overlay"
            aria-hidden="true"
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            key="drawer-panel"
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              'z-[var(--z-modal)] focus:outline-none',
              drawerVariants({ placement, size, className }),
            )}
            {...DRAWER_ANIMATIONS[placement]}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

Drawer.displayName = 'Drawer'

/* ─── DrawerHeader ───────────────────────────────────────────────────────── */

export interface DrawerHeaderProps {
  titleId?: string
  onClose?: () => void
  children: React.ReactNode
  className?: string
}

export function DrawerHeader({ titleId, onClose, children, className }: DrawerHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-5 py-4 border-b border-border shrink-0',
        className,
      )}
    >
      <div id={titleId} className="min-w-0 flex-1">
        {children}
      </div>
      {onClose != null && (
        <IconButton
          icon={XIcon}
          aria-label="Close drawer"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="shrink-0"
        />
      )}
    </div>
  )
}

DrawerHeader.displayName = 'DrawerHeader'

/* ─── DrawerTitle ────────────────────────────────────────────────────────── */

export type DrawerTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export function DrawerTitle({ className, children, ...props }: DrawerTitleProps) {
  return (
    <h2
      className={cn('text-h5 font-semibold text-foreground leading-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

DrawerTitle.displayName = 'DrawerTitle'

/* ─── DrawerBody ─────────────────────────────────────────────────────────── */

export type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>

export function DrawerBody({ className, children, ...props }: DrawerBodyProps) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto px-5 py-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}

DrawerBody.displayName = 'DrawerBody'

/* ─── DrawerFooter ───────────────────────────────────────────────────────── */

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'between'
}

const DRAWER_FOOTER_ALIGN: Record<NonNullable<DrawerFooterProps['align']>, string> = {
  start:   'justify-start',
  end:     'justify-end',
  between: 'justify-between',
}

export function DrawerFooter({ align = 'end', className, children, ...props }: DrawerFooterProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 px-5 py-4 border-t border-border shrink-0',
        DRAWER_FOOTER_ALIGN[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

DrawerFooter.displayName = 'DrawerFooter'
