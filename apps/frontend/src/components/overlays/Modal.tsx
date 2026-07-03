import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from 'lucide-react'

import { cn } from '@/utils'

import { IconButton } from '../common/IconButton'
import {
  BACKDROP_ANIMATION,
  MODAL_ANIMATION,
  type ModalSize,
  modalVariants,
} from './overlayVariants'
import { useFocusTrap } from './useOverlay'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ModalProps {
  /** Controls open/closed state */
  isOpen: boolean
  /** Called when the modal should close */
  onClose: () => void
  /**
   * ID that matches the ModalHeader's title element.
   * Wire this from useModal().titleId for full accessibility.
   */
  titleId?: string
  /**
   * ID that matches the ModalBody description element.
   * Wire this from useModal().descriptionId for full accessibility.
   */
  descriptionId?: string
  /** Width preset. @default 'md' */
  size?: ModalSize
  /**
   * Close on backdrop click. @default true
   */
  closeOnBackdrop?: boolean
  /**
   * Close on Escape key. @default true
   */
  closeOnEscape?: boolean
  /** Content rendered inside the modal panel */
  children: React.ReactNode
  /** Additional classes on the panel */
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Modal — an accessible dialog overlay.
 *
 * Renders into a portal at document.body. Traps focus. Locks scroll.
 * Closes on Escape and optional backdrop click.
 *
 * Compose with ModalHeader, ModalBody, ModalFooter for standard layout.
 *
 * @example
 * const modal = useModal()
 *
 * <Button onClick={modal.open}>Open</Button>
 *
 * <Modal isOpen={modal.isOpen} onClose={modal.close} titleId={modal.titleId}>
 *   <ModalHeader onClose={modal.close} titleId={modal.titleId}>
 *     <ModalTitle>Confirm deletion</ModalTitle>
 *   </ModalHeader>
 *   <ModalBody>
 *     <p>This action cannot be undone.</p>
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button variant="ghost" onClick={modal.close}>Cancel</Button>
 *     <Button variant="danger">Delete</Button>
 *   </ModalFooter>
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  titleId,
  descriptionId,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className,
}: ModalProps) {
  const { containerRef, handleKeyDown } = useFocusTrap(isOpen)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Save + restore focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus the dialog container on next tick
      requestAnimationFrame(() => containerRef.current?.focus())
    } else {
      previousFocusRef.current?.focus()
    }
  }, [isOpen, containerRef])

  // Keyboard handler
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
        // Backdrop
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4"
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
            key="modal-panel"
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className={cn(
              'relative z-[var(--z-modal)]',
              'focus:outline-none',
              modalVariants({ size, className }),
            )}
            {...MODAL_ANIMATION}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

Modal.displayName = 'Modal'

/* ─── ModalHeader ────────────────────────────────────────────────────────── */

export interface ModalHeaderProps {
  /** ID to apply to the heading — must match Modal's titleId prop */
  titleId?: string
  /** Show close (×) button */
  onClose?: () => void
  children: React.ReactNode
  className?: string
}

export function ModalHeader({ titleId, onClose, children, className }: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 px-6 py-4 border-b border-border shrink-0',
        className,
      )}
    >
      <div id={titleId} className="min-w-0 flex-1">
        {children}
      </div>
      {onClose != null && (
        <IconButton
          icon={XIcon}
          aria-label="Close dialog"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="shrink-0 -mr-1 -mt-0.5"
        />
      )}
    </div>
  )
}

ModalHeader.displayName = 'ModalHeader'

/* ─── ModalTitle ─────────────────────────────────────────────────────────── */

export type ModalTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export function ModalTitle({ className, children, ...props }: ModalTitleProps) {
  return (
    <h2
      className={cn('text-h5 font-semibold text-foreground leading-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

ModalTitle.displayName = 'ModalTitle'

/* ─── ModalBody ──────────────────────────────────────────────────────────── */

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ID to apply — must match Modal's descriptionId when body is the description */
  descriptionId?: string
}

export function ModalBody({ descriptionId, className, children, ...props }: ModalBodyProps) {
  return (
    <div
      id={descriptionId}
      className={cn('flex-1 overflow-y-auto px-6 py-5 text-body-md text-foreground-secondary', className)}
      {...props}
    >
      {children}
    </div>
  )
}

ModalBody.displayName = 'ModalBody'

/* ─── ModalFooter ────────────────────────────────────────────────────────── */

export type ModalFooterAlign = 'start' | 'end' | 'between' | 'center'

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alignment of footer actions. @default 'end' */
  align?: ModalFooterAlign
}

const MODAL_FOOTER_ALIGN: Record<ModalFooterAlign, string> = {
  start:   'justify-start',
  end:     'justify-end',
  between: 'justify-between',
  center:  'justify-center',
}

export function ModalFooter({ align = 'end', className, children, ...props }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 px-6 py-4 border-t border-border shrink-0',
        MODAL_FOOTER_ALIGN[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

ModalFooter.displayName = 'ModalFooter'
