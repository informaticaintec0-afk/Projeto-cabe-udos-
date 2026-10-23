/**
 * Tela de Escolha da Equipe Adversária — Futebol Retrô
 * 
 * Exibe o título "EQUIPE ADVERSÁRIA", mostra os clubes brasileiros existentes e
 * impede que o jogador escolha o mesmo clube.
 * Ao confirmar, inicia a partida real com o motor do jogo.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Zap,
  Play,
  Shield,
  Check
} from 'lucide-react';
import { TEAMS } from '../game/teams';
import { TeamPreset } from '../game/types';
import { ClubCrest } from '../game/crests';
import { sound } from '../game/audio';

interface OpponentSelectionScreenProps {
  myTeam: TeamPreset;
  initialOpponent: TeamPreset;
  onSelectOpponent: (opponent: TeamPreset) => void;
  onConfirmAndStartMatch: (myTeam: TeamPreset, opponent: TeamPreset) => void;
  onBack: () => void;
}

export const OpponentSelectionScreen: React.FC<OpponentSelectionScreenProps> = ({
  myTeam,
  initialOpponent,
  onSelectOpponent,
  onConfirmAndStartMatch,
  onBack,
}) => {
  // Lista de adversários disponíveis (exclui o time do jogador)
  const availableOpponents = useMemo(() => {
    return TEAMS.filter((t) => t.id !== myTeam.id);
  }, [myTeam.id]);

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const idx = availableOpponents.findIndex((t) => t.id === initialOpponent.id);
    return idx >= 0 ? idx : 0;
  });

  const currentOpponent = availableOpponents[currentIndex] || availableOpponents[0];

  const selectOpponentByIndex = useCallback(
    (idx: number) => {
      sound.playUiNavigate();
      setCurrentIndex(idx);
      onSelectOpponent(availableOpponents[idx]);
    },
    [availableOpponents, onSelectOpponent]
  );

  const handlePrev = useCallback(() => {
    const nextIdx = (currentIndex - 1 + availableOpponents.length) % availableOpponents.length;
    selectOpponentByIndex(nextIdx);
  }, [currentIndex, availableOpponents.length, selectOpponentByIndex]);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % availableOpponents.length;
    selectOpponentByIndex(nextIdx);
  }, [currentIndex, availableOpponents.length, selectOpponentByIndex]);

  const handleStart = useCallback(() => {
    sound.playUiConfirm();
    onConfirmAndStartMatch(myTeam, currentOpponent);
  }, [myTeam, currentOpponent, onConfirmAndStartMatch]);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleStart();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, handleStart, onBack]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-1.5 sm:p-3 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* Luz ambiente com a cor do adversário */}
      <div
        className="pointer-events-none absolute -top-24 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: currentOpponent.primaryColor }}
      />

      {/* CABEÇALHO */}
      <header className="relative z-10 shrink-0 flex items-center justify-between gap-1.5 border-b border-slate-800/80 pb-1.5">
        <button
          type="button"
          onClick={() => {
            sound.playUiNavigate();
            onBack();
          }}
          className="shrink-0 h-8 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[10px] sm:text-xs font-black tracking-wider text-slate-200 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer touch-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>MINHA EQUIPE</span>
        </button>

        <div className="text-right">
          <div className="text-[9px] font-black uppercase tracking-widest text-rose-400">
            PASSO 2 DE 2
          </div>
          <h1 className="text-base sm:text-lg font-black font-display text-white uppercase leading-none">
            EQUIPE ADVERSÁRIA
          </h1>
        </div>
      </header>

      {/* PAINEL SHOWDOWN VS: MINHA EQUIPE (P1) vs ADVERSÁRIO (IA) */}
      <section className="relative z-10 shrink-0 my-1">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 bg-gradient-to-b from-slate-900/95 to-slate-950/90 border-2 border-slate-700/80 rounded-2xl p-1.5 sm:p-2 shadow-xl">
          {/* Lado Esquerdo: Minha Equipe Confirmada */}
          <div className="flex-1 min-w-0 flex items-center gap-2 bg-sky-950/40 border border-sky-500/40 rounded-xl p-1.5 sm:p-2">
            <ClubCrest clubId={myTeam.id} size={36} className="shrink-0 drop-shadow" />
            <div className="min-w-0">
              <span className="text-[8px] font-black text-sky-400 uppercase flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> MINHA EQUIPE (P1)
              </span>
              <div className="text-xs sm:text-sm font-black text-white truncate leading-tight">
                {myTeam.name}
              </div>
              <div className="text-[8px] sm:text-[9px] text-amber-300 font-semibold truncate">
                ⚡ {myTeam.ability.name}
              </div>
            </div>
          </div>

          {/* Centro: VS */}
          <div className="shrink-0 flex flex-col items-center px-1">
            <span className="text-lg sm:text-2xl font-black font-display text-amber-400 leading-none">
              VS
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">1V1</span>
          </div>

          {/* Lado Direito: Navegador do Adversário */}
          <div className="flex-1 min-w-0 flex items-center gap-1 bg-rose-950/40 border border-rose-500/50 rounded-xl p-1 sm:p-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Adversário anterior"
              className="w-7 sm:w-8 h-10 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 flex items-center justify-center active:scale-90 shrink-0 touch-btn cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <ClubCrest clubId={currentOpponent.id} size={36} className="shrink-0 drop-shadow" />
              <div className="min-w-0">
                <span className="text-[8px] font-black text-rose-400 uppercase block leading-none">
                  ADVERSÁRIO (IA)
                </span>
                <div className="text-xs sm:text-sm font-black text-white truncate leading-tight mt-0.5">
                  {currentOpponent.name}
                </div>
                <div className="text-[8px] sm:text-[9px] text-amber-300 font-semibold truncate">
                  ⚡ {currentOpponent.ability.name}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Próximo adversário"
              className="w-7 sm:w-8 h-10 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 flex items-center justify-center active:scale-90 shrink-0 touch-btn cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* GRADE COM OS 20 CLUBES (TIME DO JOGADOR BLOQUEADO / DESABILITADO) */}
      <section className="relative z-10 flex-1 min-h-0 flex flex-col justify-center my-0.5 overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex-1 min-h-0 overflow-y-auto pr-0.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1 sm:gap-1.5">
            {TEAMS.map((team) => {
              const isMyTeam = team.id === myTeam.id;
              const isSelectedOpponent = team.id === currentOpponent.id;

              return (
                <button
                  key={team.id}
                  type="button"
                  disabled={isMyTeam}
                  onClick={() => {
                    const idx = availableOpponents.findIndex((t) => t.id === team.id);
                    if (idx >= 0) selectOpponentByIndex(idx);
                  }}
                  className={`relative min-w-0 rounded-xl p-1 sm:p-1.5 border flex items-center gap-1.5 text-left transition-all ${
                    isMyTeam
                      ? 'opacity-40 bg-slate-950/80 border-slate-800 cursor-not-allowed'
                      : isSelectedOpponent
                      ? 'bg-rose-950/90 border-rose-400 ring-2 ring-rose-400/50 shadow-lg scale-[1.02] cursor-pointer touch-btn'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-600 cursor-pointer touch-btn'
                  }`}
                >
                  {/* Badge no Canto */}
                  {isMyTeam && (
                    <div className="absolute top-1 right-1">
                      <span className="px-1 py-0.2 rounded text-[7px] font-black bg-sky-500 text-slate-950">
                        SEU CLUBE
                      </span>
                    </div>
                  )}
                  {isSelectedOpponent && (
                    <div className="absolute top-1 right-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black shadow-sm">
                        ✓
                      </span>
                    </div>
                  )}

                  <ClubCrest clubId={team.id} size={26} className="shrink-0 sm:w-7 sm:h-7" />

                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-[10px] sm:text-xs font-black leading-tight text-white truncate">
                      {team.name}
                    </div>
                    <div className="text-[8px] text-amber-300 font-semibold truncate flex items-center gap-0.5">
                      <Zap className="w-2 h-2 shrink-0 text-amber-400" />
                      <span className="truncate">{team.ability.name}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* RODAPÉ COM O BOTÃO INICIAR PARTIDA */}
      <footer className="relative z-10 shrink-0 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-1.5">
        <button
          type="button"
          onClick={() => {
            sound.playUiNavigate();
            onBack();
          }}
          className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] sm:text-xs font-black text-slate-200 uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer touch-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">VOLTAR PARA MINHA EQUIPE</span>
          <span className="sm:hidden">VOLTAR</span>
        </button>

        <button
          type="button"
          onClick={handleStart}
          className="flex-1 sm:flex-initial ml-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black font-display text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer touch-btn"
        >
          <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>INICIAR PARTIDA</span>
        </button>
      </footer>
    </div>
  );
};
