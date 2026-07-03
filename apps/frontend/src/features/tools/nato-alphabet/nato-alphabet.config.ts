import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── NATO Table ─────────────────────────────────────────────────────────── */

const NATO: Record<string, string> = {
  A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo',
  F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliet',
  K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar',
  P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango',
  U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee',
  Z: 'Zulu',
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
  '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('nato-alphabet')
if (!tool) throw new Error('[ToolEngine] nato-alphabet not found in registry')

export const natoAlphabetConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Type text to convert to NATO phonetic alphabet...\n\nExample: Hello → Hotel Echo Lima Lima Oscar',
    maxLength: 1_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter text to convert.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = input
      .toUpperCase()
      .split('')
      .map((ch) => {
        if (ch === ' ') return '(space)'
        if (ch === '\n') return '(newline)'
        return NATO[ch] ?? ch
      })
      .join(' ')
    onProgress(100)
    return result
  },
  resultType: 'text',
  layoutMode: 'split',
})
