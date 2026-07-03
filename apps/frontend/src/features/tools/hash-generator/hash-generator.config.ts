import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const hashGeneratorSchema = z.object({
  text: z.string(),
  algorithm: z.enum(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']),
})

export type HashGeneratorInput = z.infer<typeof hashGeneratorSchema>
export type HashGeneratorResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

async function processHashGenerator(
  input: HashGeneratorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): Promise<HashGeneratorResult> {
  onProgress(20)
  const encoded = new TextEncoder().encode(input.text)
  onProgress(50)
  const hashBuffer = await crypto.subtle.digest(input.algorithm, encoded)
  onProgress(90)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  onProgress(100)
  return hashHex
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('hash-generator')
if (!tool) throw new Error('[ToolEngine] hash-generator not found in registry')

export const hashGeneratorConfig = defineToolConfig<HashGeneratorInput, HashGeneratorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: hashGeneratorSchema,
    defaultValues: { text: '', algorithm: 'SHA-256' },
  },
  process: processHashGenerator,
  resultType: 'text',
  layoutMode: 'split',
})
