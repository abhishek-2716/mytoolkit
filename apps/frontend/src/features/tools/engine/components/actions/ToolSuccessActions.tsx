import { useCallback,useState } from 'react'
import { Check, Copy, Download, RotateCcw } from 'lucide-react'

import { useToolResult } from '../../hooks/useToolResult'
import type { FileResult } from '../../types/tool-result.types'

interface ToolSuccessActionsProps {
  /** Text to copy. Pass for text/code results. */
  copyText?: string
  /** File to download. Pass for file results. */
  downloadFile?: FileResult
  /** Called when user clicks Reset. */
  onReset: () => void
}

/**
 * ToolSuccessActions
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Action buttons shown after a successful result:
 *  - Copy to clipboard (with checkmark feedback)
 *  - Download file (if applicable)
 *  - Reset / Process another
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolSuccessActions({
  copyText,
  downloadFile,
  onReset,
}: ToolSuccessActionsProps) {
  const { copyToClipboard, downloadFile: downloadFileFn } = useToolResult()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!copyText) return
    const success = await copyToClipboard(copyText)
    if (success) {
      setCopied(true)
      setTimeout(() => { setCopied(false); }, 2000)
    }
  }, [copyText, copyToClipboard])

  const handleDownload = useCallback(() => {
    if (!downloadFile) return
    downloadFileFn(downloadFile.blob, downloadFile.fileName, downloadFile.mimeType)
  }, [downloadFile, downloadFileFn])

  return (
    <div className="flex items-center flex-wrap gap-2 pt-3 border-t border-border">
      {copyText && (
        <button
          type="button"
        onClick={() => { void handleCopy() }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
      )}

      {downloadFile && (
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label={`Download ${downloadFile.fileName}`}
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Download
        </button>
      )}

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
        aria-label="Process another"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        Process Another
      </button>
    </div>
  )
}
