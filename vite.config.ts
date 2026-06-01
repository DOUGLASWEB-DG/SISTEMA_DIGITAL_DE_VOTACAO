import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { 
      '@': path.resolve(__dirname, './src') 
    }
  },
  server: {
    port: 5200,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:3333',
      '/uploads': 'http://localhost:3333'
    }
  }
})
