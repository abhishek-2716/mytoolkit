import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { CsvToJsonInput, CsvToJsonResult } from './csv-to-json.config'
import { csvToJsonConfig } from './csv-to-json.config'
import { CsvToJsonInputView, CsvToJsonResultView } from './CsvToJsonViews'

const config: ToolEngineConfig<CsvToJsonInput, CsvToJsonResult> = {
  ...csvToJsonConfig,
  renderInput: (props) => <CsvToJsonInputView {...props} />,
  renderResult: ({ result, onReset }) => (
    <CsvToJsonResultView result={result} onReset={onReset} />
  ),
}

export default function CsvToJsonPage() {
  return <ToolEngine config={config} />
}
