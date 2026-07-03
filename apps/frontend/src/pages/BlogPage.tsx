import { MetaTags } from '@/components/seo'

/** BlogPage — Blog listing. Full implementation in Task-005. */
export default function BlogPage() {
  return (
    <>
      <MetaTags
        title="Blog — Tips, Tutorials & Tool Guides"
        description="Read free tutorials, how-to guides, and tips for using online tools. Learn how to compress PDFs, resize images, format JSON, generate passwords, and more."
        keywords={[
          'free tools tutorials',
          'how to compress pdf free',
          'how to resize image online',
          'how to format json online',
          'online tools guides',
          'productivity tips free tools',
          'how to use online tools',
          'best free tools blog',
          'tool tips and tricks',
        ]}
        ogType="article"
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
          Blog listing — implementation in Task-005.
        </p>
      </section>
    </>
  )
}
