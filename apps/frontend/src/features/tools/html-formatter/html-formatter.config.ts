import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── HTML Formatter ─────────────────────────────────────────────────────── */

function formatHtml(html: string): string {
  const INDENT = '  '
  // Void elements that don't need closing
  const voidTags = new Set([
    'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr',
  ])

  const parts: string[] = []
  let depth = 0
  // Tokenize by tags
  const tokens = html.split(/(<[^>]+>)/g)

  for (const token of tokens) {
    const trimmed = token.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('</')) {
      // Closing tag
      depth = Math.max(0, depth - 1)
      parts.push(INDENT.repeat(depth) + trimmed)
    } else if (trimmed.startsWith('<') && !trimmed.startsWith('<!') && !trimmed.endsWith('/>')) {
      // Opening tag
      const tagName = trimmed.match(/^<([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase() ?? ''
      parts.push(INDENT.repeat(depth) + trimmed)
      if (!voidTags.has(tagName)) {
        depth++
      }
    } else if (trimmed.startsWith('<')) {
      // Self-closing or doctype/comment
      parts.push(INDENT.repeat(depth) + trimmed)
    } else {
      // Text node
      parts.push(INDENT.repeat(depth) + trimmed)
    }
  }

  return parts.join('\n')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('html-formatter')
if (!tool) throw new Error('[ToolEngine] html-formatter not found in registry')

export const htmlFormatterConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste HTML to format and beautify...\n\nExample: <html><head><title>Test</title></head><body><p>Hello</p></body></html>',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter HTML to format.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = formatHtml(input)
    onProgress(100)
    return result
  },
  resultType: 'code',
  layoutMode: 'split',
})
