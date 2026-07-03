import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ──────────────────────────────────────────────────────────────── */

export const colorContrastSchema = z.object({
  foreground: z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Must be a valid hex color'),
  background: z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Must be a valid hex color'),
})

export type ColorContrastInput = z.infer<typeof colorContrastSchema>

/* ─── WCAG Helpers ───────────────────────────────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return [r, g, b]
  }
  return [0, 0, 0]
}

function linearize(c: number): number {
  const srgb = c / 255
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function passOrFail(passes: boolean): { value: string; color: string } {
  return passes
    ? { value: 'Pass ✓', color: 'text-green-500' }
    : { value: 'Fail ✗', color: 'text-destructive' }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('color-contrast-checker')
if (!tool) throw new Error('[ToolEngine] color-contrast-checker not found in registry')

export const colorContrastConfig = defineToolConfig<ColorContrastInput, StructuredResultItem[]>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: colorContrastSchema,
    defaultValues: { foreground: '#000000', background: '#ffffff' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const ratio = contrastRatio(input.foreground, input.background)
    const ratioStr = `${ratio.toFixed(2)}:1`

    const aaNormal = passOrFail(ratio >= 4.5)
    const aaLarge = passOrFail(ratio >= 3)
    const aaaNormal = passOrFail(ratio >= 7)
    const aaaLarge = passOrFail(ratio >= 4.5)

    onProgress(100)
    return [
      { label: 'Contrast Ratio', value: ratioStr, valueColorClass: ratio >= 4.5 ? 'text-green-500' : ratio >= 3 ? 'text-amber-500' : 'text-destructive' },
      { label: 'WCAG AA — Normal Text (≥4.5:1)', value: aaNormal.value, valueColorClass: aaNormal.color },
      { label: 'WCAG AA — Large Text (≥3:1)', value: aaLarge.value, valueColorClass: aaLarge.color },
      { label: 'WCAG AAA — Normal Text (≥7:1)', value: aaaNormal.value, valueColorClass: aaaNormal.color },
      { label: 'WCAG AAA — Large Text (≥4.5:1)', value: aaaLarge.value, valueColorClass: aaaLarge.color },
    ] satisfies StructuredResultItem[]
  },
  resultType: 'structured',
  layoutMode: 'split',
})
