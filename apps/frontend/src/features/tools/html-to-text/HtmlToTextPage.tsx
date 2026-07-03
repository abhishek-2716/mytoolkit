import { ToolEngine } from '../engine'
import { htmlToTextConfig } from './html-to-text.config'

export default function HtmlToTextPage() {
  return <ToolEngine config={htmlToTextConfig} />
}
