import { ToolEngine } from '../engine'
import { colorConverterConfig } from './color-converter.config'

export default function ColorConverterPage() {
  return <ToolEngine config={colorConverterConfig} />
}
