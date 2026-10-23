
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(
      '/Projeto-cabe-udos-/sw.js',
      { scope: '/Projeto-cabe-udos-/' }
    ).catch((error) => {
      console.error('Falha ao registrar o service worker:', error);
    });
  });
}
