/**
 * Inteligência Artificial para o Adversário no Modo 1 contra 1
 * Utiliza previsão balística da trajetória da bola (gravidade, quique e tempo de chegada),
 * posicionamento defensivo antecipado, interceptação aérea no timing correto e contra-ataque.
 */

import { Player, Ball } from './entities';
import { AIDifficulty } from './types';
import { predictBallTrajectory, BallTrajectoryForecast, clamp } from './physics';

export class SoccerAI {
  public difficulty: AIDifficulty;
  private thinkTimer: number = 0;
  private thinkInterval: number = 0.04; // 25 decisões por segundo para resposta fluida
  private currentMoveDir: number = 0;
  private shouldJump: boolean = false;
  private shouldKick: boolean = false;
  private targetHoldX: number = 960;

  constructor(difficulty: AIDifficulty = 'medio') {
    this.difficulty = difficulty;
  }

  public setDifficulty(diff: AIDifficulty) {
    this.difficulty = diff;
  }

  public update(dt: number, aiPlayer: Player, ball: Ball, isKickoffDropPhase: boolean = false) {
    // REGRA 1: No início da jogada enquanto a bola desce até o primeiro toque no chão,
    // a IA fica estritamente congelada, sem mover, pular ou chutar (igualdade total com o humano).
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
      this.decide(aiPlayer, ball);
    }

    // Executa as ações decididas
    if (this.currentMoveDir !== 0) {
      aiPlayer.move(this.currentMoveDir);
    }

    if (this.shouldJump) {
      aiPlayer.jump();
      this.shouldJump = false;
    }

    if (this.shouldKick) {
      // Se tiver super chute disponível e dificuldade for média/difícil, dispara o especial
      if (this.difficulty !== 'facil' && aiPlayer.canSuperKick() && Math.random() < 0.75) {
        aiPlayer.triggerSuperKick();
      } else {
        // Varia a carga do chute dependendo da distância para o gol adversário (trave esquerda = 110)
        const distToOpponentGoal = aiPlayer.x - 110;
        if (distToOpponentGoal > 550) {
          aiPlayer.lastReleasedCharge = this.difficulty === 'dificil' ? 0.75 : 0.55;
        } else {
          aiPlayer.lastReleasedCharge = 0.25;
        }
        aiPlayer.kick();
      }
      this.shouldKick = false;
    }
  }

  private decide(ai: Player, ball: Ball) {
    // Calibração de latência e precisão baseadas na dificuldade
    let reactionChance = 0.90;
    let timingForgiveness = 0.05; // margem de timing em segundos
    let errorNoise = 0; // erro em pixels na posição estimada

    if (this.difficulty === 'facil') {
      reactionChance = 0.70;
      timingForgiveness = 0.12;
      errorNoise = (Math.random() - 0.5) * 50;
    } else if (this.difficulty === 'dificil') {
      reactionChance = 0.99;
      timingForgiveness = 0.02;
      errorNoise = (Math.random() - 0.5) * 8;
    }

    if (Math.random() > reactionChance) {
      return; // simula imperfeição humana / latência perceptiva
    }

    // Calcula previsão balística da trajetória da bola em tempo real
    const forecast: BallTrajectoryForecast = predictBallTrajectory(ball, ai.x, 590, 1.8);
    const aiHead = ai.getHeadPos();
    const ownGoalX = 1170; // Trave direita defendida pela IA
    const distToBall = Math.abs(ball.x - ai.x);
    const kickRange = this.difficulty === 'dificil' ? 95 : 85;

    // =========================================================================
    // PRIORIDADE 1: DEFESA ATIVA DE GOL (Ameaça direta ao gol da IA)
    // Se a bola viaja para a direita com velocidade suficiente para ameaçar a meta
    // =========================================================================
    const isHeadingTowardsGoal = ball.vx > 70;
    const isDeepInDefense = ball.x > 820;

    if (forecast.threatToRightGoal || (isHeadingTowardsGoal && isDeepInDefense)) {
      // 1.1 Posicionamento antecipado: vai para a coordenada X ideal de bloqueio
      // Fica entre 980 e 1090 (na frente da linha do gol 1170 para não entrar com a bola)
      const idealBlockX = clamp(
        Math.min(forecast.landingX - 10, 1070) + errorNoise,
        960,
        1090
      );

      if (ai.x > idealBlockX + 18) {
        this.currentMoveDir = -1; // avança para fechar o ângulo
      } else if (ai.x < idealBlockX - 18) {
        this.currentMoveDir = 1; // recua para guardar a meta
      } else {
        this.currentMoveDir = 0; // plantado no ponto ótimo de interceptação
      }

      // 1.2 Interceptação Aérea com timing sincronizado
      // Se a bola cruzar a linha da IA nos próximos 0.12 a 0.38 segundos
      if (forecast.interceptTimeAtAi !== null) {
        const timeToHit = forecast.interceptTimeAtAi;
        const expectedY = forecast.interceptHeightAtAi ?? 500;

        // Bola alta/média (entre peito e travessão): PULA PARA CABECEAR/BLOQUEAR
        if (expectedY < 525 && expectedY > 360) {
          if (timeToHit <= 0.36 + timingForgiveness && timeToHit >= 0.08) {
            this.shouldJump = true;
          }
        } else if (expectedY >= 525) {
          // Bola rasteira: NÃO pula (evita pular por cima da bola!), aguarda para chutar no chão
          this.shouldJump = false;
        }
      }

      // 1.3 Bloqueio de emergência caso a bola esteja a curta distância
      if (ball.x < ai.x && distToBall < 115) {
        // Bola na altura da cabeça: cabeceia para afastar
        if (ball.y < aiHead.y + 25 && ball.y > 380) {
          this.shouldJump = true;
        }
        // Bola ao alcance dos pés: chuta para afastar para o campo de ataque
        if (distToBall < kickRange + 20 && ball.y > 450) {
          this.shouldKick = true;
        }
      }

      // 1.4 Se a bola já passou do bot e está indo para a rede (último recurso)
      if (ball.x > ai.x && ball.x < ownGoalX) {
        this.currentMoveDir = 1; // perseguição desesperada na linha de gol
        if (distToBall < 110 && ball.y < 560) {
          this.shouldJump = true;
          this.shouldKick = true;
        }
      }

      return;
    }

    // =========================================================================
    // PRIORIDADE 2: DISPUTA DE MEIO-CAMPO E BOLA AÉREA (Kickoff e Quiques)
    // Antecipa onde a bola vai quicar e avança para disputar, não ficando passiva
    // =========================================================================
    const isContestableInMidfield = forecast.landingX >= 520 && forecast.landingX <= 960;

    if (isContestableInMidfield) {
      const targetArrivalX = clamp(forecast.landingX + 25 + errorNoise, 580, 980);

      if (ai.x > targetArrivalX + 22) {
        this.currentMoveDir = -1; // corre em direção à bola no meio
      } else if (ai.x < targetArrivalX - 22) {
        this.currentMoveDir = 1;
      } else {
        this.currentMoveDir = 0;
      }

      // Timing do Pulo na Disputa Aérea:
      // Se a bola estiver caindo na zona do bot e estiver ao alcance de um cabeceio aéreo
      if (distToBall < 140 && ball.y < aiHead.y + 40 && ball.y > 380) {
        // Pula com agressividade para não deixar o adversário cabecear sozinho
        this.shouldJump = true;
      }

      // Se a bola chegar no chão e estiver ao alcance da chuteira
      if (distToBall < kickRange && ball.y > 460) {
        this.shouldKick = true;
      }

      return;
    }

    // =========================================================================
    // PRIORIDADE 3: BOLA NO CAMPO ADVERSÁRIO (Ataque da IA, x < 520)
    // Mantém posicionamento de contenção equilibrado e cobre contra-ataques
    // =========================================================================
    if (ball.x < 520) {
      // Posicionamento tático de contenção seguro
      const safeContainmentX = 780 + (ball.x / 520) * 140;

      if (ai.x > safeContainmentX + 25) {
        this.currentMoveDir = -1;
      } else if (ai.x < safeContainmentX - 25) {
        this.currentMoveDir = 1;
      } else {
        this.currentMoveDir = 0;
      }

      // Se o humano chutar alto e a bola vier voando rapidamente em sua direção
      if (ball.vx > 200 && ball.x > 400 && distToBall < 180 && ball.y < 480) {
        if (Math.random() < 0.85) {
          this.shouldJump = true;
        }
      }

      return;
    }

    // =========================================================================
    // PRIORIDADE 4: DISPUTA OFENSIVA / FINALIZAÇÃO (Bola dominável no ataque)
    // =========================================================================
    if (ball.x < ai.x) {
      if (distToBall > kickRange - 15) {
        this.currentMoveDir = -1; // avança para roubar a bola
      } else {
        this.currentMoveDir = -0.5; // desacelera para mirar o chute
      }

      // Cabeceio ofensivo
      if (ball.y < aiHead.y + 20 && ball.y > aiHead.y - 65 && distToBall < 95) {
        this.shouldJump = true;
      }

      // Chute ofensivo em direção ao gol adversário (à esquerda)
      if (distToBall < kickRange && ball.y > 440) {
        this.shouldKick = true;
      }
    } else {
      // Bola atrás do bot por drible ou desvio
      this.currentMoveDir = 1; // recua para recuperar a frente da jogada
      if (ball.y < 520 && distToBall < 100) {
        this.shouldJump = true;
      }
    }
  }
}
