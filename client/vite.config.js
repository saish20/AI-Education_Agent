import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173,
    host: true,
  },
  preview: {
    port: process.env.PORT || 4173,
    host: true,
    allowedHosts: ['ai-education-agent-1.onrender.com'],
  }
})
