import { MetaTags } from '@/components/seo'

/** TermsPage */
export default function TermsPage() {
  return (
    <>
      <MetaTags
        title="Terms of Service"
        description="Read the Terms of Service for MyToolsHub. Free to use, no account required. Fair use policy for our free online tools."
        keywords={[
          'terms of service free tools',
          'terms and conditions online tools website',
          'free tools usage terms',
          'mytoolshub terms',
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
          Terms of service content — to be written before launch.
        </p>
      </section>
    </>
  )
}
