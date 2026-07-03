import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── CSS Minifier ───────────────────────────────────────────────────────── */

function minifyCss(css: string): string {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around { } : ; , >
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    // Collapse multiple spaces/newlines
    .replace(/\s+/g, ' ')
    // Remove space before {
    .replace(/\s*\{\s*/g, '{')
    // Remove last semicolon before }
    .replace(/;}/g, '}')
    // Remove leading/trailing whitespace
    .trim()
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('css-minifier')
if (!tool) throw new Error('[ToolEngine] css-minifier not found in registry')

export const cssMinifierConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste CSS code to minify...',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter CSS to minify.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = minifyCss(input)
    onProgress(100)
    return result
  },
  resultType: 'text',
  layoutMode: 'split',
})
