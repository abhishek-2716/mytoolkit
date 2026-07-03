import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type MarkdownPreviewInput = string
export type MarkdownPreviewResult = string

/* ─── Config ─────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('markdown-preview')

if (!tool) {
  throw new Error('[ToolEngine] markdown-preview not found in registry')
}

export const markdownPreviewConfig = defineToolConfig<MarkdownPreviewInput, MarkdownPreviewResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder:
      '# Hello World\n\nWrite your **markdown** here and see it rendered live.\n\n- Item 1\n- Item 2\n\n```js\nconsole.log("Hello!")\n```',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some markdown text.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },
  process: (_input, _signal, onProgress) => {
    onProgress(50)
    onProgress(100)
    return _input
  },
  resultType: 'markdown',
  layoutMode: 'split',
})
