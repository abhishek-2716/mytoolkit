import { ToolEngine } from '../engine'
import { morseCodeConverterConfig } from './morse-code-converter.config'

export default function MorseCodeConverterPage() {
  return <ToolEngine config={morseCodeConverterConfig} />
}
