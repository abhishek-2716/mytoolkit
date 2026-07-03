import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { CaseConverterInput, CaseConverterResult } from './case-converter.config'
import { caseConverterConfig } from './case-converter.config'
import { CaseConverterResultView } from './CaseConverterResultView'

const config: ToolEngineConfig<CaseConverterInput, CaseConverterResult> = {
  ...caseConverterConfig,
  renderResult: ({ result, onReset }) => (
    <CaseConverterResultView result={result} onReset={onReset} />
  ),
}

export default function CaseConverterPage() {
  return <ToolEngine config={config} />
}
