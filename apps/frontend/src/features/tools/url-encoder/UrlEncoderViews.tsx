import { useCallback, useEffect, useId, useState } from 'react'
import { ArrowLeftRight, Check, Copy, RotateCcw } from 'lucide-react'

import type { ToolInputRenderProps, ToolResultRenderProps } from '../engine'
import type { UrlEncoderInput, UrlEncoderResult } from './url-encoder.config'
import { urlEncoderSchema } from './url-encoder.config'

/* ─── Input View ─────────────────────────────────────────────────────────── */

export function UrlEncoderInputView({
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<UrlEncoderInput>) {
  const textId = useId()
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [encodeMode, setEncodeMode] = useState<'component' | 'full'>('component')

  useEffect(() => {
    const parsed = urlEncoderSchema.safeParse({ text, mode, encodeMode })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [text, mode, encodeMode, onInputChange])

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

      {/* Encode target (only for encode mode) */}
      {mode === 'encode' && (
        <div>
          <span className="block text-sm font-medium text-foreground mb-2">Encode as</span>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="encodeMode"
                value="component"
                checked={encodeMode === 'component'}
                onChange={() => { setEncodeMode('component') }}
                disabled={isLoading}
                className="mt-0.5 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">
                <strong>encodeURIComponent</strong>{' '}
                <span className="text-muted-foreground">— encodes all special chars (best for query params)</span>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="encodeMode"
                value="full"
                checked={encodeMode === 'full'}
                onChange={() => { setEncodeMode('full') }}
                disabled={isLoading}
                className="mt-0.5 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">
                <strong>encodeURI</strong>{' '}
                <span className="text-muted-foreground">— preserves URL structure (best for full URLs)</span>
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Textarea */}
      <div>
        <label htmlFor={textId} className="block text-sm font-medium text-foreground mb-1.5">
          {mode === 'encode' ? 'URL or text to encode' : 'Encoded URL to decode'}
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
              ? 'https://example.com/search?q=hello world&lang=en'
              : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world'
          }
          rows={6}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground mt-1">Ctrl+Enter to run</p>
      </div>

      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors capitalize"
      >
        <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
        {isLoading ? 'Processing…' : `${mode} URL`}
      </button>
    </div>
  )
}

/* ─── Result View ────────────────────────────────────────────────────────── */

export function UrlEncoderResultView({ result, onReset }: ToolResultRenderProps<UrlEncoderResult>) {
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
