import { ToolEngine } from '../engine'
import { svgOptimizerConfig } from './svg-optimizer.config'

export default function SvgOptimizerPage() {
  return <ToolEngine config={svgOptimizerConfig} />
}
