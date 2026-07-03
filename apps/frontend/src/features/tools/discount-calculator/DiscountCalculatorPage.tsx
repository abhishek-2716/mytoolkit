import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { DiscountCalculatorInput, DiscountCalculatorResult } from './discount-calculator.config'
import { discountCalculatorConfig, discountCalculatorSchema } from './discount-calculator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function DiscountCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<DiscountCalculatorInput>) {
  const priceId = useId()
  const discountId = useId()

  const { register, watch } = useForm<DiscountCalculatorInput>({
    resolver: zodResolver(discountCalculatorSchema),
    defaultValues: discountCalculatorConfig.input.type === 'form' ? discountCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = discountCalculatorSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={priceId} className={LABEL_CLASS}>Original Price (₹)</label>
        <input
          id={priceId}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="e.g. 1000"
          {...register('originalPrice', { valueAsNumber: true })}
          disabled={isLoading}
          className={INPUT_CLASS}
        />
      </div>
      <div>
        <label htmlFor={discountId} className={LABEL_CLASS}>Discount (%)</label>
        <input
          id={discountId}
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="e.g. 20"
          {...register('discountPercent', { valueAsNumber: true })}
          disabled={isLoading}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<DiscountCalculatorInput, DiscountCalculatorResult> = {
  ...discountCalculatorConfig,
  renderInput: (props) => <DiscountCalculatorInputView {...props} />,
}

export default function DiscountCalculatorPage() {
  return <ToolEngine config={config} />
}
