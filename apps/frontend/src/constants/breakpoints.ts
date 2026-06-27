/** Pixel values matching Tailwind's default breakpoint scale */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const

/** CSS media query strings — use with useMediaQuery() hook */
export const MEDIA = {
  SM: '(min-width: 640px)',
  MD: '(min-width: 768px)',
  LG: '(min-width: 1024px)',
  XL: '(min-width: 1280px)',
  XXL: '(min-width: 1536px)',
  MOBILE_ONLY: '(max-width: 767px)',
  TABLET_ONLY: '(min-width: 768px) and (max-width: 1023px)',
  DESKTOP: '(min-width: 1024px)',
  PREFERS_DARK: '(prefers-color-scheme: dark)',
  PREFERS_LIGHT: '(prefers-color-scheme: light)',
  REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
  HOVER: '(hover: hover)',
  TOUCH: '(hover: none) and (pointer: coarse)',
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS
export type MediaKey = keyof typeof MEDIA
