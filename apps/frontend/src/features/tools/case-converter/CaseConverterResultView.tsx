import { useCallback, useState } from 'react'
import { Check, Copy, RotateCcw } from 'lucide-react'

import type { ToolResultRenderProps } from '../engine'
import type { CaseConverterResult } from './case-converter.config'

/* ─── Case Item ──────────────────────────────────────────────────────────── */

interface CaseItemProps {
  label: string
  value: string
  description: string
}

function CaseItem({ label, value, description }: CaseItemProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    } catch {
      // clipboard access denied
    }
  }, [value])

  return (
    <div className="group flex flex-col gap-1.5 p-3 rounded-lg border border-border bg-muted/30 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            {label}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">{description}</span>
        </div>
        <button
          type="button"
          onClick={() => { void handleCopy() }}
          className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-background border border-border hover:border-primary/60 hover:text-primary transition-colors"
          aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
        >
          {copied ? (
            <><Check className="w-3 h-3" aria-hidden="true" />Copied</>
          ) : (
            <><Copy className="w-3 h-3" aria-hidden="true" />Copy</>
          )}
        </button>
      </div>
      <p
        className="text-sm text-foreground font-mono break-all leading-relaxed"
        aria-label={`${label}: ${value}`}
      >
        {value || <span className="text-muted-foreground italic">empty</span>}
      </p>
    </div>
  )
}

/* ─── Result View ────────────────────────────────────────────────────────── */

const CASES: { key: keyof Omit<CaseConverterResult, 'original'>; label: string; description: string }[] = [
  { key: 'upper', label: 'UPPERCASE', description: 'ALL CAPS' },
  { key: 'lower', label: 'lowercase', description: 'all lower' },
  { key: 'title', label: 'Title Case', description: 'First Letter Of Each Word' },
  { key: 'sentence', label: 'Sentence case', description: 'First letter of sentence' },
  { key: 'camel', label: 'camelCase', description: 'lowerCamelCase' },
  { key: 'pascal', label: 'PascalCase', description: 'UpperCamelCase' },
  { key: 'snake', label: 'snake_case', description: 'words_separated_by_underscores' },
  { key: 'kebab', label: 'kebab-case', description: 'words-separated-by-hyphens' },
]

export function CaseConverterResultView({
  result,
  onReset,
}: ToolResultRenderProps<CaseConverterResult>) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
      role="region"
      aria-label="Case conversion results"
    >
      {/* Success header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
            8 conversions ready
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
          aria-label="Convert another text"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Case grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        {CASES.map(({ key, label, description }) => (
          <CaseItem
            key={key}
            label={label}
            description={description}
            value={result[key]}
          />
        ))}
      </div>
    </div>
  )
}
