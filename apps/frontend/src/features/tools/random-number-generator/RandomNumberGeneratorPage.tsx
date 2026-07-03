import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { RandomNumberInput } from './random-number-generator.config'
import { randomNumberConfig, randomNumberSchema } from './random-number-generator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function RandomNumberInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<RandomNumberInput>) {
  const minId = useId()
  const maxId = useId()
  const countId = useId()
  const decimalsId = useId()
  const uniqueId = useId()

  const { register, watch } = useForm<RandomNumberInput>({
    resolver: zodResolver(randomNumberSchema),
    defaultValues: randomNumberConfig.input.type === 'form' ? randomNumberConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = randomNumberSchema.safeParse(watched)
    if (parsed.success) onInputChange(parsed.data)
  }, [watched, onInputChange])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={minId} className={LABEL_CLASS}>Minimum</label>
          <input id={minId} type="number" step="any" {...register('min', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor={maxId} className={LABEL_CLASS}>Maximum</label>
          <input id={maxId} type="number" step="any" {...register('max', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        </div>
      </div>
      <div>
        <label htmlFor={countId} className={LABEL_CLASS}>Count (1–1000)</label>
        <input id={countId} type="number" min="1" max="1000" step="1" {...register('count', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input id={decimalsId} type="checkbox" {...register('allowDecimals')} disabled={isLoading} className="rounded border-border" />
          <span className="text-sm text-foreground">Allow decimals</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input id={uniqueId} type="checkbox" {...register('unique')} disabled={isLoading} className="rounded border-border" />
          <span className="text-sm text-foreground">Unique numbers</span>
        </label>
      </div>
      <button
        type="button"
        onClick={() => onProcess()}
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        Generate Numbers
      </button>
    </div>
  )
}

const config: ToolEngineConfig<RandomNumberInput, string> = {
  ...randomNumberConfig,
  renderInput: (props) => <RandomNumberInputView {...props} />,
}

export default function RandomNumberGeneratorPage() {
  return <ToolEngine config={config} />
}
