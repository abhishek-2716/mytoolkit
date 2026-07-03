import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'

import { Accordion } from '@/components/data-display'
import { FaqSection } from '@/components/layout'

import { appConfig } from '@/config'
import { cn } from '@/utils'
import { ROUTES } from '@/constants'

import { homeFaqItems } from '../data/home.data'

/* ─── FaqPreview ─────────────────────────────────────────────────────────── */

/**
 * FaqPreview — shows the top 5 FAQ questions on the homepage.
 *
 * Links to the full FAQ page for users who need more detail.
 */
export function FaqPreview() {
  return (
    <FaqSection container="content" aria-labelledby="faq-heading">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45 }}
        className="mb-8 text-center"
      >
        <h2 id="faq-heading" className="type-h2 text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 type-body-md text-foreground-secondary max-w-lg mx-auto">
          Everything you need to know about {appConfig.name}.
        </p>
      </motion.div>

      {/* Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <Accordion items={homeFaqItems} />
      </motion.div>

      {/* Link to full FAQ */}
      <div className="mt-8 text-center">
        <Link
          to={ROUTES.FAQ}
          className={cn(
            'inline-flex items-center gap-1.5 type-body-sm font-medium text-primary',
            'hover:gap-2.5 transition-all duration-150',
            'focus-visible:outline-none focus-visible:underline'
          )}
        >
          View all frequently asked questions
          <ArrowRightIcon size={15} aria-hidden="true" />
        </Link>
      </div>
    </FaqSection>
  )
}
