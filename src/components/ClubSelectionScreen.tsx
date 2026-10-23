/**

* Futebol Retrô — Seleção de Clubes
* Layout compacto para Android em modo paisagem e desktop.
  */

import React, { useState } from 'react';
import {
ArrowLeft,
Play,
Volume2,
VolumeX,
Zap,
Sparkles,
} from 'lucide-react';
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
const [difficulty, setDifficulty] =
useState<AIDifficulty>(initialDifficulty);
const [duration, setDuration] = useState<number>(initialDuration);

const handleSelectClub = (team: TeamPreset) => {
if (activeSlot === 'p1') {
setP1Team(team);
setActiveSlot('p2');
} else {
setP2Team(team);
setActiveSlot('p1');
}
};

const isMirrorMatch = p1Team.id === p2Team.id;

return (
<div className="absolute inset-0 z-30 flex flex-col gap-2 p-2 bg-slate-950/95 backdrop-blur-md overflow-y-auto lg:overflow-hidden select-none text-white">
{/* CABEÇALHO */}
<header className="shrink-0 flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
<div className="flex items-center gap-2 min-w-0">
<button
type="button"
onClick={onBack}
className="shrink-0 px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold flex items-center gap-1"
>
<ArrowLeft className="w-4 h-4" />
VOLTAR
</button>

      <div className="min-w-0">
        <h1 className="text-base sm:text-xl font-black tracking-tight text-amber-400 leading-tight">
          FUTEBOL RETRÔ
        </h1>
        <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">
          Escolha seu clube
        </p>
      </div>
    </div>

    <div className="flex items-center gap-1 shrink-0">
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
        {(['facil', 'medio', 'dificil'] as AIDifficulty[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            className={`px-1.5 py-1 rounded text-[9px] sm:text-[10px] font-bold ${
              difficulty === d
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-300'
            }`}
          >
            {d === 'facil' ? 'FÁCIL' : d === 'medio' ? 'MÉDIO' : 'DIFÍCIL'}
          </button>
        ))}
      </div>

      <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
        {[60, 90, 120].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setDuration(t)}
            className={`px-1.5 py-1 rounded text-[10px] font-bold ${
              duration === t
                ? 'bg-emerald-400 text-slate-950'
                : 'text-slate-300'
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
        className="w-8 h-8 shrink-0 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-rose-400" />
        ) : (
          <Volume2 className="w-4 h-4 text-emerald-400" />
        )}
      </button>
    </div>
  </header>

  {/* PAINÉIS DOS CLUBES ESCOLHIDOS */}
  <section className="shrink-0 grid grid-cols-2 gap-2">
    {[
      { team: p1Team, player: 'P1 • VOCÊ', selected: activeSlot === 'p1' },
      { team: p2Team, player: 'IA • ADVERSÁRIO', selected: activeSlot === 'p2' },
    ].map(({ team, player, selected }, index) => (
      <button
        key={player}
        type="button"
        onClick={() => setActiveSlot(index === 0 ? 'p1' : 'p2')}
        className={`min-w-0 flex items-center gap-2 rounded-xl p-2 border-2 text-left ${
          selected
            ? index === 0
              ? 'bg-sky-950 border-sky-400'
              : 'bg-rose-950 border-rose-400'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <ClubCrest
          clubId={team.id}
          size={36}
          className="shrink-0"
        />
        <div className="min-w-0">
          <div className="text-[9px] font-black text-slate-400">
            {player}
          </div>
          <div className="text-xs sm:text-sm font-black truncate">
            {team.name}
          </div>
          <div className="text-[9px] text-amber-300 truncate flex items-center gap-1">
            <Zap className="w-3 h-3 shrink-0" />
            {team.ability.name}
          </div>
        </div>
      </button>
    ))}
  </section>

  {/* GRADE DE CLUBES */}
  <section className="flex-1 min-h-0 flex flex-col">
    <div className="shrink-0 flex items-center justify-between gap-2 mb-1">
      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-300">
        Escolha: {activeSlot === 'p1' ? 'SEU TIME' : 'ADVERSÁRIO'}
      </span>
      {isMirrorMatch && (
        <span className="text-[9px] font-bold text-amber-300">
          Uniformes alternativos disponíveis
        </span>
      )}
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 lg:flex-1 lg:min-h-0 lg:grid-rows-2">
      {TEAMS.map((team) => {
        const isP1 = p1Team.id === team.id;
        const isP2 = p2Team.id === team.id;

        return (
          <div
            key={team.id}
            onClick={() => handleSelectClub(team)}
            className={`relative min-w-0 rounded-lg p-1.5 border cursor-pointer flex flex-col justify-between ${
              isP1 && isP2
                ? 'border-purple-400 bg-purple-950/50'
                : isP1
                ? 'border-sky-400 bg-sky-950/50'
                : isP2
                ? 'border-rose-400 bg-rose-950/50'
                : 'border-slate-700 bg-slate-900'
            }`}
          >
            <div className="absolute top-1 right-1 flex gap-1">
              {isP1 && (
                <span className="rounded px-1 text-[8px] font-black bg-sky-400 text-slate-950">
                  P1
                </span>
              )}
              {isP2 && (
                <span className="rounded px-1 text-[8px] font-black bg-rose-500 text-white">
                  IA
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <ClubCrest
                clubId={team.id}
                size={30}
                className="shrink-0"
              />
              <div className="min-w-0 pr-5">
                <div className="text-[10px] sm:text-xs font-black leading-tight truncate">
                  {team.name}
                </div>
                <div className="hidden sm:block text-[9px] text-slate-400 truncate">
                  {team.identity}
                </div>
              </div>
            </div>

            <div className="mt-1 border-t border-slate-700 pt-1">
              <div className="flex items-center gap-1 text-[9px] font-bold text-amber-300 truncate">
                <Zap className="w-3 h-3 shrink-0" />
                <span className="truncate">{team.ability.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 mt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setP1Team(team);
                  setActiveSlot('p2');
                }}
                className={`rounded py-1 text-[9px] font-black ${
                  isP1
                    ? 'bg-sky-400 text-slate-950'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                MEU TIME
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setP2Team(team);
                  setActiveSlot('p1');
                }}
                className={`rounded py-1 text-[9px] font-black ${
                  isP2
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                ADVERSÁRIO
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </section>

  {/* RODAPÉ */}
  <footer className="shrink-0 flex items-center justify-between gap-2 border-t border-slate-800 pt-2">
    <div className="hidden sm:flex min-w-0 items-center gap-1 text-[10px] text-slate-300">
      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
      <span className="truncate">
        {p1Team.name} vs {p2Team.name}
      </span>
    </div>

    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="sm:hidden flex items-center gap-1 bg-slate-900 p-1 rounded-lg">
        {[60, 90, 120].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setDuration(t)}
            className={`px-2 py-1 rounded text-[10px] font-bold ${
              duration === t
                ? 'bg-emerald-400 text-slate-950'
                : 'text-slate-300'
            }`}
          >
            {t}s
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onConfirmPlay(p1Team, p2Team, difficulty, duration)}
        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 font-black text-sm sm:text-lg uppercase shadow-lg active:scale-95 flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4 fill-current" />
        JOGAR PARTIDA
      </button>
    </div>
  </footer>
</div>

);
};
