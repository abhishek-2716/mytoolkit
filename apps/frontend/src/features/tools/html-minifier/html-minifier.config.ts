import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── HTML Minifier ──────────────────────────────────────────────────────── */

function minifyHtml(html: string): string {
  // Preserve content inside pre, code, script, style, textarea
  const preserved: string[] = []
  let result = html

  const preserve = (tag: string) => {
    const regex = new RegExp(`<${tag}(\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'gi')
    result = result.replace(regex, (match) => {
      const idx = preserved.push(match) - 1
      return `\x00PRESERVED_${idx}\x00`
    })
  }

  preserve('pre')
  preserve('textarea')
  preserve('script')
  preserve('style')
  preserve('code')

  // Remove HTML comments (not IE conditional)
  result = result.replace(/<!--(?!\[if)[\s\S]*?-->/g, '')

  // Collapse whitespace between tags
  result = result.replace(/>\s+</g, '><')

  // Collapse multiple spaces into one
  result = result.replace(/\s{2,}/g, ' ')

  // Remove whitespace around block-level elements
  result = result.replace(/\s*(<\/?(div|p|h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|section|article|header|footer|nav|main|aside|figure|figcaption|blockquote|form|fieldset|legend|details|summary)[^>]*>)\s*/gi, '$1')

  // Restore preserved content
  result = result.replace(/\x00PRESERVED_(\d+)\x00/g, (_, idx) => preserved[parseInt(idx, 10)] ?? '')

  return result.trim()
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('html-minifier')
if (!tool) throw new Error('[ToolEngine] html-minifier not found in registry')

export const htmlMinifierConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste HTML to minify and compress...',
    maxLength: 1_000_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter HTML to minify.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = minifyHtml(input)
    onProgress(100)
    return result
  },
  resultType: 'text',
  layoutMode: 'split',
})
