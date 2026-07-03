import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── XML → JSON conversion ──────────────────────────────────────────────── */

function domNodeToJson(node: Node): unknown {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim() ?? ''
    return text || undefined
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return undefined

  const el = node as Element
  const result: Record<string, unknown> = {}

  // Attributes
  for (const attr of Array.from(el.attributes)) {
    result[`@${attr.name}`] = attr.value
  }

  // Children
  const childNodes = Array.from(el.childNodes).filter((n) => {
    if (n.nodeType === Node.TEXT_NODE) return (n.textContent?.trim() ?? '') !== ''
    return n.nodeType === Node.ELEMENT_NODE
  })

  if (childNodes.length === 0) {
    const text = el.textContent?.trim() ?? ''
    if (Object.keys(result).length === 0) return text
    result['#text'] = text
    return result
  }

  for (const child of childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      result['#text'] = child.textContent?.trim()
      continue
    }
    const childEl = child as Element
    const childJson = domNodeToJson(childEl)
    const key = childEl.tagName

    if (key in result) {
      if (!Array.isArray(result[key])) result[key] = [result[key]]
      ;(result[key] as unknown[]).push(childJson)
    } else {
      result[key] = childJson
    }
  }

  return result
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('xml-to-json')
if (!tool) throw new Error('[ToolEngine] xml-to-json not found in registry')

export const xmlToJsonConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste XML to convert to JSON...',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter XML to convert.', { retryable: false }))
      if (!value.trim().startsWith('<'))
        return invalidInput(createToolError('validation-error', 'Input must start with a < tag.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'text/xml')
    const parseError = doc.querySelector('parsererror')
    if (parseError) throw new Error('Invalid XML: ' + (parseError.textContent ?? 'Parse error'))
    onProgress(60)
    const root = doc.documentElement
    const json = { [root.tagName]: domNodeToJson(root) }
    onProgress(100)
    return JSON.stringify(json, null, 2)
  },
  resultType: 'code',
  layoutMode: 'split',
})
