import { ToolEngine } from '../engine'
import { ipAddressValidatorConfig } from './ip-address-validator.config'

export default function IpAddressValidatorPage() {
  return <ToolEngine config={ipAddressValidatorConfig} />
}
