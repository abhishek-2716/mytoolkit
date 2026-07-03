import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { NumberBaseConverterInput, NumberBaseConverterResult } from './number-base-converter.config'
import { numberBaseConverterConfig, numberBaseConverterSchema } from './number-base-converter.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const SELECT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

function NumberBaseConverterInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<NumberBaseConverterInput>) {
  const numberId = useId()
  const baseId = useId()

  const { register, watch } = useForm<NumberBaseConverterInput>({
    resolver: zodResolver(numberBaseConverterSchema),
    defaultValues: numberBaseConverterConfig.input.type === 'form' ? numberBaseConverterConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = numberBaseConverterSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={baseId} className={LABEL_CLASS}>From Base</label>
        <select id={baseId} {...register('fromBase')} disabled={isLoading} className={SELECT_CLASS}>
          <option value="2">Binary (Base 2)</option>
          <option value="8">Octal (Base 8)</option>
          <option value="10">Decimal (Base 10)</option>
          <option value="16">Hexadecimal (Base 16)</option>
        </select>
      </div>
      <div>
        <label htmlFor={numberId} className={LABEL_CLASS}>Number</label>
        <input
          id={numberId}
          type="text"
          placeholder="Enter a number..."
          {...register('number')}
          disabled={isLoading}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<NumberBaseConverterInput, NumberBaseConverterResult> = {
  ...numberBaseConverterConfig,
  renderInput: (props) => <NumberBaseConverterInputView {...props} />,
}

export default function NumberBaseConverterPage() {
  return <ToolEngine config={config} />
}
