/**
 * Menu Principal Profissional — FUTEBOL RETRÔ
 * 
 * Tela inicial inspirada nos clássicos menus de futebol arcade (International Superstar Soccer, PES).
 * Apresenta o título "FUTEBOL RETRÔ" com acabamento dourado e esmeralda, atmosfera de estádio com refletores,
 * e a opção de destaque "🏆 LIGA DO BRASIL" para iniciar a seleção de equipes.
 */

import React, { useState } from 'react';
import {
  Trophy,
  Play,
  Volume2,
  VolumeX,
  BookOpen,
  Users,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { TEAMS } from '../game/teams';
import { TeamPreset, AIDifficulty } from '../game/types';
import { ClubCrest } from '../game/crests';
import { sound } from '../game/audio';

interface TitleScreenProps {
  p1Team: TeamPreset;
  p2Team: TeamPreset;
  onOpenClubSelection: () => void;
  onStartDirectGame: (
    p1Team: TeamPreset,
    p2Team: TeamPreset,
    difficulty: AIDifficulty,
    duration: number
  ) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  p1Team,
  p2Team,
  onOpenClubSelection,
  onStartDirectGame,
  isMuted,
  onToggleMute,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Manipulador do botão principal "🏆 LIGA DO BRASIL"
  const handleStartLeague = () => {
    sound.playUiConfirm();
    onOpenClubSelection();
  };

  // Partida rápida direta com os times atualmente selecionados
  const handleQuickMatch = () => {
    sound.playUiConfirm();
    onStartDirectGame(p1Team, p2Team, 'medio', 90);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* =========================================================================
          ILUMINAÇÃO E CENÁRIO DE ESTÁDIO
          Refletores esportivos, gramado verde ao fundo e reflexos dourados
          ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Refletores de topo (luzes de estádio) */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-sky-400/20 via-emerald-500/15 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Linhas de campo sutis no fundo inferior */}
        <div className="absolute -bottom-10 inset-x-0 h-40 bg-gradient-to-t from-emerald-950/40 to-transparent flex items-center justify-center opacity-40">
          <div className="w-48 h-48 rounded-full border-2 border-emerald-500/30" />
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/30" />
        </div>
      </div>

      {/* =========================================================================
          CABEÇALHO SUPERIOR COMPACTO
          Selo oficial, status e botão de áudio
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

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              sound.playUiNavigate();
              setShowHowToPlay(!showHowToPlay);
            }}
            className="h-8 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[10px] sm:text-xs font-black text-slate-200 flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer touch-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">REGRAS & HABILIDADES</span>
            <span className="sm:hidden">REGRAS</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer touch-btn"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          CENTRO: LOGO PRINCIPAL E BOTÃO DE DESTAQUE "🏆 LIGA DO BRASIL"
          ========================================================================= */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center py-2 sm:py-3 text-center">
        {/* Bola e Título Principal Esportivo */}
        <div className="flex flex-col items-center mb-2 sm:mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl sm:text-3xl drop-shadow-[0_4px_10px_rgba(250,204,21,0.4)]">
              ⚽
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md">
              CAMPEONATO NACIONAL
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)]">
            FUTEBOL RETRÔ
          </h1>

          <p className="text-[10px] sm:text-xs md:text-sm font-extrabold text-slate-300 tracking-wider uppercase mt-1">
            Arcade Clássico • 8 Clubes Oficiais • Partidas 1v1
          </p>
        </div>

        {/* Menu de Opções com Destaque para "LIGA DO BRASIL" */}
        <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-2 sm:gap-2.5">
          {/* BOTÃO PRINCIPAL EM DESTAQUE: 🏆 LIGA DO BRASIL */}
          <button
            type="button"
            onClick={handleStartLeague}
            className="group relative w-full h-14 sm:h-16 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 border-2 border-yellow-200 text-slate-950 font-black font-display text-base sm:text-xl tracking-wide uppercase shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 active:scale-95 transition-all flex items-center justify-between cursor-pointer touch-btn overflow-hidden"
          >
            {/* Brilho animado de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950/15 border border-slate-950/20 flex items-center justify-center text-xl sm:text-2xl shadow-inner">
                🏆
              </div>
              <div className="text-left">
                <div className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-slate-900/80 leading-none">
                  MODO PRINCIPAL
                </div>
                <div className="text-base sm:text-lg md:text-xl font-black text-slate-950 leading-tight">
                  LIGA DO BRASIL
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center text-xs font-black group-hover:scale-110 transition-transform">
              ➔
            </div>
          </button>

          {/* AÇÕES SECUNDÁRIAS */}
          <div className="grid grid-cols-2 gap-2">
            {/* Botão Partida Rápida */}
            <button
              type="button"
              onClick={handleQuickMatch}
              className="h-10 sm:h-11 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-black uppercase text-slate-200 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer touch-btn"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>PARTIDA RÁPIDA</span>
            </button>

            {/* Botão Seleção de Clubes */}
            <button
              type="button"
              onClick={handleStartLeague}
              className="h-10 sm:h-11 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-black uppercase text-slate-200 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer touch-btn"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>VER CLUBES</span>
            </button>
          </div>
        </div>

        {/* Faixa com prévia dos dois clubes atuais em confronto */}
        <div className="mt-2.5 sm:mt-3 flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-full text-[10px] text-slate-300">
          <div className="flex items-center gap-1.5 font-bold">
            <ClubCrest clubId={p1Team.id} size={18} />
            <span className="text-sky-300">{p1Team.name}</span>
          </div>
          <span className="font-black text-amber-400">VS</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-rose-300">{p2Team.name}</span>
            <ClubCrest clubId={p2Team.id} size={18} />
          </div>
        </div>
      </main>

      {/* =========================================================================
          RODAPÉ INFORMATIVO
          ========================================================================= */}
      <footer className="relative z-10 shrink-0 text-center text-[9px] sm:text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex items-center justify-between">
        <span>Futebol Retrô • Pronto para Celulares Android</span>
        <span className="hidden sm:inline text-slate-400">Use toques na tela ou setas do teclado</span>
        <span className="text-emerald-400 font-bold">Versão Oficial 2.0</span>
      </footer>

      {/* =========================================================================
          MODAL DE REGRAS E HABILIDADES
          ========================================================================= */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
          <div className="max-w-lg w-full max-h-[92dvh] bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between my-auto">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>⚽</span> Habilidades dos Clubes
              </h3>
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300 max-h-[55dvh] overflow-y-auto pr-1">
              <div className="bg-sky-950/60 p-2.5 rounded-xl border border-sky-700/60">
                <span className="font-extrabold text-sky-300 text-xs block mb-0.5">
                  🎯 Chute Carregado com Mira
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Segure o botão <strong>⚽ CHUTE</strong> para calibrar a força e o arco da finalização. Solte para chutar!
                </p>
              </div>

              <div className="bg-amber-950/60 p-2.5 rounded-xl border border-amber-700/60">
                <span className="font-extrabold text-amber-300 text-xs block mb-0.5">
                  🔥 Super Chute Flamejante
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Quando a barra de energia no topo atingir 100%, aperte o botão <strong>SUPER</strong> para disparar o chute especial devastador.
                </p>
              </div>

              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider pt-1">
                Clubes & Habilidades Especiais
              </div>

              {TEAMS.map((t) => (
                <div key={t.id} className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <ClubCrest clubId={t.id} size={28} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs truncate">{t.name}</span>
                      <span className="text-[9px] font-black text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
                        {t.ability.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{t.ability.effectDesc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              className="mt-3 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase"
            >
              FECHAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
