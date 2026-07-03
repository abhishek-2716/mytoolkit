import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { OgGeneratorInput, OgGeneratorResult } from './og-generator.config'
import { ogGeneratorConfig, ogGeneratorSchema } from './og-generator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function OgGeneratorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<OgGeneratorInput>) {
  const ids = { title: useId(), desc: useId(), url: useId(), image: useId(), siteName: useId() }

  const { register, watch } = useForm<OgGeneratorInput>({
    resolver: zodResolver(ogGeneratorSchema),
    defaultValues: ogGeneratorConfig.input.type === 'form' ? ogGeneratorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = ogGeneratorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={ids.title} className={LABEL_CLASS}>Title</label>
        <input id={ids.title} type="text" {...register('title')} disabled={isLoading} placeholder="My Page Title" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.desc} className={LABEL_CLASS}>Description</label>
        <textarea id={ids.desc} rows={2} {...register('description')} disabled={isLoading} placeholder="Page description for social sharing..." className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.url} className={LABEL_CLASS}>Page URL</label>
        <input id={ids.url} type="url" {...register('url')} disabled={isLoading} placeholder="https://example.com" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.image} className={LABEL_CLASS}>Image URL (optional)</label>
        <input id={ids.image} type="url" {...register('image')} disabled={isLoading} placeholder="https://example.com/og-image.jpg" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.siteName} className={LABEL_CLASS}>Site Name (optional)</label>
        <input id={ids.siteName} type="text" {...register('siteName')} disabled={isLoading} placeholder="My Website" className={INPUT_CLASS} />
      </div>
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Page Type</span>
        <div className="flex flex-wrap gap-2">
          {(['website', 'article', 'product'] as const).map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" value={t} {...register('type')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Twitter Card</span>
        <div className="flex flex-wrap gap-2">
          {(['summary', 'summary_large_image'] as const).map((c) => (
            <label key={c} className="cursor-pointer">
              <input type="radio" value={c} {...register('twitterCard')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.twitterCard === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {c === 'summary' ? 'Summary' : 'Large Image'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<OgGeneratorInput, OgGeneratorResult> = {
  ...ogGeneratorConfig,
  renderInput: (props) => <OgGeneratorInputView {...props} />,
}

export default function OgGeneratorPage() {
  return <ToolEngine config={config} />
}
