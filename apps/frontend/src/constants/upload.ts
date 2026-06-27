/**
 * Upload limits and accepted MIME types.
 * These are static constants — for runtime-configurable values use uploadConfig.
 */
export const UPLOAD = {
  /** Default maximum file size in MB */
  MAX_SIZE_MB: 50,
  /** Default maximum file size in bytes */
  MAX_SIZE_BYTES: 50 * 1024 * 1024,
  /** Maximum number of files in one session */
  MAX_FILES: 10,
  /** Chunk size for future multipart uploads */
  CHUNK_SIZE_MB: 5,
} as const

/** Accepted MIME types grouped by media category */
export const ACCEPTED_MIME = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'] as const,
  PDF: ['application/pdf'] as const,
  DOCUMENT: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ] as const,
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac'] as const,
  VIDEO: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'] as const,
} as const

/** Accepted file extensions grouped by media category */
export const ACCEPTED_EXTENSIONS = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  PDF: ['.pdf'],
  DOCUMENT: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],
  AUDIO: ['.mp3', '.wav', '.ogg', '.flac', '.aac'],
  VIDEO: ['.mp4', '.webm', '.mov', '.avi'],
} as const
