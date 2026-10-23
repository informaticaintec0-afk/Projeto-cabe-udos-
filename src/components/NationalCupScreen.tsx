/**
 * Tela da Copa Nacional — Futebol Retrô
 * Apresentação oficial do Torneio Eliminatório de Mata-Mata com Gol de Ouro.
 */

import React from 'react';
import { ArrowLeft, ShieldAlert, Play, Zap, Flame } from 'lucide-react';
import { sound } from '../game/audio';

interface NationalCupScreenProps {
  onStartQuickMatch: () => void;
  onBack: () => void;
}

export const NationalCupScreen: React.FC<NationalCupScreenProps> = ({
  onStartQuickMatch,
  onBack,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* Luz azul de mata-mata */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl opacity-60" />

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
          <div className="text-[9px] font-black uppercase tracking-widest text-sky-400">
            TORNEIO MATA-MATA
          </div>
          <h1 className="text-base sm:text-lg font-black font-display text-white uppercase leading-none">
            COPA NACIONAL
          </h1>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center py-2 px-1 text-center">
        <div className="max-w-xl w-full bg-slate-900/90 border-2 border-sky-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col items-center my-auto">
          {/* Escudo / Taça da Copa */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center text-3xl mb-2 shadow-lg shadow-sky-500/20">
            🥇
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display text-white uppercase tracking-tight leading-none">
            Copa Nacional do Brasil
          </h2>

          <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-md">
            Mata-mata eliminatório onde cada erro pode custar a desclassificação. Em caso de empate, prorrogação com regra do <strong>Gol de Ouro</strong>!
          </p>

          {/* Destaque das Regras da Copa */}
          <div className="mt-3 w-full grid grid-cols-2 gap-2 text-left">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-300 mb-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Gol de Ouro (120s)</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400">
                Prorrogação tensa de 2 minutos: quem marcar o primeiro gol vence imediatamente a partida.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-sky-400 mb-0.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>Fases Eliminatórias</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400">
                Oitavas, Quartas, Semifinal e a Grande Final da Taça mais cobiçada do país.
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-4 w-full flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playUiConfirm();
                onStartQuickMatch();
              }}
              className="flex-1 h-11 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer touch-btn"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>DISPUTAR MATA-MATA AGORA</span>
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
        <span>Copa Nacional • Mata-Mata Eliminatório</span>
        <span className="text-sky-400 font-semibold">Regra do Gol de Ouro</span>
      </footer>
    </div>
  );
};
