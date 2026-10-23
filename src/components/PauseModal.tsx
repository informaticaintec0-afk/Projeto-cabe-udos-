/**
 * Modal de Pausa (PauseModal)
 * Otimizado para não cortar elementos em celulares Android no modo paisagem.
 */

import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onGoToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onGoToMenu,
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto safe-area-container">
      <div className="max-w-xs w-full max-h-[92dvh] bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl text-center flex flex-col justify-between my-auto">
        <div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white uppercase tracking-tight mb-1">
            Jogo Pausado
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mb-3 sm:mb-4">
            Descanse um instante antes de voltar à disputa!
          </p>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all touch-btn"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Continuar</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all touch-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Partida</span>
          </button>

          <button
            type="button"
            onClick={onGoToMenu}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all touch-btn"
          >
            <Home className="w-4 h-4" />
            <span>Sair para o Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
