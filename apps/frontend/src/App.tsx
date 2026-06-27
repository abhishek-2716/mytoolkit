import { Toaster } from 'react-hot-toast'

import { AppProviders } from './providers'
import { AppRouter } from './routes'

function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
        }}
      />
    </AppProviders>
  )
}

export default App
