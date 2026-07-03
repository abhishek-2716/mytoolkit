import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const sitemapSchema = z.object({
  baseUrl: z.string().min(1, 'Base URL is required'),
  urls: z.string(),
  changefreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']),
  priority: z.string(),
})

export type SitemapInput = z.infer<typeof sitemapSchema>
export type SitemapResult = string

/* ─── Config ─────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('sitemap-generator')

if (!tool) {
  throw new Error('[ToolEngine] sitemap-generator not found in registry')
}

export const sitemapConfig = defineToolConfig<SitemapInput, SitemapResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: sitemapSchema,
    defaultValues: {
      baseUrl: 'https://example.com',
      urls: '/\n/about\n/contact\n/blog',
      changefreq: 'weekly',
      priority: '0.8',
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const base = input.baseUrl.replace(/\/$/, '')
    const urlList = input.urls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean)
    const today = new Date().toISOString().split('T')[0]
    const urlEntries = urlList
      .map((u) => {
        const full = u.startsWith('http') ? u : `${base}${u.startsWith('/') ? u : '/' + u}`
        return [
          '  <url>',
          `    <loc>${full}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          `    <changefreq>${input.changefreq}</changefreq>`,
          `    <priority>${input.priority}</priority>`,
          '  </url>',
        ].join('\n')
      })
      .join('\n')
    onProgress(100)
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urlEntries,
      '</urlset>',
    ].join('\n')
  },
  resultType: 'code',
  layoutMode: 'split',
})
