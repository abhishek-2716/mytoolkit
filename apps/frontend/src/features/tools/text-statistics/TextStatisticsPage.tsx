import { ToolEngine } from '../engine'
import { textStatisticsConfig } from './text-statistics.config'

export default function TextStatisticsPage() {
  return <ToolEngine config={textStatisticsConfig} />
}
