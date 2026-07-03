import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const schemaMarkupSchema = z.object({
  type: z.enum(['Website', 'Article', 'BreadcrumbList', 'Organization', 'FAQPage', 'LocalBusiness']),
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Enter a valid URL'),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  datePublished: z.string().optional(),
  authorName: z.string().optional(),
})

export type SchemaMarkupInput = z.infer<typeof schemaMarkupSchema>

/* ─── Schema generators ──────────────────────────────────────────────────── */

function buildSchema(input: SchemaMarkupInput): Record<string, unknown> {
  const base = {
    '@context': 'https://schema.org',
    '@type': input.type,
    name: input.name,
    url: input.url,
  }

  switch (input.type) {
    case 'Website':
      return { ...base, description: input.description || undefined }

    case 'Article':
      return {
        ...base,
        headline: input.name,
        description: input.description || undefined,
        datePublished: input.datePublished || undefined,
        author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
      }

    case 'Organization':
      return {
        ...base,
        description: input.description || undefined,
        logo: input.logoUrl ? { '@type': 'ImageObject', url: input.logoUrl } : undefined,
      }

    case 'LocalBusiness':
      return {
        ...base,
        '@type': 'LocalBusiness',
        description: input.description || undefined,
        logo: input.logoUrl || undefined,
      }

    case 'FAQPage':
      return {
        ...base,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Example Question?',
            acceptedAnswer: { '@type': 'Answer', text: 'Example answer text.' },
          },
        ],
      }

    case 'BreadcrumbList':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: input.url },
          { '@type': 'ListItem', position: 2, name: input.name, item: `${input.url}/page` },
        ],
      }

    default:
      return base
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('schema-markup-generator')
if (!tool) throw new Error('[ToolEngine] schema-markup-generator not found in registry')

export const schemaMarkupConfig = defineToolConfig<SchemaMarkupInput, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: schemaMarkupSchema,
    defaultValues: {
      type: 'Website',
      name: 'My Website',
      url: 'https://example.com',
      description: '',
      logoUrl: '',
      datePublished: '',
      authorName: '',
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const schema = buildSchema(input)
    // Remove undefined values
    const clean = JSON.parse(JSON.stringify(schema)) as Record<string, unknown>
    const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(clean, null, 2)}\n</script>`
    onProgress(100)
    return jsonLd
  },
  resultType: 'code',
  layoutMode: 'split',
})
