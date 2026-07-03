import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'

import { CtaSection } from '@/components/layout'

import type { StatItem } from '../data/home.data'
import { stats } from '../data/home.data'

/* ─── CountUp ────────────────────────────────────────────────────────────── */

interface CountUpProps {
  target: number
  suffix: string
}

/**
 * CountUp — animates a number from 0 to `target` when it enters the viewport.
 * Triggers once; after that it stays at the target value.
 */
function CountUp({ target, suffix }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!isInView) return

    const controls = animate(0, target, {
      duration: 2.2,
      ease: 'easeOut',
      onUpdate(value) {
        setCount(Math.round(value))
      },
    })

    return () => { controls.stop() }
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ─── Single stat card ───────────────────────────────────────────────────── */

interface StatCardProps {
  stat: StatItem
  index: number
}

function StatCard({ stat, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div
        className="type-display-lg font-extrabold text-primary-foreground tabular-nums"
        aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
      >
        <CountUp target={stat.value} suffix={stat.suffix} />
      </div>
      <p className="mt-1 type-body-md text-primary-foreground/80">{stat.label}</p>
    </motion.div>
  )
}

/* ─── StatsBanner ────────────────────────────────────────────────────────── */

/**
 * StatsBanner — animated counter section displayed on a primary-color background.
 *
 * Numbers animate from 0 to their target values when the section enters the viewport.
 */
export function StatsBanner() {
  return (
    <CtaSection container="wide" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        ToolNest Platform Statistics
      </h2>

      <div
        className="grid grid-cols-2 gap-10 md:grid-cols-4"
        role="list"
        aria-label="Platform statistics"
      >
        {stats.map((stat, i) => (
          <div key={stat.label} role="listitem">
            <StatCard stat={stat} index={i} />
          </div>
        ))}
      </div>
    </CtaSection>
  )
}
