import { Helmet } from 'react-helmet-async'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface JsonLdProps {
  /** JSON-LD structured data object (without the @context wrapper) */
  data: Record<string, unknown>
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * JsonLd — injects a JSON-LD structured data script into `<head>`.
 *
 * Use one JsonLd per schema type per page. For multiple schemas,
 * render multiple JsonLd components.
 *
 * @example
 * // WebSite schema for homepage
 * <JsonLd data={{
 *   '@context': 'https://schema.org',
 *   '@type': 'WebSite',
 *   name: 'ToolNest',
 *   url: 'https://toolnest.app',
 *   potentialAction: {
 *     '@type': 'SearchAction',
 *     target: 'https://toolnest.app/search?q={search_term_string}',
 *     'query-input': 'required name=search_term_string',
 *   },
 * }} />
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
