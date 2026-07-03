import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── XML Formatter ──────────────────────────────────────────────────────── */

function formatXml(xml: string): string {
  const INDENT = '  '
  const parts: string[] = []
  let depth = 0

  const tokens = xml.split(/(<[^>]+>)/g)

  for (const token of tokens) {
    const trimmed = token.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('</')) {
      depth = Math.max(0, depth - 1)
      parts.push(INDENT.repeat(depth) + trimmed)
    } else if (trimmed.startsWith('<') && !trimmed.endsWith('/>') && !trimmed.startsWith('<?') && !trimmed.startsWith('<!')) {
      parts.push(INDENT.repeat(depth) + trimmed)
      depth++
    } else {
      parts.push(INDENT.repeat(depth) + trimmed)
    }
  }

  return parts.join('\n')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('xml-formatter')
if (!tool) throw new Error('[ToolEngine] xml-formatter not found in registry')

export const xmlFormatterConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste XML to format and beautify...',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter XML to format.', { retryable: false }))
      if (!value.trim().startsWith('<'))
        return invalidInput(createToolError('validation-error', 'Input must start with a < tag.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = formatXml(input)
    onProgress(100)
    return result
  },
  resultType: 'code',
  layoutMode: 'split',
})
