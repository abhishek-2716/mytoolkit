import { MetaTags } from '@/components/seo'

/** CookiesPage */
export default function CookiesPage() {
  return (
    <>
      <MetaTags
        title="Cookie Policy"
        description="MyToolsHub cookie policy — we use only essential cookies. No tracking cookies, no advertising. Your privacy matters."
        keywords={[
          'cookie policy free tools',
          'cookies online tools website',
          'no tracking cookies tools',
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Cookie Policy</h1>
        <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
          Cookie policy content — to be written before launch.
        </p>
      </section>
    </>
  )
}
