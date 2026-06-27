import { Link } from 'react-router-dom'

/** ServerErrorPage — 500 */
export default function ServerErrorPage() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-6xl font-bold" style={{ color: 'var(--color-danger)' }}>
        500
      </p>
      <h1 className="mt-4 text-2xl font-bold">Something Went Wrong</h1>
      <p className="mt-3 text-base" style={{ color: 'var(--color-muted-foreground)' }}>
        We encountered an unexpected error. Please try again later.
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
