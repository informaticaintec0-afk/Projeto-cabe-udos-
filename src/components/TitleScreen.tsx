/**
 * Tela Inicial do Jogo (Title Screen) - FUTEBOL RETRÔ
 * Apresentação arcade retrô, seleção rápida e botão para a Tela Completa de Clubes.
 */

import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Shield, Smartphone, Info, Users } from 'lucide-react';
import { TEAMS } from '../game/teams';
import { TeamPreset, AIDifficulty } from '../game/types';
import { ClubCrest } from '../game/crests';

interface TitleScreenProps {
  p1Team: TeamPreset;
  p2Team: TeamPreset;
  onOpenClubSelection: () => void;
  onStartDirectGame: (p1Team: TeamPreset, p2Team: TeamPreset, difficulty: AIDifficulty, duration: number) => void;
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
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medio');
  const [matchDuration, setMatchDuration] = useState<number>(90);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto select-none">
      {/* Barra superior de opções */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Futebol Retrô • 100% Offline para Android</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHowToPlay(!showHowToPlay)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 active:scale-95 transition-all touch-btn"
          >
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Regras & Habilidades</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center justify-center active:scale-95 transition-all touch-btn"
            aria-label="Som"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Centro / Logo Principal */}
      <div className="flex flex-col items-center my-auto py-3 text-center">
        {/* Ícone de bola de futebol */}
        <div className="relative mb-1">
          <span className="text-5xl sm:text-7xl drop-shadow-[0_10px_20px_rgba(250,204,21,0.35)] animate-bounce inline-block">
            ⚽
          </span>
        </div>

        {/* Nome Oficial do Jogo */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 drop-shadow-md">
          FUTEBOL RETRÔ
        </h1>
        <p className="text-sm sm:text-lg font-extrabold text-slate-300 tracking-wider uppercase mt-1">
          Arcade 2D • 8 Clubes Fictícios • Partidas 1 vs 1
        </p>

        {/* Confronto Atual com Escudos Oficiais */}
        <div className="mt-5 w-full max-w-xl bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-around gap-4">
            {/* Seu Time */}
            <div className="flex flex-col items-center">
              <ClubCrest clubId={p1Team.id} size={58} className="drop-shadow-lg" />
              <span className="text-xs font-black text-sky-400 mt-2">SEU CLUBE</span>
              <span className="text-sm font-bold text-white leading-tight">{p1Team.name}</span>
              <span className="text-[10px] text-amber-300 font-semibold">{p1Team.ability.name}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black font-display text-slate-500">
                VS
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                90s
              </span>
            </div>

            {/* Adversário */}
            <div className="flex flex-col items-center">
              <ClubCrest clubId={p2Team.id} size={58} className="drop-shadow-lg" />
              <span className="text-xs font-black text-rose-400 mt-2">ADVERSÁRIO</span>
              <span className="text-sm font-bold text-white leading-tight">{p2Team.name}</span>
              <span className="text-[10px] text-amber-300 font-semibold">{p2Team.ability.name}</span>
            </div>
          </div>

          {/* Botão para abrir a Tela Completa de Seleção de Clubes */}
          <button
            type="button"
            onClick={onOpenClubSelection}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all touch-btn"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Mudar Clubes (Ver os 8 Times)</span>
          </button>
        </div>

        {/* Botão Principal JOGAR */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={onOpenClubSelection}
            className="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black font-display text-lg sm:text-xl tracking-wide uppercase shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 active:scale-95 transition-all flex items-center justify-center gap-2.5 touch-btn"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            <span>SELECIONAR & JOGAR</span>
          </button>
        </div>
      </div>

      {/* Modal / Aba de Regras e Habilidades */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>⚽</span> Habilidades dos 8 Clubes
              </h3>
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              {/* Novas Regras de Jogabilidade */}
              <div className="bg-sky-950/60 p-3 rounded-xl border border-sky-700/60 mb-3">
                <span className="font-extrabold text-sky-300 text-xs flex items-center gap-1.5 mb-1">
                  <span>🎯</span> Chute Carregado com Mira & Trajetória
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Segure o botão <strong>⚽ CHUTE</strong> para carregar a força da finalização. Uma linha de mira dinâmica prevê em tempo real o arco da bola considerando gravidade e efeitos de clube (como <em>Canhão</em> e <em>Mira Estrela</em>). Solte para chutar! Toques rápidos realizam chutes curtos.
                </p>
              </div>

              <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-700/60 mb-3">
                <span className="font-extrabold text-amber-300 text-xs flex items-center gap-1.5 mb-1">
                  <span>⏳</span> Disputa Justa no Início da Jogada
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  No início da partida ou após cada gol, a bola desce do alto. Ambos os jogadores e a IA aguardam o <strong>primeiro contato da bola com o chão</strong> para disputar a bola, eliminando vantagens injustas de pulo precoce.
                </p>
              </div>

              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
                Habilidades Especiais dos 8 Clubes
              </div>

              {TEAMS.map((t) => (
                <div key={t.id} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
                  <ClubCrest clubId={t.id} size={34} className="shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{t.name}</span>
                      <span className="text-[10px] font-black text-amber-300 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-800">
                        {t.ability.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.ability.effectDesc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Rodapé silencioso */}
      <footer className="w-full text-center text-xs text-slate-500 py-1">
        <span>Futebol Retrô 2D · Compatível com celulares Android em modo horizontal (paisagem)</span>
      </footer>
    </div>
  );
};
