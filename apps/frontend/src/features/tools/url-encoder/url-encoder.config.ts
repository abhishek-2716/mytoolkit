import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const urlEncoderSchema = z.object({
  text: z.string().min(1, 'Please enter a URL or text.'),
  mode: z.enum(['encode', 'decode']),
  encodeMode: z.enum(['component', 'full']),
})

export type UrlEncoderInput = z.infer<typeof urlEncoderSchema>

export interface UrlEncoderResult {
  output: string
  mode: 'encode' | 'decode'
  inputLength: number
  outputLength: number
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processUrlEncoder(
  input: UrlEncoderInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): UrlEncoderResult {
  onProgress(30)

  let output: string
  try {
    if (input.mode === 'encode') {
      output =
        input.encodeMode === 'component'
          ? encodeURIComponent(input.text)
          : encodeURI(input.text)
    } else {
      // Try decodeURIComponent first; fall back to decodeURI
      try {
        output = decodeURIComponent(input.text.replace(/\+/g, ' '))
      } catch {
        output = decodeURI(input.text)
      }
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'validation-error',
      `Invalid URL encoding: ${String(e)}`,
      { retryable: false }
    )
  }

  onProgress(100)
  return {
    output,
    mode: input.mode,
    inputLength: input.text.length,
    outputLength: output.length,
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('url-encoder')

if (!tool) {
  throw new Error('[ToolEngine] url-encoder not found in registry')
}

export const urlEncoderConfig = defineToolConfig<UrlEncoderInput, UrlEncoderResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'form',
    schema: urlEncoderSchema,
    defaultValues: { text: '', mode: 'encode', encodeMode: 'component' },
  },

  process: processUrlEncoder,

  resultType: 'custom',
  layoutMode: 'form',
})
