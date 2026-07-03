import { motion } from 'framer-motion'

import { Section } from '@/components/layout'

import { cn } from '@/utils'

import type { HowItWorksStep } from '../data/home.data'
import { howItWorksSteps } from '../data/home.data'

/* ─── Step card ──────────────────────────────────────────────────────────── */

interface StepCardProps {
  step: HowItWorksStep
  index: number
  isLast: boolean
}

function StepCard({ step, index, isLast }: StepCardProps) {
  const Icon = step.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.12 }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Connector line (hidden on last item) */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="absolute left-[calc(50%+40px)] top-10 hidden h-px w-[calc(100%-80px)] border-t border-dashed border-border lg:block"
        />
      )}

      {/* Step badge + icon */}
      <div className="relative mb-5">
        {/* Step number */}
        <span
          className={cn(
            'absolute -right-2 -top-2 z-10',
            'flex h-6 w-6 items-center justify-center rounded-full',
            'bg-primary text-primary-foreground',
            'type-caption font-bold'
          )}
          aria-hidden="true"
        >
          {step.step}
        </span>

        {/* Icon container */}
        <div
          className={cn(
            'flex h-20 w-20 items-center justify-center rounded-2xl',
            'border-2 border-border bg-surface shadow-sm',
            'transition-all duration-200 hover:border-primary/40 hover:shadow-md'
          )}
        >
          <Icon
            size={32}
            className="text-primary"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Content */}
      <h3 className="type-h5 text-foreground">{step.title}</h3>
      <p className="mt-2 type-body-sm text-foreground-secondary max-w-[200px] leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  )
}

/* ─── HowItWorks ─────────────────────────────────────────────────────────── */

/**
 * HowItWorks — three-step process section showing how to use ToolNest.
 */
export function HowItWorks() {
  return (
    <Section container="default" aria-labelledby="how-heading">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 id="how-heading" className="type-h2 text-foreground">
          How It Works
        </h2>
        <p className="mt-3 type-body-md text-foreground-secondary max-w-lg mx-auto">
          Three simple steps to process any file — no software to install.
        </p>
      </div>

      {/* Steps */}
      <div
        className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:gap-6"
        role="list"
        aria-label="How to use ToolNest"
      >
        {howItWorksSteps.map((step, i) => (
          <div key={step.step} role="listitem">
            <StepCard
              step={step}
              index={i}
              isLast={i === howItWorksSteps.length - 1}
            />
          </div>
        ))}
      </div>
    </Section>
  )
}
