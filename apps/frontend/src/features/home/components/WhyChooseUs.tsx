import { motion } from 'framer-motion'

import { LinkButton } from '@/components/common'
import { FeatureSection } from '@/components/layout'

import { appConfig } from '@/config'
import { cn } from '@/utils'
import { ROUTES } from '@/constants'

import type { WhyFeature } from '../data/home.data'
import { whyFeatures } from '../data/home.data'

/* ─── Single feature card ────────────────────────────────────────────────── */

interface FeatureCardProps {
  feature: WhyFeature
  index: number
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={cn(
        'flex flex-col gap-4 rounded-xl p-6',
        'border border-border bg-surface/60 backdrop-blur-sm'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl',
          feature.colorClass
        )}
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>

      {/* Content */}
      <div>
        <h3 className="type-h5 text-foreground">{feature.title}</h3>
        <p className="mt-2 type-body-sm text-foreground-secondary leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

/* ─── WhyChooseUs ────────────────────────────────────────────────────────── */

/**
 * WhyChooseUs — six feature cards explaining the platform's key advantages.
 */
export function WhyChooseUs() {
  return (
    <FeatureSection container="wide" aria-labelledby="why-heading">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 id="why-heading" className="type-h2 text-foreground">
          Why Choose {appConfig.name}?
        </h2>
        <p className="mt-3 type-body-md text-foreground-secondary max-w-xl mx-auto">
          We built the tool experience we always wanted — fast, private, and truly free.
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Platform advantages"
      >
        {whyFeatures.map((feature, i) => (
          <div key={feature.title} role="listitem">
            <FeatureCard feature={feature} index={i} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <LinkButton href={ROUTES.ABOUT} variant="outline" size="md">
          Learn more about {appConfig.name}
        </LinkButton>
      </div>
    </FeatureSection>
  )
}
