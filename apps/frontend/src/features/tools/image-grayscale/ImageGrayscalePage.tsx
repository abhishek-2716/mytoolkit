import { ToolEngine } from '../engine'
import { imageGrayscaleConfig } from './image-grayscale.config'

export default function ImageGrayscalePage() {
  return <ToolEngine config={imageGrayscaleConfig} />
}
