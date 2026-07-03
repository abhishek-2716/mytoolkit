import { Link } from 'react-router-dom'

import { appConfig } from '@/config'
import { ROUTES } from '@/constants'

import type { ToolMeta } from '@/registry'
import { getCategoryMeta, getRelatedTools } from '@/registry'

interface ToolFooterProps {
  tool: ToolMeta
}

/**
 * ToolFooter
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Renders FAQ, How-to-Use, use cases and Related Tools sections below
 * the main tool area. Drives SEO and user retention.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolFooter({ tool }: ToolFooterProps) {
  const relatedTools = getRelatedTools(tool.id)
  const category = getCategoryMeta(tool.category)

  /* ── FAQ items generated from tool meta ───────────────────────────────── */
  const faqItems = [
    {
      q: `What is ${tool.title}?`,
      a: tool.description,
    },
    {
      q: `Is ${tool.shortTitle} free to use?`,
      a: `Yes, ${tool.shortTitle} is completely free. No signup, no subscription, no hidden fees.`,
    },
    {
      q: `Is my data safe when using ${tool.shortTitle}?`,
      a: `Yes. All processing happens entirely in your browser — your files never leave your device or get uploaded to any server.`,
    },
    ...(tool.supportedInputFormats && tool.supportedInputFormats.length > 0
      ? [{
          q: `What file formats does ${tool.shortTitle} support?`,
          a: `Supported input formats: ${tool.supportedInputFormats.join(', ')}.${tool.supportedOutputFormats?.length ? ` Output formats: ${tool.supportedOutputFormats.join(', ')}.` : ''}`,
        }]
      : []),
    {
      q: `Do I need to install anything to use ${tool.shortTitle}?`,
      a: `No installation required. ${tool.shortTitle} runs entirely in your browser — on desktop, tablet, or mobile.`,
    },
  ]

  /* ── Use cases from tool tags ─────────────────────────────────────────── */
  const useCases = tool.tags.length > 0
    ? tool.tags.slice(0, 6).map((tag) => ({
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
      }))
    : null

  /* ── JSON-LD: BreadcrumbList ──────────────────────────────────────────── */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: appConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${appConfig.url}/tools` },
      ...(category
        ? [{ '@type': 'ListItem', position: 3, name: category.name, item: `${appConfig.url}/category/${category.slug}` }]
        : []),
      { '@type': 'ListItem', position: category ? 4 : 3, name: tool.shortTitle, item: `${appConfig.url}/tools/${tool.slug}` },
    ],
  }

  /* ── JSON-LD: FAQPage ─────────────────────────────────────────────────── */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <footer className="mt-12 space-y-10">
      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="tool-faq-heading" className="pt-8 border-t border-border">
        <h2 id="tool-faq-heading" className="text-lg font-semibold text-foreground mb-5">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqItems.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-lg border border-border bg-card overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground select-none hover:bg-muted/50 transition-colors">
                {q}
                <span className="flex-shrink-0 w-4 h-4 text-muted-foreground group-open:rotate-45 transition-transform duration-200" aria-hidden="true">+</span>
              </summary>
              <p className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
        {/* inject JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </section>

      {/* ── Use Cases ────────────────────────────────────────────────────── */}
      {useCases && (
        <section aria-labelledby="tool-usecases-heading" className="pt-8 border-t border-border">
          <h2 id="tool-usecases-heading" className="text-lg font-semibold text-foreground mb-4">
            Common Use Cases
          </h2>
          <div className="flex flex-wrap gap-2">
            {useCases.map(({ label }) => (
              <span
                key={label}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground border border-border"
              >
                {label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Related Tools ────────────────────────────────────────────────── */}
      {relatedTools.length > 0 && (
        <section aria-labelledby="related-tools-heading" className="pt-8 border-t border-border">
          <h2 id="related-tools-heading" className="text-lg font-semibold text-foreground mb-4">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedTools.map((related) => {
              const RelatedIcon = related.icon
              return (
                <Link
                  key={related.id}
                  to={`${ROUTES.TOOLS}/${related.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 transition-colors group"
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <RelatedIcon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {related.shortTitle}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {related.shortDescription}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </footer>
  )
}
