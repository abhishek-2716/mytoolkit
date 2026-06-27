import type { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'

interface AppProvidersProps {
  children: ReactNode
}

/** Root provider tree — wraps the entire application */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  )
}

export { QueryProvider } from './QueryProvider'
export { ThemeProvider } from './ThemeProvider'
