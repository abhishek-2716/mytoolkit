import type { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'

import { ToastProvider } from '@/components/feedback'

import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'

interface AppProvidersProps {
  children: ReactNode
}

/** Root provider tree — wraps the entire application */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <HelmetProvider>
      <QueryProvider>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </QueryProvider>
    </HelmetProvider>
  )
}

export { QueryProvider } from './QueryProvider'
export { ThemeProvider } from './ThemeProvider'
