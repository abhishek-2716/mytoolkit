/**
 * Overlay & Modal/Drawer Design System — Variant Engine
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for all overlay, modal, and drawer styles.
 * Pattern mirrors buttonVariants.ts and cardVariants.ts.
 */

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

/** Modal width presets */
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

/** Drawer slide-in direction */
export type DrawerPlacement = 'left' | 'right' | 'bottom' | 'top'

/** Drawer width/height presets */
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

/* ─── Modal sizes ────────────────────────────────────────────────────────── */

export const MODAL_SIZES: Record<ModalSize, string> = {
  xs:   'max-w-xs',
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-none w-full h-full rounded-none',
}

/* ─── Drawer sizes ───────────────────────────────────────────────────────── */

export const DRAWER_WIDTHS: Record<DrawerSize, string> = {
  xs:   'w-64',
  sm:   'w-80',
  md:   'w-96',
  lg:   'w-[32rem]',
  xl:   'w-[40rem]',
  full: 'w-full',
}

export const DRAWER_HEIGHTS: Record<DrawerSize, string> = {
  xs:   'max-h-[40vh]',
  sm:   'max-h-[50vh]',
  md:   'max-h-[60vh]',
  lg:   'max-h-[75vh]',
  xl:   'max-h-[90vh]',
  full: 'h-full max-h-full',
}

/* ─── Overlay backdrop ───────────────────────────────────────────────────── */

export function backdropClass(className?: string): string {
  return cn(
    'fixed inset-0 bg-overlay',
    className,
  )
}

/* ─── Modal container ────────────────────────────────────────────────────── */

export interface ModalVariantsOptions {
  size?: ModalSize
  className?: string
}

export function modalVariants({ size = 'md', className }: ModalVariantsOptions = {}): string {
  return cn(
    // Structure
    'relative bg-surface rounded-xl shadow-xl w-full flex flex-col',
    // Overflow: header/footer fixed, body scrolls
    'max-h-[90vh]',
    // Size
    MODAL_SIZES[size],
    className,
  )
}

/* ─── Drawer container ───────────────────────────────────────────────────── */

export interface DrawerVariantsOptions {
  placement?: DrawerPlacement
  size?: DrawerSize
  className?: string
}

export function drawerVariants({
  placement = 'right',
  size = 'md',
  className,
}: DrawerVariantsOptions = {}): string {
  const base = 'fixed bg-surface shadow-xl flex flex-col'

  const placements: Record<DrawerPlacement, string> = {
    right:  `right-0 top-0 h-full ${DRAWER_WIDTHS[size]}`,
    left:   `left-0 top-0 h-full ${DRAWER_WIDTHS[size]}`,
    bottom: `bottom-0 left-0 right-0 w-full ${DRAWER_HEIGHTS[size]} rounded-t-xl`,
    top:    `top-0 left-0 right-0 w-full ${DRAWER_HEIGHTS[size]} rounded-b-xl`,
  }

  return cn(base, placements[placement], className)
}

/* ─── Framer Motion animation variants ──────────────────────────────────── */

export const BACKDROP_ANIMATION = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1 },
  exit:     { opacity: 0 },
  transition: { duration: 0.2 },
}

export const MODAL_ANIMATION = {
  initial:  { opacity: 0, scale: 0.96, y: 8 },
  animate:  { opacity: 1, scale: 1,    y: 0 },
  exit:     { opacity: 0, scale: 0.96, y: 8 },
  transition: { duration: 0.2, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
}

export const DRAWER_ANIMATIONS: Record<DrawerPlacement, object> = {
  right: {
    initial:  { x: '100%' },
    animate:  { x: 0 },
    exit:     { x: '100%' },
    transition: { duration: 0.25, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
  },
  left: {
    initial:  { x: '-100%' },
    animate:  { x: 0 },
    exit:     { x: '-100%' },
    transition: { duration: 0.25, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
  },
  bottom: {
    initial:  { y: '100%' },
    animate:  { y: 0 },
    exit:     { y: '100%' },
    transition: { duration: 0.25, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
  },
  top: {
    initial:  { y: '-100%' },
    animate:  { y: 0 },
    exit:     { y: '-100%' },
    transition: { duration: 0.25, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
  },
}
