import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  root: 'barbershop',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [react(), tailwindcss()],
})
