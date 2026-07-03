import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const base64Schema = z.object({
  text: z.string().min(1, 'Please enter some text.'),
  mode: z.enum(['encode', 'decode']),
  urlSafe: z.boolean(),
})

export type Base64Input = z.infer<typeof base64Schema>

export interface Base64Result {
  output: string
  mode: 'encode' | 'decode'
  inputLength: number
  outputLength: number
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function encodeBase64(text: string, urlSafe: boolean): string {
  // Use TextEncoder to handle full UTF-8 range
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  let encoded = btoa(binary)
  if (urlSafe) {
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  return encoded
}

function decodeBase64(text: string): string {
  // Restore standard Base64 from URL-safe variant
  const normalized = text
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/\s/g, '')
  const padded = normalized + '=='.slice(0, (4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function processBase64(
  input: Base64Input,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): Base64Result {
  onProgress(30)

  let output: string
  try {
    if (input.mode === 'encode') {
      output = encodeBase64(input.text, input.urlSafe)
    } else {
      output = decodeBase64(input.text)
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'validation-error',
      input.mode === 'decode'
        ? 'Invalid Base64 string. Please check your input.'
        : `Encoding failed: ${String(e)}`,
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

const tool = getToolBySlug('base64-encoder')

if (!tool) {
  throw new Error('[ToolEngine] base64-encoder not found in registry')
}

export const base64Config = defineToolConfig<Base64Input, Base64Result>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'form',
    schema: base64Schema,
    defaultValues: { text: '', mode: 'encode', urlSafe: false },
  },

  process: processBase64,

  resultType: 'custom',
  layoutMode: 'form',
})
