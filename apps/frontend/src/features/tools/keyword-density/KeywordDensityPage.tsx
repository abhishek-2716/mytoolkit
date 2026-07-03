import { ToolEngine } from '../engine'
import { keywordDensityConfig } from './keyword-density.config'

export default function KeywordDensityPage() {
  return <ToolEngine config={keywordDensityConfig} />
}
