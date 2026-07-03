import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { UuidGeneratorInput, UuidGeneratorResult } from './uuid-generator.config'
import { uuidGeneratorConfig } from './uuid-generator.config'
import { UuidGeneratorInputView, UuidGeneratorResultView } from './UuidGeneratorViews'

const config: ToolEngineConfig<UuidGeneratorInput, UuidGeneratorResult> = {
  ...uuidGeneratorConfig,
  resultType: 'custom',
  renderInput: (props) => <UuidGeneratorInputView {...props} />,
  renderResult: ({ result, onReset }) => (
    <UuidGeneratorResultView result={result} onReset={onReset} />
  ),
}

export default function UuidGeneratorPage() {
  return <ToolEngine config={config} />
}
