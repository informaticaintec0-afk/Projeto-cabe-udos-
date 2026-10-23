/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Jogo de Futebol Arcade 2D "Futebol Retrô"
 * Versão 1v1 com os Oito Clubes Fictícios Oficiais para Android e Navegador Web.
 * 
 * Instruções para Executar e Testar:
 * 1. O jogo executa diretamente no navegador ou tela de celular (modo paisagem recomendado).
 * 2. Na tela inicial ou de seleção, escolha seu time e o adversário entre os 8 clubes oficiais.
 * 3. No celular: use os botões táteis na tela (◄, ►, ⬆ PULO, ⚽ CHUTE, 🔥 SUPER).
 * 4. No computador: use as setas do teclado ou W/A/S/D para mover/pular e Barra de Espaço/X para chutar.
 * 
 * Instruções para Conversão em Aplicativo Android Offline:
 * - O projeto utiliza HTML5 Canvas puro e Web Audio API, sem bibliotecas externas e sem chamadas de rede.
 * - Para empacotar com Capacitor:
 *     npm install @capacitor/core @capacitor/cli @capacitor/android
 *     npx cap init "Futebol Retro Arcade" "com.futebolretro.arcade"
 *     npm run build
 *     npx cap add android && npx cap copy && npx cap open android
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameState, MatchStats, TeamPreset, AIDifficulty } from './game/types';
import { DEFAULT_P1_TEAM, DEFAULT_P2_TEAM } from './game/teams';
import { sound } from './game/audio';
import { ScoreBoard } from './components/ScoreBoard';
import { TouchControls } from './components/TouchControls';
import { TitleScreen } from './components/TitleScreen';
import { ClubSelectionScreen } from './components/ClubSelectionScreen';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { MatchBanners } from './components/MatchBanners';
import { OrientationNotice } from './components/OrientationNotice';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Estados sincronizados com a UI React
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [superMeter, setSuperMeter] = useState<number>(0);
  const [countdownVal, setCountdownVal] = useState<number>(0);
  const [isGoalCelebration, setIsGoalCelebration] = useState<boolean>(false);
  const [goalText, setGoalText] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Times selecionados (Inicia com Rubro Imperial e Cruz de Prata)
  const [p1Team, setP1Team] = useState<TeamPreset>(DEFAULT_P1_TEAM);
  const [p2Team, setP2Team] = useState<TeamPreset>(DEFAULT_P2_TEAM);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medio');
  const [matchDuration, setMatchDuration] = useState<number>(90);

  // Vencedor e estatísticas finais
  const [matchResult, setMatchResult] = useState<{
    winner: 'p1' | 'p2' | 'draw';
    stats: MatchStats;
  } | null>(null);

  // Inicializa o motor do jogo no canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, p1Team, p2Team, difficulty);
    engineRef.current = engine;

    // Configura callbacks de sincronização
    engine.onStateChange = (state: GameState) => {
      setGameState(state);
      if (state === 'COUNTDOWN') {
        setCountdownVal(engine.countdownTimer);
        setIsGoalCelebration(false);
      } else if (state === 'GOAL_CELEBRATION') {
        setIsGoalCelebration(true);
      } else {
        setCountdownVal(0);
        setIsGoalCelebration(false);
      }
    };

    engine.onScoreChange = (score1: number, score2: number) => {
      setP1Score(score1);
      setP2Score(score2);
    };

    engine.onTimeChange = (seconds: number) => {
      setTimeLeft(seconds);
    };

    engine.onSuperMeterChange = (meter: number) => {
      setSuperMeter(meter);
    };

    engine.onGoalScored = (_scorer, text) => {
      setGoalText(text);
    };

    engine.onMatchEnd = (winner, stats) => {
      setMatchResult({ winner, stats });
    };

    // Inicia o render loop imediatamente para desenhar o cenário de fundo
    engine.startLoop();

    return () => {
      engine.destroy();
    };
  }, []);

  // Atualiza temporizador de contagem regressiva na tela
  useEffect(() => {
    if (gameState === 'COUNTDOWN') {
      const interval = setInterval(() => {
        if (engineRef.current) {
          setCountdownVal(engineRef.current.countdownTimer);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Iniciar partida confirmada a partir da seleção de clubes
  const handleConfirmAndPlay = useCallback(
    (chosenP1: TeamPreset, chosenP2: TeamPreset, diff: AIDifficulty, duration: number) => {
      setP1Team(chosenP1);
      setP2Team(chosenP2);
      setDifficulty(diff);
      setMatchDuration(duration);
      setTimeLeft(duration);

      if (engineRef.current) {
        engineRef.current.setTeams(chosenP1, chosenP2);
        engineRef.current.setDifficulty(diff);
        engineRef.current.setMatchDuration(duration);
        engineRef.current.startMatch();
      }
    },
    []
  );

  // Reiniciar partida (Revanche)
  const handlePlayAgain = useCallback(() => {
    setMatchResult(null);
    if (engineRef.current) {
      engineRef.current.restart();
    }
  }, []);

  // Voltar para a tela de Seleção de Clubes
  const handleGoToSelection = useCallback(() => {
    setMatchResult(null);
    setGameState('SELECT_TEAMS');
    if (engineRef.current) {
      engineRef.current.state = 'MENU';
      engineRef.current.resetPositionsForKickoff();
    }
  }, []);

  // Voltar ao menu principal
  const handleGoToMenu = useCallback(() => {
    setMatchResult(null);
    setGameState('MENU');
    if (engineRef.current) {
      engineRef.current.state = 'MENU';
      engineRef.current.resetPositionsForKickoff();
    }
  }, []);

  // Pausar / Despausar
  const handleTogglePause = useCallback(() => {
    if (!engineRef.current) return;
    if (gameState === 'PLAYING') {
      engineRef.current.pause();
    } else if (gameState === 'PAUSED') {
      engineRef.current.resume();
    }
  }, [gameState]);

  // Alternar áudio (Mudo / Ativo)
  const handleToggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center select-none touch-none">
      {/* Aviso de orientação para tela em pé no celular */}
      <OrientationNotice />

      {/* Container responsivo do Canvas (proporção 16:9 arcade adaptada para mobile e desktop) */}
      <div className="relative w-full h-full flex items-center justify-center p-0 m-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain max-h-screen bg-black"
          style={{
            aspectRatio: '16/9',
            maxHeight: '100vh',
            maxWidth: '100vw',
          }}
        />

        {/* 1. Tela Inicial */}
        {gameState === 'MENU' && (
          <TitleScreen
            p1Team={p1Team}
            p2Team={p2Team}
            onOpenClubSelection={() => setGameState('SELECT_TEAMS')}
            onStartDirectGame={handleConfirmAndPlay}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* 2. Tela Dedicada de Seleção dos 8 Clubes */}
        {gameState === 'SELECT_TEAMS' && (
          <ClubSelectionScreen
            initialP1Team={p1Team}
            initialP2Team={p2Team}
            initialDifficulty={difficulty}
            initialDuration={matchDuration}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onBack={() => setGameState('MENU')}
            onConfirmPlay={handleConfirmAndPlay}
          />
        )}

        {/* 3. Interface durante a Partida */}
        {(gameState === 'PLAYING' ||
          gameState === 'COUNTDOWN' ||
          gameState === 'GOAL_CELEBRATION' ||
          gameState === 'PAUSED') && (
          <>
            {/* Placar e Cronômetro */}
            <ScoreBoard
              p1Score={p1Score}
              p2Score={p2Score}
              timeLeft={timeLeft}
              p1Team={p1Team}
              p2Team={p2Team}
              superMeter={superMeter}
              isPaused={gameState === 'PAUSED'}
              isMuted={isMuted}
              onTogglePause={handleTogglePause}
              onToggleMute={handleToggleMute}
            />

            {/* Banners de Contagem Regressiva e Celebração de Gol */}
            <MatchBanners
              countdownVal={countdownVal}
              isGoalCelebration={isGoalCelebration}
              goalText={goalText}
            />

            {/* Controles Táteis na Tela para Celular */}
            <TouchControls
              engine={engineRef.current}
              superMeter={superMeter}
            />
          </>
        )}

        {/* 4. Modal de Pausa */}
        {gameState === 'PAUSED' && (
          <PauseModal
            onResume={handleTogglePause}
            onRestart={handlePlayAgain}
            onGoToMenu={handleGoToSelection}
          />
        )}

        {/* 5. Modal de Fim de Jogo */}
        {gameState === 'GAME_OVER' && matchResult && (
          <GameOverModal
            winner={matchResult.winner}
            stats={matchResult.stats}
            p1Team={p1Team}
            p2Team={p2Team}
            onPlayAgain={handlePlayAgain}
            onGoToMenu={handleGoToSelection}
          />
        )}
      </div>
    </main>
  );
}
