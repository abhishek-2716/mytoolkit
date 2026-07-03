import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const ogGeneratorSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
  image: z.string().optional(),
  type: z.enum(['website', 'article', 'product']),
  siteName: z.string().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image']),
})

export type OgGeneratorInput = z.infer<typeof ogGeneratorSchema>
export type OgGeneratorResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processOgGenerator(
  input: OgGeneratorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): OgGeneratorResult {
  onProgress(20)

  const og: string[] = [
    `<!-- Open Graph / Facebook -->`,
    `<meta property="og:type" content="${input.type}">`,
    `<meta property="og:url" content="${input.url}">`,
    `<meta property="og:title" content="${input.title}">`,
    `<meta property="og:description" content="${input.description}">`,
  ]

  if (input.image?.trim()) og.push(`<meta property="og:image" content="${input.image}">`)
  if (input.siteName?.trim()) og.push(`<meta property="og:site_name" content="${input.siteName}">`)

  const twitter: string[] = [
    ``,
    `<!-- Twitter -->`,
    `<meta name="twitter:card" content="${input.twitterCard}">`,
    `<meta name="twitter:url" content="${input.url}">`,
    `<meta name="twitter:title" content="${input.title}">`,
    `<meta name="twitter:description" content="${input.description}">`,
  ]

  if (input.image?.trim()) twitter.push(`<meta name="twitter:image" content="${input.image}">`)

  onProgress(100)
  return [...og, ...twitter].join('\n')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('og-generator')
if (!tool) throw new Error('[ToolEngine] og-generator not found in registry')

export const ogGeneratorConfig = defineToolConfig<OgGeneratorInput, OgGeneratorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: ogGeneratorSchema,
    defaultValues: {
      title: 'My Page Title',
      description: 'A great description for social media sharing.',
      url: 'https://example.com',
      image: '',
      type: 'website',
      siteName: '',
      twitterCard: 'summary_large_image',
    },
  },
  process: processOgGenerator,
  resultType: 'code',
  layoutMode: 'split',
})
