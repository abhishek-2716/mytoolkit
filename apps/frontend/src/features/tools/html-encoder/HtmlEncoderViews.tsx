import { useCallback, useEffect, useId, useState } from 'react'
import { ArrowLeftRight, Check, Copy, RotateCcw } from 'lucide-react'

import type { ToolInputRenderProps, ToolResultRenderProps } from '../engine'
import type { HtmlEncoderInput, HtmlEncoderResult } from './html-encoder.config'
import { htmlEncoderSchema } from './html-encoder.config'

/* ─── Input View ─────────────────────────────────────────────────────────── */

export function HtmlEncoderInputView({
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<HtmlEncoderInput>) {
  const textId = useId()
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [encodeQuotes, setEncodeQuotes] = useState(true)

  useEffect(() => {
    const parsed = htmlEncoderSchema.safeParse({ text, mode, encodeQuotes })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [text, mode, encodeQuotes, onInputChange])

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Mode</span>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m) }}
              disabled={isLoading}
              className={[
                'px-4 py-2 text-sm font-medium transition-colors capitalize',
                mode === m
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted',
              ].join(' ')}
              aria-pressed={mode === m}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div>
        <label htmlFor={textId} className="block text-sm font-medium text-foreground mb-1.5">
          {mode === 'encode' ? 'Text to encode' : 'HTML to decode'}
        </label>
        <textarea
          id={textId}
          value={text}
          onChange={(e) => { setText(e.target.value) }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canProcess) {
              e.preventDefault()
              onProcess()
            }
          }}
          disabled={isLoading}
          placeholder={
            mode === 'encode'
              ? '<div class="hello">Hello & "World"!</div>'
              : '&lt;div class=&quot;hello&quot;&gt;Hello &amp; &quot;World&quot;!&lt;/div&gt;'
          }
          rows={8}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground mt-1">Ctrl+Enter to run</p>
      </div>

      {/* Encode quotes option */}
      {mode === 'encode' && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={encodeQuotes}
            onChange={(e) => { setEncodeQuotes(e.target.checked) }}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">
            Encode quotes (<code className="text-xs bg-muted px-1 rounded">&quot;</code> and <code className="text-xs bg-muted px-1 rounded">&#39;</code>)
          </span>
        </label>
      )}

      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors capitalize"
      >
        <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
        {isLoading ? 'Processing…' : `${mode} HTML entities`}
      </button>
    </div>
  )
}

/* ─── Result View ────────────────────────────────────────────────────────── */

export function HtmlEncoderResultView({
  result,
  onReset,
}: ToolResultRenderProps<HtmlEncoderResult>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.output)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    } catch { /* clipboard denied */ }
  }, [result.output])

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 w-fit">
        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium capitalize">
          {result.mode}d · {result.inputLength} → {result.outputLength} chars
        </span>
      </div>

      <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Result</span>
          <button
            type="button"
            onClick={() => { void handleCopy() }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md hover:text-primary transition-colors"
          >
            {copied ? <><Check className="w-3 h-3" aria-hidden="true" />Copied</> : <><Copy className="w-3 h-3" aria-hidden="true" />Copy</>}
          </button>
        </div>
        <pre className="overflow-auto p-4 text-sm font-mono leading-relaxed bg-background max-h-[400px] whitespace-pre-wrap break-all select-all">
          {result.output}
        </pre>
      </div>

      <div className="pt-2 border-t border-border">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  )
}
