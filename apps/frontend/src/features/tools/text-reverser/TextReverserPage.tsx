import { ToolEngine } from '../engine'
import { textReverserConfig } from './text-reverser.config'

export default function TextReverserPage() {
  return <ToolEngine config={textReverserConfig} />
}
