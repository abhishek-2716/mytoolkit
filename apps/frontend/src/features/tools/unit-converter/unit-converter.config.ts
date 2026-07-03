import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const unitConverterSchema = z.object({
  value: z.number(),
  fromUnit: z.string(),
  toUnit: z.string(),
  category: z.enum(['length', 'weight', 'temperature', 'volume', 'area', 'speed']),
})

export type UnitConverterInput = z.infer<typeof unitConverterSchema>
export type UnitConverterResult = StructuredResultItem[]

/* ─── Conversion Tables ──────────────────────────────────────────────────── */

// All values are ratios relative to a base unit (multiply to get base, divide to get target)
const CONVERSIONS: Record<string, Record<string, number>> = {
  length:      { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254, nm: 1e-9 },
  weight:      { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000, stone: 6.35029 },
  volume:      { l: 1, ml: 0.001, m3: 1000, cm3: 0.001, gallon: 3.78541, quart: 0.946353, pint: 0.473176, cup: 0.236588, floz: 0.0295735 },
  area:        { m2: 1, km2: 1e6, cm2: 0.0001, mm2: 1e-6, mile2: 2589988.11, acre: 4046.86, hectare: 10000, foot2: 0.0929, yard2: 0.8361 },
  speed:       { ms: 1, kmh: 0.277778, mph: 0.44704, knot: 0.514444, fts: 0.3048 },
}

const UNIT_LABELS: Record<string, string> = {
  m: 'Meter', km: 'Kilometer', cm: 'Centimeter', mm: 'Millimeter',
  mile: 'Mile', yard: 'Yard', foot: 'Foot', inch: 'Inch', nm: 'Nanometer',
  kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce',
  ton: 'Metric Ton', stone: 'Stone',
  l: 'Liter', ml: 'Milliliter', m3: 'Cubic Meter', cm3: 'Cubic Centimeter',
  gallon: 'Gallon (US)', quart: 'Quart', pint: 'Pint', cup: 'Cup', floz: 'Fluid Ounce',
  m2: 'Sq. Meter', km2: 'Sq. Kilometer', cm2: 'Sq. Centimeter', mm2: 'Sq. Millimeter',
  mile2: 'Sq. Mile', acre: 'Acre', hectare: 'Hectare', foot2: 'Sq. Foot', yard2: 'Sq. Yard',
  ms: 'm/s', kmh: 'km/h', mph: 'mph', knot: 'Knot', fts: 'ft/s',
  C: '°C', F: '°F', K: 'Kelvin',
}

function convertTemperature(value: number, from: string, to: string): number {
  // First convert to Celsius
  let celsius: number
  if (from === 'C') celsius = value
  else if (from === 'F') celsius = (value - 32) * 5 / 9
  else celsius = value - 273.15 // K

  // Then to target
  if (to === 'C') return celsius
  if (to === 'F') return celsius * 9 / 5 + 32
  return celsius + 273.15 // K
}

function convertUnit(value: number, from: string, to: string, category: string): number {
  if (category === 'temperature') return convertTemperature(value, from, to)
  const table = CONVERSIONS[category]
  if (!table) throw new Error(`Unknown category: ${category}`)
  const fromRatio = table[from]
  const toRatio = table[to]
  if (fromRatio === undefined) throw new Error(`Unknown unit: ${from}`)
  if (toRatio === undefined) throw new Error(`Unknown unit: ${to}`)
  const base = value * fromRatio
  return base / toRatio
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('unit-converter')
if (!tool) throw new Error('[ToolEngine] unit-converter not found in registry')

export const unitConverterConfig = defineToolConfig<UnitConverterInput, UnitConverterResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: unitConverterSchema,
    defaultValues: { value: 1, fromUnit: 'km', toUnit: 'mile', category: 'length' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const result = convertUnit(input.value, input.fromUnit, input.toUnit, input.category)
    const fmt = (n: number) => {
      if (Math.abs(n) < 0.0001 || Math.abs(n) >= 1e9) return n.toExponential(6)
      return parseFloat(n.toPrecision(8)).toString()
    }
    onProgress(80)

    // Also show common related conversions
    const category = input.category
    const items: StructuredResultItem[] = [
      {
        label: `${UNIT_LABELS[input.fromUnit] ?? input.fromUnit} → ${UNIT_LABELS[input.toUnit] ?? input.toUnit}`,
        value: `${input.value} = ${fmt(result)} ${input.toUnit}`,
        valueColorClass: 'text-primary',
      },
    ]

    // Add a few more conversions in the same category
    if (category !== 'temperature') {
      const table = CONVERSIONS[category]
      const allUnits = Object.keys(table).filter((u) => u !== input.fromUnit).slice(0, 5)
      for (const u of allUnits) {
        const v = convertUnit(input.value, input.fromUnit, u, category)
        items.push({ label: UNIT_LABELS[u] ?? u, value: `${fmt(v)} ${u}` })
      }
    } else {
      const temps = ['C', 'F', 'K'].filter((u) => u !== input.fromUnit)
      for (const u of temps) {
        const v = convertTemperature(input.value, input.fromUnit, u)
        items.push({ label: UNIT_LABELS[u] ?? u, value: `${fmt(v)} ${u}` })
      }
    }

    onProgress(100)
    return items
  },
  resultType: 'structured',
  layoutMode: 'split',
})

export { CONVERSIONS, UNIT_LABELS, convertUnit }
