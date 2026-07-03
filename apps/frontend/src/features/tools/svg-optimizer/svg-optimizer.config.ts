import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── SVG Optimizer ──────────────────────────────────────────────────────── */

function optimizeSvg(svg: string): string {
  let result = svg

  // Remove XML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '')

  // Remove metadata elements
  result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
  result = result.replace(/<sodipodi:namedview[\s\S]*?\/>/gi, '')
  result = result.replace(/<sodipodi:namedview[\s\S]*?<\/sodipodi:namedview>/gi, '')

  // Remove inkscape and sodipodi namespace attributes
  result = result.replace(/\s+inkscape:[a-z\-:]+="[^"]*"/gi, '')
  result = result.replace(/\s+sodipodi:[a-z\-:]+="[^"]*"/gi, '')

  // Remove xmlns for inkscape/sodipodi
  result = result.replace(/\s+xmlns:inkscape="[^"]*"/gi, '')
  result = result.replace(/\s+xmlns:sodipodi="[^"]*"/gi, '')
  result = result.replace(/\s+xmlns:dc="[^"]*"/gi, '')
  result = result.replace(/\s+xmlns:cc="[^"]*"/gi, '')
  result = result.replace(/\s+xmlns:rdf="[^"]*"/gi, '')

  // Remove empty groups <g></g> and <g/>
  result = result.replace(/<g\s*\/>/g, '')
  result = result.replace(/<g[^>]*>\s*<\/g>/g, '')

  // Remove xml:space="preserve"
  result = result.replace(/\s+xml:space="[^"]*"/gi, '')

  // Remove default fill="black"
  result = result.replace(/\s+fill="black"/gi, '')

  // Collapse multiple whitespace between tags
  result = result.replace(/>\s{2,}</g, '><')

  // Remove whitespace at start of lines
  result = result.replace(/^\s+/gm, '')

  // Collapse multiple blank lines
  result = result.replace(/\n{3,}/g, '\n\n')

  return result.trim()
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('svg-optimizer')
if (!tool) throw new Error('[ToolEngine] svg-optimizer not found in registry')

export const svgOptimizerConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste SVG code to optimize and minify...',
    maxLength: 1_000_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter SVG code to optimize.', { retryable: false }))
      if (!value.trim().includes('<svg'))
        return invalidInput(createToolError('validation-error', 'Input does not appear to be valid SVG.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = optimizeSvg(input)
    onProgress(100)
    return result
  },
  resultType: 'code',
  layoutMode: 'split',
})
