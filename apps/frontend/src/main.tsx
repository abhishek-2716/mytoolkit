import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import './styles/globals.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Ensure an element with id="root" exists in index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
