import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { MetaGeneratorInput, MetaGeneratorResult } from './meta-generator.config'
import { metaGeneratorConfig, metaGeneratorSchema } from './meta-generator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function MetaGeneratorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<MetaGeneratorInput>) {
  const ids = { title: useId(), desc: useId(), kw: useId(), author: useId(), robots: useId(), charset: useId(), viewport: useId() }

  const { register, watch } = useForm<MetaGeneratorInput>({
    resolver: zodResolver(metaGeneratorSchema),
    defaultValues: metaGeneratorConfig.input.type === 'form' ? metaGeneratorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = metaGeneratorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={ids.title} className={LABEL_CLASS}>Page Title</label>
        <input id={ids.title} type="text" {...register('title')} disabled={isLoading} placeholder="My Awesome Page" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.desc} className={LABEL_CLASS}>Description</label>
        <textarea id={ids.desc} rows={3} {...register('description')} disabled={isLoading} placeholder="A brief description for search engines..." className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.kw} className={LABEL_CLASS}>Keywords (comma-separated)</label>
        <input id={ids.kw} type="text" {...register('keywords')} disabled={isLoading} placeholder="keyword1, keyword2" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.author} className={LABEL_CLASS}>Author (optional)</label>
        <input id={ids.author} type="text" {...register('author')} disabled={isLoading} placeholder="John Doe" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.robots} className={LABEL_CLASS}>Robots</label>
        <input id={ids.robots} type="text" {...register('robots')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.charset} className={LABEL_CLASS}>Charset</label>
        <input id={ids.charset} type="text" {...register('charset')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={ids.viewport} className={LABEL_CLASS}>Viewport</label>
        <input id={ids.viewport} type="text" {...register('viewport')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<MetaGeneratorInput, MetaGeneratorResult> = {
  ...metaGeneratorConfig,
  renderInput: (props) => <MetaGeneratorInputView {...props} />,
}

export default function MetaGeneratorPage() {
  return <ToolEngine config={config} />
}
