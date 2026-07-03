import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Lorem Ipsum Data ───────────────────────────────────────────────────── */

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'reprehenderit', 'in', 'voluptate', 'velit',
  'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde', 'omnis',
  'natus', 'error', 'voluptatem', 'accusantium', 'doloremque', 'laudantium',
  'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore',
  'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'explicabo',
  'nemo', 'ipsam', 'quia', 'aspernatur', 'aut', 'odit', 'fugit', 'consequuntur',
  'magni', 'dolores', 'eos', 'ratione', 'sequi', 'nesciunt', 'neque', 'porro',
  'quisquam', 'dolorem', 'adipisci', 'numquam', 'eius', 'modi', 'tempora',
  'incidunt', 'magnam', 'quaerat', 'voluptas',
]

const STANDARD_LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)] ?? 'lorem'
}

function generateSentence(wordCount = 8): string {
  const words = Array.from({ length: wordCount }, randomWord)
  const sentence = words.join(' ')
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
}

function generateParagraph(sentenceCount = 5): string {
  const sentences = Array.from(
    { length: sentenceCount },
    (_, i) => (i === 0 && Math.random() > 0.5 ? STANDARD_LOREM : generateSentence(6 + Math.floor(Math.random() * 8)))
  )
  return sentences.join(' ')
}

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const loremIpsumSchema = z.object({
  type: z.enum(['paragraphs', 'sentences', 'words']),
  count: z.number().int().min(1).max(100),
  startWithLorem: z.boolean(),
})

export type LoremIpsumInput = z.infer<typeof loremIpsumSchema>
export type LoremIpsumResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processLoremIpsum(
  input: LoremIpsumInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): LoremIpsumResult {
  onProgress(20)

  let result: string

  switch (input.type) {
    case 'paragraphs': {
      const paragraphs = Array.from({ length: input.count }, (_, i) =>
        i === 0 && input.startWithLorem
          ? generateParagraph(5)
          : generateParagraph(4 + Math.floor(Math.random() * 4))
      )
      if (input.startWithLorem && paragraphs.length > 0) {
        paragraphs[0] = STANDARD_LOREM + ' ' + (paragraphs[0]?.split('. ').slice(1).join('. ') ?? '')
      }
      result = paragraphs.join('\n\n')
      break
    }
    case 'sentences': {
      const sentences = Array.from({ length: input.count }, (_, i) =>
        i === 0 && input.startWithLorem ? STANDARD_LOREM : generateSentence()
      )
      result = sentences.join(' ')
      break
    }
    case 'words': {
      const words = Array.from({ length: input.count }, (_, i) =>
        i === 0 && input.startWithLorem ? 'Lorem' : randomWord()
      )
      result = words.join(' ')
      break
    }
  }

  onProgress(100)
  return result
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('lorem-ipsum')

if (!tool) {
  throw new Error('[ToolEngine] lorem-ipsum not found in registry')
}

export const loremIpsumConfig = defineToolConfig<LoremIpsumInput, LoremIpsumResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'form',
    schema: loremIpsumSchema,
    defaultValues: {
      type: 'paragraphs',
      count: 3,
      startWithLorem: true,
    },
  },

  process: processLoremIpsum,

  resultType: 'text',
  layoutMode: 'form',
})
