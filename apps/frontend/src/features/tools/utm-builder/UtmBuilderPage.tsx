import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { UtmBuilderInput } from './utm-builder.config'
import { utmBuilderConfig, utmBuilderSchema } from './utm-builder.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function UtmBuilderInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<UtmBuilderInput>) {
  const urlId = useId()
  const sourceId = useId()
  const mediumId = useId()
  const campaignId = useId()
  const termId = useId()
  const contentId = useId()

  const { register, watch } = useForm<UtmBuilderInput>({
    resolver: zodResolver(utmBuilderSchema),
    defaultValues: utmBuilderConfig.input.type === 'form' ? utmBuilderConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = utmBuilderSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={urlId} className={LABEL_CLASS}>Website URL *</label>
        <input id={urlId} type="url" placeholder="https://example.com" {...register('websiteUrl')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={sourceId} className={LABEL_CLASS}>Source * <span className="text-foreground-muted font-normal">(utm_source)</span></label>
          <input id={sourceId} type="text" placeholder="e.g. newsletter" {...register('source')} disabled={isLoading} className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor={mediumId} className={LABEL_CLASS}>Medium * <span className="text-foreground-muted font-normal">(utm_medium)</span></label>
          <input id={mediumId} type="text" placeholder="e.g. email" {...register('medium')} disabled={isLoading} className={INPUT_CLASS} />
        </div>
      </div>
      <div>
        <label htmlFor={campaignId} className={LABEL_CLASS}>Campaign * <span className="text-foreground-muted font-normal">(utm_campaign)</span></label>
        <input id={campaignId} type="text" placeholder="e.g. summer-sale" {...register('campaign')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={termId} className={LABEL_CLASS}>Term <span className="text-foreground-muted font-normal">(optional)</span></label>
          <input id={termId} type="text" placeholder="e.g. running+shoes" {...register('term')} disabled={isLoading} className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor={contentId} className={LABEL_CLASS}>Content <span className="text-foreground-muted font-normal">(optional)</span></label>
          <input id={contentId} type="text" placeholder="e.g. header-link" {...register('content')} disabled={isLoading} className={INPUT_CLASS} />
        </div>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<UtmBuilderInput, string> = {
  ...utmBuilderConfig,
  renderInput: (props) => <UtmBuilderInputView {...props} />,
}

export default function UtmBuilderPage() {
  return <ToolEngine config={config} />
}
