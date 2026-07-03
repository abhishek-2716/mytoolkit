import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { UnitConverterInput, UnitConverterResult } from './unit-converter.config'
import { CONVERSIONS, unitConverterConfig, unitConverterSchema } from './unit-converter.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const SELECT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

const CATEGORY_UNITS: Record<string, { value: string; label: string }[]> = {
  length: [
    { value: 'm', label: 'Meter (m)' }, { value: 'km', label: 'Kilometer (km)' },
    { value: 'cm', label: 'Centimeter (cm)' }, { value: 'mm', label: 'Millimeter (mm)' },
    { value: 'mile', label: 'Mile' }, { value: 'yard', label: 'Yard' },
    { value: 'foot', label: 'Foot (ft)' }, { value: 'inch', label: 'Inch (in)' },
  ],
  weight: [
    { value: 'kg', label: 'Kilogram (kg)' }, { value: 'g', label: 'Gram (g)' },
    { value: 'mg', label: 'Milligram (mg)' }, { value: 'lb', label: 'Pound (lb)' },
    { value: 'oz', label: 'Ounce (oz)' }, { value: 'ton', label: 'Metric Ton' }, { value: 'stone', label: 'Stone' },
  ],
  temperature: [
    { value: 'C', label: 'Celsius (°C)' }, { value: 'F', label: 'Fahrenheit (°F)' }, { value: 'K', label: 'Kelvin (K)' },
  ],
  volume: [
    { value: 'l', label: 'Liter (L)' }, { value: 'ml', label: 'Milliliter (mL)' },
    { value: 'm3', label: 'Cubic Meter (m³)' }, { value: 'gallon', label: 'Gallon (US)' },
    { value: 'quart', label: 'Quart' }, { value: 'pint', label: 'Pint' }, { value: 'cup', label: 'Cup' },
  ],
  area: [
    { value: 'm2', label: 'Sq. Meter (m²)' }, { value: 'km2', label: 'Sq. Kilometer (km²)' },
    { value: 'cm2', label: 'Sq. Centimeter (cm²)' }, { value: 'acre', label: 'Acre' },
    { value: 'hectare', label: 'Hectare' }, { value: 'foot2', label: 'Sq. Foot (ft²)' },
  ],
  speed: [
    { value: 'kmh', label: 'km/h' }, { value: 'mph', label: 'mph' },
    { value: 'ms', label: 'm/s' }, { value: 'knot', label: 'Knot' }, { value: 'fts', label: 'ft/s' },
  ],
}

// Suppress unused import warning
void CONVERSIONS

function UnitConverterInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<UnitConverterInput>) {
  const valueId = useId()
  const fromId = useId()
  const toId = useId()
  const catId = useId()

  const { register, watch, setValue } = useForm<UnitConverterInput>({
    resolver: zodResolver(unitConverterSchema),
    defaultValues: unitConverterConfig.input.type === 'form' ? unitConverterConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()
  const category = watched.category
  const units = CATEGORY_UNITS[category] ?? []

  // Reset units when category changes
  useEffect(() => {
    const first = units[0]?.value ?? ''
    const second = units[1]?.value ?? ''
    setValue('fromUnit', first)
    setValue('toUnit', second)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  useEffect(() => {
    const parsed = unitConverterSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={catId} className={LABEL_CLASS}>Category</label>
        <select id={catId} {...register('category')} disabled={isLoading} className={SELECT_CLASS}>
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temperature">Temperature</option>
          <option value="volume">Volume</option>
          <option value="area">Area</option>
          <option value="speed">Speed</option>
        </select>
      </div>
      <div>
        <label htmlFor={valueId} className={LABEL_CLASS}>Value</label>
        <input
          id={valueId}
          type="number"
          step="any"
          placeholder="Enter value..."
          {...register('value', { valueAsNumber: true })}
          disabled={isLoading}
          className={INPUT_CLASS}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={fromId} className={LABEL_CLASS}>From</label>
          <select id={fromId} {...register('fromUnit')} disabled={isLoading} className={SELECT_CLASS}>
            {units.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={toId} className={LABEL_CLASS}>To</label>
          <select id={toId} {...register('toUnit')} disabled={isLoading} className={SELECT_CLASS}>
            {units.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<UnitConverterInput, UnitConverterResult> = {
  ...unitConverterConfig,
  renderInput: (props) => <UnitConverterInputView {...props} />,
}

export default function UnitConverterPage() {
  return <ToolEngine config={config} />
}
