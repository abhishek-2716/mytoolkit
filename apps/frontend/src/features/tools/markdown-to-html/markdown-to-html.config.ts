import { marked } from 'marked'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('markdown-to-html')
if (!tool) throw new Error('[ToolEngine] markdown-to-html not found in registry')

export const markdownToHtmlConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: '# Hello World\n\nType **Markdown** here to convert to HTML.\n\n- Item 1\n- Item 2',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter Markdown to convert.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = marked.parse(input) as string
    onProgress(100)
    return result
  },
  resultType: 'code',
  layoutMode: 'split',
})
