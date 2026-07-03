import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import type { ImageResult } from '../engine'
import { ToolEngine } from '../engine'
import type { PlaceholderImageInput } from './placeholder-image-generator.config'
import { placeholderImageConfig, placeholderImageSchema } from './placeholder-image-generator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const SELECT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

function PlaceholderImageInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<PlaceholderImageInput>) {
  const widthId = useId()
  const heightId = useId()
  const bgId = useId()
  const textColorId = useId()
  const textId = useId()
  const fmtId = useId()

  const { register, watch } = useForm<PlaceholderImageInput>({
    resolver: zodResolver(placeholderImageSchema),
    defaultValues: placeholderImageConfig.input.type === 'form' ? placeholderImageConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = placeholderImageSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={widthId} className={LABEL_CLASS}>Width (px)</label>
          <input id={widthId} type="number" min="1" max="4096" step="1" {...register('width', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor={heightId} className={LABEL_CLASS}>Height (px)</label>
          <input id={heightId} type="number" min="1" max="4096" step="1" {...register('height', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={bgId} className={LABEL_CLASS}>Background Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" {...register('bgColor')} disabled={isLoading} className="h-9 w-12 rounded border border-border cursor-pointer disabled:opacity-50" />
            <input id={bgId} type="text" placeholder="#cccccc" {...register('bgColor')} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </div>
        <div>
          <label htmlFor={textColorId} className={LABEL_CLASS}>Text Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" {...register('textColor')} disabled={isLoading} className="h-9 w-12 rounded border border-border cursor-pointer disabled:opacity-50" />
            <input id={textColorId} type="text" placeholder="#666666" {...register('textColor')} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </div>
      </div>
      <div>
        <label htmlFor={textId} className={LABEL_CLASS}>Custom Text <span className="text-foreground-muted font-normal">(leave blank for dimensions)</span></label>
        <input id={textId} type="text" placeholder="e.g. Hero Image" {...register('text')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={fmtId} className={LABEL_CLASS}>Format</label>
        <select id={fmtId} {...register('format')} disabled={isLoading} className={SELECT_CLASS}>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<PlaceholderImageInput, ImageResult> = {
  ...placeholderImageConfig,
  renderInput: (props) => <PlaceholderImageInputView {...props} />,
}

export default function PlaceholderImageGeneratorPage() {
  return <ToolEngine config={config} />
}
