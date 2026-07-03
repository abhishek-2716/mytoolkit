import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ColorConverterInput = string
export type ColorConverterResult = StructuredResultItem[]

/* ─── Color Parsing Utilities ────────────────────────────────────────────── */

interface RGBA { r: number; g: number; b: number; a: number }

function hexToRgba(hex: string): RGBA | null {
  const clean = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{3,8}$/.test(clean)) return null
  let r: number, g: number, b: number, a = 255
  if (clean.length === 3 || clean.length === 4) {
    r = parseInt(clean[0]! + clean[0]!, 16)
    g = parseInt(clean[1]! + clean[1]!, 16)
    b = parseInt(clean[2]! + clean[2]!, 16)
    if (clean.length === 4) a = parseInt(clean[3]! + clean[3]!, 16)
  } else if (clean.length === 6 || clean.length === 8) {
    r = parseInt(clean.slice(0, 2), 16)
    g = parseInt(clean.slice(2, 4), 16)
    b = parseInt(clean.slice(4, 6), 16)
    if (clean.length === 8) a = parseInt(clean.slice(6, 8), 16)
  } else return null
  return { r, g, b, a }
}

function parseRgb(input: string): RGBA | null {
  const m = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i)
  if (!m) return null
  return { r: +m[1]!, g: +m[2]!, b: +m[3]!, a: m[4] != null ? Math.round(+m[4]! * 255) : 255 }
}

function parseHsl(input: string): RGBA | null {
  const m = input.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)/i)
  if (!m) return null
  const h = +m[1]! / 360, s = +m[2]! / 100, l = +m[3]! / 100
  const a = m[4] != null ? Math.round(+m[4]! * 255) : 255
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  return {
    r: Math.round(hue2rgb(h + 1/3) * 255),
    g: Math.round(hue2rgb(h) * 255),
    b: Math.round(hue2rgb(h - 1/3) * 255),
    a,
  }
}

function rgbaToHex({ r, g, b, a }: RGBA): string {
  const hex = [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
  return a < 255 ? `#${hex}${a.toString(16).padStart(2, '0')}` : `#${hex}`
}

function rgbaToHsl({ r, g, b, a }: RGBA): string {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return a < 255 ? `hsla(0, 0%, ${Math.round(l * 100)}%, ${(a / 255).toFixed(2)})` : `hsl(0, 0%, ${Math.round(l * 100)}%)`
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  const hs = `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
  return a < 255 ? `hsla(${hs}, ${(a / 255).toFixed(2)})` : `hsl(${hs})`
}

function rgbaToHsv({ r, g, b }: RGBA): string {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn), d = max - min
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d % 6)
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  return `hsv(${h}, ${Math.round(s * 100)}%, ${Math.round(max * 100)}%)`
}

function parseColor(input: string): RGBA | null {
  const trimmed = input.trim()
  if (trimmed.startsWith('#')) return hexToRgba(trimmed)
  if (/^rgba?/i.test(trimmed)) return parseRgb(trimmed)
  if (/^hsla?/i.test(trimmed)) return parseHsl(trimmed)
  return null
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processColorConverter(
  input: ColorConverterInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): ColorConverterResult {
  onProgress(20)
  const rgba = parseColor(input)
  onProgress(80)

  if (!rgba) {
    return [{ label: 'Error', value: 'Could not parse color. Try: #ff0000, rgb(255,0,0), hsl(0,100%,50%)' }]
  }

  onProgress(100)
  return [
    { label: 'HEX', value: rgbaToHex(rgba) },
    { label: 'RGB', value: `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})` },
    { label: 'RGBA', value: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${(rgba.a / 255).toFixed(2)})` },
    { label: 'HSL', value: rgbaToHsl(rgba) },
    { label: 'HSV', value: rgbaToHsv(rgba) },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('color-converter')
if (!tool) throw new Error('[ToolEngine] color-converter not found in registry')

export const colorConverterConfig = defineToolConfig<ColorConverterInput, ColorConverterResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Enter a color: #ff0000, rgb(255,0,0), hsl(0,100%,50%)',
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Please enter a color value.', { retryable: false }))
      return validInput(value)
    },
  },
  process: processColorConverter,
  resultType: 'structured',
  layoutMode: 'split',
})
