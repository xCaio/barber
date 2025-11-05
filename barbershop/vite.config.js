import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'barbershop',     // indica que o código-fonte principal está dentro da pasta barbershop
  base: '/',              // se vai servir na raiz do domínio
  build: {
    outDir: '../dist',    // gera o build na pasta dist da raiz do repositório
    emptyOutDir: true
  },
  plugins: [react(), tailwindcss()]
});
