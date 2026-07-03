import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { CssGradientGeneratorInput, CssGradientGeneratorResult } from './css-gradient-generator.config'
import { cssGradientGeneratorConfig, cssGradientGeneratorSchema } from './css-gradient-generator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

const DIRECTIONS = ['to right', 'to left', 'to bottom', 'to top', '45deg', '135deg', '90deg', '270deg']

function buildGradientStyle(input: CssGradientGeneratorInput): string {
  const stopList = input.stops.split(',').map((s) => s.trim())
  const colors = [input.color1, input.color2, input.color3].filter(Boolean)
  const colorStops = colors.map((c, i) => {
    const stop = stopList[i] ?? ''
    return stop ? `${c} ${stop}` : c
  }).join(', ')
  if (input.type === 'linear') return `linear-gradient(${input.direction}, ${colorStops})`
  if (input.type === 'radial') return `radial-gradient(circle at center, ${colorStops})`
  return `conic-gradient(from 0deg, ${colorStops})`
}

function CssGradientGeneratorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<CssGradientGeneratorInput>) {
  const ids = { dir: useId(), c1: useId(), c2: useId(), c3: useId(), stops: useId() }

  const { register, watch } = useForm<CssGradientGeneratorInput>({
    resolver: zodResolver(cssGradientGeneratorSchema),
    defaultValues: cssGradientGeneratorConfig.input.type === 'form' ? cssGradientGeneratorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = cssGradientGeneratorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  const gradientStyle = buildGradientStyle(watched)

  return (
    <div className="space-y-4">
      {/* Live preview */}
      <div
        className="w-full h-24 rounded-xl border border-border"
        style={{ backgroundImage: gradientStyle }}
        aria-label="Gradient preview"
      />

      {/* Type */}
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Type</span>
        <div className="flex flex-wrap gap-2">
          {(['linear', 'radial', 'conic'] as const).map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" value={t} {...register('type')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Direction (linear only) */}
      {watched.type === 'linear' && (
        <div>
          <label htmlFor={ids.dir} className={LABEL_CLASS}>Direction</label>
          <select id={ids.dir} {...register('direction')} disabled={isLoading} className={INPUT_CLASS}>
            {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={ids.c1} className={LABEL_CLASS}>Color 1</label>
          <div className="flex gap-2">
            <input type="color" {...register('color1')} disabled={isLoading} className="h-9 w-12 rounded border border-border bg-background cursor-pointer disabled:opacity-50" />
            <input id={ids.c1} type="text" {...register('color1')} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </div>
        <div>
          <label htmlFor={ids.c2} className={LABEL_CLASS}>Color 2</label>
          <div className="flex gap-2">
            <input type="color" {...register('color2')} disabled={isLoading} className="h-9 w-12 rounded border border-border bg-background cursor-pointer disabled:opacity-50" />
            <input id={ids.c2} type="text" {...register('color2')} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </div>
      </div>
      <div>
        <label htmlFor={ids.c3} className={LABEL_CLASS}>Color 3 (optional)</label>
        <div className="flex gap-2">
          <input type="color" {...register('color3')} disabled={isLoading} className="h-9 w-12 rounded border border-border bg-background cursor-pointer disabled:opacity-50" />
          <input id={ids.c3} type="text" {...register('color3')} disabled={isLoading} placeholder="Leave empty for 2-color gradient" className={INPUT_CLASS} />
        </div>
      </div>
      <div>
        <label htmlFor={ids.stops} className={LABEL_CLASS}>Color Stops (comma-separated)</label>
        <input id={ids.stops} type="text" {...register('stops')} disabled={isLoading} placeholder="0%, 50%, 100%" className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<CssGradientGeneratorInput, CssGradientGeneratorResult> = {
  ...cssGradientGeneratorConfig,
  renderInput: (props) => <CssGradientGeneratorInputView {...props} />,
}

export default function CssGradientGeneratorPage() {
  return <ToolEngine config={config} />
}
