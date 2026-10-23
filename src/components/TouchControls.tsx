/**
 * Controles Táteis Virtuais para Celular (Android / Mobile Web)
 * Suporte a multitoque simultâneo (andar mantendo pressionado enquanto pula e chuta),
 * feedback visual e vibração háptica tátil nativa.
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Zap } from 'lucide-react';
import { GameEngine } from '../game/GameEngine';

interface TouchControlsProps {
  engine: GameEngine | null;
  superMeter: number;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ engine, superMeter }) => {
  const isSuperReady = superMeter >= 100;
  const [isKickCharging, setIsKickCharging] = useState(false);

  // Feedback de vibração sutil no Android
  const triggerHaptic = (ms: number = 18) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignora em caso de bloqueio pelo navegador
      }
    }
  };

  // Handlers para botões contínuos (Esquerda, Direita e Pulo)
  const bindContinuousControl = (actionKey: 'left' | 'right' | 'jump') => {
    const handleStart = (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      if (engine) {
        engine.input[actionKey] = true;
      }
      triggerHaptic(14);
    };

    const handleEnd = (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
      if (engine) {
        engine.input[actionKey] = false;
      }
    };

    return {
      onPointerDown: handleStart,
      onPointerUp: handleEnd,
      onPointerCancel: handleEnd,
      onPointerLeave: handleEnd,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    };
  };

  // Handler para Chute Carregado com Mira (segurar para acumular força e mirar, soltar para disparar)
  const handleKickPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsKickCharging(true);
    if (engine) {
      engine.input.kick = true;
      engine.startChargingKick('p1');
    }
    triggerHaptic(20);
  };

  const handleKickPointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
    setIsKickCharging(false);
    if (engine) {
      engine.input.kick = false;
      engine.releaseKick('p1');
    }
    triggerHaptic(25);
  };

  const handleKickPointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
    setIsKickCharging(false);
    if (engine) {
      engine.input.kick = false;
      engine.cancelChargingKick('p1');
    }
  };

  // Handler para Super Chute (ação única)
  const handleSuperKick = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (engine && isSuperReady) {
      engine.input.superKick = true;
      triggerHaptic(35);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex justify-between items-end p-2 pb-[max(env(safe-area-inset-bottom,0px),10px)] pl-[max(env(safe-area-inset-left,0px),10px)] pr-[max(env(safe-area-inset-right,0px),10px)] select-none">
      {/* Botões Direcionais (Polegar Esquerdo) */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        {/* Esquerda */}
        <button
          type="button"
          aria-label="Mover para Esquerda"
          {...bindContinuousControl('left')}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-slate-900/85 backdrop-blur-md border-2 border-slate-700/70 active:border-sky-400 active:bg-sky-950/80 active:scale-90 transition-transform shadow-lg flex items-center justify-center text-slate-200 active:text-sky-300 touch-btn"
        >
          <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9" />
        </button>

        {/* Direita */}
        <button
          type="button"
          aria-label="Mover para Direita"
          {...bindContinuousControl('right')}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-slate-900/85 backdrop-blur-md border-2 border-slate-700/70 active:border-sky-400 active:bg-sky-950/80 active:scale-90 transition-transform shadow-lg flex items-center justify-center text-slate-200 active:text-sky-300 touch-btn"
        >
          <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9" />
        </button>
      </div>

      {/* Botões de Ação (Polegar Direito) */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        {/* Super Chute Flamejante */}
        {isSuperReady && (
          <button
            type="button"
            aria-label="Super Chute"
            onPointerDown={handleSuperKick}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-600 to-rose-500 border-2 border-amber-300 shadow-lg shadow-orange-500/50 flex flex-col items-center justify-center text-white font-black text-[9px] active:scale-90 animate-pulse touch-btn"
          >
            <Zap className="w-5 h-5 text-yellow-200 fill-yellow-300" />
            <span className="font-extrabold uppercase tracking-tight">SUPER</span>
          </button>
        )}

        {/* Pulo */}
        <button
          type="button"
          aria-label="Pular"
          {...bindContinuousControl('jump')}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-slate-900/85 backdrop-blur-md border-2 border-emerald-600/70 active:border-emerald-400 active:bg-emerald-950/80 active:scale-90 transition-transform shadow-lg flex flex-col items-center justify-center text-emerald-400 active:text-emerald-200 touch-btn"
        >
          <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider">PULO</span>
        </button>

        {/* Chute Carregado com Mira */}
        <div className="relative">
          {/* Anel indicador de carregamento ativo */}
          {isKickCharging && (
            <div className="absolute -inset-1.5 rounded-3xl border-2 border-amber-400 animate-ping pointer-events-none opacity-70" />
          )}

          <button
            type="button"
            aria-label="Chutar ou Segurar para Carregar com Mira"
            onPointerDown={handleKickPointerDown}
            onPointerUp={handleKickPointerUp}
            onPointerCancel={handleKickPointerCancel}
            onPointerLeave={handleKickPointerCancel}
            onContextMenu={(e) => e.preventDefault()}
            className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl border-2 transition-all shadow-xl flex flex-col items-center justify-center text-slate-950 touch-btn ${
              isKickCharging
                ? 'bg-gradient-to-b from-amber-400 via-orange-500 to-rose-600 border-yellow-200 scale-95 shadow-orange-500/60 ring-4 ring-amber-400/50'
                : 'bg-gradient-to-b from-amber-500 to-amber-600 border-amber-300 active:from-amber-600 active:to-amber-700 shadow-amber-950/40'
            }`}
          >
            <span className="text-xl sm:text-2xl leading-none">⚽</span>
            <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase mt-0.5">
              {isKickCharging ? 'MIRANDO' : 'CHUTE'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
