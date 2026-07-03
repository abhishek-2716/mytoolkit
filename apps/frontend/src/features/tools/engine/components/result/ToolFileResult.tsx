import { FileText } from 'lucide-react'

import { useToolResult } from '../../hooks/useToolResult'
import type { FileResult } from '../../types/tool-result.types'
import { ToolSuccessActions } from '../actions/ToolSuccessActions'

interface ToolFileResultProps {
  file: FileResult
  onReset: () => void
}

/**
 * ToolFileResult
 * Renders a file download result with file info and download button.
 * Used by resultType: 'file'.
 */
export function ToolFileResult({ file, onReset }: ToolFileResultProps) {
  const { formatFileSize } = useToolResult()

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      {/* File info */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-7 h-7 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{file.fileName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatFileSize(file.sizeBytes)}
          </p>
        </div>
      </div>

      {/* Success indicator */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
          File ready for download
        </p>
      </div>

      {/* Actions */}
      <ToolSuccessActions downloadFile={file} onReset={onReset} />
    </div>
  )
}
