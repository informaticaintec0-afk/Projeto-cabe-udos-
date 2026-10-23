/**
 * Modal de Fim de Jogo (GameOverModal)
 * Exibe resultado da partida, escudos oficiais dos clubes, placar final e estatísticas.
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
    <div className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Ícone de Resultado */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg bg-slate-800 border border-slate-700">
          {isP1Winner ? (
            <Trophy className="w-10 h-10 sm:w-11 sm:h-11 text-yellow-400" />
          ) : isDraw ? (
            <span className="text-3xl sm:text-4xl">🤝</span>
          ) : (
            <span className="text-3xl sm:text-4xl">⚽</span>
          )}
        </div>

        {/* Título de Vencedor */}
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase">
          {isP1Winner ? 'Vitória Espetacular!' : isDraw ? 'Empate Emocionante!' : 'Fim de Jogo!'}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5">
          {isP1Winner
            ? `Parabéns! ${p1Team.name} conquistou a vitória!`
            : isDraw
            ? 'Uma partida equilibrada até o último segundo!'
            : `${p2Team.name} levou a melhor desta vez!`}
        </p>

        {/* Placar Final com Escudos Oficiais */}
        <div className="flex items-center justify-center gap-6 my-5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center">
            <ClubCrest clubId={p1Team.id} size={44} className="mb-1 drop-shadow" />
            <span className="text-xs font-black text-slate-200 truncate max-w-[90px]">{p1Team.name}</span>
            <span className="text-3xl sm:text-4xl font-black font-display text-sky-400 tabular-nums">
              {stats.p1Goals}
            </span>
          </div>

          <span className="text-xl font-black text-slate-600">X</span>

          <div className="flex flex-col items-center">
            <ClubCrest clubId={p2Team.id} size={44} className="mb-1 drop-shadow" />
            <span className="text-xs font-black text-slate-200 truncate max-w-[90px]">{p2Team.name}</span>
            <span className="text-3xl sm:text-4xl font-black font-display text-rose-500 tabular-nums">
              {stats.p2Goals}
            </span>
          </div>
        </div>

        {/* Estatísticas da Partida */}
        <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/80 mb-5 space-y-2 text-xs">
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

        {/* Botões de Ação */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-95 transition-all touch-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Revanche</span>
          </button>

          <button
            type="button"
            onClick={onGoToMenu}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-all touch-btn"
          >
            <Home className="w-4 h-4" />
            <span>Clubes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
