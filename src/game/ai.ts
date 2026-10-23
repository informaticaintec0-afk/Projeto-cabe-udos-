/**
 * Inteligência Artificial para o Adversário no Modo 1 contra 1
 * Utiliza a mesma mecânica física de chute e salto disponível para o jogador humano.
 * Reconhece oportunidades reais de finalização ao gol, ângulo, cobertura do goleiro,
 * disputas de meio-campo e alívio defensivo, com calibração por nível de dificuldade.
 */

import { Player, Ball } from './entities';
import { AIDifficulty } from './types';
import { predictBallTrajectory, BallTrajectoryForecast, clamp } from './physics';

export class SoccerAI {
  public difficulty: AIDifficulty;
  private thinkTimer: number = 0;
  private thinkInterval: number = 0.04; // 25 decisões por segundo para resposta ágil e suave
  private currentMoveDir: number = 0;
  private shouldJump: boolean = false;
  private shouldKick: boolean = false;
  private kickChargeIntensity: number = 0.3;

  constructor(difficulty: AIDifficulty = 'medio') {
    this.difficulty = difficulty;
  }

  public setDifficulty(diff: AIDifficulty) {
    this.difficulty = diff;
  }

  public update(
    dt: number,
    aiPlayer: Player,
    ball: Ball,
    opponentPlayer: Player,
    isKickoffDropPhase: boolean = false
  ) {
    // 1. Fase de Reposição Inicial (bola caindo do alto até o primeiro toque no chão):
    // Congelamento estrito para paridade absoluta com o jogador humano.
    if (isKickoffDropPhase) {
      this.currentMoveDir = 0;
      this.shouldJump = false;
      this.shouldKick = false;
      aiPlayer.vx = 0;
      aiPlayer.cancelChargingKick();
      return;
    }

    this.thinkTimer += dt;
    if (this.thinkTimer >= this.thinkInterval) {
      this.thinkTimer = 0;
      this.decide(aiPlayer, ball, opponentPlayer);
    }

    // 2. Execução das movimentações decididas
    if (this.currentMoveDir !== 0) {
      aiPlayer.move(this.currentMoveDir);
    }

    if (this.shouldJump) {
      aiPlayer.jump();
      this.shouldJump = false;
    }

    // 3. Execução do Chute com a mesma mecânica do humano
    if (this.shouldKick) {
      // Disparo de Super Chute se disponível e em situação ofensiva
      if (this.difficulty !== 'facil' && aiPlayer.canSuperKick() && Math.random() < 0.85) {
        aiPlayer.triggerSuperKick();
      } else {
        // Aplica a intensidade calculada na decisão tática
        aiPlayer.lastReleasedCharge = this.kickChargeIntensity;
        aiPlayer.kick();
      }
      this.shouldKick = false;
    }
  }

  private decide(ai: Player, ball: Ball, opponent: Player) {
    // Calibração de latência perceptiva e precisão baseadas na dificuldade
    let reactionChance = 0.92;
    let timingForgiveness = 0.04;
    let errorNoise = 0;

    if (this.difficulty === 'facil') {
      reactionChance = 0.72;
      timingForgiveness = 0.10;
      errorNoise = (Math.random() - 0.5) * 45;
    } else if (this.difficulty === 'dificil') {
      reactionChance = 0.99;
      timingForgiveness = 0.015;
      errorNoise = (Math.random() - 0.5) * 6;
    }

    if (Math.random() > reactionChance) {
      return; // Latência natural
    }

    // Identificação dinâmica da meta adversária e própria (suporta P2 ou P1 como IA em qualquer metade)
    const forwardDir = ai.facing; // 1 (olha direita, ataca gol direito) ou -1 (olha esquerda, ataca gol esquerdo)
    const targetGoalX = forwardDir === 1 ? 1170 : 110;
    const ownGoalX = forwardDir === 1 ? 110 : 1170;
    const midX = 640;

    // Limite territorial da IA na linha central
    const aiMidfieldLimitX = ai.side === 'left' ? ai.maxX : ai.minX;
    const isBallInAiHalf = ai.side === 'left' ? ball.x <= midX : ball.x >= midX;
    const isBallInOpponentHalf = !isBallInAiHalf;
    const distToMidfieldLimit = Math.abs(ai.x - aiMidfieldLimitX);
    const isAiNearMidfieldLimit = distToMidfieldLimit <= 20;

    const distToTargetGoal = Math.abs(targetGoalX - ai.x);
    const distToOwnGoal = Math.abs(ownGoalX - ai.x);

    // Relação espacial com a bola
    const ballRelativeX = (ball.x - ai.x) * forwardDir; // > 0 se a bola está à frente em direção ao gol adversário
    const isBallInFront = ballRelativeX > -15;
    const distToBall = Math.abs(ball.x - ai.x);
    const ballHeight = ball.y; // 570 no chão, 390 na trave
    const isBallOnGroundOrWaist = ballHeight >= 400; // bola em altura de chute

    // Previsão balística em tempo real da trajetória da bola
    const forecast: BallTrajectoryForecast = predictBallTrajectory(ball, ai.x, 590, 1.8);
    const aiHead = ai.getHeadPos();
    const kickStrikeRange = this.difficulty === 'dificil' ? 100 : 90;

    // Distância do goleiro adversário até a meta que defende
    const opponentDistToOwnGoal = Math.abs(targetGoalX - opponent.x);
    const isOpponentOutOfPosition = opponentDistToOwnGoal > 240;

    // =========================================================================
    // SITUAÇÃO 1: OPORTUNIDADE DE FINALIZAÇÃO AO GOL (Ataque / Chute)
    // Se a bola está em posse ou acessível na frente da IA, com ângulo para o gol
    // =========================================================================
    const isInShootingZone = distToTargetGoal < 840;

    if (isInShootingZone && isBallInFront && distToBall <= kickStrikeRange + 15) {
      if (isBallOnGroundOrWaist) {
        // NÃO PULA! A IA fica no chão para chutar com o pé
        this.shouldJump = false;
        this.shouldKick = true;

        // Calibra a força e o ângulo do chute baseado na distância do gol
        if (distToTargetGoal > 480) {
          // Chute de média/longa distância: bomba potente
          this.kickChargeIntensity = this.difficulty === 'dificil' ? 0.85 : (this.difficulty === 'medio' ? 0.65 : 0.40);
        } else if (isOpponentOutOfPosition) {
          // Goleiro adiantado: chute colocado com curva
          this.kickChargeIntensity = 0.50;
        } else {
          // Chute de perto: finalização rápida e elevada
          this.kickChargeIntensity = this.difficulty === 'dificil' ? 0.40 : 0.25;
        }

        // Não avança se já estiver no limite do meio-campo
        if (isAiNearMidfieldLimit) {
          this.currentMoveDir = 0;
        } else {
          this.currentMoveDir = forwardDir * 0.7;
        }
        return;
      } else if (ballHeight < 420 && ballHeight > 340 && distToBall < 85) {
        // Bola alta no ataque: cabeceio ofensivo ao gol
        // Pula apenas se a bola estiver na própria metade ou vindo de encontro, evitando pular na linha
        if (!isAiNearMidfieldLimit || isBallInAiHalf) {
          this.shouldJump = true;
          this.currentMoveDir = isAiNearMidfieldLimit ? 0 : forwardDir;
          return;
        }
      }
    }

    // =========================================================================
    // SITUAÇÃO 2: DEFESA ATIVA DE GOL (Ameaça iminente à meta própria)
    // =========================================================================
    const isHeadingTowardsOwnGoal = (forwardDir === 1 ? ball.vx < -70 : ball.vx > 70);
    const isDeepInDefense = distToOwnGoal < 380;
    const isThreat = (forwardDir === -1 ? forecast.threatToRightGoal : (ball.x <= 220 && isHeadingTowardsOwnGoal));

    if (isThreat || (isHeadingTowardsOwnGoal && isDeepInDefense)) {
      // 2.1 Posicionamento defensivo seguro dentro dos limites permitidos
      const blockXOffset = forwardDir === 1 ? 160 : -160;
      const idealBlockX = clamp(ownGoalX + blockXOffset + errorNoise, ai.minX, ai.maxX);

      if (Math.abs(ai.x - idealBlockX) > 20) {
        this.currentMoveDir = ai.x > idealBlockX ? -1 : 1;
      } else {
        this.currentMoveDir = 0;
      }

      // 2.2 Bloqueio de Emergência: Chute de Alívio / Afastamento
      if (isBallInFront && distToBall < kickStrikeRange + 15 && isBallOnGroundOrWaist) {
        this.shouldKick = true;
        this.kickChargeIntensity = this.difficulty === 'dificil' ? 0.75 : 0.50;
        return;
      }

      // 2.3 Interceptação Aérea: Pula somente se a bola estiver alta e em direção à rede
      if (forecast.interceptTimeAtAi !== null) {
        const timeToHit = forecast.interceptTimeAtAi;
        const expectedY = forecast.interceptHeightAtAi ?? 500;

        // Se a bola vier na altura da cabeça ou travessão
        if (expectedY < 515 && expectedY > 360) {
          if (timeToHit <= 0.35 + timingForgiveness && timeToHit >= 0.08) {
            this.shouldJump = true;
          }
        } else if (expectedY >= 515) {
          // Bola rasteira: Fica firme no chão para rebater ou chutar
          this.shouldJump = false;
        }
      }

      // 2.4 Último recurso caso a bola passe da linha da IA
      if ((forwardDir === 1 ? ball.x < ai.x : ball.x > ai.x) && distToOwnGoal > 60) {
        this.currentMoveDir = -forwardDir; // persegue em direção à linha
        if (distToBall < 110 && ball.y < 560) {
          this.shouldJump = true;
          this.shouldKick = true;
        }
      }

      return;
    }

    // =========================================================================
    // SITUAÇÃO 3: DISPUTA DE BOLA / ANTECIPAÇÃO DE QUICQUE
    // =========================================================================
    const isContestable = Math.abs(forecast.landingX - ai.x) < 380;

    if (isContestable) {
      // Corre para antecipar onde a bola vai tocar o chão, sempre restrito à própria metade
      const targetArrivalX = clamp(forecast.landingX + forwardDir * -20 + errorNoise, ai.minX, ai.maxX);

      if (Math.abs(ai.x - targetArrivalX) > 22) {
        this.currentMoveDir = ai.x > targetArrivalX ? -1 : 1;
      } else {
        this.currentMoveDir = 0;
      }

      // Se a bola chegar perto no chão e estiver à frente: CHUTA para armar contra-ataque
      if (isBallInFront && distToBall < kickStrikeRange && isBallOnGroundOrWaist) {
        this.shouldKick = true;
        this.kickChargeIntensity = this.difficulty === 'dificil' ? 0.70 : 0.45;
        return;
      }

      // Pula somente se a bola estiver realmente no ar (acima do peito) e não estiver presa na linha central
      if (distToBall < 100 && ballHeight < aiHead.y + 15 && ballHeight > 370 && !isBallOnGroundOrWaist) {
        if (!isAiNearMidfieldLimit || isBallInAiHalf) {
          this.shouldJump = true;
          return;
        }
      }

      return;
    }

    // =========================================================================
    // SITUAÇÃO 4: BOLA NO ATAQUE / PERSEGUIÇÃO DA JOGADA OU POSICIONAMENTO TÁTICO
    // =========================================================================
    if (isBallInOpponentHalf) {
      // REGRA DE MEIO-CAMPO: A bola está na metade adversária!
      // Se a bola estiver perto da linha central ao alcance de um chute: disputa a bola a partir da posição permitida
      if (isBallInFront && distToBall < kickStrikeRange + 10) {
        if (isBallOnGroundOrWaist) {
          this.shouldKick = true;
          this.kickChargeIntensity = this.difficulty === 'dificil' ? 0.65 : 0.40;
        }
        // Permanece no limite do meio-campo sem tentar atravessar
        this.currentMoveDir = 0;
        this.shouldJump = false;
        return;
      }

      // Se a bola estiver no campo adversário, mas próxima do meio-campo (até 180px da linha)
      const distBallToMidfield = Math.abs(ball.x - midX);
      if (distBallToMidfield < 180) {
        // Avança até próximo do limite central (com margem de 25px para não encostar rigidamente)
        const readyX = clamp(aiMidfieldLimitX - forwardDir * 25, ai.minX, ai.maxX);
        if (Math.abs(ai.x - readyX) > 20) {
          this.currentMoveDir = ai.x > readyX ? -1 : 1;
        } else {
          this.currentMoveDir = 0;
        }
      } else {
        // Bola profunda no campo adversário: assume postura tática intermediária na própria metade
        // Evita aglomeração e protege a própria meta contra balões e rebotes
        const tacticalHoldX = clamp(ownGoalX + forwardDir * 360, ai.minX, ai.maxX);
        if (Math.abs(ai.x - tacticalHoldX) > 22) {
          this.currentMoveDir = ai.x > tacticalHoldX ? -1 : 1;
        } else {
          this.currentMoveDir = 0;
        }
      }

      // Não fica pulando na linha central quando a bola está no campo adversário
      this.shouldJump = false;
      return;
    }

    // Bola na própria metade da IA
    if (isBallInFront) {
      // Avança em velocidade em direção à bola, respeitando os limites da própria metade
      if (!isAiNearMidfieldLimit || (forwardDir === 1 ? ai.x < ai.maxX : ai.x > ai.minX)) {
        this.currentMoveDir = forwardDir;
      } else {
        this.currentMoveDir = 0;
      }

      // Se atingir a zona de finalização
      if (distToBall < kickStrikeRange) {
        if (isBallOnGroundOrWaist) {
          this.shouldKick = true;
          this.kickChargeIntensity = this.difficulty === 'dificil' ? 0.65 : 0.35;
        } else if (ballHeight < aiHead.y + 20 && ballHeight > 360) {
          this.shouldJump = true;
        }
      }
    } else {
      // A bola passou atrás da IA: recua para recuperar a frente da jogada
      this.currentMoveDir = -forwardDir;
      if (distToBall < 90 && ballHeight < 510) {
        this.shouldJump = true;
      }
    }
  }
}
