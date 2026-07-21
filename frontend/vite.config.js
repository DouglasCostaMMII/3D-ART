import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/3D-ART/',
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true, cookieDomainRewrite: 'localhost' },
      '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
