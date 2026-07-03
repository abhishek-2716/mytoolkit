import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Config (shared, no renderResult) ──────────────────────────────────── */

const tool = getToolBySlug('html-preview')
if (!tool) throw new Error('[ToolEngine] html-preview not found in registry')

export const htmlPreviewConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: '<h1>Hello World</h1>\n<p>Type HTML here to preview it live...</p>',
    maxLength: 100_000,
    validate: (v) =>
      v.trim()
        ? validInput(v)
        : invalidInput(createToolError('validation-error', 'Enter some HTML.', { retryable: false })),
  },
  process: (input, _s, onProgress) => {
    onProgress(100)
    return input
  },
  resultType: 'custom',
  layoutMode: 'split',
})
