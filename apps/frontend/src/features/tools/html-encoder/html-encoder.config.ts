import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const htmlEncoderSchema = z.object({
  text: z.string().min(1, 'Please enter some text.'),
  mode: z.enum(['encode', 'decode']),
  encodeQuotes: z.boolean(),
})

export type HtmlEncoderInput = z.infer<typeof htmlEncoderSchema>

export interface HtmlEncoderResult {
  output: string
  mode: 'encode' | 'decode'
  inputLength: number
  outputLength: number
}

/* ─── HTML Entity Maps ───────────────────────────────────────────────────── */

const ENCODE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const DECODE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': '\u00A0',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&euro;': '€',
  '&pound;': '£',
  '&yen;': '¥',
  '&cent;': '¢',
  '&mdash;': '—',
  '&ndash;': '–',
  '&laquo;': '«',
  '&raquo;': '»',
  '&hellip;': '…',
}

function encodeHtml(text: string, encodeQuotes: boolean): string {
  return text.replace(/[&<>"']/g, (char) => {
    if (!encodeQuotes && (char === '"' || char === "'")) return char
    return ENCODE_MAP[char] ?? char
  })
}

function decodeHtml(text: string): string {
  // Decode named entities
  let result = text.replace(/&[a-zA-Z]+;/g, (entity) => DECODE_MAP[entity] ?? entity)
  // Decode numeric decimal entities (&#123;)
  result = result.replace(/&#(\d+);/g, (_, num: string) =>
    String.fromCodePoint(parseInt(num, 10))
  )
  // Decode numeric hex entities (&#x1F600;)
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
    String.fromCodePoint(parseInt(hex, 16))
  )
  return result
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processHtmlEncoder(
  input: HtmlEncoderInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): HtmlEncoderResult {
  onProgress(30)

  let output: string
  try {
    output =
      input.mode === 'encode'
        ? encodeHtml(input.text, input.encodeQuotes)
        : decodeHtml(input.text)
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError('validation-error', `Failed: ${String(e)}`, { retryable: false })
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

const tool = getToolBySlug('html-encoder')

if (!tool) {
  throw new Error('[ToolEngine] html-encoder not found in registry')
}

export const htmlEncoderConfig = defineToolConfig<HtmlEncoderInput, HtmlEncoderResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'form',
    schema: htmlEncoderSchema,
    defaultValues: { text: '', mode: 'encode', encodeQuotes: true },
  },

  process: processHtmlEncoder,

  resultType: 'custom',
  layoutMode: 'form',
})
