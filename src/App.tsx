/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Jogo de Futebol Arcade 2D "Futebol Retrô"
 * Versão 1v1 com os 20 Clubes Brasileiros Oficiais para Android e Navegador Web.
 * 
 * Fluxo dos Menus:
 * 1. Menu Principal (4 botões: Partida Rápida, Liga Nacional, Copa Nacional, Configurações)
 * 2. Seleção de País (Cartão com a Bandeira do Brasil)
 * 3. Escolha da Minha Equipe (20 Clubes Brasileiros)
 * 4. Escolha da Equipe Adversária (IA, impedindo mesmo clube)
 * 5. Partida 1v1
 * 6. Fim de Jogo (Revanche, Voltar à Seleção de Times, Voltar ao Menu)
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameState, MatchStats, TeamPreset, AIDifficulty } from './game/types';
import { DEFAULT_P1_TEAM, DEFAULT_P2_TEAM } from './game/teams';
import { sound } from './game/audio';
import { ScoreBoard } from './components/ScoreBoard';
import { TouchControls } from './components/TouchControls';
import { TitleScreen } from './components/TitleScreen';
import { CountrySelectionScreen } from './components/CountrySelectionScreen';
import { MyTeamSelectionScreen } from './components/MyTeamSelectionScreen';
import { OpponentSelectionScreen } from './components/OpponentSelectionScreen';
import { NationalLeagueScreen } from './components/NationalLeagueScreen';
import { NationalCupScreen } from './components/NationalCupScreen';
import { SettingsScreen } from './components/SettingsScreen';
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

  // Vencedor e estatísticas finais da partida
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

    // Inicia o render loop imediatamente
    engine.startLoop();

    return () => {
      engine.destroy();
    };
  }, []);

  // Atualiza temporizador de contagem regressiva
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

  // Iniciar partida com as equipes confirmadas
  const handleConfirmAndPlay = useCallback(
    (chosenP1: TeamPreset, chosenP2: TeamPreset, diff: AIDifficulty = difficulty, duration: number = matchDuration) => {
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
    [difficulty, matchDuration]
  );

  // Reiniciar partida (Revanche direta)
  const handlePlayAgain = useCallback(() => {
    setMatchResult(null);
    if (engineRef.current) {
      engineRef.current.restart();
    }
  }, []);

  // Voltar para a Seleção de Times (mantém os times pré-selecionados)
  const handleGoToSelection = useCallback(() => {
    setMatchResult(null);
    setGameState('SELECT_MY_TEAM');
    if (engineRef.current) {
      engineRef.current.state = 'MENU';
      engineRef.current.resetPositionsForKickoff();
    }
  }, []);

  // Voltar ao Menu Principal
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
    <main className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-slate-950 flex items-center justify-center select-none touch-none">
      {/* Aviso de orientação para tela em pé no celular */}
      <OrientationNotice />

      {/* Container responsivo do Canvas (16:9 arcade adaptada para mobile e desktop) */}
      <div className="relative w-full h-full flex items-center justify-center p-0 m-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain max-h-[100dvh] max-w-[100vw] bg-black"
          style={{
            aspectRatio: '16/9',
            maxHeight: '100dvh',
            maxWidth: '100vw',
          }}
        />

        {/* 1. TELA: MENU PRINCIPAL (4 Botões Grandes Empilhados) */}
        {gameState === 'MENU' && (
          <TitleScreen
            onStartQuickMatch={() => setGameState('SELECT_COUNTRY')}
            onOpenNationalLeague={() => setGameState('LIGA_NACIONAL')}
            onOpenNationalCup={() => setGameState('COPA_NACIONAL')}
            onOpenSettings={() => setGameState('CONFIGURACOES')}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            p1Team={p1Team}
            p2Team={p2Team}
          />
        )}

        {/* 2. TELA: SELEÇÃO DE PAÍS (Partida Rápida -> Bandeira do Brasil) */}
        {gameState === 'SELECT_COUNTRY' && (
          <CountrySelectionScreen
            onSelectBrazil={() => setGameState('SELECT_MY_TEAM')}
            onBack={() => setGameState('MENU')}
          />
        )}

        {/* 3. TELA: ESCOLHA DA MINHA EQUIPE (20 Clubes Brasileiros) */}
        {(gameState === 'SELECT_MY_TEAM' || gameState === 'SELECT_TEAMS') && (
          <MyTeamSelectionScreen
            selectedTeam={p1Team}
            onSelectTeam={(team) => {
              setP1Team(team);
              // Se o adversário for igual ao time escolhido, troca para o próximo disponível
              if (p2Team.id === team.id) {
                const other = DEFAULT_P1_TEAM.id === team.id ? DEFAULT_P2_TEAM : DEFAULT_P1_TEAM;
                setP2Team(other);
              }
            }}
            onContinue={(team) => {
              setP1Team(team);
              setGameState('SELECT_OPPONENT');
            }}
            onBack={() => setGameState('SELECT_COUNTRY')}
          />
        )}

        {/* 4. TELA: ESCOLHA DA EQUIPE ADVERSÁRIA (Impedindo o mesmo clube) */}
        {gameState === 'SELECT_OPPONENT' && (
          <OpponentSelectionScreen
            myTeam={p1Team}
            initialOpponent={p2Team.id === p1Team.id ? DEFAULT_P2_TEAM : p2Team}
            onSelectOpponent={(opp) => setP2Team(opp)}
            onConfirmAndStartMatch={(my, opp) => {
              handleConfirmAndPlay(my, opp, difficulty, matchDuration);
            }}
            onBack={() => setGameState('SELECT_MY_TEAM')}
          />
        )}

        {/* 5. TELA: LIGA NACIONAL */}
        {gameState === 'LIGA_NACIONAL' && (
          <NationalLeagueScreen
            onStartQuickMatch={() => setGameState('SELECT_COUNTRY')}
            onBack={() => setGameState('MENU')}
          />
        )}

        {/* 6. TELA: COPA NACIONAL */}
        {gameState === 'COPA_NACIONAL' && (
          <NationalCupScreen
            onStartQuickMatch={() => setGameState('SELECT_COUNTRY')}
            onBack={() => setGameState('MENU')}
          />
        )}

        {/* 7. TELA: CONFIGURAÇÕES */}
        {gameState === 'CONFIGURACOES' && (
          <SettingsScreen
            difficulty={difficulty}
            onChangeDifficulty={setDifficulty}
            matchDuration={matchDuration}
            onChangeMatchDuration={setMatchDuration}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onBack={() => setGameState('MENU')}
          />
        )}

        {/* 8. INTERFACE DURANTE A PARTIDA REAL */}
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

            {/* Controles Táteis Virtuais */}
            <TouchControls
              engine={engineRef.current}
              superMeter={superMeter}
            />
          </>
        )}

        {/* 9. MODAL DE PAUSA */}
        {gameState === 'PAUSED' && (
          <PauseModal
            onResume={handleTogglePause}
            onRestart={handlePlayAgain}
            onGoToMenu={handleGoToMenu}
          />
        )}

        {/* 10. MODAL DE FIM DE JOGO */}
        {gameState === 'GAME_OVER' && matchResult && (
          <GameOverModal
            winner={matchResult.winner}
            stats={matchResult.stats}
            p1Team={p1Team}
            p2Team={p2Team}
            onPlayAgain={handlePlayAgain}
            onGoToSelection={handleGoToSelection}
            onGoToMenu={handleGoToMenu}
          />
        )}
      </div>
    </main>
  );
}
