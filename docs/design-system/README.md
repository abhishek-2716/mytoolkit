# ToolNest Design System

> Single source of truth for all visual design decisions in the ToolNest platform.

---

## Architecture

The design system is split into four CSS files, all imported in order from `globals.css`:

| File             | Purpose                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `tokens.css`     | All `@theme` tokens → Tailwind utility generation + dark mode overrides |
| `typography.css` | `.type-*` composite utility classes                                     |
| `animations.css` | `@keyframes` definitions                                                |
| `globals.css`    | Entry point: imports above + `@layer base` + `@layer utilities`         |

A TypeScript mirror of all tokens lives in `tokens.ts` for use in Framer Motion, inline styles, and
tests.

---

## Color System

Colors use the **OKLCH** color space for perceptual uniformity — identical lightness values appear
visually equal across hues.

### Semantic Token Groups

| Group      | Token prefix          | Purpose                      |
| ---------- | --------------------- | ---------------------------- |
| Background | `--color-background*` | Canvas layers                |
| Surface    | `--color-surface*`    | Cards, panels, dialogs       |
| Border     | `--color-border*`     | Dividers, input outlines     |
| Foreground | `--color-foreground*` | Text and icon hierarchy      |
| Muted      | `--color-muted*`      | Low-emphasis backgrounds     |
| Primary    | `--color-primary*`    | Brand blue, primary actions  |
| Secondary  | `--color-secondary*`  | Neutral secondary actions    |
| Accent     | `--color-accent*`     | Violet complementary accents |
| Success    | `--color-success*`    | Positive outcomes            |
| Warning    | `--color-warning*`    | Caution states               |
| Danger     | `--color-danger*`     | Errors, destructive actions  |
| Info       | `--color-info*`       | Informational callouts       |
| Overlay    | `--color-overlay*`    | Modal backdrops, scrims      |

### Color Scale

Each semantic color (primary, accent, success, warning, danger, info) has an 8-step scale (50–700+)
plus `DEFAULT`, `hover`, `light`, and `foreground` aliases.

```
primary-50    → Subtle tint backgrounds
primary-100   → Light background chips/badges
primary-200   → Hover highlights
primary-300   → Decorative borders
primary-400   → Light interactive states
primary-500   → DEFAULT — primary buttons, links (light mode)
primary-600   → hover state
primary-700   → active / pressed state
primary-800   → High contrast on light bg
primary-900   → Near-black text use
primary-950   → Maximum contrast
```

### Dark Mode

Two mechanisms apply dark theme tokens:

1. **Explicit**: `[data-theme='dark']` — set by `ThemeProvider` when user selects dark
2. **System**: `@media (prefers-color-scheme: dark)` with `:root:not([data-theme='light'])` —
   respects OS preference when no explicit choice is made

Only background/surface/border/foreground/muted/secondary/shadow tokens are overridden. Semantic
colors (primary, success, danger, etc.) remain constant across themes for consistency.

### Usage

```tsx
// Always use Tailwind color utilities
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground hover:bg-primary-hover" />
<p className="text-foreground-muted" />

// Use var() only in CSS files
.custom { color: var(--color-success); }
```

---

## Typography

### Font Stack

| Variable         | Stack                                     | Purpose             |
| ---------------- | ----------------------------------------- | ------------------- |
| `--font-sans`    | Inter → system-ui → sans-serif            | All UI text         |
| `--font-mono`    | JetBrains Mono → Fira Code → ui-monospace | Code, keys          |
| `--font-display` | Inter → system-ui                         | Marketing headlines |

### Type Scale

| Class              | Size     | Weight | Leading | Tracking | Usage                      |
| ------------------ | -------- | ------ | ------- | -------- | -------------------------- |
| `.type-display-xl` | 4.5rem   | 800    | 1.05    | −0.03em  | Homepage hero H1           |
| `.type-display-lg` | 3.75rem  | 700    | 1.08    | −0.025em | Section heroes             |
| `.type-h1`         | 2.5rem   | 700    | 1.2     | −0.02em  | Page titles                |
| `.type-h2`         | 2rem     | 600    | 1.25    | −0.015em | Section headings           |
| `.type-h3`         | 1.5rem   | 600    | 1.3     | −0.01em  | Card titles, sub-sections  |
| `.type-h4`         | 1.25rem  | 600    | 1.4     | −0.005em | Widget titles              |
| `.type-h5`         | 1.125rem | 600    | 1.4     | 0        | Group labels               |
| `.type-h6`         | 1rem     | 600    | 1.5     | 0        | Table headers              |
| `.type-body-lg`    | 1.125rem | 400    | 1.7     | 0        | Featured body copy         |
| `.type-body-md`    | 1rem     | 400    | 1.65    | 0        | Default body text          |
| `.type-body-sm`    | 0.875rem | 400    | 1.6     | 0        | Secondary copy             |
| `.type-caption`    | 0.75rem  | 400    | 1.5     | +0.01em  | Timestamps, hints          |
| `.type-label`      | 0.875rem | 500    | 1.4     | +0.01em  | Form labels, table headers |
| `.type-button`     | 0.875rem | 500    | 1       | +0.02em  | All button text            |
| `.type-code`       | 0.875rem | 400    | 1.6     | 0        | Inline/block code          |

### Text Color Helpers

```tsx
<p className="type-body-md text-secondary">Secondary text</p>
<span className="type-caption text-muted">Hint text</span>
<p className="text-success">Operation successful</p>
```

### Text Rendering Helpers

```tsx
<h1 className="type-display-xl text-balance">Long headline that wraps well</h1>
<p className="type-body-md text-pretty">Long paragraph text</p>
<span className="text-ellipsis w-48">Truncated text that overflows</span>
<p className="line-clamp-2">Multi-line truncation at 2 lines</p>
```

---

## Spacing

The spacing system uses Tailwind's default scale (base unit: 0.25rem = 4px), extended with named
tokens for semantic layout use.

### Layout Tokens

| Token                    | Value  | Usage                     |
| ------------------------ | ------ | ------------------------- |
| `--container-padding-x`  | 1.5rem | Horizontal page padding   |
| `--section-padding-y`    | 5rem   | Vertical section rhythm   |
| `--section-padding-y-sm` | 3rem   | Compact sections (mobile) |
| `--grid-gutter`          | 1.5rem | Column gap in grids       |

### Container System

```tsx
// Standard page wrapper
<div className="container">...</div>

// Width-constrained containers
<div className="container container-lg">...</div>
<div className="container container-sm">...</div>

// Section with standard padding
<section className="section">...</section>
<section className="section section-sm">...</section>
```

---

## Border Radius

| Token           | Value   | Tailwind       | Usage                        |
| --------------- | ------- | -------------- | ---------------------------- |
| `--radius-none` | 0px     | `rounded-none` | Sharp technical elements     |
| `--radius-sm`   | 0.25rem | `rounded-sm`   | Badges, chips                |
| `--radius-md`   | 0.5rem  | `rounded-md`   | Buttons, inputs, small cards |
| `--radius-lg`   | 0.75rem | `rounded-lg`   | Menus, popovers              |
| `--radius-xl`   | 1rem    | `rounded-xl`   | Large cards, panels          |
| `--radius-2xl`  | 1.5rem  | `rounded-2xl`  | Featured spotlights          |
| `--radius-3xl`  | 2rem    | `rounded-3xl`  | Decorative shapes            |
| `--radius-full` | 9999px  | `rounded-full` | Avatars, pills, tags         |

---

## Shadow System

Minimal shadows — professional, not overdone.

| Token            | Tailwind       | Usage                       |
| ---------------- | -------------- | --------------------------- |
| `--shadow-xs`    | `shadow-xs`    | Subtle raised state (hover) |
| `--shadow-sm`    | `shadow-sm`    | Inputs, small cards         |
| `--shadow-md`    | `shadow-md`    | Dropdowns, tooltips         |
| `--shadow-lg`    | `shadow-lg`    | Modals, drawers             |
| `--shadow-xl`    | `shadow-xl`    | Floating panels             |
| `--shadow-2xl`   | `shadow-2xl`   | Large containers            |
| `--shadow-inner` | `shadow-inner` | Active / pressed wells      |
| `--shadow-focus` | —              | Focus glow (via var())      |

Dark mode shadows are automatically stronger (higher opacity) via `[data-theme='dark']` overrides.

---

## Breakpoints

Extends Tailwind's default scale with a `3xl` breakpoint.

| Name  | Pixel  | Tailwind | Target device                  |
| ----- | ------ | -------- | ------------------------------ |
| `sm`  | 640px  | `sm:`    | Mobile landscape, small tablet |
| `md`  | 768px  | `md:`    | Tablet portrait                |
| `lg`  | 1024px | `lg:`    | Laptop                         |
| `xl`  | 1280px | `xl:`    | Desktop                        |
| `2xl` | 1536px | `2xl:`   | Wide desktop                   |
| `3xl` | 1920px | `3xl:`   | Ultra-wide monitor             |

```tsx
// Responsive usage
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
```

---

## Animation

### Duration Scale

| Token                | Value  | Usage                              |
| -------------------- | ------ | ---------------------------------- |
| `--duration-instant` | 0ms    | Immediate (state toggles)          |
| `--duration-fast`    | 150ms  | Micro-interactions (hover, active) |
| `--duration-normal`  | 250ms  | Standard enter/exit transitions    |
| `--duration-slow`    | 350ms  | Large panel transitions            |
| `--duration-slower`  | 500ms  | Complex orchestrated sequences     |
| `--duration-loading` | 1500ms | Skeleton shimmer, infinite loops   |

### Easing Presets

| Token             | Curve                                 | Best for                   |
| ----------------- | ------------------------------------- | -------------------------- |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)`          | Most UI transitions        |
| `--ease-out`      | `cubic-bezier(0, 0, 0.2, 1)`          | Elements entering screen   |
| `--ease-in`       | `cubic-bezier(0.4, 0, 1, 1)`          | Elements leaving screen    |
| `--ease-spring`   | `cubic-bezier(0.34, 1.56, 0.64, 1)`   | Springy micro-interactions |
| `--ease-bounce`   | `cubic-bezier(0.68, -0.6, 0.32, 1.6)` | Exaggerated bounce effects |

### Animation Utilities

```tsx
// CSS class approach
<div className="animate-fade-in">Fades in</div>
<div className="animate-slide-up">Slides up</div>
<div className="animate-scale-in">Scales in with spring</div>
<div className="animate-spin">Loading spinner</div>
<div className="animate-shimmer">Shimmer effect</div>

// Skeleton loading
<div className="skeleton w-full h-4 rounded-md" />

// Framer Motion approach (preferred for complex sequences)
import { animation } from '@/styles/tokens'

<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={animation.transition.normal}
/>
```

---

## Z-Index Scale

Never use magic numbers. Always reference a named token.

| Token                | Value | Usage                           |
| -------------------- | ----- | ------------------------------- |
| `--z-base`           | 0     | Default stacking context        |
| `--z-raised`         | 1     | Slightly elevated (hover cards) |
| `--z-dropdown`       | 1000  | Dropdown menus, selects         |
| `--z-sticky`         | 1020  | Sticky headers, toolbars        |
| `--z-fixed`          | 1030  | Fixed position elements         |
| `--z-modal-backdrop` | 1040  | Modal overlay/scrim             |
| `--z-modal`          | 1050  | Modal dialog content            |
| `--z-popover`        | 1060  | Popovers, context menus         |
| `--z-toast`          | 1070  | Toast notifications             |
| `--z-tooltip`        | 1080  | Tooltips                        |
| `--z-overlay`        | 1090  | Top-level overlays              |

```css
/* Usage in CSS */
.my-modal {
  z-index: var(--z-modal);
}
```

---

## Icon System

All icons use **Lucide React** — a single, consistent icon library.

### Icon Component

```tsx
import { Icon } from '@/components/common'
import { SearchIcon, AlertCircleIcon } from 'lucide-react'

// Decorative (hidden from screen readers)
<Icon icon={SearchIcon} size="md" decorative />

// Semantic (announced by screen readers)
<Icon icon={AlertCircleIcon} size="lg" color="danger" aria-label="Error" />
```

### Size Scale

| Size  | Pixels | Usage                            |
| ----- | ------ | -------------------------------- |
| `xs`  | 12px   | Status indicators, dense UI      |
| `sm`  | 14px   | Small labels, compact controls   |
| `md`  | 16px   | Default — most UI icons          |
| `lg`  | 20px   | Navigation, prominent controls   |
| `xl`  | 24px   | Feature icons, empty states      |
| `2xl` | 32px   | Hero icons, large visual accents |

### Color Intents

| Color     | Token                      | Usage                |
| --------- | -------------------------- | -------------------- |
| `default` | `currentColor`             | Inherits from parent |
| `muted`   | `--color-foreground-muted` | De-emphasized icons  |
| `primary` | `--color-primary`          | Brand-colored icons  |
| `success` | `--color-success`          | Positive status      |
| `warning` | `--color-warning`          | Caution status       |
| `danger`  | `--color-danger`           | Error status         |
| `info`    | `--color-info`             | Informational        |
| `accent`  | `--color-accent`           | Decorative accent    |

---

## Accessibility Standards

### Contrast Ratios (WCAG AA)

- **Normal text** (< 18pt): minimum 4.5:1
- **Large text** (≥ 18pt or ≥ 14pt bold): minimum 3:1
- **Interactive components** (borders, focus indicators): minimum 3:1

All semantic colors (`primary`, `success`, `warning`, `danger`, `info`) meet WCAG AA contrast ratios
against their corresponding `*-foreground` values.

### Focus Management

- All interactive elements show a visible focus ring via `:focus-visible`
- Focus ring uses `--color-focus-ring` (= `--color-primary`)
- Focus ring is `2px solid` with `2px offset`
- Never use `outline: none` without providing an alternative

### Reduced Motion

A global `@media (prefers-reduced-motion: reduce)` rule in `globals.css` collapses all animation
durations to `0.01ms`, disabling animations for users who have requested reduced motion.

---

## Future Extension Strategy

### Adding new color tokens

1. Add the OKLCH value to `@theme {}` in `tokens.css`
2. Add a dark mode override in `[data-theme='dark']` and `@media` blocks
3. Add the JS reference to `tokens.ts`
4. No component changes needed — Tailwind utilities are auto-generated

### Adding new typography styles

1. Add `--text-*` size + `--text-*--line-height` companion to `@theme {}`
2. Add the composite `.type-*` class to `typography.css`
3. Document in this file

### Adding new animation

1. Add `@keyframes` to `animations.css`
2. Register `--animate-*` in `@theme {}` inside `animations.css`
3. Tailwind auto-generates the `animate-*` utility class

### Adding new breakpoint

1. Add `--breakpoint-*` to `@theme {}` in `tokens.css`
2. Add the pixel value to `breakpoints` in `tokens.ts`
3. Use the responsive modifier: `4xl:grid-cols-6`

### Phase 2+ considerations

- **Brand refresh**: Update OKLCH values in `tokens.css` — all components update automatically
- **White-label theming**: Replace `@theme {}` root values with client-specific values
- **Design token export**: `tokens.ts` can be extended to export Style Dictionary-compatible JSON
