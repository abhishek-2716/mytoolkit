import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

/**
 * Standard content-width presets.
 *
 * | Width     | Max-width | Typical use                             |
 * |-----------|-----------|------------------------------------------|
 * | narrow    | 768px     | Long-form reading, legal text           |
 * | content   | 1024px    | Forms, blog articles, moderate content  |
 * | default   | 1280px    | Standard pages, tool grids              |
 * | wide      | 1400px    | Home page, tools listing, data-heavy    |
 * | fluid     | none      | Full-width sections, maps, canvases     |
 */
export type ContainerWidth = 'narrow' | 'content' | 'default' | 'wide' | 'fluid'

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  /** Content-width preset */
  width?: ContainerWidth
  /**
   * HTML element to render as.
   * Useful for semantic HTML: render as `<section>`, `<article>`, etc.
   * @default 'div'
   */
  as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'nav'
  children: ReactNode
}

/* ─── Width classes ──────────────────────────────────────────────────────── */

/**
 * Maps width presets to the CSS class combinations defined in globals.css.
 * `.container` provides `margin-inline: auto`, `padding-inline`, and
 * default max-width. The sibling `.container-*` overrides the max-width.
 */
const widthClasses: Record<ContainerWidth, string> = {
  narrow: 'container container-md', // 768px
  content: 'container container-lg', // 1024px
  default: 'container container-xl', // 1280px
  wide: 'container', // 1400px (container default)
  fluid: 'w-full px-6', // No max-width, 24px padding
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Container — horizontally centers and constrains content width.
 *
 * All padding and max-widths come from design tokens (see tokens.css).
 * Never add arbitrary max-width values to component files — use this instead.
 *
 * @example
 * // Standard page content (1280px max)
 * <Container>
 *   <h1>Page title</h1>
 * </Container>
 *
 * @example
 * // Narrow reading column (768px max)
 * <Container width="narrow">
 *   <article>Long-form text content…</article>
 * </Container>
 *
 * @example
 * // Semantic article element
 * <Container as="article" width="content">
 *   <BlogPost />
 * </Container>
 */
export function Container({
  width = 'default',
  as: Tag = 'div',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={cn(widthClasses[width], className)} {...props}>
      {children}
    </Tag>
  )
}

/* ─── Named shorthand exports ────────────────────────────────────────────── */

/** Narrow container — 768px max. Best for reading-length prose. */
export function ContainerNarrow(props: Omit<ContainerProps, 'width'>) {
  return <Container width="narrow" {...props} />
}

/** Wide container — 1400px max. Best for tool grids and home pages. */
export function ContainerWide(props: Omit<ContainerProps, 'width'>) {
  return <Container width="wide" {...props} />
}

/** Fluid container — full width with padding. Best for edge-to-edge sections. */
export function ContainerFluid(props: Omit<ContainerProps, 'width'>) {
  return <Container width="fluid" {...props} />
}
