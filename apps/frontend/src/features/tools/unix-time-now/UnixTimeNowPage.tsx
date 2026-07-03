import { useEffect, useId, useState } from 'react'

import { getToolBySlug } from '@/registry'
import { useCopyToClipboard } from '@/hooks'

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getWeekOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1)
  const diff = d.getTime() - start.getTime()
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  return Math.ceil((diff / oneWeek + start.getDay() / 7))
}

function formatTimestamp(ms: number) {
  const d = new Date(ms)
  return {
    unixSeconds: Math.floor(ms / 1000).toString(),
    unixMilliseconds: ms.toString(),
    iso8601: d.toISOString(),
    utcString: d.toUTCString(),
    localString: d.toLocaleString(),
    dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
    weekOfYear: `Week ${getWeekOfYear(d)}`,
  }
}

function parseInputTimestamp(input: string): Date | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  if (!isNaN(num)) {
    // Detect if seconds or milliseconds
    const ms = num < 1e10 ? num * 1000 : num
    const d = new Date(ms)
    return isNaN(d.getTime()) ? null : d
  }
  const d = new Date(trimmed)
  return isNaN(d.getTime()) ? null : d
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('unix-time-now')

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

export default function UnixTimeNowPage() {
  const [now, setNow] = useState(Date.now())
  const [inputTs, setInputTs] = useState('')
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)
  const { copy } = useCopyToClipboard()
  const inputId = useId()

  const handleCopy = (value: string, label: string) => {
    void copy(value)
    setCopiedLabel(label)
    setTimeout(() => setCopiedLabel(null), 2000)
  }

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const current = formatTimestamp(now)

  const parsedDate = parseInputTimestamp(inputTs)
  const converted = parsedDate ? formatTimestamp(parsedDate.getTime()) : null

  const liveFields: { label: string; value: string }[] = [
    { label: 'Unix Timestamp (seconds)', value: current.unixSeconds },
    { label: 'Unix Timestamp (ms)', value: current.unixMilliseconds },
    { label: 'ISO 8601', value: current.iso8601 },
    { label: 'UTC String', value: current.utcString },
    { label: 'Local Time', value: current.localString },
    { label: 'Day of Week', value: current.dayOfWeek },
    { label: 'Week of Year', value: current.weekOfYear },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{tool?.title ?? 'Unix Time Now'}</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {tool?.shortDescription ?? 'View the current Unix timestamp and convert between formats.'}
          </p>
        </div>

        {/* Live Clock */}
        <section className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Current Time (updates every second)
          </h2>
          <div className="space-y-2">
            {liveFields.map((field) => (
              <div key={field.label} className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2.5">
                <span className="text-sm text-foreground-muted">{field.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-foreground">{field.value}</span>
                  <button
                    onClick={() => handleCopy(field.value, field.label)}
                    className="px-2 py-0.5 text-xs rounded bg-muted text-foreground-muted hover:bg-primary/10 hover:text-primary transition-colors"
                    aria-label={`Copy ${field.label}`}
                  >
                    {copiedLabel === field.label ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Converter */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Timestamp Converter</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor={inputId} className={LABEL_CLASS}>
                Enter Unix timestamp (seconds or ms) or date string
              </label>
              <input
                id={inputId}
                type="text"
                value={inputTs}
                onChange={(e) => setInputTs(e.target.value)}
                placeholder="e.g. 1700000000 or 2024-01-15T12:00:00Z"
                className={INPUT_CLASS}
              />
            </div>

            {inputTs && !converted && (
              <p className="text-sm text-destructive">Invalid timestamp or date string.</p>
            )}

            {converted && (
              <div className="space-y-2">
                {([
                  { label: 'Unix Timestamp (seconds)', value: converted.unixSeconds },
                  { label: 'Unix Timestamp (ms)', value: converted.unixMilliseconds },
                  { label: 'ISO 8601', value: converted.iso8601 },
                  { label: 'UTC String', value: converted.utcString },
                  { label: 'Local Time', value: converted.localString },
                  { label: 'Day of Week', value: converted.dayOfWeek },
                ] as const).map((field) => (
                  <div key={field.label} className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2.5">
                    <span className="text-sm text-foreground-muted">{field.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-foreground">{field.value}</span>
                      <button
                        onClick={() => handleCopy(field.value, field.label)}
                        className="px-2 py-0.5 text-xs rounded bg-muted text-foreground-muted hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {copiedLabel === field.label ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
