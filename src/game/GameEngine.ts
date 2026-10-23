/**
 * Motor Principal do Jogo Arcade (Game Engine)
 * Gerencia o loop de 60fps, física, regras de gol, cronômetro de 90 segundos e colisões.
 */

import { GameState, InputState, MatchStats, TeamPreset, AIDifficulty } from './types';
import { Ball, Player, Goal, ParticleSystem } from './entities';
import { SoccerAI } from './ai';
import { GameRenderer } from './renderer';
import { sound } from './audio';
import {
  dist,
  distSq,
  clamp,
  resolveCircleCircleCollision,
  resolveCircleSegmentCollision
} from './physics';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: GameRenderer;

  // Estado da partida
  public state: GameState = 'MENU';
  public matchTime: number = 90; // 90 segundos de partida regulamentar
  public matchDuration: number = 90;
  public countdownTimer: number = 3; // 3, 2, 1, JÁ!
  public goalCelebrationTimer: number = 0;
  public lastScorer: 'p1' | 'p2' | null = null;

  // Entidades
  public ball: Ball;
  public p1: Player;
  public p2: Player;
  public goalLeft: Goal;
  public goalRight: Goal;
  public particles: ParticleSystem;
  public ai: SoccerAI;

  // Estatísticas
  public stats: MatchStats = {
    p1Goals: 0,
    p2Goals: 0,
    p1Shots: 0,
    p2Shots: 0,
    p1Headers: 0,
    p2Headers: 0,
    p1Saves: 0,
    p2Saves: 0
  };

  // Controles
  public input: InputState = {
    left: false,
    right: false,
    jump: false,
    kick: false,
    superKick: false
  };

  // Callbacks para sincronização com a interface React
  public onStateChange?: (state: GameState) => void;
  public onScoreChange?: (p1Score: number, p2Score: number) => void;
  public onTimeChange?: (secondsLeft: number) => void;
  public onSuperMeterChange?: (meterP1: number) => void;
  public onGoalScored?: (scorer: 'p1' | 'p2', text: string) => void;
  public onMatchEnd?: (winner: 'p1' | 'p2' | 'draw', stats: MatchStats) => void;
  public onGoldenGoalTick?: (period: number, secondsLeft: number) => void;
  public onGoldenGoalPeriodChange?: (period: number) => void;

  // Estado Universal de Gol de Ouro (Copa do Brasil e futuras Copas Internacionais)
  public isGoldenGoalActive: boolean = false;
  public goldenGoalPeriod: number = 1;
  public goldenGoalPeriodDuration: number = 120; // 2 minutos (120 segundos)
  public goldenGoalTimeLeft: number = 120;
  public aggOffsetP1: number = 0; // Gols do time 1 em partidas anteriores (ida)
  public aggOffsetP2: number = 0; // Gols do time 2 em partidas anteriores (ida)
  public isCupMatch: boolean = false;
  public cupLeg: 1 | 2 = 1;

  // Loop de animação
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  // Dimensões do jogo virtual
  public readonly virtualWidth = 1280;
  public readonly virtualHeight = 720;
  public readonly groundY = 590;

  // Fase de reposição / início de jogada (congelamento temporário até 1º toque no chão)
  public isKickoffDropPhase: boolean = false;
  public kickoffSafetyTimer: number = 0;

  // Monitoramento e Liberação de Bola Presa no Travessão/Baliza
  private ballStuckTimer: number = 0;
  private ballStuckCheckX: number = 640;
  private ballStuckCheckY: number = 240;
  private consecutiveGoalHits: number = 0;
  private goalHitWindowTimer: number = 0;
  private lastPostSoundTime: number = 0;
  private ballReleaseCooldown: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    p1Team: TeamPreset,
    p2Team: TeamPreset,
    difficulty: AIDifficulty = 'medio'
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não foi possível obter contexto 2D');
    this.ctx = context;

    this.renderer = new GameRenderer(this.ctx);

    // Inicializa entidades
    this.ball = new Ball(640, 240);
    this.p1 = new Player('p1', p1Team, 360, 1);
    this.p2 = new Player('p2', p2Team, 920, -1);

    // Limites de locomoção dos jogadores (não podem entrar além da linha de gol)
    this.p1.minX = 120;
    this.p1.maxX = 1160;
    this.p2.minX = 120;
    this.p2.maxX = 1160;

    this.goalLeft = new Goal(true);
    this.goalRight = new Goal(false);
    this.particles = new ParticleSystem();
    this.ai = new SoccerAI(difficulty);

    this.setupKeyboardListeners();
    this.handleResize();
  }

  public setTeams(p1Team: TeamPreset, p2Team: TeamPreset) {
    const isMirrorMatch = p1Team.id === p2Team.id;
    this.p1.setTeam(p1Team, false);
    this.p2.setTeam(p2Team, isMirrorMatch);
  }

  public setDifficulty(diff: AIDifficulty) {
    this.ai.setDifficulty(diff);
  }

  public setMatchDuration(seconds: number) {
    this.matchDuration = seconds;
    this.matchTime = seconds;
  }

  public startMatch() {
    this.isGoldenGoalActive = false;
    this.goldenGoalPeriod = 1;
    this.goldenGoalTimeLeft = this.goldenGoalPeriodDuration;
    this.aggOffsetP1 = 0;
    this.aggOffsetP2 = 0;
    this.matchTime = this.matchDuration;
    this.stats = {
      p1Goals: 0,
      p2Goals: 0,
      p1Shots: 0,
      p2Shots: 0,
      p1Headers: 0,
      p2Headers: 0,
      p1Saves: 0,
      p2Saves: 0
    };
    this.lastScorer = null;
    this.resetPositionsForKickoff();
    this.state = 'COUNTDOWN';
    this.countdownTimer = 3;
    sound.playCountdownBeep(false);

    this.onStateChange?.(this.state);
    this.onScoreChange?.(0, 0);
    this.onTimeChange?.(Math.ceil(this.matchTime));
  }

  /**
   * Inicia ou retoma a prorrogação de Gol de Ouro (Copa do Brasil / Copas Internacionais)
   * Respeita período atual, cronômetro regressivo de 2 minutos (120s) e placar agregado.
   */
  public startGoldenGoalMatch(
    chosenP1: TeamPreset,
    chosenP2: TeamPreset,
    diff: AIDifficulty,
    period: number = 1,
    timeLeft: number = 120,
    aggOffsetP1: number = 0,
    aggOffsetP2: number = 0,
    currentLegP1: number = 0,
    currentLegP2: number = 0
  ) {
    this.setTeams(chosenP1, chosenP2);
    this.setDifficulty(diff);
    this.isGoldenGoalActive = true;
    this.goldenGoalPeriod = Math.max(1, period);
    this.goldenGoalPeriodDuration = 120;
    this.goldenGoalTimeLeft = Math.max(1, timeLeft);
    this.matchTime = this.goldenGoalTimeLeft;
    this.aggOffsetP1 = aggOffsetP1;
    this.aggOffsetP2 = aggOffsetP2;

    this.stats = {
      p1Goals: currentLegP1,
      p2Goals: currentLegP2,
      p1Shots: 0,
      p2Shots: 0,
      p1Headers: 0,
      p2Headers: 0,
      p1Saves: 0,
      p2Saves: 0
    };
    this.lastScorer = null;
    this.resetPositionsForKickoff();
    this.state = 'COUNTDOWN';
    this.countdownTimer = 3;
    sound.playCountdownBeep(false);

    this.particles.showFloatingText(640, 260, `GOL DE OURO - ${this.goldenGoalPeriod}º PERÍODO`, '#facc15');

    this.onStateChange?.(this.state);
    this.onScoreChange?.(this.stats.p1Goals, this.stats.p2Goals);
    this.onTimeChange?.(Math.ceil(this.matchTime));
    this.onGoldenGoalTick?.(this.goldenGoalPeriod, Math.ceil(this.matchTime));
    this.onGoldenGoalPeriodChange?.(this.goldenGoalPeriod);
  }

  public restart() {
    if (this.isGoldenGoalActive) {
      this.startGoldenGoalMatch(
        this.p1.team,
        this.p2.team,
        this.ai.difficulty,
        1,
        120,
        this.aggOffsetP1,
        this.aggOffsetP2,
        0,
        0
      );
    } else {
      this.startMatch();
    }
  }

  public pause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.onStateChange?.(this.state);
    }
  }

  public resume() {
    if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.onStateChange?.(this.state);
    }
  }

  public startLoop() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  public stopLoop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    const rawDt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    const dt = Math.min(rawDt, 0.05); // Garante estabilidade física mesmo se houver queda de frames

    this.update(dt, currentTime / 1000);
    this.render(currentTime / 1000);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number, timeSec: number) {
    this.renderer.update(dt);
    this.particles.update(dt);

    if (this.state === 'COUNTDOWN') {
      // Contagem regressiva antes do início do jogo
      const prevInt = Math.ceil(this.countdownTimer);
      this.countdownTimer -= dt;
      const curInt = Math.ceil(this.countdownTimer);

      if (curInt < prevInt && curInt > 0) {
        sound.playCountdownBeep(false);
      }

      if (this.countdownTimer <= 0) {
        this.state = 'PLAYING';
        this.ball.vy = 90; // inicia descida ativa em direção ao gramado
        sound.playCountdownBeep(true);
        sound.playWhistle(false);
        this.onStateChange?.(this.state);
      }
      return;
    }

    if (this.state === 'GOAL_CELEBRATION') {
      this.goalCelebrationTimer -= dt;
      // Continua atualizando a bola para pousar suavemente na rede
      this.ball.update(dt, this.groundY, 0, this.virtualWidth, 30);

      if (this.goalCelebrationTimer <= 0) {
        if (this.isGoldenGoalActive) {
          // REGRA DE OURO: O primeiro clube a marcar vence IMEDIATAMENTE!
          this.finishMatch();
          return;
        }

        if (this.matchTime <= 0) {
          this.finishMatch();
        } else {
          this.resetPositionsForKickoff();
          this.state = 'COUNTDOWN';
          this.countdownTimer = 2.5;
          sound.playCountdownBeep(false);
          this.onStateChange?.(this.state);
        }
      }
      return;
    }

    if (this.state !== 'PLAYING') {
      return;
    }

    // REGRA 1: Verificação da Fase de Disputa no Início da Jogada
    // Se a bola estiver caindo do alto em direção ao chão, ambos os jogadores ficam congelados
    // até que a bola faça seu primeiro contato com o chão ou até o tempo de segurança esgotar.
    if (this.isKickoffDropPhase) {
      this.kickoffSafetyTimer -= dt;
      const ballHitsGround = (this.ball.y + this.ball.radius >= this.groundY - 2);

      if (ballHitsGround || this.kickoffSafetyTimer <= 0) {
        this.isKickoffDropPhase = false;
        sound.playBounce(0.9);
        this.particles.addTurfDust(this.ball.x, this.groundY);
        this.particles.showFloatingText(640, 290, '⚽ BOLA EM JOGO! ⚽', '#22c55e');
      }
    }

    // Atualiza cronômetro da partida
    const prevSeconds = Math.ceil(this.matchTime);
    this.matchTime -= dt;
    const currentSeconds = Math.ceil(this.matchTime);

    if (currentSeconds !== prevSeconds) {
      const positiveSecs = Math.max(0, currentSeconds);
      this.onTimeChange?.(positiveSecs);
      if (this.isGoldenGoalActive) {
        this.goldenGoalTimeLeft = positiveSecs;
        this.onGoldenGoalTick?.(this.goldenGoalPeriod, positiveSecs);
      }
    }

    // Fim do tempo do período atual
    if (this.matchTime <= 0) {
      if (this.isGoldenGoalActive) {
        // REGRA DO GOL DE OURO: Ao chegar a zero sem gol, começa automaticamente o período seguinte de 2 minutos
        this.goldenGoalPeriod += 1;
        this.matchTime = this.goldenGoalPeriodDuration;
        this.goldenGoalTimeLeft = this.goldenGoalPeriodDuration;
        this.resetPositionsForKickoff();
        this.state = 'COUNTDOWN';
        this.countdownTimer = 2.5;
        sound.playCountdownBeep(false);
        this.particles.showFloatingText(640, 280, `GOL DE OURO - ${this.goldenGoalPeriod}º PERÍODO`, '#facc15');
        this.onGoldenGoalPeriodChange?.(this.goldenGoalPeriod);
        this.onGoldenGoalTick?.(this.goldenGoalPeriod, this.goldenGoalPeriodDuration);
        this.onTimeChange?.(this.goldenGoalPeriodDuration);
        this.onStateChange?.(this.state);
        return;
      } else {
        this.matchTime = 0;
        this.finishMatch();
        return;
      }
    }

    // Atualiza Jogador 1 (Humano)
    this.handlePlayerInput();
    this.p1.update(dt, this.groundY, this.ball);

    // Atualiza Jogador 2 (Inteligência Artificial) com respeito estrito à fase de reposição
    this.ai.update(dt, this.p2, this.ball, this.p1, this.isKickoffDropPhase);
    this.p2.update(dt, this.groundY, this.ball);

    // Atualiza Bola
    this.ball.update(dt, this.groundY, 0, this.virtualWidth, 30);

    // Efeito de fogo para o super chute
    if (this.ball.isSuper) {
      this.particles.addFireTrail(this.ball.x, this.ball.y);
    }

    // Resolução de Colisões Físicas
    this.handleCollisions(dt);

    // Monitoramento e Liberação de Bola Presa no Travessão/Baliza
    this.checkAndResolveStuckBall(dt);

    // Verificação de Gols
    this.checkGoals();

    // Atualiza medidor de super chute para o React
    this.onSuperMeterChange?.(this.p1.superMeter);
  }

  private handlePlayerInput() {
    // Se estiver na fase de reposição (bola caindo), impede movimentação e ações
    if (this.isKickoffDropPhase) {
      this.p1.vx = 0;
      this.p1.cancelChargingKick();
      return;
    }

    let moveDir = 0;
    if (this.input.left) moveDir -= 1;
    if (this.input.right) moveDir += 1;

    if (moveDir !== 0) {
      this.p1.move(moveDir);
    }

    if (this.input.jump) {
      this.p1.jump();
    }

    if (this.input.superKick && this.p1.canSuperKick()) {
      this.p1.triggerSuperKick();
      this.input.superKick = false;
    }
  }

  // Métodos de controle de Chute Carregado (usados por TouchControls e Teclado)
  public startChargingKick(playerId: 'p1' | 'p2' = 'p1') {
    if (this.state !== 'PLAYING' || this.isKickoffDropPhase) return;
    const player = playerId === 'p1' ? this.p1 : this.p2;
    player.startChargingKick();
  }

  public releaseKick(playerId: 'p1' | 'p2' = 'p1') {
    if (this.state !== 'PLAYING' || this.isKickoffDropPhase) return;
    const player = playerId === 'p1' ? this.p1 : this.p2;
    player.releaseKick();
  }

  public cancelChargingKick(playerId: 'p1' | 'p2' = 'p1') {
    const player = playerId === 'p1' ? this.p1 : this.p2;
    player.cancelChargingKick();
  }

  /**
   * Calcula a trajetória balística prevista do chute carregado em tempo real,
   * espelhando fielmente a física do jogo (gravidade 880 px/s², arrasto 0.996, habilidades do clube).
   */
  public getKickTrajectory(p: Player): Array<{ x: number; y: number }> {
    if (!p.isChargingKick) return [];

    const charge = p.kickCharge; // 0.0 a 1.0
    const isSuper = p.canSuperKick();

    // Potência proporcional ao carregamento: 780 rápida a 1040 carga total
    const basePower = 780 + charge * 260;
    let kickPower = isSuper ? 1160 + charge * 120 : basePower;

    // Habilidade CANHÃO (Rubro Imperial) / COLORADO (Internacional)
    if (p.team.ability?.id === 'canhao' || p.team.ability?.id === 'colorado') {
      kickPower = isSuper ? 1280 : basePower * 1.18 + 40;
    } else if (p.team.ability?.id === 'raio_solar' && charge > 0.35) {
      // Sol de Ouro: Chutes carregados devastadores
      kickPower = isSuper ? 1280 : basePower * 1.25 + 50;
    } else if (p.team.ability?.id === 'falcao') {
      kickPower = isSuper ? 1200 : basePower * 1.10 + 20;
    }

    // Ângulo de chute: rápida tem elevação destacada (0.72 rad / ~41°), carregada afina em laser (0.54 rad / ~31°)
    const dynamicElevation = 0.72 - charge * 0.18;
    let kickAngle = (p.facing === 1 ? dynamicElevation : Math.PI - dynamicElevation);

    // Habilidade ESTRELA (Estrela Alvinegra) / CONSTELAÇÃO (Cruzeiro Celeste): mira refinada ao ângulo do gol
    if (p.team.ability?.id === 'estrela' || p.team.ability?.id === 'constelacao') {
      const targetX = p.facing === 1 ? this.goalRight.postX : this.goalLeft.postX;
      const targetY = this.goalRight.crossbarY + 28;
      const dx = targetX - p.x;
      const dy = targetY - p.y;
      let precisionAngle = Math.atan2(-dy, Math.abs(dx));
      precisionAngle = clamp(precisionAngle, 0.45, 0.82);
      kickAngle = p.facing === 1 ? precisionAngle : Math.PI - precisionAngle;
    }

    // Ponto de partida da previsão balística
    const foot = p.getFootPos();
    const dFootBall = dist(foot.x, foot.y, this.ball.x, this.ball.y);
    const originX = dFootBall < 110 ? this.ball.x : foot.x;
    const originY = dFootBall < 110 ? this.ball.y : foot.y;

    let simX = originX;
    let simY = originY;
    let simVx = Math.cos(kickAngle) * kickPower;
    let simVy = -Math.sin(kickAngle) * kickPower;

    const points: Array<{ x: number; y: number }> = [{ x: simX, y: simY }];
    // O alcance visual da linha cresce proporcionalmente à força carregada (7 a 18 pontos)
    const maxSteps = Math.floor(7 + charge * 11);
    const simDt = 0.038;

    for (let step = 0; step < maxSteps; step++) {
      simVy += 880 * simDt; // Gravidade real da bola (Ball.gravity = 880)
      simVx *= 0.996; // Arrasto horizontal
      simX += simVx * simDt;
      simY += simVy * simDt;

      // Colisão com o chão
      if (simY >= this.groundY) {
        simY = this.groundY;
        points.push({ x: simX, y: simY });
        break;
      }

      // Limites da trave
      if (simX <= 110 || simX >= 1170) {
        points.push({ x: simX, y: simY });
        break;
      }

      points.push({ x: simX, y: simY });
    }

    return points;
  }

  private handleCollisions(dt: number) {
    const ball = this.ball;
    const p1 = this.p1;
    const p2 = this.p2;

    // 1. Colisão entre os dois jogadores (não se atravessam e respeitam massa corporal)
    const minPlayerDist = 58;
    const dxPlayers = p2.x - p1.x;
    if (Math.abs(dxPlayers) < minPlayerDist) {
      const overlap = (minPlayerDist - Math.abs(dxPlayers));
      const totalMass = p1.mass + p2.mass;
      p1.x -= (p2.mass / totalMass) * overlap;
      p2.x += (p1.mass / totalMass) * overlap;

      // Habilidade FORTALEZA / MURALHA VERDE / IMORTALIDADE: estabilidade máxima na dividida
      const isTank1 = ['fortaleza', 'muralha_verde', 'imortalidade'].includes(p1.team.ability?.id || '');
      const isTank2 = ['fortaleza', 'muralha_verde', 'imortalidade'].includes(p2.team.ability?.id || '');
      const isFastRec1 = p1.team.ability?.id === 'esperanca';
      const isFastRec2 = p2.team.ability?.id === 'esperanca';

      p1.vx *= isFastRec1 ? 0.9 : (isTank1 ? 0.82 : 0.5);
      p2.vx *= isFastRec2 ? 0.9 : (isTank2 ? 0.82 : 0.5);
    }

    // 2. Colisão Bola com as Traves e Travessão
    this.handleGoalCollisions(this.goalLeft, dt);
    this.handleGoalCollisions(this.goalRight, dt);

    // 3. Colisões de Jogadores com a Bola
    this.handlePlayerBallCollision(p1);
    this.handlePlayerBallCollision(p2);
  }

  private handleGoalCollisions(goal: Goal, dt: number) {
    const ball = this.ball;
    const postX = goal.postX;
    const crossY = goal.crossbarY;
    const postRadius = goal.postRadius; // 9px
    const ballRadius = ball.radius; // 20px
    const cornerRadius = postRadius + ballRadius; // 29px

    // 1. Quina frontal arredondada do travessão (postX, crossbarY)
    const cornerDx = ball.x - postX;
    const cornerDy = ball.y - crossY;
    const cornerDist = Math.sqrt(cornerDx * cornerDx + cornerDy * cornerDy);

    if (cornerDist < cornerRadius && cornerDist > 0.0001) {
      const nx = cornerDx / cornerDist;
      const ny = cornerDy / cornerDist;
      ball.x = postX + nx * (cornerRadius + 0.1);
      ball.y = crossY + ny * (cornerRadius + 0.1);

      const vn = ball.vx * nx + ball.vy * ny;
      if (vn < 0) {
        ball.vx -= 1.82 * vn * nx;
        ball.vy -= 1.82 * vn * ny;
        this.triggerPostHitFeedback(ball.x, crossY - 20, Math.abs(vn));
      }

      // Se a colisão ocorrer na metade superior da quina, aplica deflexão natural para fora
      const rollDir = goal.isLeft ? 1 : -1;
      if (ny < -0.2) {
        ball.vx += rollDir * 80;
      }
    }

    // 2. Travessão horizontal (segmento de reta com espessura)
    // O segmento termina ligeiramente antes da quina para que a quina circular frontal assuma a curvatura
    const barStartX = goal.isLeft ? 0 : postX + 4;
    const barEndX = goal.isLeft ? postX - 4 : 1280;

    const hitCrossbar = resolveCircleSegmentCollision(
      ball,
      barStartX,
      crossY,
      barEndX,
      crossY,
      0.82,
      postRadius
    );

    if (hitCrossbar) {
      this.triggerPostHitFeedback(ball.x, crossY - 20, Math.abs(ball.vy));
    }

    // 3. Força de dispersão e arredondamento virtual no topo do travessão (Anti-Equilíbrio e Anti-Stuck)
    // Na física real, uma bola esférica nunca fica em repouso estático sobre um cano cilíndrico
    const isOverGoalFrame = goal.isLeft
      ? (ball.x <= postX + 15)
      : (ball.x >= postX - 15);

    if (isOverGoalFrame && ball.y <= crossY + 2) {
      const rollDir = goal.isLeft ? 1 : -1;

      // Impulso de rolagem contínua para descer da trave
      ball.vx += rollDir * 320 * dt;

      // Garante velocidade horizontal mínima de saída da estrutura do gol
      if (rollDir === 1 && ball.vx < 110) {
        ball.vx = Math.max(ball.vx + 60, 110);
      } else if (rollDir === -1 && ball.vx > -110) {
        ball.vx = Math.min(ball.vx - 60, -110);
      }

      // Impede que o quique vertical decaia para repouso ou micro-vibrações
      if (Math.abs(ball.vy) < 85) {
        ball.vy = -Math.max(Math.abs(ball.vy), 95);
      }

      // Separação vertical garantida
      const safeTopY = crossY - cornerRadius - 1;
      if (ball.y > safeTopY) {
        ball.y = safeTopY;
      }

      this.consecutiveGoalHits++;
      this.goalHitWindowTimer = 0.5;
    }

    // 4. Proteção contra quina entre parede externa do estádio e a armação traseira do gol
    if (goal.isLeft && ball.x < 35 && ball.y <= crossY + 15) {
      ball.vx = Math.max(ball.vx, 160);
      ball.vy = Math.min(ball.vy, -80);
    } else if (!goal.isLeft && ball.x > 1245 && ball.y <= crossY + 15) {
      ball.vx = Math.min(ball.vx, -160);
      ball.vy = Math.min(ball.vy, -80);
    }
  }

  private triggerPostHitFeedback(x: number, y: number, impactSpeed: number) {
    this.consecutiveGoalHits++;
    this.goalHitWindowTimer = 0.5;

    const now = performance.now() / 1000;
    // Dispara som e tremor de tela somente após cooldown ou em pancadas expressivas
    if (now - this.lastPostSoundTime > 0.22 || impactSpeed > 170) {
      this.lastPostSoundTime = now;
      sound.playPost();
      this.renderer.triggerScreenShake(Math.min(8, Math.max(3, impactSpeed / 30)));
      if (impactSpeed > 90) {
        this.particles.showFloatingText(x, y, 'TRAVE!', '#facc15');
      }
    }
  }

  private checkAndResolveStuckBall(dt: number) {
    // Não monitora durante contagem regressiva, comemoração de gol, bola parada ou reposição
    if (this.state !== 'PLAYING' || this.isKickoffDropPhase) {
      this.ballStuckTimer = 0;
      this.consecutiveGoalHits = 0;
      return;
    }

    if (this.ballReleaseCooldown > 0) {
      this.ballReleaseCooldown -= dt;
    }

    if (this.goalHitWindowTimer > 0) {
      this.goalHitWindowTimer -= dt;
      if (this.goalHitWindowTimer <= 0) {
        this.consecutiveGoalHits = 0;
      }
    }

    const ball = this.ball;
    // Zonas de risco: proximidades do travessão e da armação superior das balizas
    const inLeftDanger = (ball.x <= this.goalLeft.postX + 35) && (ball.y <= this.goalLeft.crossbarY + 30);
    const inRightDanger = (ball.x >= this.goalRight.postX - 35) && (ball.y <= this.goalRight.crossbarY + 30);

    if (inLeftDanger || inRightDanger) {
      const dx = ball.x - this.ballStuckCheckX;
      const dy = ball.y - this.ballStuckCheckY;
      const displacement = Math.sqrt(dx * dx + dy * dy);

      // Se a bola se deslocou menos de 22px nesta janela de tempo
      if (displacement < 22) {
        this.ballStuckTimer += dt;
      } else {
        this.ballStuckTimer = Math.max(0, this.ballStuckTimer - dt * 1.5);
        this.ballStuckCheckX = ball.x;
        this.ballStuckCheckY = ball.y;
      }

      // Condição de bola presa:
      // Mais de 0.60s confinada OU mais de 5 micro-colisões com deslocamento nulo
      const isStuck = (this.ballStuckTimer >= 0.60) || (this.consecutiveGoalHits >= 5 && this.ballStuckTimer >= 0.30);

      if (isStuck && this.ballReleaseCooldown <= 0) {
        this.releaseStuckBall(inLeftDanger ? 'left' : 'right');
      }
    } else {
      // Bola jogada normalmente pelo campo
      this.ballStuckTimer = 0;
      this.ballStuckCheckX = ball.x;
      this.ballStuckCheckY = ball.y;
    }
  }

  private releaseStuckBall(side: 'left' | 'right') {
    const ball = this.ball;
    const isLeft = side === 'left';
    const goal = isLeft ? this.goalLeft : this.goalRight;

    // 1. Posição válida e segura dentro do campo jogável (à frente da linha de meta)
    let targetX = isLeft ? goal.postX + 48 : goal.postX - 48; // ~158 ou ~1122
    const targetY = goal.crossbarY - 32; // 358px (acima da trave, em posição arejada)

    // 2. Não posiciona a bola dentro do corpo de um jogador
    const obstaclePlayer = isLeft ? this.p1 : this.p2;
    if (Math.abs(obstaclePlayer.x - targetX) < 48) {
      targetX += isLeft ? 45 : -45;
    }

    // 3. Aplica coordenadas sem modificar o placar
    ball.x = targetX;
    ball.y = targetY;
    ball.isSuper = false;

    // 4. Velocidade dinâmica natural de rebote (arco em direção ao centro do campo)
    const pushDir = isLeft ? 1 : -1;
    ball.vx = pushDir * (230 + Math.random() * 40);
    ball.vy = -180 - Math.random() * 30; // Arco que sobe e desce fluidamente pela gravidade
    ball.angularVelocity = pushDir * 6;

    // 5. Reinicia medições e concede breve imunidade contra reincidência
    this.ballStuckTimer = 0;
    this.consecutiveGoalHits = 0;
    this.ballStuckCheckX = ball.x;
    this.ballStuckCheckY = ball.y;
    this.ballReleaseCooldown = 0.55;

    // 6. Efeito audiovisual esportivo e feedback
    sound.playPost();
    this.renderer.triggerScreenShake(4);
    this.particles.addTurfDust(ball.x, goal.crossbarY);
    this.particles.showFloatingText(ball.x, ball.y - 25, '⚽ BOLA EM JOGO!', '#22c55e');
  }

  private handlePlayerBallCollision(p: Player) {
    const ball = this.ball;
    const head = p.getHeadPos();

    // 1. CHUTE COM O PÉ (Prioridade máxima de ação voluntária)
    // Se o jogador estiver em animação de chute e ainda não atingiu a bola neste movimento
    if (p.isKicking && !p.hasHitBallThisKick) {
      const isBallInStrikeZone = p.canStrikeBall(ball.x, ball.y, ball.radius);

      if (isBallInStrikeZone) {
        const foot = p.getFootPos();
        const isSuper = p.canSuperKick() || (p.superMeter <= 0 && p.kickProgress < 0.5);
        const charge = p.lastReleasedCharge; // 0.0 (toque rápido) a 1.0 (carga máxima)

        // Potência do chute claramente superior a passes comuns (780 base rápida a 1040 carga total)
        const basePower = 780 + charge * 260;
        let kickPower = isSuper ? 1160 + charge * 120 : basePower;

        // Bônus de habilidades de chute
        if (p.team.ability?.id === 'canhao' || p.team.ability?.id === 'colorado') {
          kickPower = isSuper ? 1280 : basePower * 1.18 + 40;
          this.particles.showFloatingText(foot.x, foot.y - 30, p.team.ability.id === 'canhao' ? 'CANHÃO! 💣' : 'COLORADO! 💥', '#dc2626');
        } else if (p.team.ability?.id === 'raio_solar' && charge > 0.35) {
          kickPower = isSuper ? 1280 : basePower * 1.25 + 50;
          this.particles.showFloatingText(foot.x, foot.y - 30, 'RAIO SOLAR! ☀️', '#eab308');
        } else if (p.team.ability?.id === 'falcao') {
          kickPower = isSuper ? 1200 : basePower * 1.10 + 20;
        }

        // Ângulo de chute: rápida sobe em arco expressivo (0.72 rad / ~41°), carregada afina em laser (0.54 rad / ~31°)
        const dynamicElevation = 0.72 - charge * 0.18;
        let kickAngle = (p.facing === 1 ? dynamicElevation : Math.PI - dynamicElevation);

        // Habilidade ESTRELA / CONSTELAÇÃO (mira direcionada ao ângulo do gol)
        if (p.team.ability?.id === 'estrela' || p.team.ability?.id === 'constelacao') {
          const targetX = p.facing === 1 ? this.goalRight.postX : this.goalLeft.postX;
          const targetY = this.goalRight.crossbarY + 28;
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          let precisionAngle = Math.atan2(-dy, Math.abs(dx));
          precisionAngle = clamp(precisionAngle, 0.45, 0.82);
          kickAngle = p.facing === 1 ? precisionAngle : Math.PI - precisionAngle;
          this.particles.showFloatingText(
            foot.x,
            foot.y - 30,
            p.team.ability.id === 'constelacao' ? 'CONSTELAÇÃO! ✨' : 'MIRA ESTRELA! ⭐',
            '#ffffff'
          );
        }

        ball.applyKick(kickAngle, kickPower, isSuper, p.id);
        p.hasHitBallThisKick = true;
        p.kickedCooldownTimer = 0.22; // Impede que o próprio tronco anule o chute no mesmo frame
        p.superMeter = Math.min(p.maxSuperMeter, p.superMeter + 14);

        // Feedback visual e sonoro vibrante
        this.particles.addKickShockwave(foot.x, foot.y, p.facing, isSuper);
        const sparkColor = isSuper ? '#f97316' : (charge > 0.6 ? '#ef4444' : '#facc15');
        this.particles.addKickSpark(foot.x, foot.y, sparkColor, isSuper ? 24 : Math.round(12 + charge * 12));
        if (ball.y >= this.groundY - 35) {
          this.particles.addTurfDust(ball.x, this.groundY);
        }
        this.renderer.triggerScreenShake(isSuper ? 14 : 5 + charge * 6);

        // Reseta carga aplicada
        p.lastReleasedCharge = 0;

        if (p.id === 'p1') {
          this.stats.p1Shots++;
          if (isSuper) {
            this.particles.showFloatingText(foot.x, foot.y - 30, 'SUPER CHUTE! 🔥', '#f97316');
          } else if (charge > 0.75) {
            this.particles.showFloatingText(foot.x, foot.y - 25, 'BOMBA! ⚡', '#ef4444');
          } else {
            this.particles.showFloatingText(foot.x, foot.y - 25, 'CHUTE! ⚽', '#facc15');
          }
        } else {
          this.stats.p2Shots++;
          if (isSuper) {
            this.particles.showFloatingText(foot.x, foot.y - 30, 'SUPER CHUTE! 🔥', '#f97316');
          } else if (charge > 0.75) {
            this.particles.showFloatingText(foot.x, foot.y - 25, 'BOMBA IA! ⚡', '#f87171');
          }
        }

        // Interrompe processamento de colisão para o chutador neste ciclo
        return;
      }
    }

    // Se o jogador acabou de desferir um chute, seu próprio corpo não reabsorve a bola
    if (ball.lastHitBy === p.id && p.kickedCooldownTimer > 0) {
      return;
    }

    // 2. CABEÇA / CABECEIO (Defensivo ou Ofensivo)
    const dHeadSq = distSq(ball.x, ball.y, head.x, head.y);
    const minHeadDist = head.radius + ball.radius;

    if (dHeadSq < minHeadDist * minHeadDist) {
      const isOpponentShot = ball.isKicked && ball.lastHitBy !== p.id;
      // Regra de elevação: Se o chute adversário está subindo alto por cima do topo da cabeça e o defensor NÃO pulou,
      // a bola encobre o defensor legitimamente sem ser interceptada por magnetismo
      const isBallSailingOver = ball.y + ball.radius * 0.4 < head.y && ball.vy < -80;

      if (isOpponentShot && p.isGrounded && isBallSailingOver) {
        // Bola encobre o defensor no chão, continua sua trajetória em direção ao gol
      } else {
        const d = Math.sqrt(dHeadSq);
        const nx = (ball.x - head.x) / d;
        const ny = (ball.y - head.y) / d;

        // Afasta para fora da cabeça
        const overlap = minHeadDist - d;
        ball.x += nx * overlap;
        ball.y += ny * overlap;

        // Impulso base de cabeceio calibrado
        let forwardBoost = p.facing * 110;
        let jumpBoost = p.vy < 0 ? -130 : -20;
        let headerPower = 320;
        let playerSpeedTransfer = p.vx * 0.35;

        // Habilidade MURALHA (Cruz de Prata) / GALO DE AÇO (Atlético das Gerais)
        if (p.team.ability?.id === 'muralha') {
          forwardBoost = p.facing * 160;
          jumpBoost = p.vy < 0 ? -170 : -40;
          headerPower = 390;
          playerSpeedTransfer = p.vx * 0.45;
          this.particles.showFloatingText(head.x, head.y - 25, 'MURALHA AÉREA! 🛡️', '#cbd5e1');
        } else if (p.team.ability?.id === 'galo_de_aco') {
          forwardBoost = p.facing * 170;
          jumpBoost = p.vy < 0 ? -180 : -45;
          headerPower = 405;
          playerSpeedTransfer = p.vx * 0.48;
          this.particles.showFloatingText(head.x, head.y - 25, 'GALO DE AÇO! 🐓', '#facc15');
        } else if (p.team.ability?.id === 'falcao') {
          forwardBoost = p.facing * 130;
          headerPower = 345;
          playerSpeedTransfer = p.vx * 0.38;
        }

        // Se foi um bloqueio de chute adversário com cabeceio, registra defesa/salvamento
        if (isOpponentShot) {
          ball.isKicked = false;
          if (p.id === 'p1') {
            this.stats.p1Saves++;
            this.particles.showFloatingText(head.x, head.y - 25, 'DEFESA! 🧤', '#38bdf8');
          } else {
            this.stats.p2Saves++;
            this.particles.showFloatingText(head.x, head.y - 25, 'BLOQUEIO! 🛡️', '#f87171');
          }
          this.particles.addBlockSparks(ball.x, ball.y);
          this.renderer.triggerScreenShake(7);
        }

        ball.vx = nx * headerPower + forwardBoost + playerSpeedTransfer;
        ball.vy = ny * headerPower + jumpBoost;
        ball.angularVelocity = p.facing * 14;
        ball.lastHitBy = p.id;

        p.superMeter = Math.min(p.maxSuperMeter, p.superMeter + 10);
        sound.playHeader();
        this.particles.addKickSpark(ball.x, ball.y, '#ffffff', 8);

        if (p.id === 'p1') {
          this.stats.p1Headers++;
          this.stats.p1Shots++;
        } else {
          this.stats.p2Headers++;
          this.stats.p2Shots++;
        }

        return;
      }
    }

    // 3. CONTATO DO TRONCO COM A BOLA (Empurrão, amortecimento ou bloqueio corporal)
    const bodyX = p.x;
    const bodyY = p.y - 25;
    const bodyRadius = 26;
    const dBodySq = distSq(ball.x, ball.y, bodyX, bodyY);
    const minBodyDist = bodyRadius + ball.radius;

    if (dBodySq < minBodyDist * minBodyDist) {
      const d = Math.sqrt(dBodySq);
      const nx = (ball.x - bodyX) / d;
      const ny = (ball.y - bodyY) / d;

      const isOpponentShot = ball.isKicked && ball.lastHitBy !== p.id;

      // Bloqueio de chute potente com o peito/tronco: rebote elástico defensivo
      if (isOpponentShot) {
        ball.x = bodyX + nx * minBodyDist;
        ball.y = bodyY + ny * minBodyDist;
        ball.vx = -ball.vx * 0.45 + p.vx * 0.4;
        ball.vy = -Math.abs(ball.vy) * 0.35 - 120;
        ball.isKicked = false;
        ball.lastHitBy = p.id;

        if (p.id === 'p1') {
          this.stats.p1Saves++;
          this.particles.showFloatingText(p.x, p.y - 35, 'DEFESA! 🧤', '#38bdf8');
        } else {
          this.stats.p2Saves++;
          this.particles.showFloatingText(p.x, p.y - 35, 'BLOQUEIO! 🛡️', '#f87171');
        }
        this.particles.addBlockSparks(ball.x, ball.y);
        sound.playKick(0.6);
        return;
      }

      // Habilidade MAESTRO / ESQUADRÃO: amortece a bola suavemente para os pés
      const isBallMaster = p.team.ability?.id === 'maestro' || p.team.ability?.id === 'esquadrao';
      if (isBallMaster && !p.isKicking) {
        ball.x = bodyX + nx * minBodyDist;
        ball.y = bodyY + ny * minBodyDist;
        ball.vx = p.facing * 85 + p.vx * 0.2;
        ball.vy = Math.min(ball.vy * 0.25, 20);
        ball.lastHitBy = p.id;
        this.particles.showFloatingText(
          p.x,
          p.y - 45,
          p.team.ability.id === 'esquadrao' ? 'ESQUADRÃO! 🛡️' : 'DOMÍNIO MAESTRO! 🎵',
          '#059669'
        );
      } else {
        ball.x = bodyX + nx * minBodyDist;
        ball.y = bodyY + ny * minBodyDist;
        ball.vx = nx * 240 + p.vx * 0.8;
        ball.vy = ny * 160;
        ball.lastHitBy = p.id;
      }
    }
  }

  private checkGoals() {
    // 1. Gol do Jogador 1 (bola entra no gol direito do adversário)
    if (this.goalRight.checkGoal(this.ball)) {
      this.stats.p1Goals++;
      this.lastScorer = 'p1';
      this.onScoreChange?.(this.stats.p1Goals, this.stats.p2Goals);
      this.triggerGoalCelebration('p1');
      return;
    }

    // 2. Gol do Jogador 2 / Adversário (bola entra no gol esquerdo do P1)
    if (this.goalLeft.checkGoal(this.ball)) {
      this.stats.p2Goals++;
      this.lastScorer = 'p2';
      this.onScoreChange?.(this.stats.p1Goals, this.stats.p2Goals);
      this.triggerGoalCelebration('p2');
      return;
    }
  }

  private triggerGoalCelebration(scorer: 'p1' | 'p2') {
    this.state = 'GOAL_CELEBRATION';
    this.goalCelebrationTimer = 2.6;

    sound.playGoal();
    sound.playWhistle(true);
    this.renderer.triggerScreenShake(14);

    const goalX = scorer === 'p1' ? this.goalRight.postX : this.goalLeft.postX;
    this.particles.addConfettiBurst(goalX, 480, 90);

    const scorerPlayer = scorer === 'p1' ? this.p1 : this.p2;
    scorerPlayer.celebrate();

    const bannerText = this.isGoldenGoalActive
      ? `⚡ GOL DE OURO! ${scorer === 'p1' ? this.p1.team.name.toUpperCase() : this.p2.team.name.toUpperCase()} VENCE! ⚡`
      : (scorer === 'p1' ? `GOL DE ${this.p1.team.name.toUpperCase()}!` : `GOL DE ${this.p2.team.name.toUpperCase()}!`);

    this.particles.showFloatingText(
      640,
      320,
      this.isGoldenGoalActive ? '⚡ GOL DE OURO! ⚡' : '⚽ GOOOOL! ⚽',
      '#facc15'
    );

    this.onGoalScored?.(scorer, bannerText);
    this.onStateChange?.(this.state);
  }

  public resetPositionsForKickoff() {
    // Bola é colocada no alto descendo em direção ao campo
    this.ball.reset(640, 220, 80);
    this.p1.reset(360, 1);
    this.p2.reset(920, -1);

    // Ativa a fase de disputa temporariamente congelada
    this.isKickoffDropPhase = true;
    this.kickoffSafetyTimer = 3.5; // Limite máximo de segurança caso a bola não toque o solo

    // Reinicia rastreadores de monitoramento de bola presa
    this.ballStuckTimer = 0;
    this.ballStuckCheckX = 640;
    this.ballStuckCheckY = 220;
    this.consecutiveGoalHits = 0;
    this.goalHitWindowTimer = 0;
    this.ballReleaseCooldown = 0;
  }

  private finishMatch() {
    this.state = 'GAME_OVER';
    sound.playWhistle(true);

    let winner: 'p1' | 'p2' | 'draw' = 'draw';
    if (this.isGoldenGoalActive) {
      // REGRA UNIVERSAL DO GOL DE OURO: quem marcou na prorrogação vence imediatamente
      winner = this.lastScorer === 'p1' ? 'p1' : 'p2';
    } else {
      if (this.stats.p1Goals > this.stats.p2Goals) {
        winner = 'p1';
      } else if (this.stats.p2Goals > this.stats.p1Goals) {
        winner = 'p2';
      }
    }

    this.onStateChange?.(this.state);
    this.onMatchEnd?.(winner, this.stats);
  }

  private render(timeSec: number) {
    const trajectoryPoints = this.p1.isChargingKick ? this.getKickTrajectory(this.p1) : undefined;

    this.renderer.render(
      this.ball,
      this.p1,
      this.p2,
      this.goalLeft,
      this.goalRight,
      this.particles,
      timeSec,
      trajectoryPoints,
      this.isKickoffDropPhase
    );
  }

  // Teclado para testes no computador e desktop com suporte a carregar e soltar chute
  private setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      this.handleKeyDown(e.key);
    });

    window.addEventListener('keyup', (e) => {
      this.handleKeyUp(e.key);
    });

    window.addEventListener('blur', () => {
      this.input.left = false;
      this.input.right = false;
      this.input.jump = false;
      this.input.kick = false;
      this.input.superKick = false;
      this.cancelChargingKick('p1');
    });

    window.addEventListener('resize', this.handleResize);
  }

  private handleKeyDown(key: string) {
    const k = key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') {
      this.input.left = true;
    } else if (k === 'arrowright' || k === 'd') {
      this.input.right = true;
    } else if (k === 'arrowup' || k === 'w' || k === ' ') {
      this.input.jump = true;
    } else if (k === 'x' || k === 'k' || k === 'enter') {
      if (!this.input.kick) {
        this.input.kick = true;
        this.startChargingKick('p1');
      }
    } else if (k === 's' || k === 'arrowdown' || k === 'l') {
      this.input.superKick = true;
    } else if (k === 'escape' || k === 'p') {
      if (this.state === 'PLAYING') this.pause();
      else if (this.state === 'PAUSED') this.resume();
    }
  }

  private handleKeyUp(key: string) {
    const k = key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') {
      this.input.left = false;
    } else if (k === 'arrowright' || k === 'd') {
      this.input.right = false;
    } else if (k === 'arrowup' || k === 'w' || k === ' ') {
      this.input.jump = false;
    } else if (k === 'x' || k === 'k' || k === 'enter') {
      if (this.input.kick) {
        this.input.kick = false;
        this.releaseKick('p1');
      }
    } else if (k === 's' || k === 'arrowdown' || k === 'l') {
      this.input.superKick = false;
    }
  }

  public handleResize = () => {
    // Redimensiona o canvas para preencher com resolução nítida
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = this.virtualWidth * dpr;
    this.canvas.height = this.virtualHeight * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  };

  public destroy() {
    this.stopLoop();
    window.removeEventListener('resize', this.handleResize);
  }
}
