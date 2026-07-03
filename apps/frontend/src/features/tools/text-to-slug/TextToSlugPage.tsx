import { ToolEngine } from '../engine'
import { textToSlugConfig } from './text-to-slug.config'

export default function TextToSlugPage() {
  return <ToolEngine config={textToSlugConfig} />
}
