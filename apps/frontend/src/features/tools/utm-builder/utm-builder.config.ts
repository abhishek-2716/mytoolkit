import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const utmBuilderSchema = z.object({
  websiteUrl: z.string().url('Enter a valid URL'),
  source: z.string().min(1, 'Source is required'),
  medium: z.string().min(1, 'Medium is required'),
  campaign: z.string().min(1, 'Campaign is required'),
  term: z.string().optional(),
  content: z.string().optional(),
})

export type UtmBuilderInput = z.infer<typeof utmBuilderSchema>

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('utm-builder')
if (!tool) throw new Error('[ToolEngine] utm-builder not found in registry')

export const utmBuilderConfig = defineToolConfig<UtmBuilderInput, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: utmBuilderSchema,
    defaultValues: {
      websiteUrl: 'https://example.com',
      source: 'newsletter',
      medium: 'email',
      campaign: 'summer-sale',
      term: '',
      content: '',
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const params = new URLSearchParams()
    params.set('utm_source', input.source)
    params.set('utm_medium', input.medium)
    params.set('utm_campaign', input.campaign)
    if (input.term?.trim()) params.set('utm_term', input.term.trim())
    if (input.content?.trim()) params.set('utm_content', input.content.trim())

    const base = input.websiteUrl.endsWith('/') ? input.websiteUrl.slice(0, -1) : input.websiteUrl
    onProgress(100)
    return `${base}?${params.toString()}`
  },
  resultType: 'text',
  layoutMode: 'split',
})
