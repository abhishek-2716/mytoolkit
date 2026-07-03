import { ToolEngine } from '../engine'
import { htmlMinifierConfig } from './html-minifier.config'

export default function HtmlMinifierPage() {
  return <ToolEngine config={htmlMinifierConfig} />
}
