import { useParams } from 'react-router-dom'

/** CategoryPage — Browse tools by category. Full implementation in Task-003. */
export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold capitalize">{slug?.replace(/-/g, ' ')} Tools</h1>
      <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
        Category page — implementation in Task-003.
      </p>
    </section>
  )
}
