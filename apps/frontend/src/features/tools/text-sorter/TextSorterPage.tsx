import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { TextSorterInput, TextSorterResult } from './text-sorter.config'
import { textSorterConfig } from './text-sorter.config'
import { TextSorterInputView } from './TextSorterViews'

const config: ToolEngineConfig<TextSorterInput, TextSorterResult> = {
  ...textSorterConfig,
  renderInput: (props) => <TextSorterInputView {...props} />,
}

export default function TextSorterPage() {
  return <ToolEngine config={config} />
}
