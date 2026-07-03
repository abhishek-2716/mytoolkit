import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const colorPaletteSchema = z.object({
  baseColor: z.string(),
  paletteType: z.enum([
    'complementary',
    'analogous',
    'triadic',
    'tetradic',
    'monochromatic',
    'split-complementary',
  ]),
  count: z.number().int().min(3).max(10),
})

export type ColorPaletteInput = z.infer<typeof colorPaletteSchema>
export type ColorPaletteResult = string

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const hh = ((h % 360) + 360) % 360
  const ss = s / 100
  const ll = l / 100
  const a = ss * Math.min(ll, 1 - ll)
  const f = (n: number) => {
    const k = (n + hh / 30) % 12
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generatePalette(h: number, s: number, l: number, type: string, count: number): string[] {
  const colors: string[] = []
  switch (type) {
    case 'complementary':
      return [hslToHex(h, s, l), hslToHex(h + 180, s, l)]
    case 'analogous':
      for (let i = 0; i < count; i++) colors.push(hslToHex(h + (i - Math.floor(count / 2)) * 30, s, l))
      return colors
    case 'triadic':
      return [hslToHex(h, s, l), hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)]
    case 'tetradic':
      return [hslToHex(h, s, l), hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)]
    case 'split-complementary':
      return [hslToHex(h, s, l), hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)]
    case 'monochromatic': {
      const step = Math.floor(70 / (count - 1))
      for (let i = 0; i < count; i++) colors.push(hslToHex(h, s, 15 + i * step))
      return colors
    }
    default:
      return [hslToHex(h, s, l)]
  }
}

/* ─── Config ─────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('color-palette-generator')

if (!tool) {
  throw new Error('[ToolEngine] color-palette-generator not found in registry')
}

export const colorPaletteConfig = defineToolConfig<ColorPaletteInput, ColorPaletteResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: colorPaletteSchema,
    defaultValues: {
      baseColor: '#6366f1',
      paletteType: 'analogous',
      count: 5,
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(30)
    const safeHex = /^#[0-9a-fA-F]{6}$/.test(input.baseColor) ? input.baseColor : '#6366f1'
    const [h, s, l] = hexToHsl(safeHex)
    const palette = generatePalette(h, s, l, input.paletteType, input.count)
    onProgress(100)
    return palette.map((hex, i) => `/* Color ${i + 1} */\n${hex}`).join('\n\n')
  },
  resultType: 'code',
  layoutMode: 'split',
})
