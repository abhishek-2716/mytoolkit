import { useState } from 'react'

import { ToolSuccessActions } from '../engine/components/actions/ToolSuccessActions'
import type { JsonFormatterResult } from './json-formatter.config'

interface JsonFormatterResultViewProps {
  result: JsonFormatterResult
  onReset: () => void
}

/**
 * JsonFormatterResultView
 * Custom result renderer for the JSON Formatter.
 * Shows: formatted code + minified toggle + line/char counts.
 */
export function JsonFormatterResultView({ result, onReset }: JsonFormatterResultViewProps) {
  const [showMinified, setShowMinified] = useState(false)

  const displayText = showMinified ? result.minified : result.formatted

  return (
    <div className="flex flex-col rounded-xl border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => { setShowMinified(false); }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              !showMinified
                ? 'bg-background text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Formatted
          </button>
          <button
            type="button"
            onClick={() => { setShowMinified(true); }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              showMinified
                ? 'bg-background text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Minified
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
          <span>{result.lineCount.toLocaleString()} lines</span>
          <span>{result.characterCount.toLocaleString()} chars</span>
        </div>
      </div>

      {/* Code */}
      <pre className="overflow-auto p-4 text-sm font-mono leading-relaxed bg-background max-h-[440px] whitespace-pre text-foreground">
        {displayText}
      </pre>

      {/* Actions */}
      <div className="px-4 pb-4 bg-background">
        <ToolSuccessActions copyText={displayText} onReset={onReset} />
      </div>
    </div>
  )
}
