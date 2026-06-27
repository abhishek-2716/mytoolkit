import { useParams } from 'react-router-dom'

/** BlogArticlePage — Single article. Full implementation in Task-005. */
export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold capitalize">{slug?.replace(/-/g, ' ')}</h1>
      <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
        Article content — implementation in Task-005.
      </p>
    </section>
  )
}
