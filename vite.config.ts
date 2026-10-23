
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

// Plugin para duplicar index.html como 404.html no GitHub Pages
function generate404Plugin(): Plugin {
  return {
    name: 'generate-404-html',
    apply: 'build',
    closeBundle() {
      const distIndex = path.resolve(import.meta.dirname, 'dist', 'index.html');
      const dist404 = path.resolve(import.meta.dirname, 'dist', '404.html');

      if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, dist404);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    // Caminho correto para publicação no GitHub Pages
    base: '/Projeto-cabe-udos-/',

    plugins: [
      react(),
      tailwindcss(),
      generate404Plugin(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },

    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
