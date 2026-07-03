/**
 * Tool Result System Types
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The result type drives which built-in renderer the engine uses.
 * Tools declare their result type; the engine handles the display.
 *
 * Result type → default renderer:
 *  'text'        → plain text with copy button
 *  'code'        → monospace pre with syntax highlight + copy
 *  'file'        → download button with file info
 *  'image'       → image preview + download + dimensions
 *  'structured'  → key-value stat grid (word counter output)
 *  'json'        → formatted JSON with tree view
 *  'markdown'    → rendered markdown HTML
 *  'table'       → sortable data table
 *  'multiple'    → list of files (batch output)
 *  'custom'      → tool provides renderResult, engine skips built-in
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

/** All supported result rendering modes. */
export type ToolResultType =
  | 'text'
  | 'code'
  | 'file'
  | 'image'
  | 'structured'
  | 'json'
  | 'markdown'
  | 'table'
  | 'multiple'
  | 'custom'

/** The three layout modes supported by the engine. */
export type LayoutMode = 'split' | 'stack' | 'form'

/**
 * A single stat item for the 'structured' result renderer.
 * Example: { label: 'Words', value: 1234, icon: 'AlignLeft' }
 */
export interface StructuredResultItem {
  label: string
  value: string | number
  /** Optional Lucide icon name (rendered via the engine's Icon component). */
  iconName?: string
  /** Tailwind classes for the value color. Default: text-primary */
  valueColorClass?: string
}

/**
 * A downloadable file result.
 * Used by the 'file' result renderer.
 */
export interface FileResult {
  /** File name with extension, shown in the download button. */
  fileName: string
  /** The Blob to download. */
  blob: Blob
  /** MIME type for the download link. */
  mimeType: string
  /** File size in bytes — shown in the download button. */
  sizeBytes: number
}

/**
 * An image result with preview capability.
 * Used by the 'image' result renderer.
 */
export interface ImageResult {
  /** Object URL for preview. Revoke after download. */
  previewUrl: string
  /** File name with extension. */
  fileName: string
  /** The Blob to download. */
  blob: Blob
  /** MIME type. */
  mimeType: string
  /** Width in pixels. */
  width: number
  /** Height in pixels. */
  height: number
  /** Size in bytes. */
  sizeBytes: number
}

/**
 * A table result with headers and rows.
 * Used by the 'table' result renderer.
 */
export interface TableResult {
  headers: string[]
  rows: (string | number)[][]
  /** Optional footer row (e.g., totals). */
  footer?: (string | number)[]
}

/**
 * Multiple file results (batch processing output).
 * Used by the 'multiple' result renderer.
 */
export interface MultipleFileResult {
  files: FileResult[]
  /** Whether to offer a ZIP download of all files. */
  enableZipDownload?: boolean
  zipFileName?: string
}
