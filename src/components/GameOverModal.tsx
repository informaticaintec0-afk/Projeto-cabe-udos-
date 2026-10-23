/**
 * Modal de Fim de Jogo (GameOverModal)
 * Otimizado para não cortar elementos em celulares Android em modo paisagem.
 */

import React from 'react';
import { RotateCcw, Home, Trophy } from 'lucide-react';
import { MatchStats, TeamPreset } from '../game/types';
import { ClubCrest } from '../game/crests';

interface GameOverModalProps {
  winner: 'p1' | 'p2' | 'draw';
  stats: MatchStats;
  p1Team: TeamPreset;
  p2Team: TeamPreset;
  onPlayAgain: () => void;
  onGoToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  stats,
  p1Team,
  p2Team,
  onPlayAgain,
  onGoToMenu,
}) => {
  const isP1Winner = winner === 'p1';
  const isDraw = winner === 'draw';

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto safe-area-container">
      <div className="max-w-md w-full max-h-[94dvh] bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-3 sm:p-5 shadow-2xl text-center flex flex-col justify-between my-auto animate-in fade-in zoom-in-95 duration-200">
        <div>
          {/* Título de Vencedor */}
          <div className="flex items-center justify-center gap-2 mb-1">
            {isP1Winner ? (
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            ) : isDraw ? (
              <span className="text-xl sm:text-2xl">🤝</span>
            ) : (
              <span className="text-xl sm:text-2xl">⚽</span>
            )}
            <h2 className="text-lg sm:text-2xl font-black font-display text-white tracking-tight uppercase leading-none">
              {isP1Winner ? 'Vitória Espetacular!' : isDraw ? 'Empate Emocionante!' : 'Fim de Jogo!'}
            </h2>
          </div>

          <p className="text-[10px] sm:text-xs font-semibold text-slate-400">
            {isP1Winner
              ? `Parabéns! ${p1Team.name} conquistou a vitória!`
              : isDraw
              ? 'Uma partida equilibrada até o último segundo!'
              : `${p2Team.name} levou a melhor desta vez!`}
          </p>

          {/* Placar Final com Escudos Oficiais */}
          <div className="flex items-center justify-center gap-4 my-2 sm:my-3 bg-slate-950/70 p-2 sm:p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-col items-center">
              <ClubCrest clubId={p1Team.id} size={36} className="mb-0.5 drop-shadow" />
              <span className="text-[10px] sm:text-xs font-black text-slate-200 truncate max-w-[90px]">{p1Team.name}</span>
              <span className="text-2xl sm:text-3xl font-black font-display text-sky-400 tabular-nums">
                {stats.p1Goals}
              </span>
            </div>

            <span className="text-lg font-black text-slate-600">X</span>

            <div className="flex flex-col items-center">
              <ClubCrest clubId={p2Team.id} size={36} className="mb-0.5 drop-shadow" />
              <span className="text-[10px] sm:text-xs font-black text-slate-200 truncate max-w-[90px]">{p2Team.name}</span>
              <span className="text-2xl sm:text-3xl font-black font-display text-rose-500 tabular-nums">
                {stats.p2Goals}
              </span>
            </div>
          </div>

          {/* Estatísticas da Partida */}
          <div className="bg-slate-950/40 rounded-xl p-2 sm:p-2.5 border border-slate-800/80 mb-2 sm:mb-3 space-y-1 text-[11px] sm:text-xs">
            <div className="flex justify-between items-center text-slate-400 font-semibold">
              <span className="text-sky-400 tabular-nums font-bold">{stats.p1Shots}</span>
              <span>Finalizações / Chutes</span>
              <span className="text-rose-400 tabular-nums font-bold">{stats.p2Shots}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400 font-semibold">
              <span className="text-sky-400 tabular-nums font-bold">{stats.p1Headers}</span>
              <span>Cabeceios</span>
              <span className="text-rose-400 tabular-nums font-bold">{stats.p2Headers}</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 active:scale-95 transition-all touch-btn cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Revanche</span>
          </button>

          <button
            type="button"
            onClick={onGoToMenu}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-btn cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Clubes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
