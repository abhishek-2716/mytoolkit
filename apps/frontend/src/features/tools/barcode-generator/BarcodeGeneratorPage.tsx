import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ImageResult, ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { BarcodeGeneratorInput } from './barcode-generator.config'
import { barcodeGeneratorConfig, barcodeGeneratorSchema } from './barcode-generator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function BarcodeInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<BarcodeGeneratorInput>) {
  const textId = useId()
  const widthId = useId()
  const heightId = useId()

  const { register, watch } = useForm<BarcodeGeneratorInput>({
    resolver: zodResolver(barcodeGeneratorSchema),
    defaultValues: barcodeGeneratorConfig.input.type === 'form' ? barcodeGeneratorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = barcodeGeneratorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={textId} className={LABEL_CLASS}>Barcode Text</label>
        <input
          id={textId}
          {...register('text')}
          disabled={isLoading}
          placeholder="Hello World"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>Barcode Format</label>
        <select
          {...register('format')}
          disabled={isLoading}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        >
          <option value="CODE128">CODE128 (any text)</option>
          <option value="CODE39">CODE39 (alphanumeric)</option>
          <option value="EAN13">EAN-13 (12 digits)</option>
          <option value="UPC">UPC-A (11 digits)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={widthId} className={LABEL_CLASS}>Bar Width: {watched.width}x</label>
          <input
            id={widthId}
            type="range"
            min={1}
            max={4}
            step={1}
            {...register('width', { valueAsNumber: true })}
            disabled={isLoading}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label htmlFor={heightId} className={LABEL_CLASS}>Height: {watched.height}px</label>
          <input
            id={heightId}
            type="range"
            min={20}
            max={200}
            step={10}
            {...register('height', { valueAsNumber: true })}
            disabled={isLoading}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register('showValue')}
          disabled={isLoading}
          className="accent-primary"
        />
        <span className="text-sm font-medium text-foreground">Show value below barcode</span>
      </label>
    </div>
  )
}

const config: ToolEngineConfig<BarcodeGeneratorInput, ImageResult> = {
  ...barcodeGeneratorConfig,
  renderInput: (props) => <BarcodeInputView {...props} />,
}

export default function BarcodeGeneratorPage() {
  return <ToolEngine config={config} />
}
