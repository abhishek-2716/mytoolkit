import { ToolSuccessActions } from '../actions/ToolSuccessActions'

interface ToolTextResultProps {
  text: string
  onReset: () => void
  /** Show monospace font (for code-like output). @default false */
  isCode?: boolean
  /** Language hint for screen readers. */
  language?: string
}

/**
 * ToolTextResult
 * Renders a text or code result with copy action.
 * Used by resultType: 'text' and 'code'.
 */
export function ToolTextResult({ text, onReset, isCode = false, language }: ToolTextResultProps) {
  return (
    <div className="flex flex-col gap-0 rounded-xl border border-border overflow-hidden">
      {/* Header */}
      {language && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {language}
          </span>
        </div>
      )}

      {/* Content */}
      <pre
        className={[
          'flex-1 overflow-auto p-4 text-sm leading-relaxed bg-background',
          isCode ? 'font-mono' : 'font-sans whitespace-pre-wrap break-words',
          'max-h-[500px]',
        ].join(' ')}
        role="region"
        aria-label="Result text"
        /* tabIndex={0} allows keyboard users to scroll overflow content */
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        {text}
      </pre>

      {/* Actions */}
      <div className="px-4 pb-4 bg-background">
        <ToolSuccessActions copyText={text} onReset={onReset} />
      </div>
    </div>
  )
}
