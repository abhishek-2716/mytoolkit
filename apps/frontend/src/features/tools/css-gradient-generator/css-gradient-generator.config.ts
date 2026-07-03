import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const cssGradientGeneratorSchema = z.object({
  type: z.enum(['linear', 'radial', 'conic']),
  direction: z.string(),
  color1: z.string(),
  color2: z.string(),
  color3: z.string().optional(),
  stops: z.string(),
})

export type CssGradientGeneratorInput = z.infer<typeof cssGradientGeneratorSchema>
export type CssGradientGeneratorResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processCssGradientGenerator(
  input: CssGradientGeneratorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): CssGradientGeneratorResult {
  onProgress(20)

  const stopList = input.stops.split(',').map((s) => s.trim())
  const colors = [input.color1, input.color2, input.color3].filter(Boolean)

  const colorStops = colors.map((c, i) => {
    const stop = stopList[i] ?? ''
    return stop ? `${c} ${stop}` : c
  }).join(', ')

  let gradient: string

  if (input.type === 'linear') {
    gradient = `linear-gradient(${input.direction}, ${colorStops})`
  } else if (input.type === 'radial') {
    gradient = `radial-gradient(circle at center, ${colorStops})`
  } else {
    gradient = `conic-gradient(from 0deg, ${colorStops})`
  }

  onProgress(100)
  return `background: ${gradient};\nbackground-image: ${gradient};`
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('css-gradient-generator')
if (!tool) throw new Error('[ToolEngine] css-gradient-generator not found in registry')

export const cssGradientGeneratorConfig = defineToolConfig<CssGradientGeneratorInput, CssGradientGeneratorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: cssGradientGeneratorSchema,
    defaultValues: {
      type: 'linear',
      direction: 'to right',
      color1: '#6366f1',
      color2: '#8b5cf6',
      color3: '',
      stops: '0%, 100%',
    },
  },
  process: processCssGradientGenerator,
  resultType: 'code',
  layoutMode: 'split',
})
