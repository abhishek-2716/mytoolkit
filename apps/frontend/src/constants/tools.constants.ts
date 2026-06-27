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

/** File upload limits */
export const UPLOAD_LIMITS = {
  MAX_SIZE_MB: 50,
  MAX_SIZE_BYTES: 50 * 1024 * 1024,
  MAX_FILES: 10,
} as const

/** Accepted MIME types by category */
export const ACCEPTED_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  PDF: ['application/pdf'],
  DOCUMENT: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
} as const

/** Default pagination settings */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const
