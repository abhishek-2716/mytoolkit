import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { RobotsGeneratorInput, RobotsGeneratorResult } from './robots-generator.config'
import { robotsGeneratorConfig, robotsGeneratorSchema } from './robots-generator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function RobotsGeneratorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<RobotsGeneratorInput>) {
  const ids = { ua: useId(), disallow: useId(), delay: useId(), sitemap: useId() }

  const { register, watch } = useForm<RobotsGeneratorInput>({
    resolver: zodResolver(robotsGeneratorSchema),
    defaultValues: robotsGeneratorConfig.input.type === 'form' ? robotsGeneratorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = robotsGeneratorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={ids.ua} className={LABEL_CLASS}>User-agent</label>
        <input id={ids.ua} type="text" {...register('userAgent')} disabled={isLoading} placeholder="*" className={INPUT_CLASS} />
        <p className="text-xs text-foreground-muted mt-1">Use * for all bots, or specific bot name like Googlebot</p>
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
        <input type="checkbox" {...register('allowAll')} disabled={isLoading} className="rounded border-border" />
        Allow all crawling (Add Allow: /)
      </label>
      <div>
        <label htmlFor={ids.disallow} className={LABEL_CLASS}>Disallow Paths (one per line)</label>
        <textarea id={ids.disallow} rows={4} {...register('disallowPaths')} disabled={isLoading} placeholder="/admin&#10;/private&#10;/tmp" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.delay} className={LABEL_CLASS}>Crawl Delay (seconds, optional)</label>
        <input id={ids.delay} type="number" min="0" step="1" {...register('crawlDelay', { valueAsNumber: true })} disabled={isLoading} placeholder="e.g. 10" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.sitemap} className={LABEL_CLASS}>Sitemap URL (optional)</label>
        <input id={ids.sitemap} type="url" {...register('sitemapUrl')} disabled={isLoading} placeholder="https://example.com/sitemap.xml" className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<RobotsGeneratorInput, RobotsGeneratorResult> = {
  ...robotsGeneratorConfig,
  renderInput: (props) => <RobotsGeneratorInputView {...props} />,
}

export default function RobotsGeneratorPage() {
  return <ToolEngine config={config} />
}
