/**
 * ToolNest Design Tokens — TypeScript Mirror
 * ══════════════════════════════════════════════════════════════════════════
 *
 * JavaScript/TypeScript access to design tokens for use in:
 *  • Framer Motion transition configs
 *  • Dynamic inline styles (when Tailwind classes can't be used)
 *  • Test assertions and snapshot references
 *  • SSR-safe calculations
 *
 * KEEP IN SYNC with tokens.css.
 *
 * ► Prefer CSS tokens (var(--color-*), Tailwind classes) in components.
 * ► Use this file only when CSS variables cannot be used directly.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

/* ─── Colors ──────────────────────────────────────────────────────────────
   Use var(--color-*) in component styles wherever possible.
   These JS strings are provided for Framer Motion / canvas / canvas2D usage.
   ──────────────────────────────────────────────────────────────────────── */

export const colors = {
  /** @see tokens.css --color-background */
  background: 'var(--color-background)',
  backgroundSubtle: 'var(--color-background-subtle)',
  backgroundMuted: 'var(--color-background-muted)',

  surface: 'var(--color-surface)',
  surfaceRaised: 'var(--color-surface-raised)',
  surfaceOverlay: 'var(--color-surface-overlay)',
  surfaceSunken: 'var(--color-surface-sunken)',

  border: 'var(--color-border)',
  borderStrong: 'var(--color-border-strong)',
  borderSubtle: 'var(--color-border-subtle)',

  foreground: 'var(--color-foreground)',
  foregroundSecondary: 'var(--color-foreground-secondary)',
  foregroundMuted: 'var(--color-foreground-muted)',
  foregroundDisabled: 'var(--color-foreground-disabled)',
  foregroundOnDark: 'var(--color-foreground-on-dark)',

  muted: 'var(--color-muted)',
  mutedForeground: 'var(--color-muted-foreground)',

  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)',
    950: 'var(--color-primary-950)',
    DEFAULT: 'var(--color-primary)',
    hover: 'var(--color-primary-hover)',
    active: 'var(--color-primary-active)',
    light: 'var(--color-primary-light)',
    foreground: 'var(--color-primary-foreground)',
  },

  secondary: {
    DEFAULT: 'var(--color-secondary)',
    hover: 'var(--color-secondary-hover)',
    foreground: 'var(--color-secondary-foreground)',
  },

  accent: {
    DEFAULT: 'var(--color-accent)',
    hover: 'var(--color-accent-hover)',
    light: 'var(--color-accent-light)',
    foreground: 'var(--color-accent-foreground)',
  },

  success: {
    DEFAULT: 'var(--color-success)',
    hover: 'var(--color-success-hover)',
    light: 'var(--color-success-light)',
    foreground: 'var(--color-success-foreground)',
  },

  warning: {
    DEFAULT: 'var(--color-warning)',
    hover: 'var(--color-warning-hover)',
    light: 'var(--color-warning-light)',
    foreground: 'var(--color-warning-foreground)',
  },

  danger: {
    DEFAULT: 'var(--color-danger)',
    hover: 'var(--color-danger-hover)',
    light: 'var(--color-danger-light)',
    foreground: 'var(--color-danger-foreground)',
  },

  info: {
    DEFAULT: 'var(--color-info)',
    hover: 'var(--color-info-hover)',
    light: 'var(--color-info-light)',
    foreground: 'var(--color-info-foreground)',
  },

  overlay: 'var(--color-overlay)',
  overlaySubtle: 'var(--color-overlay-subtle)',
  overlayStrong: 'var(--color-overlay-strong)',
  focusRing: 'var(--color-focus-ring)',
} as const

/* ─── Typography ──────────────────────────────────────────────────────────
   Font size values for use in inline styles or Framer Motion.
   Prefer Tailwind text-* classes in JSX.
   ──────────────────────────────────────────────────────────────────────── */

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
    display: 'var(--font-display)',
  },
  fontSize: {
    displayXl: 'var(--text-display-xl)',
    displayLg: 'var(--text-display-lg)',
    h1: 'var(--text-h1)',
    h2: 'var(--text-h2)',
    h3: 'var(--text-h3)',
    h4: 'var(--text-h4)',
    h5: 'var(--text-h5)',
    h6: 'var(--text-h6)',
    bodyLg: 'var(--text-body-lg)',
    bodyMd: 'var(--text-body-md)',
    bodySm: 'var(--text-body-sm)',
    caption: 'var(--text-caption)',
    label: 'var(--text-label)',
    button: 'var(--text-button)',
    code: 'var(--text-code)',
  },
} as const

/* ─── Spacing ──────────────────────────────────────────────────────────────
   Named layout spacing tokens.
   For component spacing, use Tailwind p-*, m-*, gap-* classes.
   ──────────────────────────────────────────────────────────────────────── */

export const spacing = {
  containerX: 'var(--container-padding-x)',
  sectionY: 'var(--section-padding-y)',
  sectionYSm: 'var(--section-padding-y-sm)',
  gridGutter: 'var(--grid-gutter)',
} as const

/* ─── Border Radius ────────────────────────────────────────────────────────
   Use Tailwind rounded-* classes in JSX.
   Use these in dynamic styles (e.g. Framer Motion borderRadius).
   ──────────────────────────────────────────────────────────────────────── */

export const radius = {
  none: 'var(--radius-none)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
} as const

/* ─── Shadows ──────────────────────────────────────────────────────────────
   Use Tailwind shadow-* classes in JSX.
   ──────────────────────────────────────────────────────────────────────── */

export const shadow = {
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  inner: 'var(--shadow-inner)',
  focus: 'var(--shadow-focus)',
  none: 'none',
} as const

/* ─── Animation ────────────────────────────────────────────────────────────
   Use numeric ms values in Framer Motion (transition.duration in seconds).
   ──────────────────────────────────────────────────────────────────────── */

export const animation = {
  /** Duration values in milliseconds — divide by 1000 for Framer Motion */
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
    loading: 1500,
  },
  /** Framer Motion-compatible easing arrays */
  easing: {
    linear: [0, 0, 1, 1] as [number, number, number, number],
    easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
    easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
    easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
    standard: [0.2, 0, 0, 1] as [number, number, number, number],
    spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    bounce: [0.68, -0.6, 0.32, 1.6] as [number, number, number, number],
  },
  /** Pre-built Framer Motion transition objects */
  transition: {
    fast: { duration: 0.15, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
    normal: { duration: 0.25, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
    slow: { duration: 0.35, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
    spring: { type: 'spring' as const, stiffness: 300, damping: 24 },
    bounce: { type: 'spring' as const, stiffness: 400, damping: 10 },
  },
} as const

/* ─── Breakpoints ──────────────────────────────────────────────────────────
   Pixel values matching Tailwind's responsive breakpoints.
   ──────────────────────────────────────────────────────────────────────── */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const

/* ─── Z-Index ──────────────────────────────────────────────────────────────
   Use var(--z-*) in CSS, use these numbers in Framer Motion zIndex prop.
   ──────────────────────────────────────────────────────────────────────── */

export const zIndex = {
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  toast: 1070,
  tooltip: 1080,
  overlay: 1090,
} as const

/* ─── Containers ────────────────────────────────────────────────────────── */

export const containers = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
} as const

/* ─── Aggregate export ─────────────────────────────────────────────────── */

/** Complete ToolNest token tree — all design decisions in one object */
export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  animation,
  breakpoints,
  zIndex,
  containers,
} as const

/* ─── Utility types ────────────────────────────────────────────────────── */

export type ColorToken = keyof typeof colors
export type RadiusToken = keyof typeof radius
export type ShadowToken = keyof typeof shadow
export type ZIndexToken = keyof typeof zIndex
export type BreakpointKey = keyof typeof breakpoints
