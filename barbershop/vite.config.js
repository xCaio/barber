import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: path.resolve(__dirname, 'barbershop', 'dist'),
    emptyOutDir: true
  },
  plugins: [react(), tailwindcss()]
});
