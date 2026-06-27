export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api',
  version: 'v1',
  timeout: 30_000,
  uploadTimeout: 300_000, // 5 minutes for file uploads
} as const
