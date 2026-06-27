import { Link } from 'react-router-dom'

/** NotFoundPage — 404 */
export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-6xl font-bold" style={{ color: 'var(--color-primary)' }}>
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
      <p className="mt-3 text-base" style={{ color: 'var(--color-muted-foreground)' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Back to Home
      </Link>
    </section>
  )
}
