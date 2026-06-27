/**
 * Returns a throttled version of `fn` that invokes at most once per `limit` ms.
 * Trailing calls within the window are discarded (leading-edge throttle).
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCallAt = 0

  return function throttled(...args: Parameters<T>): void {
    const now = Date.now()
    if (now - lastCallAt >= limit) {
      lastCallAt = now
      fn(...args)
    }
  }
}
