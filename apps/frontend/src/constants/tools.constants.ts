/** All tool category slugs used throughout the application */
export const TOOL_CATEGORIES = {
  PDF: 'pdf',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  DEVELOPER: 'developer',
  AI: 'ai',
  CALCULATOR: 'calculator',
  GENERATOR: 'generator',
  CONVERTER: 'converter',
  COMPRESSION: 'compression',
  WRITING: 'writing',
  COLOR: 'color',
  SOCIAL_MEDIA: 'social-media',
  SEO: 'seo',
  TEXT: 'text',
  SECURITY: 'security',
  NETWORK: 'network',
  OFFICE: 'office',
  FINANCE: 'finance',
  EDUCATION: 'education',
  UNIT_CONVERSION: 'unit-conversion',
} as const

export type ToolCategorySlug = (typeof TOOL_CATEGORIES)[keyof typeof TOOL_CATEGORIES]
