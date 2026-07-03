import { ToolEngine } from '../engine'
import { cssBeautifierConfig } from './css-beautifier.config'

export default function CssBeautifierPage() {
  return <ToolEngine config={cssBeautifierConfig} />
}
