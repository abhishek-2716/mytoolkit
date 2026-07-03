import { ToolEngine } from '../engine'
import { jwtDecoderConfig } from './jwt-decoder.config'

export default function JwtDecoderPage() {
  return <ToolEngine config={jwtDecoderConfig} />
}
