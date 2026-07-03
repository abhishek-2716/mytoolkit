import { ToolEngine } from '../engine'
import { cssMinifierConfig } from './css-minifier.config'

export default function CssMinifierPage() {
  return <ToolEngine config={cssMinifierConfig} />
}
