import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': {
        target: 'https://ecomexpress-dn3d.onrender.com',
        changeOrigin: true,
        secure: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/user/, '')
      },
      '/otp': {
        target: 'https://ecomexpress-dn3d.onrender.com',
        changeOrigin: true,
        secure: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/otp/, '')
      }
    }
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['ecomexpress-dn3d.onrender.com']
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://ecomexpress-dn3d.onrender.com')
  }
})
