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

  public restart() {
    this.startMatch();
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
      this.onTimeChange?.(Math.max(0, currentSeconds));
    }

    // Fim do tempo
    if (this.matchTime <= 0) {
      this.matchTime = 0;
      this.finishMatch();
      return;
    }

    // Atualiza Jogador 1 (Humano)
    this.handlePlayerInput();
    this.p1.update(dt, this.groundY, this.ball);

    // Atualiza Jogador 2 (Inteligência Artificial) com respeito estrito à fase de reposição
    this.ai.update(dt, this.p2, this.ball, this.isKickoffDropPhase);
    this.p2.update(dt, this.groundY, this.ball);

    // Atualiza Bola
    this.ball.update(dt, this.groundY, 0, this.virtualWidth, 30);

    // Efeito de fogo para o super chute
    if (this.ball.isSuper) {
      this.particles.addFireTrail(this.ball.x, this.ball.y);
    }

    // Resolução de Colisões Físicas
    this.handleCollisions();

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

    // Potência proporcional ao carregamento
    const basePower = 520 + charge * 290;
    let kickPower = isSuper ? 880 + charge * 120 : basePower;

    // Habilidade CANHÃO (Rubro Imperial)
    if (p.team.ability?.id === 'canhao') {
      kickPower = isSuper ? 1000 : basePower * 1.18 + 50;
    } else if (p.team.ability?.id === 'falcao') {
      kickPower = isSuper ? 920 : basePower * 1.08 + 20;
    }

    // Ângulo de chute
    let kickAngle = (p.facing === 1 ? 0.65 : Math.PI - 0.65);

    // Habilidade ESTRELA (Estrela Alvinegra): mira refinada ao canto do gol
    if (p.team.ability?.id === 'estrela') {
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

  private handleCollisions() {
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

      // Habilidade FORTALEZA: sofre menos perda de velocidade/empurrão na colisão física
      p1.vx *= (p1.team.ability?.id === 'fortaleza' ? 0.78 : 0.5);
      p2.vx *= (p2.team.ability?.id === 'fortaleza' ? 0.78 : 0.5);
    }

    // 2. Colisão Bola com as Traves e Travessão
    this.handleGoalCollisions(this.goalLeft);
    this.handleGoalCollisions(this.goalRight);

    // 3. Colisões de Jogadores com a Bola
    this.handlePlayerBallCollision(p1);
    this.handlePlayerBallCollision(p2);
  }

  private handleGoalCollisions(goal: Goal) {
    const ball = this.ball;

    // Travessão horizontal (segmento de reta com espessura)
    const barStartX = goal.isLeft ? goal.postX - goal.depth : goal.postX;
    const barEndX = goal.isLeft ? goal.postX : goal.postX + goal.depth;

    const hitCrossbar = resolveCircleSegmentCollision(
      ball,
      barStartX,
      goal.crossbarY,
      barEndX,
      goal.crossbarY,
      0.82,
      7
    );

    if (hitCrossbar) {
      sound.playPost();
      this.renderer.triggerScreenShake(7);
      this.particles.showFloatingText(ball.x, goal.crossbarY - 20, 'TRAVE!', '#facc15');
    }

    // Quina frontal arredondada do travessão (postX, crossbarY)
    const cornerDx = ball.x - goal.postX;
    const cornerDy = ball.y - goal.crossbarY;
    const cornerDist = Math.sqrt(cornerDx * cornerDx + cornerDy * cornerDy);
    const cornerRadius = goal.postRadius + ball.radius;

    if (cornerDist < cornerRadius && cornerDist > 0.001) {
      const nx = cornerDx / cornerDist;
      const ny = cornerDy / cornerDist;
      ball.x = goal.postX + nx * cornerRadius;
      ball.y = goal.crossbarY + ny * cornerRadius;

      const vn = ball.vx * nx + ball.vy * ny;
      if (vn < 0) {
        ball.vx -= 1.8 * vn * nx;
        ball.vy -= 1.8 * vn * ny;
        sound.playPost();
        this.renderer.triggerScreenShake(8);
      }
    }
  }

  private handlePlayerBallCollision(p: Player) {
    const ball = this.ball;
    const head = p.getHeadPos();

    // A) Colisão da Cabeça com a Bola (Cabeceio)
    const dHeadSq = distSq(ball.x, ball.y, head.x, head.y);
    const minHeadDist = head.radius + ball.radius;

    if (dHeadSq < minHeadDist * minHeadDist) {
      const d = Math.sqrt(dHeadSq);
      const nx = (ball.x - head.x) / d;
      const ny = (ball.y - head.y) / d;

      // Afasta para fora
      const overlap = minHeadDist - d;
      ball.x += nx * overlap;
      ball.y += ny * overlap;

      // Impulso base de cabeceio calibrado (evita disparos aéreos indefensáveis a partir do meio-campo)
      let forwardBoost = p.facing * 95;
      let jumpBoost = p.vy < 0 ? -110 : 0;
      let headerPower = 295;
      let playerSpeedTransfer = p.vx * 0.32;

      // Habilidade MURALHA (Cruz de Prata): cabeceios mais potentes e impositivos
      if (p.team.ability?.id === 'muralha') {
        forwardBoost = p.facing * 140;
        jumpBoost = p.vy < 0 ? -150 : -25;
        headerPower = 370;
        playerSpeedTransfer = p.vx * 0.45;
        this.particles.showFloatingText(head.x, head.y - 25, 'MURALHA AÉREA! 🛡️', '#cbd5e1');
      } else if (p.team.ability?.id === 'falcao') {
        forwardBoost = p.facing * 115;
        headerPower = 325;
        playerSpeedTransfer = p.vx * 0.38;
      }

      ball.vx = nx * headerPower + forwardBoost + playerSpeedTransfer;
      ball.vy = ny * headerPower + jumpBoost;
      ball.angularVelocity = p.facing * 12;
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
    }

    // B) Chute com o Pé (durante a animação de chute com força acumulada)
    if (p.isKicking && p.kickProgress > 0.1 && p.kickProgress < 0.85) {
      const foot = p.getFootPos();
      const footHitRadius = 40;
      const dFootSq = distSq(ball.x, ball.y, foot.x, foot.y);

      if (dFootSq < (footHitRadius + ball.radius) * (footHitRadius + ball.radius)) {
        const isSuper = p.superMeter <= 0 && p.kickProgress < 0.5;
        let kickAngle = (p.facing === 1 ? 0.65 : Math.PI - 0.65);

        // Aplica a força acumulada (lastReleasedCharge de 0 a 1)
        const charge = p.lastReleasedCharge;
        const basePower = 520 + charge * 290;
        let kickPower = isSuper ? 880 + charge * 120 : basePower;

        // Habilidade CANHÃO (Rubro Imperial): chute mais potente
        if (p.team.ability?.id === 'canhao') {
          kickPower = isSuper ? 1000 : basePower * 1.18 + 50;
          this.particles.showFloatingText(foot.x, foot.y - 30, 'CANHÃO! 💣', '#dc2626');
        } else if (p.team.ability?.id === 'falcao') {
          kickPower = isSuper ? 920 : basePower * 1.08 + 20;
        }

        // Habilidade ESTRELA (Estrela Alvinegra): precisão refinada em direção ao canto do gol
        if (p.team.ability?.id === 'estrela') {
          const targetX = p.facing === 1 ? this.goalRight.postX : this.goalLeft.postX;
          const targetY = this.goalRight.crossbarY + 28;
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          let precisionAngle = Math.atan2(-dy, Math.abs(dx));
          precisionAngle = clamp(precisionAngle, 0.45, 0.82);
          kickAngle = p.facing === 1 ? precisionAngle : Math.PI - precisionAngle;
          this.particles.showFloatingText(foot.x, foot.y - 30, 'MIRA ESTRELA! ⭐', '#ffffff');
        }

        ball.applyKick(kickAngle, kickPower, isSuper, p.id);
        p.superMeter = Math.min(p.maxSuperMeter, p.superMeter + 14);

        const sparkColor = isSuper ? '#f97316' : (charge > 0.6 ? '#ef4444' : '#facc15');
        this.particles.addKickSpark(foot.x, foot.y, sparkColor, isSuper ? 24 : Math.round(10 + charge * 10));
        this.renderer.triggerScreenShake(isSuper ? 12 : 4 + charge * 5);

        // Reseta carga após o impacto ser transmitido à bola
        p.lastReleasedCharge = 0;

        if (p.id === 'p1') {
          this.stats.p1Shots++;
          if (isSuper) {
            this.particles.showFloatingText(foot.x, foot.y - 30, 'SUPER CHUTE! 🔥', '#f97316');
          } else if (charge > 0.8) {
            this.particles.showFloatingText(foot.x, foot.y - 25, 'BOMBA! ⚡', '#ef4444');
          }
        } else {
          this.stats.p2Shots++;
        }
      }
    }

    // C) Contato do Tronco com a Bola (empurrão e domínio de bola)
    const bodyX = p.x;
    const bodyY = p.y - 25;
    const bodyRadius = 26;
    const dBodySq = distSq(ball.x, ball.y, bodyX, bodyY);
    const minBodyDist = bodyRadius + ball.radius;

    if (dBodySq < minBodyDist * minBodyDist) {
      const d = Math.sqrt(dBodySq);
      const nx = (ball.x - bodyX) / d;
      const ny = (ball.y - bodyY) / d;

      // Habilidade MAESTRO (Tricolor das Laranjeiras): amortece a bola para os pés suavemente
      if (p.team.ability?.id === 'maestro' && !p.isKicking) {
        ball.x = bodyX + nx * minBodyDist;
        ball.y = bodyY + ny * minBodyDist;
        ball.vx = p.facing * 75 + p.vx * 0.2;
        ball.vy = Math.min(ball.vy * 0.25, 25);
        ball.lastHitBy = p.id;
        this.particles.showFloatingText(p.x, p.y - 45, 'DOMÍNIO MAESTRO! 🎵', '#059669');
      } else {
        ball.x = bodyX + nx * minBodyDist;
        ball.y = bodyY + ny * minBodyDist;
        ball.vx = nx * 220 + p.vx * 0.8;
        ball.vy = ny * 180;
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

    const bannerText = scorer === 'p1' ? `GOL DE ${this.p1.team.name.toUpperCase()}!` : `GOL DE ${this.p2.team.name.toUpperCase()}!`;
    this.particles.showFloatingText(640, 320, '⚽ GOOOOL! ⚽', '#facc15');

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
  }

  private finishMatch() {
    this.state = 'GAME_OVER';
    sound.playWhistle(true);

    let winner: 'p1' | 'p2' | 'draw' = 'draw';
    if (this.stats.p1Goals > this.stats.p2Goals) {
      winner = 'p1';
    } else if (this.stats.p2Goals > this.stats.p1Goals) {
      winner = 'p2';
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
