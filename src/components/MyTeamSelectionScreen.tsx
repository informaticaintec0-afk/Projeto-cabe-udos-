/**
 * Tela de Escolha da Minha Equipe — Futebol Retrô
 * 
 * Exibe todos os 20 clubes brasileiros existentes no projeto com seus escudos e nomes reais.
 * Permite selecionar somente uma equipe, destaca a seleção e apresenta o botão "Continuar".
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Check
} from 'lucide-react';
import { TEAMS } from '../game/teams';
import { TeamPreset } from '../game/types';
import { ClubCrest } from '../game/crests';
import { sound } from '../game/audio';

interface MyTeamSelectionScreenProps {
  selectedTeam: TeamPreset;
  onSelectTeam: (team: TeamPreset) => void;
  onContinue: (team: TeamPreset) => void;
  onBack: () => void;
}

export const MyTeamSelectionScreen: React.FC<MyTeamSelectionScreenProps> = ({
  selectedTeam,
  onSelectTeam,
  onContinue,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const idx = TEAMS.findIndex((t) => t.id === selectedTeam.id);
    return idx >= 0 ? idx : 0;
  });

  const currentTeam = TEAMS[currentIndex] || TEAMS[0];

  // Sincroniza time selecionado para o componente pai
  const selectClubByIndex = useCallback(
    (idx: number) => {
      sound.playUiNavigate();
      setCurrentIndex(idx);
      onSelectTeam(TEAMS[idx]);
    },
    [onSelectTeam]
  );

  const handlePrev = useCallback(() => {
    const nextIdx = (currentIndex - 1 + TEAMS.length) % TEAMS.length;
    selectClubByIndex(nextIdx);
  }, [currentIndex, selectClubByIndex]);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % TEAMS.length;
    selectClubByIndex(nextIdx);
  }, [currentIndex, selectClubByIndex]);

  // Teclado (Setas ◄ e ►, Enter para continuar, Esc para voltar)
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
        sound.playUiConfirm();
        onContinue(currentTeam);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onContinue, currentTeam, onBack]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-1.5 sm:p-3 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* Luz ambiente com a cor do time */}
      <div
        className="pointer-events-none absolute -top-24 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: currentTeam.primaryColor }}
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
          <span>VOLTAR</span>
        </button>

        <div className="text-right">
          <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
            PASSO 1 DE 2
          </div>
          <h1 className="text-base sm:text-lg font-black font-display text-white uppercase leading-none">
            MINHA EQUIPE
          </h1>
        </div>
      </header>

      {/* PAINEL DE DESTAQUE SUPERIOR COM SETAS ◄ E ► */}
      <section className="relative z-10 shrink-0 my-1">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 bg-gradient-to-b from-slate-900/95 to-slate-950/90 border-2 border-slate-700/80 rounded-2xl p-1.5 sm:p-2.5 shadow-xl">
          {/* Seta Anterior */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Time anterior"
            className="w-10 sm:w-14 h-12 sm:h-14 rounded-xl bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400 text-amber-400 flex items-center justify-center active:scale-90 transition-transform cursor-pointer touch-btn shrink-0"
          >
            <ChevronLeft className="w-6 sm:w-8 h-6 sm:h-8" />
          </button>

          {/* Destaque Central */}
          <div className="flex-1 min-w-0 flex items-center justify-center gap-2 sm:gap-4 px-1">
            <div
              className="p-1 sm:p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 shadow-lg"
              style={{ boxShadow: `0 0 20px ${currentTeam.primaryColor}33` }}
            >
              <ClubCrest clubId={currentTeam.id} size={44} className="drop-shadow-md sm:w-12 sm:h-12" />
            </div>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black tracking-wider uppercase text-sky-400 bg-sky-950/70 border border-sky-800/70 px-1.5 py-0.2 rounded">
                  EQUIPE SELECIONADA
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 tabular-nums">
                  {currentIndex + 1} / {TEAMS.length}
                </span>
              </div>

              <h2 className="text-base sm:text-xl font-black font-display text-white uppercase leading-tight truncate">
                {currentTeam.name}
              </h2>

              <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold truncate">
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{currentTeam.ability.name}</span>
                <span className="text-slate-400 font-normal hidden sm:inline">— {currentTeam.ability.shortDesc}</span>
              </div>
            </div>
          </div>

          {/* Seta Próximo */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Próximo time"
            className="w-10 sm:w-14 h-12 sm:h-14 rounded-xl bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400 text-amber-400 flex items-center justify-center active:scale-90 transition-transform cursor-pointer touch-btn shrink-0"
          >
            <ChevronRight className="w-6 sm:w-8 h-6 sm:h-8" />
          </button>
        </div>
      </section>

      {/* GRADE COM OS 20 CLUBES BRASILEIROS EXISTENTES */}
      <section className="relative z-10 flex-1 min-h-0 flex flex-col justify-center my-0.5 overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex-1 min-h-0 overflow-y-auto pr-0.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1 sm:gap-1.5">
            {TEAMS.map((team, idx) => {
              const isSelected = team.id === currentTeam.id;

              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => selectClubByIndex(idx)}
                  className={`relative min-w-0 rounded-xl p-1 sm:p-1.5 border flex items-center gap-1.5 text-left transition-all cursor-pointer touch-btn ${
                    isSelected
                      ? 'bg-sky-950/90 border-sky-400 ring-2 ring-sky-400/50 shadow-lg scale-[1.02]'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-600'
                  }`}
                >
                  {/* Badge de Selecionado */}
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center text-[8px] font-black shadow-sm">
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

      {/* RODAPÉ COM O BOTÃO CONTINUAR */}
      <footer className="relative z-10 shrink-0 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-1.5">
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="font-bold text-amber-400">Dica:</span>
          <span>Toque no clube desejado e depois em Continuar</span>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playUiConfirm();
            onContinue(currentTeam);
          }}
          className="w-full sm:w-auto ml-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black font-display text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer touch-btn"
        >
          <span>CONTINUAR</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </footer>
    </div>
  );
};
