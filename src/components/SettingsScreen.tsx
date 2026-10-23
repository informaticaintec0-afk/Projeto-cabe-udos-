/**
 * Tela de Configurações — Futebol Retrô
 * Permite ajustar a dificuldade da IA, duração da partida e áudio,
 * além de exibir guia rápido de controles.
 */

import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Check, Gamepad2, Smartphone } from 'lucide-react';
import { AIDifficulty } from '../game/types';
import { sound } from '../game/audio';

interface SettingsScreenProps {
  difficulty: AIDifficulty;
  onChangeDifficulty: (diff: AIDifficulty) => void;
  matchDuration: number;
  onChangeMatchDuration: (duration: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  difficulty,
  onChangeDifficulty,
  matchDuration,
  onChangeMatchDuration,
  isMuted,
  onToggleMute,
  onBack,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* Luz ambiente */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-slate-700/20 via-slate-800/10 to-transparent rounded-full blur-3xl opacity-60" />

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
            OPÇÕES DO JOGO
          </div>
          <h1 className="text-base sm:text-lg font-black font-display text-white uppercase leading-none">
            CONFIGURAÇÕES
          </h1>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center py-1 sm:py-2 px-1 text-center overflow-y-auto">
        <div className="max-w-md w-full bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-3 sm:p-5 shadow-2xl flex flex-col gap-3 my-auto">
          {/* 1. Dificuldade da IA */}
          <div className="text-left bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5 sm:p-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1.5">
              Dificuldade do Adversário (IA)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['facil', 'medio', 'dificil'] as AIDifficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    sound.playUiNavigate();
                    onChangeDifficulty(d);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer touch-btn ${
                    difficulty === d
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/40'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-850 border border-slate-800'
                  }`}
                >
                  {difficulty === d && <Check className="w-3 h-3" />}
                  <span>{d === 'facil' ? 'FÁCIL' : d === 'medio' ? 'MÉDIO' : 'DIFÍCIL'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Duração da Partida */}
          <div className="text-left bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5 sm:p-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1.5">
              Duração da Partida
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[60, 90, 120].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    sound.playUiNavigate();
                    onChangeMatchDuration(t);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer touch-btn ${
                    matchDuration === t
                      ? 'bg-emerald-400 text-slate-950 shadow-md ring-2 ring-emerald-300/40'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-850 border border-slate-800'
                  }`}
                >
                  {matchDuration === t && <Check className="w-3 h-3" />}
                  <span>{t} Segundos</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Efeitos Sonoros */}
          <div className="text-left bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
                Efeitos Sonoros do Jogo
              </span>
              <span className="text-[10px] text-slate-400">Chutes, apito, comemoração e torcida</span>
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              className={`h-9 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer touch-btn ${
                !isMuted
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-rose-950 border border-rose-800 text-rose-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'MUDO' : 'ATIVO'}</span>
            </button>
          </div>

          {/* 4. Guia Rápido de Controles */}
          <div className="text-left bg-slate-950/40 border border-slate-800/80 rounded-2xl p-2 text-[10px] text-slate-400">
            <div className="font-bold text-slate-300 mb-0.5 flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-amber-400" />
              <span>Controles no Celular & Computador:</span>
            </div>
            <p>
              • <strong>Celular</strong>: Use os botões virtuais ◄ ► (andar), ⬆ (pulo), ⚽ (chute com mira) e 🔥 (super chute).
            </p>
            <p>
              • <strong>Computador</strong>: Setas ou A/D para andar, W/Espaço para pular, X ou K para chutar, S ou L para super chute.
            </p>
          </div>
        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="relative z-10 shrink-0 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-1.5">
        <span className="text-[9px] text-slate-500">Configurações salvas automaticamente</span>

        <button
          type="button"
          onClick={() => {
            sound.playUiConfirm();
            onBack();
          }}
          className="ml-auto h-9 sm:h-10 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer touch-btn"
        >
          SALVAR E VOLTAR
        </button>
      </footer>
    </div>
  );
};
