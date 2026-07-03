import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface AccordionItemData {
  id: string
  question: string
  answer: string
}

export interface AccordionProps {
  /** List of FAQ / accordion items */
  items: AccordionItemData[]
  /**
   * Allow multiple items to be open simultaneously.
   * @default false
   */
  allowMultiple?: boolean
  /**
   * IDs of items that should be open on first render.
   */
  defaultOpenIds?: string[]
  className?: string
}

/* ─── Single item ────────────────────────────────────────────────────────── */

interface AccordionItemProps {
  item: AccordionItemData
  isOpen: boolean
  onToggle: () => void
  headingId: string
  panelId: string
}

function AccordionRow({ item, isOpen, onToggle, headingId, panelId }: AccordionItemProps) {
  return (
    <div className="border-b border-border px-5 last:border-b-0 sm:px-6">
      {/* ── Trigger ── */}
      <h3>
        <button
          id={headingId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            'flex w-full items-center justify-between gap-4 py-5 text-left',
            'type-body-md font-medium text-foreground',
            'transition-colors duration-150',
            'hover:text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'focus-visible:ring-offset-2 focus-visible:rounded'
          )}
        >
          <span>{item.question}</span>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-foreground-muted"
          >
            <ChevronDownIcon size={18} />
          </motion.span>
        </button>
      </h3>

      {/* ── Collapsible panel ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headingId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 type-body-md text-foreground-secondary leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Accordion ──────────────────────────────────────────────────────────── */

/**
 * Accordion — accessible collapsible content container.
 *
 * Implements WAI-ARIA Accordion pattern with keyboard navigation.
 * Animates the panel height via Framer Motion AnimatePresence.
 *
 * @example
 * // FAQ with single open at a time
 * <Accordion items={faqItems} />
 *
 * @example
 * // Allow multiple panels open simultaneously
 * <Accordion items={items} allowMultiple defaultOpenIds={['item-1']} />
 */
export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenIds))
  const prefix = useId()

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <div
      className={cn('overflow-hidden rounded-xl border border-border bg-surface', className)}
    >
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={() => { toggle(item.id) }}
          headingId={`${prefix}-h-${item.id}`}
          panelId={`${prefix}-p-${item.id}`}
        />
      ))}
    </div>
  )
}
