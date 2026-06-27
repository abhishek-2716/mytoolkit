/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_URL?: string
  readonly VITE_APP_ENV?: 'development' | 'staging' | 'production'
  readonly VITE_API_BASE_URL?: string
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_UPLOAD_MAX_SIZE?: string // MB, e.g. "50"
  readonly VITE_DEFAULT_THEME?: string // "light" | "dark" | "system"
  readonly VITE_ENABLE_ANALYTICS?: string // "true" | "false"
  readonly VITE_ENABLE_BLOG?: string // "true" | "false"
  readonly VITE_ENABLE_SEARCH?: string // "true" | "false"
  readonly VITE_ENABLE_AI?: string // "true" | "false"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
