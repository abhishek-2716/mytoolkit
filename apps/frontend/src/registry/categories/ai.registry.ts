import {
  Brain,
  ImageUp,
  Languages,
  Pen,
  Sparkles,
} from 'lucide-react'

import type { ToolMeta } from '../types'

/**
 * AI Tools Registry
 * ══════════════════════════════════════════════════════════════════════════
 * These tools are registered now for SEO purposes but marked 'coming-soon'.
 * They will be implemented in Phase 5 (Sprint 12+) using AI APIs.
 * Having them in the registry means:
 *  - SEO landing pages can be built immediately
 *  - Search shows them with "Coming Soon" badges
 *  - Internal links point to future tool pages (Google discovers them)
 *  - The platform signals that AI tools are part of the roadmap
 * ══════════════════════════════════════════════════════════════════════════
 */

export const aiTools: ToolMeta[] = [
  {
    id: 'ai-text-summarizer',
    slug: 'ai-text-summarizer',
    title: 'AI Text Summarizer',
    shortTitle: 'AI Summarizer',
    description:
      'Summarize long articles, research papers, or documents into concise summaries using AI. Control summary length and style. Get key points as bullet points.',
    shortDescription: 'Summarize long text into concise AI-powered summaries.',
    category: 'ai',
    subcategory: 'text',
    icon: Brain,
    keywords: [
      'ai text summarizer',
      'article summarizer',
      'ai summary generator',
      'text summarization',
      'summarize text online',
      'automatic summarizer',
    ],
    tags: ['ai', 'summarize', 'text', 'nlp'],
    difficulty: 'beginner',
    status: 'coming-soon',
    processingMode: 'server',
    isPremium: false,
    seo: {
      title: 'AI Text Summarizer — Summarize Articles Online Free',
      description:
        'Summarize long text, articles, and documents with AI. Get concise summaries and key bullet points instantly. Free AI summarization tool.',
      keywords: [
        'ai text summarizer free',
        'article summarizer online',
        'ai summarize text',
        'automatic text summary',
        'document summarizer',
      ],
    },
    relatedToolSlugs: ['ai-text-rewriter', 'ai-translator', 'word-counter', 'readability-checker'],
    createdAt: '2025-09-01',
    updatedAt: '2026-06-28',
  },
  {
    id: 'ai-text-rewriter',
    slug: 'ai-text-rewriter',
    title: 'AI Text Rewriter',
    shortTitle: 'AI Rewriter',
    description:
      'Rewrite and paraphrase text with AI while preserving meaning. Choose from Standard, Formal, Creative, and Simplified rewriting modes.',
    shortDescription: 'Rewrite and paraphrase text with AI.',
    category: 'ai',
    subcategory: 'text',
    icon: Pen,
    keywords: [
      'ai text rewriter',
      'paraphrase tool',
      'ai paraphraser',
      'rewrite text online',
      'content rewriter',
      'paraphrase generator',
    ],
    tags: ['ai', 'rewrite', 'paraphrase', 'text'],
    difficulty: 'beginner',
    status: 'coming-soon',
    processingMode: 'server',
    seo: {
      title: 'AI Text Rewriter — Paraphrase Text Online Free',
      description:
        'Rewrite and paraphrase text with AI. Multiple modes: formal, creative, simplified. Preserve meaning while changing wording. Free AI tool.',
      keywords: [
        'ai text rewriter free',
        'paraphrase tool online',
        'ai paraphraser',
        'rewrite text ai',
        'content paraphrase generator',
      ],
    },
    relatedToolSlugs: ['ai-text-summarizer', 'ai-translator', 'word-counter', 'case-converter'],
    createdAt: '2025-09-01',
    updatedAt: '2026-06-28',
  },
  {
    id: 'ai-translator',
    slug: 'ai-translator',
    title: 'AI Text Translator',
    shortTitle: 'AI Translator',
    description:
      'Translate text between 100+ languages with AI-powered accuracy. Supports automatic language detection, formal/informal tone options.',
    shortDescription: 'Translate text between 100+ languages with AI.',
    category: 'ai',
    subcategory: 'language',
    icon: Languages,
    keywords: [
      'ai translator',
      'text translator',
      'translate text online',
      'language translator',
      'ai translation tool',
      'multilingual translator',
    ],
    tags: ['ai', 'translate', 'language', '100+ languages'],
    difficulty: 'beginner',
    status: 'coming-soon',
    processingMode: 'server',
    seo: {
      title: 'AI Text Translator — Translate 100+ Languages Online Free',
      description:
        'Translate text between 100+ languages with AI accuracy. Auto language detection, formal/informal tone. Free AI translation tool.',
      keywords: [
        'ai translator free online',
        'translate text online',
        'ai language translator',
        'multilingual translation tool',
      ],
    },
    relatedToolSlugs: ['ai-text-summarizer', 'ai-text-rewriter', 'word-counter', 'readability-checker'],
    createdAt: '2025-09-01',
    updatedAt: '2026-06-28',
  },
  {
    id: 'ai-image-upscaler',
    slug: 'ai-image-upscaler',
    title: 'AI Image Upscaler',
    shortTitle: 'AI Upscaler',
    description:
      'Upscale images up to 4x resolution using AI super-resolution technology. Enhance details, reduce blur, and sharpen photos without quality loss.',
    shortDescription: 'Upscale images up to 4x with AI super-resolution.',
    category: 'ai',
    subcategory: 'image',
    icon: ImageUp,
    keywords: [
      'ai image upscaler',
      'image upscaling',
      'super resolution',
      'ai enhance image',
      'upscale photo',
      'increase image resolution',
    ],
    tags: ['ai', 'upscale', 'enhance', 'image', 'super resolution'],
    difficulty: 'beginner',
    status: 'coming-soon',
    processingMode: 'server',
    isPremium: true,
    maxFileSizeMb: 10,
    supportedInputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    supportedOutputFormats: ['.jpg', '.png', '.webp'],
    seo: {
      title: 'AI Image Upscaler — Enhance & Upscale Images Online',
      description:
        'Upscale images up to 4x resolution with AI. Enhance photo quality, reduce blur, and increase detail. Free AI image enhancement tool.',
      keywords: [
        'ai image upscaler free',
        'upscale image online',
        'ai photo enhancer',
        'image resolution increaser',
        'super resolution ai',
      ],
    },
    relatedToolSlugs: ['image-background-remover', 'image-compress', 'image-resize', 'ai-text-summarizer'],
    createdAt: '2025-09-01',
    updatedAt: '2026-06-28',
  },
  {
    id: 'ai-content-generator',
    slug: 'ai-content-generator',
    title: 'AI Content Generator',
    shortTitle: 'AI Writer',
    description:
      'Generate blog posts, product descriptions, social media captions, ad copy, and more with AI. Choose tone, length, and target audience.',
    shortDescription: 'Generate blog posts, captions, and copy with AI.',
    category: 'ai',
    subcategory: 'content',
    icon: Sparkles,
    keywords: [
      'ai content generator',
      'ai writer',
      'ai blog writer',
      'content generation tool',
      'ai copywriter',
      'generate blog post',
    ],
    tags: ['ai', 'write', 'content', 'blog', 'copy'],
    difficulty: 'beginner',
    status: 'coming-soon',
    processingMode: 'server',
    isPremium: true,
    seo: {
      title: 'AI Content Generator — Write Blog Posts & Copy with AI',
      description:
        'Generate blog posts, product descriptions, and social media content with AI. Choose tone and length. Free AI writing assistant.',
      keywords: [
        'ai content generator free',
        'ai blog writer',
        'ai copywriter online',
        'generate content with ai',
        'ai writing tool',
      ],
    },
    relatedToolSlugs: ['ai-text-rewriter', 'ai-text-summarizer', 'word-counter', 'lorem-ipsum'],
    createdAt: '2025-09-01',
    updatedAt: '2026-06-28',
  },
]
