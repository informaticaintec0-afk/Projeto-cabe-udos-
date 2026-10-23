/**
 * Futebol Retrô — Menu de Seleção de Clubes
 * 
 * Estrutura em Duas Etapas com layout 100% responsivo para celulares Android e desktop:
 * - ETAPA 1: "MINHA EQUIPE" — Navegação por setas grandes + Exibição dos 8 cards em 4 colunas x 2 linhas.
 * - ETAPA 2: "MEU ADVERSÁRIO" — Showdown VS com minha equipe à esquerda, adversário com setas à direita,
 *             e grade 4x2 com time do jogador bloqueado para evitar repetição.
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  Zap,
  Shield,
  RotateCcw,
  Check
} from 'lucide-react';
import { TEAMS } from '../game/teams';
import { TeamPreset, AIDifficulty } from '../game/types';
import { ClubCrest } from '../game/crests';
import { sound } from '../game/audio';

interface ClubSelectionScreenProps {
  initialP1Team: TeamPreset;
  initialP2Team: TeamPreset;
  initialDifficulty: AIDifficulty;
  initialDuration: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onConfirmPlay: (
    p1Team: TeamPreset,
    p2Team: TeamPreset,
    difficulty: AIDifficulty,
    duration: number
  ) => void;
}

export const ClubSelectionScreen: React.FC<ClubSelectionScreenProps> = ({
  initialP1Team,
  initialP2Team,
  initialDifficulty,
  initialDuration,
  isMuted,
  onToggleMute,
  onBack,
  onConfirmPlay,
}) => {
  // Estado das etapas: 'p1' = MINHA EQUIPE, 'p2' = MEU ADVERSÁRIO
  const [step, setStep] = useState<'p1' | 'p2'>('p1');

  // Os 8 clubes clássicos oficiais para exibição na grade 4x2
  const classicEight = useMemo(() => TEAMS.slice(0, 8), []);

  // Índice da equipe do jogador (P1)
  const [p1Index, setP1Index] = useState<number>(() => {
    const idx = TEAMS.findIndex((t) => t.id === initialP1Team.id);
    return idx >= 0 ? idx : 0;
  });

  const p1Team = TEAMS[p1Index] || TEAMS[0];

  // Lista de adversários disponíveis (exclui estritamente a equipe do jogador)
  const availableOpponents = useMemo(() => {
    return TEAMS.filter((t) => t.id !== p1Team.id);
  }, [p1Team.id]);

  // Índice do adversário (P2)
  const [p2Index, setP2Index] = useState<number>(() => {
    const filtered = TEAMS.filter((t) => t.id !== initialP1Team.id);
    const idx = filtered.findIndex((t) => t.id === initialP2Team.id);
    return idx >= 0 ? idx : 0;
  });

  // Ajusta índice do adversário se a lista filtrada alterar
  useEffect(() => {
    if (p2Index >= availableOpponents.length) {
      setP2Index(0);
    }
  }, [availableOpponents.length, p2Index]);

  const p2Team = availableOpponents[p2Index] || availableOpponents[0];

  // Configurações da partida
  const [difficulty, setDifficulty] = useState<AIDifficulty>(initialDifficulty);
  const [duration, setDuration] = useState<number>(initialDuration);

  // Navegação P1 (Minha Equipe)
  const handlePrevP1 = useCallback(() => {
    sound.playUiNavigate();
    setP1Index((prev) => (prev - 1 + TEAMS.length) % TEAMS.length);
  }, []);

  const handleNextP1 = useCallback(() => {
    sound.playUiNavigate();
    setP1Index((prev) => (prev + 1) % TEAMS.length);
  }, []);

  // Navegação P2 (Meu Adversário)
  const handlePrevP2 = useCallback(() => {
    sound.playUiNavigate();
    setP2Index((prev) => (prev - 1 + availableOpponents.length) % availableOpponents.length);
  }, [availableOpponents.length]);

  const handleNextP2 = useCallback(() => {
    sound.playUiNavigate();
    setP2Index((prev) => (prev + 1) % availableOpponents.length);
  }, [availableOpponents.length]);

  // Selecionar clube ao tocar diretamente no card
  const handleCardClick = useCallback((team: TeamPreset) => {
    sound.playUiNavigate();
    if (step === 'p1') {
      const idx = TEAMS.findIndex((t) => t.id === team.id);
      if (idx >= 0) setP1Index(idx);
    } else {
      // No passo 2, não permite clicar no próprio time
      if (team.id === p1Team.id) return;
      const oppIdx = availableOpponents.findIndex((t) => t.id === team.id);
      if (oppIdx >= 0) setP2Index(oppIdx);
    }
  }, [step, p1Team.id, availableOpponents]);

  // Avançar para Etapa 2
  const handleConfirmP1 = useCallback(() => {
    sound.playUiConfirm();
    setStep('p2');
  }, []);

  // Retornar para Etapa 1
  const handleBackToP1 = useCallback(() => {
    sound.playUiNavigate();
    setStep('p1');
  }, []);

  // Iniciar partida com P1 e P2 confirmados
  const handleStartMatch = useCallback(() => {
    sound.playUiConfirm();
    onConfirmPlay(p1Team, p2Team, difficulty, duration);
  }, [onConfirmPlay, p1Team, p2Team, difficulty, duration]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (step === 'p1') handlePrevP1();
        else handlePrevP2();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (step === 'p1') handleNextP1();
        else handleNextP2();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (step === 'p1') handleConfirmP1();
        else handleStartMatch();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        if (step === 'p2') {
          e.preventDefault();
          handleBackToP1();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handlePrevP1, handleNextP1, handlePrevP2, handleNextP2, handleConfirmP1, handleStartMatch, handleBackToP1]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-1.5 sm:p-3 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* Luzes de estádio sutis no fundo */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: step === 'p1' ? p1Team.primaryColor : p2Team.primaryColor }}
      />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 bg-emerald-600" />

      {/* =========================================================================
          1. CABEÇALHO COMPACTO
          ========================================================================= */}
      <header className="relative z-10 shrink-0 flex items-center justify-between gap-1.5 border-b border-slate-800/80 pb-1.5">
        {/* Botão Voltar */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={step === 'p1' ? onBack : handleBackToP1}
            className="shrink-0 h-8 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[10px] sm:text-xs font-black tracking-wider text-slate-200 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer touch-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{step === 'p1' ? 'MENU PRINCIPAL' : 'MINHA EQUIPE'}</span>
            <span className="sm:hidden">VOLTAR</span>
          </button>

          {/* Título da Etapa */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/70 px-1.5 py-0.2 rounded-md">
                ETAPA {step === 'p1' ? '1' : '2'} DE 2
              </span>
              <span className="text-[10px] font-bold text-slate-400 hidden md:inline">
                {step === 'p1' ? 'Escolha sua equipe' : 'Escolha o adversário'}
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-black font-display tracking-tight text-white uppercase leading-none mt-0.5">
              {step === 'p1' ? 'MINHA EQUIPE' : 'MEU ADVERSÁRIO'}
            </h1>
          </div>
        </div>

        {/* Dificuldade, Duração e Áudio */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
            {(['facil', 'medio', 'dificil'] as AIDifficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  sound.playUiNavigate();
                  setDifficulty(d);
                }}
                className={`px-1.5 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase transition-all ${
                  difficulty === d
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d === 'facil' ? 'FÁCIL' : d === 'medio' ? 'MÉDIO' : 'DIFÍCIL'}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
            {[60, 90, 120].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  sound.playUiNavigate();
                  setDuration(t);
                }}
                className={`px-1.5 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black transition-all ${
                  duration === t
                    ? 'bg-emerald-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            className="w-8 h-8 shrink-0 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer touch-btn"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. PAINEL DE DESTAQUE SUPERIOR (COM SETAS ◄ E ►)
          ========================================================================= */}
      <section className="relative z-10 shrink-0 my-1">
        {step === 'p1' ? (
          /* PAINEL ETAPA 1: MINHA EQUIPE SELECIONADA COM SETAS GRANDES */
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 bg-gradient-to-b from-slate-900/95 to-slate-950/90 border-2 border-slate-700/80 rounded-2xl p-1.5 sm:p-2.5 shadow-xl">
            {/* Seta Esquerda */}
            <button
              type="button"
              onClick={handlePrevP1}
              aria-label="Time anterior"
              className="w-10 sm:w-14 h-14 sm:h-16 rounded-xl bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400 text-amber-400 flex items-center justify-center active:scale-90 transition-transform cursor-pointer touch-btn shrink-0"
            >
              <ChevronLeft className="w-7 sm:w-9 h-7 sm:h-9" />
            </button>

            {/* Detalhes do Clube Escolhido */}
            <div className="flex-1 min-w-0 flex items-center justify-center gap-2 sm:gap-4 px-1">
              <div
                className="p-1 sm:p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 shadow-lg"
                style={{ boxShadow: `0 0 20px ${p1Team.primaryColor}33` }}
              >
                <ClubCrest clubId={p1Team.id} size={46} className="drop-shadow-md sm:w-14 sm:h-14" />
              </div>

              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black tracking-wider uppercase text-sky-400 bg-sky-950/70 border border-sky-800/70 px-1.5 py-0.2 rounded">
                    SUA ESCOLHA (P1)
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 tabular-nums">
                    {p1Index + 1}/{TEAMS.length}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-black font-display text-white uppercase leading-tight truncate">
                  {p1Team.name}
                </h2>
                <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold truncate">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{p1Team.ability.name}</span>
                  <span className="text-slate-400 font-normal hidden sm:inline">— {p1Team.ability.shortDesc}</span>
                </div>
              </div>
            </div>

            {/* Seta Direita */}
            <button
              type="button"
              onClick={handleNextP1}
              aria-label="Próximo time"
              className="w-10 sm:w-14 h-14 sm:h-16 rounded-xl bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400 text-amber-400 flex items-center justify-center active:scale-90 transition-transform cursor-pointer touch-btn shrink-0"
            >
              <ChevronRight className="w-7 sm:w-9 h-7 sm:h-9" />
            </button>
          </div>
        ) : (
          /* PAINEL ETAPA 2: SHOWDOWN VS COM MEU ADVERSÁRIO NAVEGÁVEL */
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 bg-gradient-to-b from-slate-900/95 to-slate-950/90 border-2 border-slate-700/80 rounded-2xl p-1.5 sm:p-2 shadow-xl">
            {/* Lado Esquerdo: Minha Equipe Confirmada */}
            <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2.5 bg-sky-950/40 border border-sky-500/40 rounded-xl p-1.5">
              <ClubCrest clubId={p1Team.id} size={36} className="shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black text-sky-400 uppercase">VOCÊ (P1)</span>
                  <button
                    type="button"
                    onClick={handleBackToP1}
                    className="text-[8px] text-sky-300 underline font-bold"
                  >
                    Alterar
                  </button>
                </div>
                <div className="text-xs sm:text-sm font-black text-white truncate">{p1Team.name}</div>
                <div className="text-[8px] text-amber-300 font-bold truncate">⚡ {p1Team.ability.name}</div>
              </div>
            </div>

            {/* Centro: VS */}
            <div className="shrink-0 flex flex-col items-center px-1">
              <span className="text-lg sm:text-2xl font-black font-display text-amber-400 leading-none">VS</span>
              <span className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase">{duration}s</span>
            </div>

            {/* Lado Direito: Adversário Navegável com Setas */}
            <div className="flex-1 min-w-0 flex items-center gap-1 bg-rose-950/40 border border-rose-500/50 rounded-xl p-1">
              <button
                type="button"
                onClick={handlePrevP2}
                aria-label="Adversário anterior"
                className="w-7 sm:w-8 h-10 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 flex items-center justify-center active:scale-90 shrink-0 touch-btn"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 min-w-0 flex items-center gap-1.5">
                <ClubCrest clubId={p2Team.id} size={36} className="shrink-0" />
                <div className="min-w-0">
                  <span className="text-[8px] font-black text-rose-400 uppercase block">IA ADVERSÁRIO</span>
                  <div className="text-xs sm:text-sm font-black text-white truncate">{p2Team.name}</div>
                  <div className="text-[8px] text-amber-300 font-bold truncate">⚡ {p2Team.ability.name}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextP2}
                aria-label="Próximo adversário"
                className="w-7 sm:w-8 h-10 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 flex items-center justify-center active:scale-90 shrink-0 touch-btn"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          3. GRADE DOS 8 CLUBES OFICIAIS (4 COLUNAS POR 2 LINHAS)
          Totalmente visíveis sem corte em landscape mobile e desktop
          ========================================================================= */}
      <section className="relative z-10 flex-1 min-h-0 flex flex-col justify-center my-0.5">
        <div className="max-w-4xl w-full mx-auto flex-1 min-h-0 grid grid-cols-4 grid-rows-2 gap-1 sm:gap-1.5">
          {classicEight.map((team) => {
            const isP1 = p1Team.id === team.id;
            const isP2 = p2Team.id === team.id;
            const isCurrentSelected = step === 'p1' ? isP1 : isP2;
            const isDisabledInStep2 = step === 'p2' && isP1;

            return (
              <button
                key={team.id}
                type="button"
                onClick={() => handleCardClick(team)}
                disabled={isDisabledInStep2}
                className={`relative min-w-0 rounded-xl p-1 sm:p-1.5 border flex items-center gap-1.5 text-left transition-all cursor-pointer touch-btn ${
                  isDisabledInStep2
                    ? 'opacity-40 bg-slate-950/70 border-slate-800 cursor-not-allowed'
                    : isCurrentSelected
                    ? step === 'p1'
                      ? 'bg-sky-950/80 border-sky-400 ring-2 ring-sky-400/40 shadow-lg'
                      : 'bg-rose-950/80 border-rose-400 ring-2 ring-rose-400/40 shadow-lg'
                    : 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-850 hover:border-slate-500'
                }`}
              >
                {/* Indicador de Seleção no Canto */}
                <div className="absolute top-1 right-1 flex items-center gap-0.5">
                  {isP1 && (
                    <span className="px-1 py-0.2 rounded text-[7px] font-black bg-sky-400 text-slate-950">
                      P1
                    </span>
                  )}
                  {isP2 && step === 'p2' && (
                    <span className="px-1 py-0.2 rounded text-[7px] font-black bg-rose-500 text-white">
                      IA
                    </span>
                  )}
                </div>

                {/* Escudo do Clube */}
                <ClubCrest clubId={team.id} size={28} className="shrink-0 sm:w-8 sm:h-8" />

                {/* Nome e Habilidade */}
                <div className="min-w-0 flex-1 pr-4">
                  <div className="text-[10px] sm:text-xs font-black leading-tight text-white truncate">
                    {team.name}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-amber-300 truncate flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{team.ability.name}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. RODAPÉ DE AÇÃO PRINCIPAL
          Botões grandes, ergonômicos e nunca cortados
          ========================================================================= */}
      <footer className="relative z-10 shrink-0 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-1.5">
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="font-black text-amber-400">Dica:</span>
          <span>Toque no card desejado ou use as setas ◄ ► para navegar</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
          {step === 'p1' ? (
            /* Botão da Etapa 1: CONFIRMAR MINHA EQUIPE */
            <button
              type="button"
              onClick={handleConfirmP1}
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black font-display text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer touch-btn"
            >
              <span>CONFIRMAR MINHA EQUIPE</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          ) : (
            /* Botões da Etapa 2: VOLTAR + CONFIRMAR E INICIAR PARTIDA */
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleBackToP1}
                className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] sm:text-xs font-black text-slate-200 uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer touch-btn"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">VOLTAR PARA MINHA EQUIPE</span>
                <span className="sm:hidden">VOLTAR</span>
              </button>

              <button
                type="button"
                onClick={handleStartMatch}
                className="flex-1 sm:flex-initial h-11 sm:h-12 px-5 sm:px-7 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 hover:from-emerald-300 hover:to-green-400 text-slate-950 font-black font-display text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer touch-btn"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>CONFIRMAR E INICIAR PARTIDA</span>
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
