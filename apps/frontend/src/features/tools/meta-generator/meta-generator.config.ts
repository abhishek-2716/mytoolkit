import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const metaGeneratorSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.string(),
  author: z.string().optional(),
  robots: z.string(),
  charset: z.string(),
  viewport: z.string(),
})

export type MetaGeneratorInput = z.infer<typeof metaGeneratorSchema>
export type MetaGeneratorResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processMetaGenerator(
  input: MetaGeneratorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): MetaGeneratorResult {
  onProgress(20)

  const lines: string[] = [
    `<meta charset="${input.charset}">`,
    `<meta name="viewport" content="${input.viewport}">`,
    `<title>${input.title}</title>`,
    `<meta name="description" content="${input.description}">`,
  ]

  if (input.keywords.trim()) lines.push(`<meta name="keywords" content="${input.keywords}">`)
  if (input.author?.trim()) lines.push(`<meta name="author" content="${input.author}">`)
  if (input.robots.trim()) lines.push(`<meta name="robots" content="${input.robots}">`)

  onProgress(100)
  return lines.join('\n')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('meta-generator')
if (!tool) throw new Error('[ToolEngine] meta-generator not found in registry')

export const metaGeneratorConfig = defineToolConfig<MetaGeneratorInput, MetaGeneratorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: metaGeneratorSchema,
    defaultValues: {
      title: 'My Awesome Page',
      description: 'A brief description of my page for search engines.',
      keywords: 'keyword1, keyword2, keyword3',
      author: '',
      robots: 'index, follow',
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1.0',
    },
  },
  process: processMetaGenerator,
  resultType: 'code',
  layoutMode: 'split',
})
