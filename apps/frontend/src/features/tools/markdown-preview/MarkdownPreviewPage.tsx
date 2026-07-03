import { ToolEngine } from '../engine'
import { markdownPreviewConfig } from './markdown-preview.config'

export default function MarkdownPreviewPage() {
  return <ToolEngine config={markdownPreviewConfig} />
}
