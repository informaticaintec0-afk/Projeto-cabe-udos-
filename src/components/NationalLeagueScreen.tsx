/**
 * Tela da Liga Nacional — Futebol Retrô
 * Apresentação oficial do Campeonato Brasileiro de Pontos Corridos.
 */

import React from 'react';
import { ArrowLeft, Trophy, Play, Users, Award } from 'lucide-react';
import { TEAMS } from '../game/teams';
import { ClubCrest } from '../game/crests';
import { sound } from '../game/audio';

interface NationalLeagueScreenProps {
  onStartQuickMatch: () => void;
  onBack: () => void;
}

export const NationalLeagueScreen: React.FC<NationalLeagueScreenProps> = ({
  onStartQuickMatch,
  onBack,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* Luz dourada de campeonato */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent rounded-full blur-3xl opacity-60" />

      {/* CABEÇALHO */}
      <header className="relative z-10 shrink-0 flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 sm:pb-2">
        <button
          type="button"
          onClick={() => {
            sound.playUiNavigate();
            onBack();
          }}
          className="shrink-0 h-8 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[10px] sm:text-xs font-black tracking-wider text-slate-200 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer touch-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>MENU PRINCIPAL</span>
        </button>

        <div className="text-right">
          <div className="text-[9px] font-black uppercase tracking-widest text-amber-400">
            MODO OFICIAL
          </div>
          <h1 className="text-base sm:text-lg font-black font-display text-white uppercase leading-none">
            LIGA NACIONAL
          </h1>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center py-2 px-1 text-center">
        <div className="max-w-xl w-full bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col items-center my-auto">
          {/* Troféu */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-3xl mb-2 shadow-lg shadow-amber-500/20">
            🏆
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white uppercase tracking-tight leading-none">
            Campeonato Brasileiro Retrô
          </h2>

          <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-md">
            20 clubes disputando o título nacional em pontos corridos. O modo completo de campanha contínua está em preparação para a próxima atualização.
          </p>

          {/* Destaque dos 20 Clubes Participantes */}
          <div className="mt-3 w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1.5 flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              <span>20 Clubes Confirmados na Série A</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-24 sm:max-h-28 overflow-y-auto p-1">
              {TEAMS.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/70 px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-200"
                >
                  <ClubCrest clubId={team.id} size={14} />
                  <span>{team.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de Ação: Disputar Rodada via Partida Rápida */}
          <div className="mt-4 w-full flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playUiConfirm();
                onStartQuickMatch();
              }}
              className="flex-1 h-11 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer touch-btn"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>DISPUTAR CLÁSSICO AGORA</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playUiNavigate();
                onBack();
              }}
              className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs uppercase flex items-center justify-center active:scale-95 transition-all cursor-pointer touch-btn"
            >
              <span>VOLTAR</span>
            </button>
          </div>
        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="relative z-10 shrink-0 text-center text-[9px] sm:text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5 flex items-center justify-between">
        <span>Liga Nacional • 20 Clubes Brasileiros</span>
        <span className="text-amber-400 font-semibold">Temporada Oficial</span>
      </footer>
    </div>
  );
};
