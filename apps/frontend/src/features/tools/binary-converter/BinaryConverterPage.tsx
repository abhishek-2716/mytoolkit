import { ToolEngine } from '../engine'
import { binaryConverterConfig } from './binary-converter.config'

export default function BinaryConverterPage() {
  return <ToolEngine config={binaryConverterConfig} />
}
