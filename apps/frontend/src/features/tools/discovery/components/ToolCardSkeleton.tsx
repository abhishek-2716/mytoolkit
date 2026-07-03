/**
 * ToolCardSkeleton
 * Animated loading placeholder that matches the ToolCard layout.
 * Used while tool data is loading or being filtered.
 */
export function ToolCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4 animate-pulse">
      {/* Icon skeleton */}
      <div className="w-10 h-10 rounded-xl bg-muted" />
      {/* Badge row */}
      <div className="flex gap-1.5">
        <div className="w-10 h-3.5 rounded-full bg-muted" />
      </div>
      {/* Title */}
      <div className="w-3/4 h-4 rounded bg-muted" />
      {/* Description lines */}
      <div className="space-y-1.5">
        <div className="w-full h-3 rounded bg-muted" />
        <div className="w-4/5 h-3 rounded bg-muted" />
      </div>
    </div>
  )
}

/** Renders n skeleton cards in a grid-compatible layout. */
export function ToolGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </>
  )
}
