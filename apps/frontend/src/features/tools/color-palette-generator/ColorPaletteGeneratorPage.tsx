import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { ColorPaletteInput, ColorPaletteResult } from './color-palette-generator.config'
import { colorPaletteConfig, colorPaletteSchema } from './color-palette-generator.config'

/* ─── Custom Input View ──────────────────────────────────────────────────── */

const PALETTE_TYPES = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'split-complementary', label: 'Split-Complementary' },
  { value: 'monochromatic', label: 'Monochromatic' },
] as const

function ColorPaletteInputView({
  onInputChange,
  onProcess,
  isLoading,
}: ToolInputRenderProps<ColorPaletteInput>) {
  const defaults = colorPaletteConfig.input.type === 'form' ? colorPaletteConfig.input.defaultValues : undefined
  const { register, watch } = useForm<ColorPaletteInput>({
    resolver: zodResolver(colorPaletteSchema),
    defaultValues: defaults,
    mode: 'onChange',
  })
  const watched = watch()

  useEffect(() => {
    const result = colorPaletteSchema.safeParse(watched)
    if (!result.success) return
    onInputChange(result.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  const countId = useId()

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Base Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            {...register('baseColor')}
            disabled={isLoading}
            className="h-10 w-16 rounded-lg border border-border cursor-pointer shrink-0"
          />
          <input
            type="text"
            value={watched.baseColor}
            onChange={(e) => {
              const el = e.target
              const syntheticEvent = { target: { value: el.value, name: 'baseColor' } }
              register('baseColor').onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
            }}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Palette Type</label>
        <select
          {...register('paletteType')}
          disabled={isLoading}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        >
          {PALETTE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {(watched.paletteType === 'analogous' || watched.paletteType === 'monochromatic') && (
        <div>
          <label htmlFor={countId} className="block text-sm font-medium text-foreground mb-1.5">
            Number of Colors: {watched.count}
          </label>
          <input
            id={countId}
            type="range"
            min={3}
            max={10}
            step={1}
            {...register('count', { valueAsNumber: true })}
            disabled={isLoading}
            className="w-full accent-primary"
          />
        </div>
      )}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const config: ToolEngineConfig<ColorPaletteInput, ColorPaletteResult> = {
  ...colorPaletteConfig,
  renderInput: (props) => <ColorPaletteInputView {...props} />,
}

export default function ColorPaletteGeneratorPage() {
  return <ToolEngine config={config} />
}
