import { useCallback, useId, useRef, useState } from 'react'

/* ─── useModal ───────────────────────────────────────────────────────────── */

export interface UseModalOptions {
  /** Initial open state */
  defaultOpen?: boolean
  /** Called when the modal requests to close (Escape, backdrop click, X) */
  onClose?: () => void
}

export interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  /** Stable IDs for aria-labelledby / aria-describedby wiring */
  titleId: string
  descriptionId: string
}

/**
 * useModal — state + accessibility ID management for Modal.
 *
 * @example
 * const modal = useModal()
 * // …
 * <Button onClick={modal.open}>Open</Button>
 * <Modal isOpen={modal.isOpen} onClose={modal.close} titleId={modal.titleId}>…</Modal>
 */
export function useModal({
  defaultOpen = false,
  onClose,
}: UseModalOptions = {}): UseModalReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const uid = useId()

  const open = useCallback(() => { setIsOpen(true); }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  const toggle = useCallback(() => { setIsOpen((v) => !v); }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
    titleId: `${uid}-title`,
    descriptionId: `${uid}-desc`,
  }
}

/* ─── useDrawer ──────────────────────────────────────────────────────────── */

export interface UseDrawerOptions {
  defaultOpen?: boolean
  onClose?: () => void
}

export interface UseDrawerReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  titleId: string
}

/**
 * useDrawer — state management for Drawer.
 *
 * @example
 * const drawer = useDrawer()
 * <Button onClick={drawer.open}>Open drawer</Button>
 * <Drawer isOpen={drawer.isOpen} onClose={drawer.close} titleId={drawer.titleId}>…</Drawer>
 */
export function useDrawer({
  defaultOpen = false,
  onClose,
}: UseDrawerOptions = {}): UseDrawerReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const uid = useId()

  const open = useCallback(() => { setIsOpen(true); }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  const toggle = useCallback(() => { setIsOpen((v) => !v); }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
    titleId: `${uid}-drawer-title`,
  }
}

/* ─── useFocusTrap ───────────────────────────────────────────────────────── */

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ')

/**
 * Returns a ref to attach to the trap container.
 * Automatically traps Tab / Shift+Tab focus within the container.
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active || e.key !== 'Tab' || !containerRef.current) return

      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      ).filter((el) => !el.closest('[aria-hidden="true"]'))

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [active],
  )

  return { containerRef, handleKeyDown }
}
