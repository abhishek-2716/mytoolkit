import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, XIcon } from 'lucide-react'

import { cn } from '@/utils'

import { Button } from '../common/Button'
import { IconButton } from '../common/IconButton'
import { BACKDROP_ANIMATION, MODAL_ANIMATION } from './overlayVariants'
import { useModal } from './useOverlay'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type AlertDialogVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void | Promise<void>
  variant?: AlertDialogVariant
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** When true, hides the cancel button */
  confirmOnly?: boolean
  /** When true, shows a loading spinner on the confirm button */
  loading?: boolean
}

/* ─── Icon + color config ────────────────────────────────────────────────── */

const VARIANT_CONFIG: Record<
  AlertDialogVariant,
  { icon: React.ElementType; iconClass: string; iconBg: string; confirmVariant: 'primary' | 'success' | 'warning' | 'danger' }
> = {
  info:    { icon: InfoIcon,          iconClass: 'text-info',    iconBg: 'bg-info-light',    confirmVariant: 'primary' },
  success: { icon: CheckCircleIcon,   iconClass: 'text-success', iconBg: 'bg-success-light', confirmVariant: 'success' },
  warning: { icon: AlertTriangleIcon, iconClass: 'text-warning', iconBg: 'bg-warning-light', confirmVariant: 'warning' },
  danger:  { icon: AlertCircleIcon,   iconClass: 'text-danger',  iconBg: 'bg-danger-light',  confirmVariant: 'danger'  },
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * AlertDialog — a focused confirmation overlay.
 *
 * Use for irreversible or high-consequence actions (delete, reset, disconnect).
 * Always shows an icon, title, optional description, and action buttons.
 *
 * @example
 * <AlertDialog
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleDelete}
 *   variant="danger"
 *   title="Delete project?"
 *   description="This action cannot be undone. All data will be permanently removed."
 *   confirmLabel="Yes, delete"
 * />
 */
export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  variant = 'info',
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmOnly = false,
  loading = false,
}: AlertDialogProps) {
  const { titleId, descriptionId } = useModal({ defaultOpen: isOpen })
  const config = VARIANT_CONFIG[variant]
  const Icon = config.icon

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="alert-backdrop"
          className="fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4"
          {...BACKDROP_ANIMATION}
        >
          <div
            className="absolute inset-0 bg-overlay"
            aria-hidden="true"
            onClick={onClose}
          />

          <motion.div
            key="alert-panel"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description != null ? descriptionId : undefined}
            className="relative z-[var(--z-modal)] w-full max-w-sm bg-surface rounded-xl shadow-xl p-6 focus:outline-none"
            tabIndex={-1}
            {...MODAL_ANIMATION}
          >
            {/* Icon */}
            <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-4', config.iconBg)}>
              <Icon size={24} className={config.iconClass} aria-hidden="true" />
            </div>

            {/* Title */}
            <h2 id={titleId} className="text-h5 font-semibold text-foreground mb-1">
              {title}
            </h2>

            {/* Description */}
            {description != null && (
              <p id={descriptionId} className="text-body-sm text-foreground-secondary mb-6">
                {description}
              </p>
            )}

            {description == null && <div className="mb-6" />}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              {!confirmOnly && (
                <Button variant="ghost" onClick={onClose} disabled={loading}>
                  {cancelLabel}
                </Button>
              )}
              <Button
                variant={config.confirmVariant}
                loading={loading}
                onClick={onConfirm != null ? () => { void onConfirm() } : undefined}
              >
                {confirmLabel}
              </Button>
            </div>

            {/* Close button */}
            <div className="absolute top-4 right-4">
              <IconButton
                icon={XIcon}
                aria-label="Close"
                variant="ghost"
                size="sm"
                onClick={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

AlertDialog.displayName = 'AlertDialog'
