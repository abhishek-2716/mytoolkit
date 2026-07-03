import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { StructuredResultItem, ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { ColorContrastInput } from './color-contrast-checker.config'
import { colorContrastConfig, colorContrastSchema } from './color-contrast-checker.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function ColorContrastInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<ColorContrastInput>) {
  const fgId = useId()
  const bgId = useId()

  const { register, watch } = useForm<ColorContrastInput>({
    resolver: zodResolver(colorContrastSchema),
    defaultValues: colorContrastConfig.input.type === 'form' ? colorContrastConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = colorContrastSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  const fg = watched.foreground ?? '#000000'
  const bg = watched.background ?? '#ffffff'

  return (
    <div className="space-y-5">
      {/* Live preview swatch */}
      <div
        className="rounded-xl flex items-center justify-center h-24 text-lg font-semibold shadow-inner"
        style={{ backgroundColor: bg, color: fg }}
      >
        Sample Text Preview
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={fgId} className={LABEL_CLASS}>Foreground Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={fg}
              {...register('foreground')}
              disabled={isLoading}
              className="h-9 w-12 rounded-lg border border-border bg-background cursor-pointer p-0.5"
            />
            <input
              id={fgId}
              type="text"
              {...register('foreground')}
              disabled={isLoading}
              placeholder="#000000"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor={bgId} className={LABEL_CLASS}>Background Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              {...register('background')}
              disabled={isLoading}
              className="h-9 w-12 rounded-lg border border-border bg-background cursor-pointer p-0.5"
            />
            <input
              id={bgId}
              type="text"
              {...register('background')}
              disabled={isLoading}
              placeholder="#ffffff"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<ColorContrastInput, StructuredResultItem[]> = {
  ...colorContrastConfig,
  renderInput: (props) => <ColorContrastInputView {...props} />,
}

export default function ColorContrastCheckerPage() {
  return <ToolEngine config={config} />
}
