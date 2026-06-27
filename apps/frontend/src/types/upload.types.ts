/** Possible states during a file upload lifecycle */
export type UploadStatus = 'idle' | 'pending' | 'uploading' | 'processing' | 'success' | 'error'

/** Constraints communicated to the file picker / dropzone */
export interface UploadConstraints {
  maxSizeBytes: number
  maxSizeMb: number
  maxFiles: number
  allowedMimeTypes: string[]
  /** Human-readable accept string for <input type="file" accept="..."> */
  acceptString: string
}

/**
 * A file that has been validated, uploaded, and optionally processed by the backend.
 * NOTE: UploadedFile (raw pre-processing file reference) stays in tool.types.ts.
 */
export interface ProcessedFile {
  id: string
  originalName: string
  processedName: string
  mimeType: string
  sizeBytes: number
  /** Signed URL for downloading the result */
  downloadUrl: string
  /** Expiry timestamp for the download link */
  expiresAt: string
}

/** Groups multiple file uploads under one transaction */
export interface UploadSession {
  sessionId: string
  status: UploadStatus
  files: ProcessedFile[]
  createdAt: string
  /** Error message when status === 'error' */
  errorMessage?: string
}
