import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento root não foi encontrado no documento.');
}

createRoot(rootElement).render(<App />);

// Registro resiliente do Service Worker respeitando a base do Vite e do GitHub Pages
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const swPath = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}sw.js`;

    navigator.serviceWorker
      .register(swPath, { scope: baseUrl })
      .catch((error) => {
        console.warn('Registro do service worker ignorado ou bloqueado:', error);
      });
  });
}
