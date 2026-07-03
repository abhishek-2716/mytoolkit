import { ToolEngine } from '../engine'
import { natoAlphabetConfig } from './nato-alphabet.config'

export default function NatoAlphabetPage() {
  return <ToolEngine config={natoAlphabetConfig} />
}
