import { useEffect, useRef, useState } from 'react'

/**
 * useScrolled — tracks whether the page has scrolled past a threshold.
 *
 * Uses `requestAnimationFrame` to debounce the scroll handler and prevent
 * layout thrashing. The listener is passive for maximum scroll performance.
 *
 * @param threshold - Scroll distance in pixels before `isScrolled` becomes
 *   true. Defaults to `10`.
 *
 * @example
 * const isScrolled = useScrolled()
 * // → false at top of page, true after scrolling 10px
 *
 * const isScrolled = useScrolled({ threshold: 80 })
 * // → true after scrolling 80px (e.g. past hero)
 */
export function useScrolled({ threshold = 10 }: { threshold?: number } = {}): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.scrollY > threshold
  })
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > threshold)
          ticking.current = false
        })
        ticking.current = true
      }
    }

    // Sync state immediately (avoids mismatch on initial render)
    setIsScrolled(window.scrollY > threshold)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return isScrolled
}
