import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const speedCalculatorSchema = z.object({
  mode: z.enum(['speed', 'distance', 'time']),
  speed: z.number().optional(),
  distance: z.number().optional(),
  hours: z.number().optional(),
  minutes: z.number().optional(),
  speedUnit: z.enum(['kmh', 'mph', 'ms']),
  distanceUnit: z.enum(['km', 'miles', 'meters']),
})

export type SpeedCalculatorInput = z.infer<typeof speedCalculatorSchema>
export type SpeedCalculatorResult = StructuredResultItem[]

/* ─── Conversion helpers ─────────────────────────────────────────────────── */

const SPEED_TO_MS: Record<string, number> = { kmh: 1 / 3.6, mph: 0.44704, ms: 1 }
const DIST_TO_M: Record<string, number> = { km: 1000, miles: 1609.344, meters: 1 }

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('speed-calculator')
if (!tool) throw new Error('[ToolEngine] speed-calculator not found in registry')

export const speedCalculatorConfig = defineToolConfig<SpeedCalculatorInput, SpeedCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: speedCalculatorSchema,
    defaultValues: { mode: 'speed', speed: undefined, distance: 100, hours: 1, minutes: 0, speedUnit: 'kmh', distanceUnit: 'km' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)

    const timeHrs = (input.hours ?? 0) + (input.minutes ?? 0) / 60
    const speedMs = (input.speed ?? 0) * (SPEED_TO_MS[input.speedUnit] ?? 1)
    const distanceM = (input.distance ?? 0) * (DIST_TO_M[input.distanceUnit] ?? 1)

    let resultItems: StructuredResultItem[] = []

    if (input.mode === 'speed') {
      if (!distanceM || !timeHrs) throw new Error('Enter distance and time to calculate speed.')
      const ms = distanceM / (timeHrs * 3600)
      resultItems = [
        { label: 'Speed (m/s)', value: ms.toFixed(4) },
        { label: 'Speed (km/h)', value: (ms * 3.6).toFixed(4), valueColorClass: 'text-primary' },
        { label: 'Speed (mph)', value: (ms / 0.44704).toFixed(4) },
        { label: 'Distance', value: `${input.distance} ${input.distanceUnit}` },
        { label: 'Time', value: `${input.hours ?? 0}h ${input.minutes ?? 0}m` },
      ]
    } else if (input.mode === 'distance') {
      if (!speedMs || !timeHrs) throw new Error('Enter speed and time to calculate distance.')
      const meters = speedMs * timeHrs * 3600
      resultItems = [
        { label: 'Distance (meters)', value: meters.toFixed(2) },
        { label: 'Distance (km)', value: (meters / 1000).toFixed(4), valueColorClass: 'text-primary' },
        { label: 'Distance (miles)', value: (meters / 1609.344).toFixed(4) },
        { label: 'Speed', value: `${input.speed} ${input.speedUnit}` },
        { label: 'Time', value: `${input.hours ?? 0}h ${input.minutes ?? 0}m` },
      ]
    } else {
      if (!speedMs || !distanceM) throw new Error('Enter speed and distance to calculate time.')
      const totalSecs = distanceM / speedMs
      const hrs = Math.floor(totalSecs / 3600)
      const mins = Math.floor((totalSecs % 3600) / 60)
      const secs = Math.round(totalSecs % 60)
      resultItems = [
        { label: 'Time', value: `${hrs}h ${mins}m ${secs}s`, valueColorClass: 'text-primary' },
        { label: 'Total Seconds', value: totalSecs.toFixed(1) },
        { label: 'Speed', value: `${input.speed} ${input.speedUnit}` },
        { label: 'Distance', value: `${input.distance} ${input.distanceUnit}` },
      ]
    }

    onProgress(100)
    return resultItems
  },
  resultType: 'structured',
  layoutMode: 'split',
})
