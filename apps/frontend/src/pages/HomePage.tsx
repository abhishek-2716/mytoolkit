/**
 * HomePage — Full implementation in Task-003.
 * Sections: Hero, Popular Tools, Categories, Statistics, How It Works, FAQ, Blog, Footer.
 */
export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Your Free Online Toolbox</h1>
      <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
        Hundreds of free productivity tools — PDF, images, text, and more.
        <br />
        No sign-up required. Full implementation coming in Task-003.
      </p>
    </section>
  )
}
