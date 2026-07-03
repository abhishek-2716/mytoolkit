import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, XIcon } from 'lucide-react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

/* ─── Context ────────────────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null)

/* ─── Toast item ─────────────────────────────────────────────────────────── */

const ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle2Icon,
  error: AlertCircleIcon,
  info: InfoIcon,
}

const STYLES: Record<ToastVariant, string> = {
  success: 'bg-success/10 border-success/30 text-success',
  error: 'bg-danger/10 border-danger/30 text-danger',
  info: 'bg-info/10 border-info/30 text-info',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = ICONS[toast.variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg',
        'min-w-[260px] max-w-sm',
        'bg-background',
        STYLES[toast.variant]
      )}
    >
      <Icon size={16} className="shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
      <button
        type="button"
        onClick={() => { onDismiss(toast.id) }}
        className="shrink-0 p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <XIcon size={14} aria-hidden="true" />
      </button>
    </motion.div>
  )
}

/* ─── Provider ───────────────────────────────────────────────────────────── */

/**
 * ToastProvider
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Provides `useToast()` to the entire app.
 * Renders toasts in a portal at the bottom-right corner.
 *
 * Usage:
 *   const { success, error, info } = useToast()
 *   success('Copied to clipboard!')
 *   error('Something went wrong.')
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) clearTimeout(timer)
    timersRef.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
      setToasts((prev) => [...prev.slice(-4), { id, message, variant }])

      const timer = setTimeout(() => {
        dismiss(id)
      }, 3500)
      timersRef.current.set(id, timer)
    },
    [dismiss]
  )

  const success = useCallback((message: string) => { toast(message, 'success') }, [toast])
  const error = useCallback((message: string) => { toast(message, 'error') }, [toast])
  const info = useCallback((message: string) => { toast(message, 'info') }, [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          className="fixed bottom-4 right-4 z-[60] flex flex-col-reverse gap-2 pointer-events-none"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <div key={t.id} className="pointer-events-auto">
                <ToastItem toast={t} onDismiss={dismiss} />
              </div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

/**
 * useToast — access the toast notification system.
 *
 * Must be used inside a <ToastProvider>.
 *
 * @example
 * const { success } = useToast()
 * success('Copied to clipboard!')
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
