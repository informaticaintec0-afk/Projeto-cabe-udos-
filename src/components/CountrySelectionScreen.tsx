/**
 * Tela de Seleção de País — Fluxo de Partida Rápida
 * Exibe um cartão grande em destaque com a bandeira do Brasil e o texto BRASIL.
 * Ao tocar nele, avança para a escolha da Minha Equipe.
 */

import React from 'react';
import { ArrowLeft, ChevronRight, Globe, Sparkles } from 'lucide-react';
import { sound } from '../game/audio';

interface CountrySelectionScreenProps {
  onSelectBrazil: () => void;
  onBack: () => void;
}

export const CountrySelectionScreen: React.FC<CountrySelectionScreenProps> = ({
  onSelectBrazil,
  onBack,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden select-none text-white safe-area-container">
      {/* Luzes e atmosfera */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-emerald-500/20 via-yellow-500/10 to-transparent rounded-full blur-3xl opacity-60" />

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
          <span>VOLTAR AO MENU</span>
        </button>

        <div className="text-right">
          <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
            PARTIDA RÁPIDA
          </div>
          <h1 className="text-base sm:text-lg font-black font-display text-white uppercase leading-none">
            SELEÇÃO DE PAÍS
          </h1>
        </div>
      </header>

      {/* CONTEÚDO CENTRAL: CARTÃO GRANDE DO BRASIL */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center py-2 px-1 text-center">
        <p className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 sm:mb-3">
          Escolha a liga nacional para disputar a partida:
        </p>

        <div className="w-full max-w-md sm:max-w-lg">
          {/* CARTÃO GRANDE COM A BANDEIRA DO BRASIL */}
          <button
            type="button"
            onClick={() => {
              sound.playUiConfirm();
              onSelectBrazil();
            }}
            className="group relative w-full rounded-3xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-2 border-emerald-500/80 hover:border-amber-400 p-4 sm:p-5 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/35 active:scale-95 transition-all cursor-pointer touch-btn flex flex-col items-center overflow-hidden"
          >
            {/* Efeito de brilho ao passar o dedo */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-amber-400/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Selo superior do Cartão */}
            <div className="w-full flex items-center justify-between text-xs mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Sparkles className="w-3 h-3" /> LIGA OFICIAL DISPONÍVEL
              </span>

              <span className="text-[10px] font-mono font-bold text-slate-400">
                20 CLUBES
              </span>
            </div>

            {/* BANDEIRA DO BRASIL ESTILIZADA (SVG DE ALTA PRECISÃO) */}
            <div className="relative w-40 sm:w-48 h-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-yellow-300/60 shadow-xl transition-transform group-hover:scale-105">
              <svg viewBox="0 0 720 504" className="w-full h-full object-cover">
                {/* Fundo Verde */}
                <rect width="720" height="504" fill="#009c3b" />
                {/* Losango Amarelo */}
                <polygon points="360,50 670,252 360,454 50,252" fill="#ffdf00" />
                {/* Círculo Azul */}
                <circle cx="360" cy="252" r="120" fill="#002776" />
                {/* Faixa Branca */}
                <path
                  d="M 245,260 A 130,130 0 0,0 475,225 A 145,145 0 0,1 245,260 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>

            {/* TEXTO EM DESTAQUE: BRASIL */}
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white uppercase tracking-tight leading-none mt-3">
              BRASIL
            </h2>

            <p className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-1 max-w-xs">
              Campeonato Brasileiro com os 20 clubes oficiais, escudos originais e uniformes autênticos.
            </p>

            {/* Botão de Avanço Integrado */}
            <div className="mt-3 w-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 group-hover:brightness-110 shadow-md">
              <span>AVANÇAR PARA OS CLUBES</span>
              <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="relative z-10 shrink-0 text-center text-[9px] sm:text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5 flex items-center justify-between">
        <span>Selecione o Brasil para escolher seu clube</span>
        <span className="text-emerald-400 font-semibold">20 Clubes Brasileiros Disponíveis</span>
      </footer>
    </div>
  );
};
