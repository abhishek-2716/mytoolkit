import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { TimestampConverterInput, TimestampConverterResult } from './timestamp-converter.config'
import { timestampConverterConfig, timestampConverterSchema } from './timestamp-converter.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function TimestampConverterInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<TimestampConverterInput>) {
  const valueId = useId()

  const { register, watch } = useForm<TimestampConverterInput>({
    resolver: zodResolver(timestampConverterSchema),
    defaultValues: timestampConverterConfig.input.type === 'form' ? timestampConverterConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = timestampConverterSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  const isUnixToDate = watched.type === 'unix-to-date'

  return (
    <div className="space-y-5">
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Conversion Mode</span>
        <div className="flex flex-wrap gap-2">
          {(['unix-to-date', 'date-to-unix'] as const).map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" value={t} {...register('type')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.type === t
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {t === 'unix-to-date' ? 'Unix → Date' : 'Date → Unix'}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor={valueId} className={LABEL_CLASS}>
          {isUnixToDate ? 'Unix Timestamp (seconds)' : 'Date / DateTime String'}
        </label>
        <input
          id={valueId}
          type="text"
          {...register('value')}
          disabled={isLoading}
          placeholder={isUnixToDate ? 'e.g. 1719705600' : 'e.g. 2024-06-30T00:00:00Z'}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<TimestampConverterInput, TimestampConverterResult> = {
  ...timestampConverterConfig,
  renderInput: (props) => <TimestampConverterInputView {...props} />,
}

export default function TimestampConverterPage() {
  return <ToolEngine config={config} />
}
