/**
 * Modal de Pausa (PauseModal)
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
    <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-xs w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center">
        <h3 className="text-2xl font-black font-display text-white uppercase tracking-tight mb-2">
          Jogo Pausado
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Descanse um instante antes de voltar à disputa!
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all touch-btn"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Continuar</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all touch-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Partida</span>
          </button>

          <button
            type="button"
            onClick={onGoToMenu}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all touch-btn"
          >
            <Home className="w-4 h-4" />
            <span>Sair para o Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
