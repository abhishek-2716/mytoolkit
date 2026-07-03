import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const uuidGeneratorSchema = z.object({
  count: z.number().int().min(1).max(100),
  format: z.enum(['lowercase', 'uppercase']),
  hyphens: z.boolean(),
})

export type UuidGeneratorInput = z.infer<typeof uuidGeneratorSchema>

export interface UuidGeneratorResult {
  uuids: string[]
  count: number
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processUuidGenerator(
  input: UuidGeneratorInput,
  signal: AbortSignal,
  onProgress: (p: number) => void
): UuidGeneratorResult {
  const uuids: string[] = []

  for (let i = 0; i < input.count; i++) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    if (signal.aborted) throw createToolError('cancelled', 'Cancelled.')

    let uuid: string = crypto.randomUUID()

    if (!input.hyphens) {
      uuid = uuid.replace(/-/g, '')
    }
    if (input.format === 'uppercase') {
      uuid = uuid.toUpperCase()
    }

    uuids.push(uuid)
    onProgress(Math.round(((i + 1) / input.count) * 100))
  }

  return { uuids, count: uuids.length }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('uuid-generator')

if (!tool) {
  throw new Error('[ToolEngine] uuid-generator not found in registry')
}

export const uuidGeneratorConfig = defineToolConfig<UuidGeneratorInput, UuidGeneratorResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'form',
    schema: uuidGeneratorSchema,
    defaultValues: {
      count: 1,
      format: 'lowercase',
      hyphens: true,
    },
  },

  process: processUuidGenerator,

  resultType: 'text',
  layoutMode: 'form',
})
