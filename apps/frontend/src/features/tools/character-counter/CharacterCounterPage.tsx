import { ToolEngine } from '../engine'
import { characterCounterConfig } from './character-counter.config'

export default function CharacterCounterPage() {
  return <ToolEngine config={characterCounterConfig} />
}
