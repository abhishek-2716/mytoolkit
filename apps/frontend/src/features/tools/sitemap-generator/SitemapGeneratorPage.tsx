import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { SitemapInput, SitemapResult } from './sitemap-generator.config'
import { sitemapConfig, sitemapSchema } from './sitemap-generator.config'

/* ─── Custom Input View ──────────────────────────────────────────────────── */

const CHANGEFREQ_OPTIONS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'] as const
const PRIORITY_OPTIONS = ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1']

function SitemapInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<SitemapInput>) {
  const defaults = sitemapConfig.input.type === 'form' ? sitemapConfig.input.defaultValues : undefined
  const { register, watch } = useForm<SitemapInput>({
    resolver: zodResolver(sitemapSchema),
    defaultValues: defaults,
    mode: 'onChange',
  })
  const watched = watch()

  useEffect(() => {
    const result = sitemapSchema.safeParse(watched)
    if (!result.success) return
    onInputChange(result.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Base URL</label>
        <input
          {...register('baseUrl')}
          disabled={isLoading}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          URL Paths <span className="text-foreground-muted font-normal">(one per line)</span>
        </label>
        <textarea
          {...register('urls')}
          disabled={isLoading}
          rows={6}
          placeholder="/&#10;/about&#10;/contact"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 resize-y font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Change Frequency</label>
          <select
            {...register('changefreq')}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            {CHANGEFREQ_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Priority</label>
          <select
            {...register('priority')}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const config: ToolEngineConfig<SitemapInput, SitemapResult> = {
  ...sitemapConfig,
  renderInput: (props) => <SitemapInputView {...props} />,
}

export default function SitemapGeneratorPage() {
  return <ToolEngine config={config} />
}
