import { ToolEngine } from '../engine'
import { romanNumeralConverterConfig } from './roman-numeral-converter.config'

export default function RomanNumeralConverterPage() {
  return <ToolEngine config={romanNumeralConverterConfig} />
}
