import { useCallback } from 'react'

import { formatFileSize } from '@/utils'
import { copyToClipboard } from '@/utils/copy-to-clipboard'
import { downloadBlob } from '@/utils/download-file'

import { useToolStoreContext } from '../store/ToolStoreContext'

/**
 * useToolResult
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Utilities for consuming and interacting with a tool's result:
 *  - copyToClipboard — copy text result with feedback
 *  - downloadFile    — trigger a file download from a Blob
 *  - downloadImage   — trigger an image download + revoke object URL
 *
 * These are used by ToolSuccessActions and individual result components.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function useToolResult() {
  const useStore = useToolStoreContext()
  const result = useStore((s) => s.result)

  /* ── downloadFile ──────────────────────────────────────────────────────── */

  const downloadFile = useCallback((blob: Blob, fileName: string, mimeType: string) => {
    downloadBlob(new Blob([blob], { type: mimeType }), fileName)
  }, [])

  /* ── downloadImage ─────────────────────────────────────────────────────── */

  const downloadImage = useCallback(
    (blob: Blob, fileName: string, mimeType: string) => {
      downloadBlob(new Blob([blob], { type: mimeType }), fileName)
    },
    []
  )

  return {
    result,
    copyToClipboard,
    downloadFile,
    downloadImage,
    formatFileSize,
  }
}
