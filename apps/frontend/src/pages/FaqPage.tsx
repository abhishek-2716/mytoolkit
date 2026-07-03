import { JsonLd, MetaTags } from '@/components/seo'
import { appConfig } from '@/config'

/* ─── FAQ structured data ────────────────────────────────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are all tools on MyToolsHub completely free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every tool on MyToolsHub is 100% free. No subscriptions, no credits, no hidden fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account to use the tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account needed. All tools work without registration — just visit any tool page and start immediately.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store my uploaded files?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All processing runs entirely in your browser. Files are never uploaded to any server. Your data stays on your device.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which browsers does MyToolsHub support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyToolsHub works in all modern browsers: Chrome, Firefox, Safari, and Edge. No plugins or extensions required.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many tools are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There are 52+ active tools available right now, spanning categories like Developer Tools, Image Tools, Text Tools, SEO Tools, Calculators, and Generators.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Since all processing is browser-based, file size limits depend on your device\'s memory. For most tools, files up to 50MB work without issues.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use these tools on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. MyToolsHub is fully responsive and works on smartphones and tablets as well as desktop computers.',
      },
    },
  ],
}

/** FaqPage */
export default function FaqPage() {
  return (
    <>
      <MetaTags
        title="FAQ — Frequently Asked Questions"
        description="Answers to common questions about MyToolsHub — how our free online tools work, privacy, data security, file limits, and browser support."
        canonical={`${appConfig.url}/faq`}
        keywords={[
          'faq free online tools',
          'how does the tool work',
          'is the tool safe to use',
          'does the tool store my files',
          'free tools privacy questions',
          'online tools help',
          'frequently asked questions tools website',
          'mytoolshub faq',
        ]}
      />
      <JsonLd data={faqSchema} />
      <div className="min-h-screen bg-background">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h1>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about {appConfig.name}. Can't find what you're looking for?{' '}
              <a href="/contact" className="text-primary hover:underline">Contact us</a>.
            </p>
          </div>

          {/* FAQ accordion */}
          <div className="space-y-3">
            {faqSchema.mainEntity.map((item) => (
              <details
                key={item.name}
                className="group rounded-xl border border-border bg-card overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-foreground select-none hover:bg-muted/50 transition-colors list-none">
                  {item.name}
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground group-open:rotate-45 transition-transform duration-200"
                    aria-hidden="true"
                  >+</span>
                </summary>
                <p className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
            <h2 className="text-lg font-semibold text-foreground">Still have questions?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Can't find the answer you're looking for? Our team is happy to help.
            </p>
            <a
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
