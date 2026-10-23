/**
 * Banners de Animação durante a partida:
 * Contagem regressiva (3, 2, 1, JÁ!) e Celebração de Gol em tela cheia.
 */

import React from 'react';

interface MatchBannersProps {
  countdownVal: number;
  isGoalCelebration: boolean;
  goalText: string;
}

export const MatchBanners: React.FC<MatchBannersProps> = ({
  countdownVal,
  isGoalCelebration,
  goalText,
}) => {
  // 1. Contagem Regressiva para início de partida ou reinício após gol
  if (countdownVal > 0) {
    const ceil = Math.ceil(countdownVal);
    const text = ceil > 0 ? String(ceil) : 'JÁ!';

    return (
      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center select-none">
        <div className="flex flex-col items-center animate-in zoom-in-75 duration-200">
          <span className="text-8xl sm:text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
            {text}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-white uppercase tracking-widest bg-slate-900/80 px-4 py-1 rounded-full border border-slate-700/80 mt-2 shadow-lg">
            Prepare-se!
          </span>
        </div>
      </div>
    );
  }

  // 2. Banner de Celebração de Gol
  if (isGoalCelebration) {
    return (
      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center select-none">
        <div className="flex flex-col items-center bg-slate-950/85 backdrop-blur-md px-8 py-5 sm:px-12 sm:py-7 rounded-3xl border-4 border-amber-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] animate-in zoom-in-50 duration-300">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-6xl animate-bounce">⚽</span>
            <span className="text-5xl sm:text-7xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-emerald-400 tracking-wider">
              GOOOOL!
            </span>
            <span className="text-4xl sm:text-6xl animate-bounce">⚽</span>
          </div>
          <span className="text-base sm:text-xl font-black text-white uppercase tracking-widest mt-2">
            {goalText}
          </span>
        </div>
      </div>
    );
  }

  return null;
};
