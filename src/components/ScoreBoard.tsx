/**
 * Placar do Jogo (Top HUD)
 * Exibe os escudos oficiais e nomes dos dois clubes, cronômetro de 90s,
 * barra de super chute e controles rápidos de pausa e áudio.
 */

import React from 'react';
import { Volume2, VolumeX, Pause, Play, Zap } from 'lucide-react';
import { TeamPreset } from '../game/types';
import { ClubCrest } from '../game/crests';

interface ScoreBoardProps {
  p1Score: number;
  p2Score: number;
  timeLeft: number;
  p1Team: TeamPreset;
  p2Team: TeamPreset;
  superMeter: number;
  isPaused: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  p1Score,
  p2Score,
  timeLeft,
  p1Team,
  p2Team,
  superMeter,
  isPaused,
  isMuted,
  onTogglePause,
  onToggleMute,
}) => {
  // Formata o tempo restante (ex: 90 -> 01:30)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2 sm:p-3 select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Painel do Jogador 1 (Escudo + Nome + Barra de Super) */}
        <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-slate-700/80 shadow-lg">
          <ClubCrest clubId={p1Team.id} size={36} className="shrink-0 drop-shadow" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-slate-100 tracking-tight leading-tight truncate max-w-[110px] sm:max-w-[150px]">
                {p1Team.name}
              </span>
              <span className="text-[9px] font-bold text-sky-400 bg-sky-950/60 px-1 py-0.2 rounded border border-sky-800">
                {p1Team.ability.name}
              </span>
            </div>
            {/* Barra de Energia Super Chute */}
            <div className="w-20 sm:w-28 h-1.5 bg-slate-950 rounded-full overflow-hidden mt-1 border border-slate-700/80">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-500 transition-all duration-150"
                style={{ width: `${Math.min(100, superMeter)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Placar Central e Cronômetro da Partida */}
        <div className="flex flex-col items-center pointer-events-auto bg-slate-950/90 backdrop-blur-md px-4 py-1 sm:px-6 sm:py-1.5 rounded-2xl border-2 border-slate-700/80 shadow-2xl">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <span className="text-2xl sm:text-3xl font-black font-display text-sky-400 tabular-nums">
              {p1Score}
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-widest">
              X
            </span>
            <span className="text-2xl sm:text-3xl font-black font-display text-rose-500 tabular-nums">
              {p2Score}
            </span>
          </div>

          {/* Cronômetro */}
          <div className="flex items-center gap-1">
            <span
              className={`text-[11px] sm:text-xs font-black tabular-nums tracking-wider ${
                timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-slate-300'
              }`}
            >
              ⏱ {formattedTime}
            </span>
          </div>
        </div>

        {/* Painel do Jogador 2 (Adversário / IA) e Botões de Controle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-slate-700/80 shadow-lg text-right">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-rose-400 bg-rose-950/60 px-1 py-0.2 rounded border border-rose-800">
                  {p2Team.ability.name}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-100 tracking-tight leading-tight truncate max-w-[110px] sm:max-w-[150px]">
                  {p2Team.name}
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                ADVERSÁRIO IA
              </span>
            </div>
            <ClubCrest clubId={p2Team.id} size={36} className="shrink-0 drop-shadow" />
          </div>

          {/* Botão de Som */}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors active:scale-95 shadow-md touch-btn"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Botão de Pausa */}
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={isPaused ? 'Continuar jogo' : 'Pausar jogo'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors active:scale-95 shadow-md touch-btn"
          >
            {isPaused ? <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" /> : <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />}
          </button>
        </div>
      </div>
    </header>
  );
};
