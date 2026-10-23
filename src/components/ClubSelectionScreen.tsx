/**
 * Tela de Seleção dos 8 Clubes Fictícios de Futebol Retrô
 * Adaptada para celulares Android em orientação horizontal (paisagem) e telas desktop.
 * Apresenta os 8 clubes, escudos vetoriais, uniformes, habilidades especiais balanceadas,
 * botões grandes "JOGAR" e "VOLTAR".
 */

import React, { useState } from 'react';
import { ArrowLeft, Play, Volume2, VolumeX, Shield, Zap, Sparkles } from 'lucide-react';
import { TEAMS } from '../game/teams';
import { TeamPreset, AIDifficulty } from '../game/types';
import { ClubCrest } from '../game/crests';

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
  const [p1Team, setP1Team] = useState<TeamPreset>(initialP1Team);
  const [p2Team, setP2Team] = useState<TeamPreset>(initialP2Team);
  const [activeSlot, setActiveSlot] = useState<'p1' | 'p2'>('p1');
  const [difficulty, setDifficulty] = useState<AIDifficulty>(initialDifficulty);
  const [duration, setDuration] = useState<number>(initialDuration);

  const handleSelectClub = (team: TeamPreset) => {
    if (activeSlot === 'p1') {
      setP1Team(team);
      // Alterna o foco para facilitar a escolha do adversário
      setActiveSlot('p2');
    } else {
      setP2Team(team);
    }
  };

  const isMirrorMatch = p1Team.id === p2Team.id;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 bg-slate-950/95 backdrop-blur-md overflow-y-auto select-none">
      {/* 1. Barra Superior com Nome do Jogo e Ações */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 active:scale-95 transition-all touch-btn"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>VOLTAR</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400">
              FUTEBOL RETRÔ
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
              Seleção de Clubes • 8 Times Oficiais
            </p>
          </div>
        </div>

        {/* Seletor de Dificuldade, Tempo e Som */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
            <span className="text-slate-400 px-1.5">IA:</span>
            {(['facil', 'medio', 'dificil'] as AIDifficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-2 py-0.5 rounded-lg capitalize transition-colors ${
                  difficulty === d
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d === 'facil' ? 'Fácil' : d === 'medio' ? 'Médio' : 'Difícil'}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
            <span className="text-slate-400 px-1.5">Tempo:</span>
            {[60, 90, 120].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDuration(t)}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  duration === t
                    ? 'bg-emerald-500 text-slate-950 font-black'
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
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center justify-center active:scale-95 transition-all touch-btn"
            aria-label="Som"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* 2. Destaque dos Clubes Selecionados (Duelo VS) */}
      <section className="w-full max-w-6xl mx-auto my-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Painel Jogador 1 (Você) */}
        <div
          onClick={() => setActiveSlot('p1')}
          className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex items-center justify-between gap-3 ${
            activeSlot === 'p1'
              ? 'bg-sky-950/70 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <ClubCrest clubId={p1Team.id} size={54} className="shrink-0 drop-shadow-md" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  SEU CLUBE (P1)
                </span>
                {isMirrorMatch && (
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800">
                    1º Uniforme
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                {p1Team.name}
              </h2>
              <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <span className="text-amber-300 font-bold">{p1Team.ability.name}:</span>
                <span className="text-slate-300 text-[10.5px] truncate max-w-[200px] sm:max-w-xs">{p1Team.ability.shortDesc}</span>
              </p>
            </div>
          </div>

          {/* Amostra do Uniforme */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-bold text-slate-400 mb-1">Cores</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-lg border border-slate-800">
              <div
                className="w-5 h-5 rounded-md border border-white/40 shadow-sm"
                style={{ backgroundColor: p1Team.primaryColor }}
                title="Camisa"
              />
              <div
                className="w-5 h-5 rounded-md border border-white/40 shadow-sm"
                style={{ backgroundColor: p1Team.shortsColor }}
                title="Calção"
              />
            </div>
          </div>
        </div>

        {/* Painel Adversário (IA) */}
        <div
          onClick={() => setActiveSlot('p2')}
          className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex items-center justify-between gap-3 ${
            activeSlot === 'p2'
              ? 'bg-rose-950/70 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <ClubCrest clubId={p2Team.id} size={54} className="shrink-0 drop-shadow-md" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  ADVERSÁRIO (IA)
                </span>
                {isMirrorMatch && (
                  <span className="text-[9px] font-bold text-yellow-300 bg-yellow-950/50 px-1.5 py-0.5 rounded border border-yellow-600">
                    2º Uniforme / Faixa C
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                {p2Team.name}
              </h2>
              <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <span className="text-amber-300 font-bold">{p2Team.ability.name}:</span>
                <span className="text-slate-300 text-[10.5px] truncate max-w-[200px] sm:max-w-xs">{p2Team.ability.shortDesc}</span>
              </p>
            </div>
          </div>

          {/* Amostra do Uniforme */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-bold text-slate-400 mb-1">Cores</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-lg border border-slate-800">
              <div
                className="w-5 h-5 rounded-md border border-white/40 shadow-sm"
                style={{ backgroundColor: p2Team.primaryColor }}
                title="Camisa"
              />
              <div
                className="w-5 h-5 rounded-md border border-white/40 shadow-sm"
                style={{ backgroundColor: p2Team.shortsColor }}
                title="Calção"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Grade com os 8 Clubes Fictícios */}
      <section className="w-full max-w-6xl mx-auto my-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Selecione um clube para:{' '}
            <span className={activeSlot === 'p1' ? 'text-sky-400' : 'text-rose-400'}>
              {activeSlot === 'p1' ? 'VOCÊ (JOGADOR 1)' : 'ADVERSÁRIO (IA)'}
            </span>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Clique no cartão para selecionar ou use os botões rápidos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TEAMS.map((team) => {
            const isP1 = p1Team.id === team.id;
            const isP2 = p2Team.id === team.id;

            return (
              <div
                key={team.id}
                onClick={() => handleSelectClub(team)}
                className={`relative rounded-2xl p-2.5 bg-slate-900/90 border-2 transition-all cursor-pointer flex flex-col justify-between hover:bg-slate-850 hover:scale-[1.02] shadow-md touch-btn ${
                  isP1 && isP2
                    ? 'border-purple-400 ring-2 ring-purple-500/50 bg-purple-950/30'
                    : isP1
                    ? 'border-sky-400 ring-2 ring-sky-500/40 bg-sky-950/30'
                    : isP2
                    ? 'border-rose-400 ring-2 ring-rose-500/40 bg-rose-950/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Badges de seleção P1 / P2 */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {isP1 && (
                    <span className="text-[9px] font-black bg-sky-500 text-slate-950 px-1.5 py-0.5 rounded shadow">
                      P1
                    </span>
                  )}
                  {isP2 && (
                    <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded shadow">
                      IA
                    </span>
                  )}
                </div>

                {/* Escudo e Nome */}
                <div className="flex items-center gap-2.5">
                  <ClubCrest clubId={team.id} size={42} className="shrink-0 drop-shadow" />
                  <div className="flex flex-col min-w-0 pr-6">
                    <span className="font-extrabold text-xs sm:text-sm text-white leading-tight truncate">
                      {team.name}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight truncate">
                      {team.identity}
                    </span>
                  </div>
                </div>

                {/* Habilidade Especial */}
                <div className="mt-2 pt-1.5 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-300">
                    <Zap className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{team.ability.name}</span>
                  </div>
                  <p className="text-[9.5px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {team.ability.shortDesc}
                  </p>
                </div>

                {/* Botões de Escolha Rápida */}
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setP1Team(team);
                    }}
                    className={`py-1 text-[10px] font-black rounded-lg transition-colors ${
                      isP1
                        ? 'bg-sky-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 hover:bg-sky-950 hover:text-sky-300 text-slate-300'
                    }`}
                  >
                    Meu Time
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setP2Team(team);
                    }}
                    className={`py-1 text-[10px] font-black rounded-lg transition-colors ${
                      isP2
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300'
                    }`}
                  >
                    Adversário
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Rodapé com Botão Principal JOGAR */}
      <footer className="w-full max-w-6xl mx-auto pt-2 flex items-center justify-between gap-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 font-semibold hidden sm:flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            {p1Team.name} ({p1Team.ability.name}) vs {p2Team.name} ({p2Team.ability.name})
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onBack}
            className="sm:hidden px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-black text-slate-300 uppercase touch-btn"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={() => onConfirmPlay(p1Team, p2Team, difficulty, duration)}
            className="flex-1 sm:flex-initial px-8 py-3.5 sm:px-12 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black font-display text-base sm:text-xl tracking-wide uppercase shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 active:scale-95 transition-all flex items-center justify-center gap-2.5 touch-btn"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>JOGAR PARTIDA</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
