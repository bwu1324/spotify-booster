import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/callback': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/mashupapi': 'http://localhost:8080',
    },
  }
})
