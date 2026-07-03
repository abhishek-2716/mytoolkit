import { useCallback, useEffect,useRef, useState } from 'react'

import type { ToolError } from '../types/tool-error.types'
import { createToolError } from '../types/tool-error.types'

/**
 * useFileInput
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Manages file selection from a <input type="file"> or drag-and-drop zone.
 *
 * Features:
 *  - Drag-and-drop with visual feedback (isDragActive)
 *  - Click-to-browse via hidden <input type="file"> ref
 *  - File type validation against the accept list
 *  - File size validation against maxSizeMb
 *  - Object URL preview generation (auto-revoked on unmount)
 *  - Multi-file support with maxFiles enforcement
 *
 * @example
 * const { isDragActive, previewUrl, fileInfo, dropZoneProps, inputRef, openFilePicker } =
 *   useFileInput({ accept: ['image/*'], maxSizeMb: 10 })
 */

export interface UseFileInputOptions {
  /** MIME types and/or extensions to accept. Example: ['image/png', '.jpg'] */
  accept: string[]
  /** Max file size in megabytes. */
  maxSizeMb: number
  /** For multi-file inputs: max number of files. */
  maxFiles?: number
  /** Called when a valid file (or files) is selected. */
  onFile: (file: File | File[]) => void
  /** Called when validation fails. */
  onError: (error: ToolError) => void
}

export interface FileInfo {
  name: string
  sizeBytes: number
  mimeType: string
  lastModified: number
}

export interface UseFileInputReturn {
  /** Whether a drag operation is currently active over the drop zone. */
  isDragActive: boolean
  /** Object URL of the current file for preview. null if none. */
  previewUrl: string | null
  /** Info about the selected file. null if none. */
  fileInfo: FileInfo | null
  /** Props to spread onto the drop zone element. */
  dropZoneProps: {
    onDragEnter: React.DragEventHandler
    onDragLeave: React.DragEventHandler
    onDragOver: React.DragEventHandler
    onDrop: React.DragEventHandler
    onClick: React.MouseEventHandler
    role: string
    tabIndex: number
    'aria-label': string
  }
  /** Ref to attach to a hidden <input type="file"> element. */
  inputRef: React.RefObject<HTMLInputElement | null>
  /** Programmatically open the file picker. */
  openFilePicker: () => void
  /** Manually clear the selected file. */
  clearFile: () => void
}

export function useFileInput(options: UseFileInputOptions): UseFileInputReturn {
  const { accept, maxSizeMb, maxFiles = 1, onFile, onError } = options
  const [isDragActive, setIsDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const previewUrlRef = useRef<string | null>(null)
  const dragCounter = useRef(0)

  // Revoke object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  const generatePreviewUrl = useCallback((file: File): string | null => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      const url = URL.createObjectURL(file)
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = url
      return url
    }
    return null
  }, [])

  const isAccepted = useCallback(
    (file: File): boolean => {
      if (accept.length === 0) return true
      return accept.some((a) => {
        if (a.startsWith('.')) {
          return file.name.toLowerCase().endsWith(a.toLowerCase())
        }
        if (a.endsWith('/*')) {
          const mimePrefix = a.slice(0, -2)
          return file.type.startsWith(mimePrefix)
        }
        return file.type === a
      })
    },
    [accept]
  )

  const validateAndProcess = useCallback(
    (files: File[]) => {
      if (files.length === 0) return

      // Multi-file count check
      if (maxFiles > 1 && files.length > maxFiles) {
        onError(
          createToolError(
            'file-count-error',
            `Too many files. Maximum is ${maxFiles}.`,
            { details: `You dropped ${files.length} files.`, retryable: false }
          )
        )
        return
      }

      const target = maxFiles === 1 ? files[0] : files[0]

      // Type check
      if (!isAccepted(target)) {
        onError(
          createToolError(
            'file-type-error',
            `File type not supported.`,
            {
              details: `Accepted formats: ${accept.join(', ')}`,
              retryable: false,
            }
          )
        )
        return
      }

      // Size check
      const maxBytes = maxSizeMb * 1024 * 1024
      if (target.size > maxBytes) {
        onError(
          createToolError(
            'file-size-error',
            `File is too large.`,
            {
              details: `Maximum size is ${maxSizeMb} MB. Your file is ${(target.size / 1024 / 1024).toFixed(1)} MB.`,
              retryable: false,
            }
          )
        )
        return
      }

      const preview = generatePreviewUrl(target)
      setPreviewUrl(preview)
      setFileInfo({
        name: target.name,
        sizeBytes: target.size,
        mimeType: target.type,
        lastModified: target.lastModified,
      })

      if (maxFiles > 1) {
        onFile(files.slice(0, maxFiles))
      } else {
        onFile(target)
      }
    },
    [accept, isAccepted, maxSizeMb, maxFiles, onFile, onError, generatePreviewUrl]
  )

  const clearFile = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setPreviewUrl(null)
    setFileInfo(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const dropZoneProps = {
    onDragEnter: useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current += 1
      if (dragCounter.current === 1) setIsDragActive(true)
    }, []),

    onDragLeave: useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current -= 1
      if (dragCounter.current === 0) setIsDragActive(false)
    }, []),

    onDragOver: useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }, []),

    onDrop: useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounter.current = 0
        setIsDragActive(false)
        const files = Array.from(e.dataTransfer.files)
        validateAndProcess(files)
      },
      [validateAndProcess]
    ),

    onClick: useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        openFilePicker()
      },
      [openFilePicker]
    ),

    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `Upload file. Accepted formats: ${accept.join(', ')}`,
  }

  return {
    isDragActive,
    previewUrl,
    fileInfo,
    dropZoneProps,
    inputRef,
    openFilePicker,
    clearFile,
  }
}
