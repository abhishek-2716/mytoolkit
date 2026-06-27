import { useParams } from 'react-router-dom'

/** ToolDetailPage — Individual tool page. Full implementation in Task-004. */
export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold capitalize">{slug?.replace(/-/g, ' ')}</h1>
      <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
        Tool interface — implementation in Task-004.
      </p>
    </section>
  )
}
