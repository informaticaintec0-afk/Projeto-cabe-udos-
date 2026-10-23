/**
 * Aviso de Orientação para Celular (Landscape / Horizontal)
 * Detecta se a tela está em modo retrato em dispositivos móveis e sugere gentilmente girar para horizontal.
 */

import React, { useState, useEffect } from 'react';
import { RotateCw, X } from 'lucide-react';

export const OrientationNotice: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Se a altura for maior que a largura e estiver em tela compacta (mobile)
      if (typeof window !== 'undefined') {
        const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 800;
        setIsPortrait(portrait);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  return (
    <aside aria-label="Aviso de orientação do celular" className="fixed top-[max(env(safe-area-inset-top,0px),8px)] left-2 right-2 z-50 bg-amber-500/95 text-slate-950 font-bold px-3 py-2 rounded-2xl shadow-xl flex items-center justify-between text-xs sm:text-sm border border-amber-300 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-2">
        <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
        <span>Gire o celular para a horizontal (modo paisagem) para melhor jogabilidade!</span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1 rounded-full hover:bg-black/10 active:scale-90"
        aria-label="Fechar aviso"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
