import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { LoremIpsumInput, LoremIpsumResult } from './lorem-ipsum.config'
import { loremIpsumConfig } from './lorem-ipsum.config'
import { LoremIpsumInputView } from './LoremIpsumViews'

const config: ToolEngineConfig<LoremIpsumInput, LoremIpsumResult> = {
  ...loremIpsumConfig,
  renderInput: (props) => <LoremIpsumInputView {...props} />,
}

export default function LoremIpsumPage() {
  return <ToolEngine config={config} />
}
