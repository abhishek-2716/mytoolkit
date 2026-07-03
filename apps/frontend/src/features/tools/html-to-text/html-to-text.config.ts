import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── HTML Entity Decoding ───────────────────────────────────────────────── */

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
  '&nbsp;': ' ', '&copy;': '©', '&reg;': '®', '&trade;': '™',
  '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&laquo;': '«',
  '&raquo;': '»', '&euro;': '€', '&pound;': '£', '&yen;': '¥',
}

function decodeHtmlEntities(text: string): string {
  // Named entities
  let result = text.replace(/&[a-zA-Z]+;/g, (match) => HTML_ENTITIES[match] ?? match)
  // Numeric decimal entities
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  // Numeric hex entities
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  return result
}

function stripHtmlTags(html: string): string {
  // Replace block-level tags with newlines to preserve line breaks
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|h[1-6]|li|tr|td|th|blockquote|pre)[^>]*>/gi, '\n')
  // Strip all remaining tags
  const stripped = withBreaks.replace(/<[^>]+>/g, '')
  // Collapse multiple blank lines
  return stripped.replace(/\n{3,}/g, '\n\n').trim()
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('html-to-text')
if (!tool) throw new Error('[ToolEngine] html-to-text not found in registry')

export const htmlToTextConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste HTML content here to extract plain text...\n\nExample: <h1>Hello</h1><p>World</p>',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter HTML content to convert.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = decodeHtmlEntities(stripHtmlTags(input))
    onProgress(100)
    return result
  },
  resultType: 'text',
  layoutMode: 'split',
})
