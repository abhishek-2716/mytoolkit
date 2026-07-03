import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── CSS Beautifier ─────────────────────────────────────────────────────── */

function beautifyCss(css: string): string {
  // Remove existing comments for clean processing
  let clean = css.replace(/\/\*[\s\S]*?\*\//g, '')

  // Normalize whitespace
  clean = clean.replace(/\s+/g, ' ').trim()

  let result = ''
  let indentLevel = 0
  const INDENT = '  '

  let i = 0
  while (i < clean.length) {
    const ch = clean[i]!

    if (ch === '{') {
      result += ' {\n'
      indentLevel++
      result += INDENT.repeat(indentLevel)
      i++
    } else if (ch === '}') {
      // Remove trailing spaces/newline before }
      result = result.trimEnd()
      result += '\n'
      indentLevel = Math.max(0, indentLevel - 1)
      result += INDENT.repeat(indentLevel) + '}\n'
      if (indentLevel === 0) result += '\n'
      i++
    } else if (ch === ';') {
      result += ';\n'
      // Peek if next non-space is not }
      let j = i + 1
      while (j < clean.length && clean[j] === ' ') j++
      if (clean[j] !== '}') {
        result += INDENT.repeat(indentLevel)
      }
      i++
    } else if (ch === ':' && i + 1 < clean.length && clean[i + 1] !== ':') {
      // property: value - ensure space after colon
      result += ': '
      i++
      // skip existing space
      if (i < clean.length && clean[i] === ' ') i++
    } else if (ch === ' ' && result.endsWith('\n')) {
      // skip leading space after newline
      i++
    } else {
      result += ch
      i++
    }
  }

  return result.trim()
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('css-beautifier')
if (!tool) throw new Error('[ToolEngine] css-beautifier not found in registry')

export const cssBeautifierConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste CSS code to beautify and format...',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter CSS to beautify.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = beautifyCss(input)
    onProgress(100)
    return result
  },
  resultType: 'code',
  layoutMode: 'split',
})
