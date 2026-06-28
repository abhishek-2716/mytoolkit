import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utils'

import { Container, type ContainerWidth } from './Container'

/* ─── Types ──────────────────────────────────────────────────────────────── */

/**
 * Section visual variants.
 *
 * | Variant  | Background         | Padding     | Use case                        |
 * |----------|--------------------|-------------|----------------------------------|
 * | default  | transparent        | 5rem block  | Standard content sections       |
 * | hero     | transparent        | 7rem block  | Hero / top-of-page headline     |
 * | muted    | background-subtle  | 5rem block  | Alternating rows, feature blocks|
 * | feature  | surface            | 5rem block  | Highlighted content panels      |
 * | cta      | primary            | 5rem block  | Call-to-action banners          |
 * | faq      | transparent        | 4rem block  | FAQ / accordion lists           |
 */
export type SectionVariant = 'default' | 'hero' | 'muted' | 'feature' | 'cta' | 'faq'

export interface SectionProps extends Omit<ComponentPropsWithoutRef<'section'>, 'ref'> {
  /** Visual variant controlling background and padding rhythm */
  variant?: SectionVariant
  /**
   * When provided, wraps children in a `<Container>` with the given width.
   * Omit to manage layout inside children manually.
   */
  container?: ContainerWidth
  /** Override to a different HTML element */
  as?: 'section' | 'div' | 'article'
  children: ReactNode
}

/* ─── Variant styles ─────────────────────────────────────────────────────── */

const variantClasses: Record<SectionVariant, string> = {
  default: 'py-20',
  hero: 'py-28 md:py-36',
  muted: 'py-20 bg-background-subtle',
  feature: 'py-20 bg-surface border-y border-border',
  cta: 'py-24 bg-primary text-primary-foreground',
  faq: 'py-16',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Section — semantic section element with consistent vertical spacing.
 *
 * The `container` prop optionally wraps children in a `Container` for
 * horizontal centering. When omitted, children manage their own layout.
 *
 * @example
 * // Standard content section with contained width
 * <Section container="default">
 *   <h2 className="type-h2">Feature title</h2>
 *   <p className="type-body-md">Description…</p>
 * </Section>
 *
 * @example
 * // Hero section
 * <Section variant="hero" container="wide">
 *   <h1 className="type-display-xl text-balance">Big headline</h1>
 * </Section>
 *
 * @example
 * // CTA section
 * <Section variant="cta" container="default">
 *   <h2 className="type-h2 text-on-primary">Ready to start?</h2>
 * </Section>
 */
export function Section({
  variant = 'default',
  container,
  as: Tag = 'section',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn(variantClasses[variant], className)} {...props}>
      {container ? <Container width={container}>{children}</Container> : children}
    </Tag>
  )
}

/* ─── Named shorthand variants ───────────────────────────────────────────── */

export function HeroSection(props: Omit<SectionProps, 'variant'>) {
  return <Section variant="hero" {...props} />
}

export function MutedSection(props: Omit<SectionProps, 'variant'>) {
  return <Section variant="muted" {...props} />
}

export function FeatureSection(props: Omit<SectionProps, 'variant'>) {
  return <Section variant="feature" {...props} />
}

export function CtaSection(props: Omit<SectionProps, 'variant'>) {
  return <Section variant="cta" {...props} />
}

export function FaqSection(props: Omit<SectionProps, 'variant'>) {
  return <Section variant="faq" {...props} />
}
