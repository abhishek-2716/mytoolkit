import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop — scrolls the window to the top whenever the pathname changes.
 *
 * Must be rendered inside a `<BrowserRouter>` (or any React Router Router)
 * so it can access `useLocation()`.
 *
 * Uses `behavior: 'instant'` to avoid the jarring effect of a smooth scroll
 * while page content is loading. Smooth scrolling for anchor navigation
 * is handled separately by the CSS `scroll-behavior: smooth` on `<html>`.
 *
 * @example
 * // Place inside BrowserRouter, before <Routes>
 * <BrowserRouter>
 *   <ScrollToTop />
 *   <Routes>...</Routes>
 * </BrowserRouter>
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Skip scroll restoration for hash navigation (same-page anchor links)
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname])

  // Renders nothing — purely a side-effect component
  return null
}
