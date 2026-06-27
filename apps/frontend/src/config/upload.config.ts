/** Parse an env string as a positive integer, returning fallback on invalid input */
function parseEnvInt(value: string | undefined, fallback: number): number {
  const parsed = parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const maxSizeMb = parseEnvInt(import.meta.env.VITE_UPLOAD_MAX_SIZE, 50)

export const uploadConfig = {
  /** Maximum file size in megabytes */
  maxSizeMb,
  /** Maximum file size in bytes */
  maxSizeBytes: maxSizeMb * 1024 * 1024,
  /** Maximum number of files per upload session */
  maxFiles: 10,
  /** Chunk size for future multipart uploads (MB) */
  chunkSizeMb: 5,

  /** Accepted MIME types by media category */
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    pdf: ['application/pdf'],
    document: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
    ],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac'],
    video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  },

  /** HTML <input accept="..."> strings by category */
  acceptStrings: {
    image: 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
    pdf: 'application/pdf',
    document: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv',
    audio: 'audio/mpeg,audio/wav,audio/ogg,audio/flac',
    video: 'video/mp4,video/webm',
    any: '*/*',
  },
} as const
