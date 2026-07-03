import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { HashGeneratorInput, HashGeneratorResult } from './hash-generator.config'
import { hashGeneratorConfig, hashGeneratorSchema } from './hash-generator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const

function HashGeneratorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<HashGeneratorInput>) {
  const textId = useId()
  const algoId = useId()

  const { register, watch } = useForm<HashGeneratorInput>({
    resolver: zodResolver(hashGeneratorSchema),
    defaultValues: hashGeneratorConfig.input.type === 'form' ? hashGeneratorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = hashGeneratorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={algoId} className={LABEL_CLASS}>Algorithm</label>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((a) => (
            <label key={a} className="cursor-pointer">
              <input type="radio" value={a} {...register('algorithm')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.algorithm === a
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {a}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor={textId} className={LABEL_CLASS}>Text to Hash</label>
        <textarea id={textId} rows={5} {...register('text')} disabled={isLoading} placeholder="Enter text to generate its hash..." className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<HashGeneratorInput, HashGeneratorResult> = {
  ...hashGeneratorConfig,
  renderInput: (props) => <HashGeneratorInputView {...props} />,
}

export default function HashGeneratorPage() {
  return <ToolEngine config={config} />
}
