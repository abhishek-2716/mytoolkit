import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Primary alias — use @/... in all imports (e.g. @/components/Button)
      '@': resolve(__dirname, './src'),
      // Convenience short-form aliases — available but @/... is preferred
      '@components': resolve(__dirname, './src/components'),
      '@features': resolve(__dirname, './src/features'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils'),
      '@config': resolve(__dirname, './src/config'),
      '@store': resolve(__dirname, './src/store'),
      '@assets': resolve(__dirname, './src/assets'),
      '@constants': resolve(__dirname, './src/constants'),
      '@providers': resolve(__dirname, './src/providers'),
      '@styles': resolve(__dirname, './src/styles'),
      '@errors': resolve(__dirname, './src/errors'),
      '@routes': resolve(__dirname, './src/routes'),
    },
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  preview: {
    port: 3001,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Split large vendor chunks for better caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react', 'react-hot-toast'],
        },
      },
    },
  },
})
