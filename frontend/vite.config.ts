import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// http://localhost:5173 -> http://localhost:8080/api
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
