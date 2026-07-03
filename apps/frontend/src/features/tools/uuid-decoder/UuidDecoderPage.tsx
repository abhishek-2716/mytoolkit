import { ToolEngine } from '../engine'
import { uuidDecoderConfig } from './uuid-decoder.config'

export default function UuidDecoderPage() {
  return <ToolEngine config={uuidDecoderConfig} />
}
