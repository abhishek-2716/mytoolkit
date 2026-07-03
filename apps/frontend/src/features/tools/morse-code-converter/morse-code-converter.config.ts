import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Morse Tables ───────────────────────────────────────────────────────── */

const CHAR_TO_MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/',
}

const MORSE_TO_CHAR: Record<string, string> = Object.fromEntries(
  Object.entries(CHAR_TO_MORSE).map(([k, v]) => [v, k])
)

function isMorseInput(value: string): boolean {
  return /^[.\-/ \n]+$/.test(value.trim())
}

function encodeToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((ch) => CHAR_TO_MORSE[ch] ?? '?')
    .join(' ')
}

function decodeFromMorse(morse: string): string {
  return morse
    .trim()
    .split(/\s+\/\s+|\s{2,}/)
    .map((word) =>
      word
        .trim()
        .split(' ')
        .map((code) => (code === '/' ? ' ' : (MORSE_TO_CHAR[code] ?? '?')))
        .join('')
    )
    .join(' ')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('morse-code-converter')
if (!tool) throw new Error('[ToolEngine] morse-code-converter not found in registry')

export const morseCodeConverterConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Type text to convert to Morse code, or paste Morse code (. - /) to decode...',
    maxLength: 10_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter text or Morse code to convert.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = isMorseInput(input) ? decodeFromMorse(input) : encodeToMorse(input)
    onProgress(100)
    return result
  },
  resultType: 'text',
  layoutMode: 'split',
})
