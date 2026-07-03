import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import type { ImageResult } from '../engine'
import { ToolEngine } from '../engine'
import type { FaviconGeneratorInput } from './favicon-generator.config'
import { faviconGeneratorConfig, faviconGeneratorSchema } from './favicon-generator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const SELECT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

function FaviconGeneratorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<FaviconGeneratorInput>) {
  const textId = useId()
  const bgId = useId()
  const textColorId = useId()
  const sizeId = useId()

  const { register, watch } = useForm<FaviconGeneratorInput>({
    resolver: zodResolver(faviconGeneratorSchema),
    defaultValues: faviconGeneratorConfig.input.type === 'form' ? faviconGeneratorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = faviconGeneratorSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={textId} className={LABEL_CLASS}>Emoji / Text (max 4 chars)</label>
        <input
          id={textId}
          type="text"
          maxLength={4}
          placeholder="⚡"
          {...register('text')}
          disabled={isLoading}
          className={INPUT_CLASS}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={bgId} className={LABEL_CLASS}>Background Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" {...register('bgColor')} disabled={isLoading} className="h-9 w-12 rounded border border-border cursor-pointer disabled:opacity-50" />
            <input id={bgId} type="text" placeholder="#6366f1" {...register('bgColor')} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </div>
        <div>
          <label htmlFor={textColorId} className={LABEL_CLASS}>Text Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" {...register('textColor')} disabled={isLoading} className="h-9 w-12 rounded border border-border cursor-pointer disabled:opacity-50" />
            <input id={textColorId} type="text" placeholder="#ffffff" {...register('textColor')} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </div>
      </div>
      <div>
        <label htmlFor={sizeId} className={LABEL_CLASS}>Size (px)</label>
        <select id={sizeId} {...register('size')} disabled={isLoading} className={SELECT_CLASS}>
          <option value="16">16×16 (browser tab)</option>
          <option value="32">32×32 (standard)</option>
          <option value="48">48×48 (desktop shortcut)</option>
          <option value="64">64×64 (high-DPI)</option>
          <option value="128">128×128 (app icon)</option>
        </select>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<FaviconGeneratorInput, ImageResult> = {
  ...faviconGeneratorConfig,
  renderInput: (props) => <FaviconGeneratorInputView {...props} />,
}

export default function FaviconGeneratorPage() {
  return <ToolEngine config={config} />
}
