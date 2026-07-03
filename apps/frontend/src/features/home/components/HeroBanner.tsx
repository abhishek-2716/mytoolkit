import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { ArrowRightIcon, GlobeIcon, ShieldIcon, SparklesIcon, ZapIcon } from 'lucide-react'

import { LinkButton } from '@/components/common'
import { SearchInput } from '@/components/forms'
import { HeroSection } from '@/components/layout'

import { cn } from '@/utils'
import { ROUTES } from '@/constants'

import { registryStats, searchTools } from '@/registry'

import { popularSearches } from '../data/home.data'

/* ─── Animation variants ─────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const, delay: custom as number },
  }),
}

/* ─── Trust badges ───────────────────────────────────────────────────────── */

const TRUST_BADGES = [
  { label: 'Browser-based', icon: GlobeIcon },
  { label: 'Free forever', icon: ZapIcon },
  { label: 'No signup', icon: ShieldIcon },
]

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * HeroBanner — the primary above-the-fold section of the homepage.
 *
 * Contains: headline, subtitle, global search, popular search chips,
 * CTA buttons, stats and trust badges.
 */
export function HeroBanner() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = useCallback(
    (value: string) => {
      const q = value.trim()
      if (!q) return
      // If there's exactly one result (or exact title match), go directly
      const results = searchTools(q, 2)
      const exact = results.find(
        (t) => t.title.toLowerCase() === q.toLowerCase() || t.slug === q.toLowerCase()
      )
      const target = exact ?? (results.length === 1 ? results[0] : undefined)
      if (target) {
        void navigate(`${ROUTES.TOOLS}/${target.slug}`)
        return
      }
      void navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`)
    },
    [navigate]
  )

  const handlePopularSearch = useCallback(
    (term: string) => {
      const results = searchTools(term, 2)
      const exact = results.find(
        (t) => t.title.toLowerCase() === term.toLowerCase() || t.shortTitle.toLowerCase() === term.toLowerCase()
      )
      if (exact) {
        void navigate(`${ROUTES.TOOLS}/${exact.slug}`)
        return
      }
      void navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(term)}`)
    },
    [navigate]
  )

  return (
    <HeroSection
      container="wide"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-background-subtle"
    >
      {/* ── Decorative background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* ── Announcement badge ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 inline-flex items-center gap-2"
        >
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5',
              'border border-primary/20 bg-primary-subtle',
              'type-caption font-medium text-primary'
            )}
          >
            <SparklesIcon size={13} aria-hidden="true" />
            {registryStats.activeTools}+ Free Tools — No Sign-up Required
          </span>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          id="hero-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="type-display-lg text-balance text-foreground md:type-display-xl"
        >
          Your Ultimate{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Free Online
          </span>{' '}
          Toolkit
        </motion.h1>

        {/* ── Subtitle ── */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mx-auto mt-5 max-w-2xl type-body-lg text-foreground-secondary text-balance"
        >
          PDF, image, developer tools and more. Fast, secure, and completely
          free — process files right in your browser, no upload needed.
        </motion.p>

        {/* ── Stats row ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.25}
          className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          aria-label="Platform statistics"
        >
          <span className="flex items-center gap-1.5 type-caption text-foreground-secondary">
            <span className="font-bold text-foreground">{registryStats.activeTools}+</span>
            tools
          </span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-border" aria-hidden="true" />
          <span className="flex items-center gap-1.5 type-caption text-foreground-secondary">
            <span className="font-bold text-foreground">{registryStats.totalCategories}</span>
            categories
          </span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-border" aria-hidden="true" />
          <span className="flex items-center gap-1.5 type-caption text-foreground-secondary">
            <span className="font-bold text-foreground">{registryStats.browserTools}+</span>
            instant browser tools
          </span>
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mx-auto mt-8 max-w-xl"
          role="search"
          aria-label="Search tools"
        >
          <SearchInput
            size="lg"
            placeholder={`Search ${registryStats.activeTools}+ tools…`}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value) }}
            onSearch={handleSearch}
            clearable
            onClear={() => { setSearchQuery('') }}
            aria-label="Search for a tool"
            className="shadow-md"
          />
        </motion.div>

        {/* ── Popular searches ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
          aria-label="Popular search terms"
        >
          <span className="type-caption text-foreground-muted">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => { handlePopularSearch(term) }}
              className={cn(
                'rounded-full border border-border bg-surface px-3 py-1',
                'type-caption text-foreground-secondary',
                'hover:border-primary/40 hover:text-primary hover:bg-primary-subtle',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                'transition-all duration-150 cursor-pointer'
              )}
            >
              {term}
            </button>
          ))}
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <LinkButton href={ROUTES.ACTIVE_TOOLS} variant="primary" size="lg" rightIcon={ArrowRightIcon}>
              Explore Active Tools
          </LinkButton>
          <LinkButton href={ROUTES.ABOUT} variant="outline" size="lg">
            Learn More
          </LinkButton>
        </motion.div>

        {/* ── Trust badges ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          aria-label="Platform guarantees"
        >
          {TRUST_BADGES.map(({ label, icon: BadgeIcon }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 type-caption text-foreground-muted"
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full bg-success/20 text-success"
                aria-hidden="true"
              >
                <BadgeIcon size={10} />
              </span>
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </HeroSection>
  )
}
