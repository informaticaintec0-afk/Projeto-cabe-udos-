/**
 * Menu Principal — FUTEBOL RETRÔ
 * 
 * Quatro botões grandes empilhados verticalmente:
 * 1. Partida Rápida
 * 2. Liga Nacional
 * 3. Copa Nacional
 * 4. Configurações
 */

import React from 'react';
import {
  Play,
  Trophy,
  ShieldAlert,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { TeamPreset } from '../game/types';
import { ClubCrest } from '../game/crests';
import { sound } from '../game/audio';

interface TitleScreenProps {
  onStartQuickMatch: () => void;
  onOpenNationalLeague: () => void;
  onOpenNationalCup: () => void;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  p1Team: TeamPreset;
  p2Team: TeamPreset;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartQuickMatch,
  onOpenNationalLeague,
  onOpenNationalCup,
  onOpenSettings,
  isMuted,
  onToggleMute,
  p1Team,
  p2Team,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* =========================================================================
          ILUMINAÇÃO E CENÁRIO DE ESTÁDIO
          ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-sky-400/20 via-emerald-500/15 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Linhas de campo de futebol estilizadas no fundo */}
        <div className="absolute -bottom-10 inset-x-0 h-40 bg-gradient-to-t from-emerald-950/40 to-transparent flex items-center justify-center opacity-30">
          <div className="w-56 h-56 rounded-full border-2 border-emerald-500/30" />
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/30" />
        </div>
      </div>

      {/* =========================================================================
          CABEÇALHO COMPACTO
          ========================================================================= */}
      <header className="relative z-10 shrink-0 flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 sm:pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-xl shadow-sm">
            <Smartphone className="w-3.5 h-3.5" />
            <span>FUTEBOL RETRÔ • ARCADE 2D</span>
          </div>

          <span className="hidden md:inline text-[10px] font-semibold text-slate-400">
            20 Clubes Brasileiros • Habilidades Especiais
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer touch-btn"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </header>

      {/* =========================================================================
          CENTRO: LOGOTIPO E OS 4 BOTÕES VERTICAIS GRANDES
          ========================================================================= */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center py-1 sm:py-2 text-center">
        {/* Título Principal */}
        <div className="flex flex-col items-center mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(250,204,21,0.4)]">⚽</span>
            <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.2 rounded-md">
              EDIÇÃO OFICIAL 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)]">
            FUTEBOL RETRÔ
          </h1>
        </div>

        {/* 4 BOTÕES GRANDES EMPILHADOS VERTICALMENTE */}
        <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-2 sm:gap-2.5">
          {/* BOTÃO 1: PARTIDA RÁPIDA */}
          <button
            type="button"
            onClick={() => {
              sound.playUiConfirm();
              onStartQuickMatch();
            }}
            className="group relative w-full h-12 sm:h-14 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 border border-emerald-400/60 text-slate-950 font-black font-display text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-between cursor-pointer touch-btn"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950/20 border border-slate-950/30 flex items-center justify-center text-slate-950 shrink-0">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 text-slate-950" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-black leading-none">Partida Rápida</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-900/80 tracking-normal mt-0.5">
                  1 vs 1 • Escolha seu país e times
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* BOTÃO 2: LIGA NACIONAL */}
          <button
            type="button"
            onClick={() => {
              sound.playUiNavigate();
              onOpenNationalLeague();
            }}
            className="group relative w-full h-12 sm:h-14 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 border border-yellow-200/60 text-slate-950 font-black font-display text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-between cursor-pointer touch-btn"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950/20 border border-slate-950/30 flex items-center justify-center text-slate-950 shrink-0">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-black leading-none">Liga Nacional</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-900/80 tracking-normal mt-0.5">
                  Campeonato Brasileiro de Pontos Corridos
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* BOTÃO 3: COPA NACIONAL */}
          <button
            type="button"
            onClick={() => {
              sound.playUiNavigate();
              onOpenNationalCup();
            }}
            className="group relative w-full h-12 sm:h-14 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 border border-sky-300/50 text-white font-black font-display text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-between cursor-pointer touch-btn"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-black leading-none">Copa Nacional</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-sky-100 tracking-normal mt-0.5">
                  Torneio Eliminatório com Gol de Ouro
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          {/* BOTÃO 4: CONFIGURAÇÕES */}
          <button
            type="button"
            onClick={() => {
              sound.playUiNavigate();
              onOpenSettings();
            }}
            className="group relative w-full h-12 sm:h-14 px-4 sm:px-5 rounded-2xl bg-slate-900/95 hover:bg-slate-850 border border-slate-700/80 text-slate-200 font-black font-display text-sm sm:text-base uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-between cursor-pointer touch-btn"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:rotate-45 transition-transform" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-black leading-none text-white">Configurações</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-normal mt-0.5">
                  Dificuldade da IA, Duração e Áudio
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Prévia dos clubes atuais */}
        <div className="mt-2 flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-full text-[9px] text-slate-300">
          <div className="flex items-center gap-1 font-bold">
            <ClubCrest clubId={p1Team.id} size={16} />
            <span className="text-sky-300">{p1Team.name}</span>
          </div>
          <span className="font-black text-amber-400">VS</span>
          <div className="flex items-center gap-1 font-bold">
            <span className="text-rose-300">{p2Team.name}</span>
            <ClubCrest clubId={p2Team.id} size={16} />
          </div>
        </div>
      </main>

      {/* =========================================================================
          RODAPÉ INFORMATIVO
          ========================================================================= */}
      <footer className="relative z-10 shrink-0 text-center text-[9px] sm:text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex items-center justify-between">
        <span>Futebol Retrô • 100% Offline para Android</span>
        <span className="hidden sm:inline text-slate-400">Toque na tela ou use as setas do teclado</span>
        <span className="text-emerald-400 font-bold">Arcade 2D</span>
      </footer>
    </div>
  );
};
