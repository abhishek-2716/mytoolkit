import { ToolEngine } from '../engine'
import { cronExpressionParserConfig } from './cron-expression-parser.config'

export default function CronExpressionParserPage() {
  return <ToolEngine config={cronExpressionParserConfig} />
}
