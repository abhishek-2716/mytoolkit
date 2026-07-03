import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const robotsGeneratorSchema = z.object({
  userAgent: z.string(),
  allowAll: z.boolean(),
  disallowPaths: z.string(),
  crawlDelay: z.number().optional(),
  sitemapUrl: z.string().optional(),
})

export type RobotsGeneratorInput = z.infer<typeof robotsGeneratorSchema>
export type RobotsGeneratorResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processRobotsGenerator(
  input: RobotsGeneratorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): RobotsGeneratorResult {
  onProgress(20)

  const lines: string[] = [`User-agent: ${input.userAgent || '*'}`]

  if (input.allowAll) {
    lines.push('Allow: /')
  }

  const paths = input.disallowPaths
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)

  for (const path of paths) {
    lines.push(`Disallow: ${path.startsWith('/') ? path : '/' + path}`)
  }

  if (!input.allowAll && paths.length === 0) {
    lines.push('Disallow:')
  }

  if (input.crawlDelay != null && !isNaN(input.crawlDelay)) {
    lines.push(`Crawl-delay: ${input.crawlDelay}`)
  }

  if (input.sitemapUrl?.trim()) {
    lines.push('')
    lines.push(`Sitemap: ${input.sitemapUrl.trim()}`)
  }

  onProgress(100)
  return lines.join('\n')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('robots-generator')
if (!tool) throw new Error('[ToolEngine] robots-generator not found in registry')

export const robotsGeneratorConfig = defineToolConfig<RobotsGeneratorInput, RobotsGeneratorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: robotsGeneratorSchema,
    defaultValues: {
      userAgent: '*',
      allowAll: false,
      disallowPaths: '/admin\n/private\n/tmp',
      crawlDelay: undefined,
      sitemapUrl: '',
    },
  },
  process: processRobotsGenerator,
  resultType: 'code',
  layoutMode: 'split',
})
