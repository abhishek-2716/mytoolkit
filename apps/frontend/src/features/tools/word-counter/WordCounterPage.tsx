import { ToolEngine } from '../engine'
import { wordCounterConfig } from './word-counter.config'

export default function WordCounterPage() {
  return <ToolEngine config={wordCounterConfig} />
}
