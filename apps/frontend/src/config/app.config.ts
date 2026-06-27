export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'ToolNest',
  description: 'Free Online Productivity Tools',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  version: '0.1.0',
  env: import.meta.env.VITE_APP_ENV || 'development',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
