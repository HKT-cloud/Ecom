import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/user/, '')
      }
    }
  },
  preview: {
    host: true,
    port: process.env.PORT || 4173,
    allowedHosts: ['ecomexpress-0dc3.onrender.com']
  }
})
