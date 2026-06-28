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
            background: 'var(--color-surface)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            boxShadow: 'var(--shadow-lg)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'var(--color-success-foreground)',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: 'var(--color-danger-foreground)',
            },
          },
        }}
      />
    </AppProviders>
  )
}

export default App
