import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
  const envDirectory = path.resolve(currentDirectory, '../..')
  const env = loadEnv(mode, envDirectory, '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${env.PORT || 3000}`,
          changeOrigin: true,
        },
      },
    },
  }
})
