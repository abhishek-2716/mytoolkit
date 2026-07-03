import { ToolEngine } from '../engine'
import { imageToBase64Config } from './image-to-base64.config'

export default function ImageToBase64Page() {
  return <ToolEngine config={imageToBase64Config} />
}
