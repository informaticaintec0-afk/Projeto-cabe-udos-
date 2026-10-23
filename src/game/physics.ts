/**
 * Motor Físico 2D para Futebol Arcade
 * Tratamento de colisões círculo-círculo, círculo-segmento, atrito, gravidade e rebote.
 */

export interface Vec2 {
  x: number;
  y: number;
}

export function distSq(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return dx * dx + dy * dy;
}

export function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(distSq(x1, y1, x2, y2));
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Ponto mais próximo de um ponto P em um segmento de reta AB
 */
export function closestPointOnSegment(
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number
): { x: number; y: number; t: number } {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;

  const abLenSq = abx * abx + aby * aby;
  if (abLenSq === 0) return { x: ax, y: ay, t: 0 };

  const t = clamp((apx * abx + apy * aby) / abLenSq, 0, 1);
  return {
    x: ax + t * abx,
    y: ay + t * aby,
    t
  };
}

/**
 * Verifica e resolve colisão entre círculo e segmento de reta com espessura
 */
export function resolveCircleSegmentCollision(
  circle: { x: number; y: number; vx: number; vy: number; radius: number },
  ax: number, ay: number,
  bx: number, by: number,
  restitution: number = 0.8,
  segmentThickness: number = 4
): boolean {
  const closest = closestPointOnSegment(circle.x, circle.y, ax, ay, bx, by);
  const dX = circle.x - closest.x;
  const dY = circle.y - closest.y;
  const d = Math.sqrt(dX * dX + dY * dY);
  const minDist = circle.radius + segmentThickness;

  if (d < minDist && d > 0.0001) {
    // Vetor normal apontando do segmento para o círculo
    const nx = dX / d;
    const ny = dY / d;

    // Afasta o círculo para fora da penetração
    const overlap = minDist - d;
    circle.x += nx * overlap;
    circle.y += ny * overlap;

    // Velocidade relativa normal
    const vn = circle.vx * nx + circle.vy * ny;
    if (vn < 0) {
      circle.vx -= (1 + restitution) * vn * nx;
      circle.vy -= (1 + restitution) * vn * ny;
    }
    return true;
  }
  return false;
}

/**
 * Colisão e resolução entre dois corpos circulares (ex: Cabeça do Jogador vs Bola)
 */
export function resolveCircleCircleCollision(
  c1: { x: number; y: number; vx: number; vy: number; radius: number; mass: number },
  c2: { x: number; y: number; vx: number; vy: number; radius: number; mass: number },
  restitution: number = 0.8,
  bonusPush: number = 0
): boolean {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  const minDist = c1.radius + c2.radius;

  if (d < minDist && d > 0.0001) {
    const nx = dx / d;
    const ny = dy / d;

    // Resolução de sobreposição baseada nas massas
    const overlap = minDist - d;
    const totalMass = c1.mass + c2.mass;
    const m1Ratio = c2.mass / totalMass;
    const m2Ratio = c1.mass / totalMass;

    c1.x -= nx * overlap * m1Ratio;
    c1.y -= ny * overlap * m1Ratio;
    c2.x += nx * overlap * m2Ratio;
    c2.y += ny * overlap * m2Ratio;

    // Velocidade relativa
    const kx = c1.vx - c2.vx;
    const ky = c1.vy - c2.vy;
    const p = 2 * (nx * kx + ny * ky) / totalMass;

    // Aplica impulso
    c1.vx -= p * c2.mass * nx * restitution;
    c1.vy -= p * c2.mass * ny * restitution;
    c2.vx += p * c1.mass * nx * restitution;
    c2.vy += p * c1.mass * ny * restitution;

    if (bonusPush > 0) {
      c2.vx += nx * bonusPush;
      c2.vy += ny * bonusPush;
    }

    return true;
  }
  return false;
}

export interface BallTrajectoryForecast {
  landingTime: number; // segundos até o primeiro impacto com o chão
  landingX: number; // posição X onde a bola toca o chão
  threatToRightGoal: boolean; // se a trajetória alcança a zona do gol direito da IA
  interceptTimeAtAi: number | null; // tempo em segundos até a bola alcançar o X da IA
  interceptHeightAtAi: number | null; // altura Y da bola ao cruzar o X da IA
  interceptVyAtAi: number | null; // velocidade vertical ao cruzar o X da IA
  estimatedPeakY: number; // ponto mais alto alcançado na parábola
  points: Array<{ x: number; y: number; time: number }>;
}

/**
 * Simula a trajetória balística prevista da bola em tempo real para a IA tomar decisões antecipadas.
 * Considera gravidade (880), arrasto aerodinâmico (0.996), quique no solo e limites da quadra.
 */
export function predictBallTrajectory(
  ball: { x: number; y: number; vx: number; vy: number; radius: number },
  aiX: number,
  groundY: number = 590,
  maxSimTime: number = 1.6
): BallTrajectoryForecast {
  let simX = ball.x;
  let simY = ball.y;
  let simVx = ball.vx;
  let simVy = ball.vy;

  let landingTime = maxSimTime;
  let landingX = ball.x;
  let foundFirstGround = false;

  let interceptTimeAtAi: number | null = null;
  let interceptHeightAtAi: number | null = null;
  let interceptVyAtAi: number | null = null;
  let threatToRightGoal = false;
  let estimatedPeakY = ball.y;

  const points: Array<{ x: number; y: number; time: number }> = [{ x: simX, y: simY, time: 0 }];
  const simDt = 0.04;
  const steps = Math.floor(maxSimTime / simDt);

  let prevX = simX;

  for (let s = 1; s <= steps; s++) {
    const t = s * simDt;

    // Física idêntica à do Ball.update
    simVy += 880 * simDt;
    simVx *= 0.996;
    simVy *= 0.996;
    simX += simVx * simDt;
    simY += simVy * simDt;

    if (simY < estimatedPeakY) {
      estimatedPeakY = simY;
    }

    // Detecta o momento exato em que a bola cruza a coordenada X da IA
    if (interceptTimeAtAi === null) {
      const crossedX = (prevX <= aiX && simX >= aiX) || (prevX >= aiX && simX <= aiX);
      if (crossedX || Math.abs(simX - aiX) < 22) {
        interceptTimeAtAi = t;
        interceptHeightAtAi = simY;
        interceptVyAtAi = simVy;
      }
    }

    // Ameaça direta ao gol da IA (trave direita postX=1170, travessão crossbarY=390, chão=590)
    if (simX >= 1060 && simY > 370 && simY < groundY + 10) {
      threatToRightGoal = true;
    }

    // Primeiro impacto com o gramado
    if (simY + ball.radius >= groundY && !foundFirstGround) {
      foundFirstGround = true;
      landingTime = t;
      landingX = simX;
      // Simula quique no solo
      simY = groundY - ball.radius;
      simVy = -simVy * 0.72;
      simVx *= 0.96;
    } else if (simY + ball.radius >= groundY) {
      simY = groundY - ball.radius;
      simVy = -simVy * 0.72;
      simVx *= 0.96;
    }

    // Colisão com teto e paredes laterais
    if (simY - ball.radius < 30) {
      simY = 30 + ball.radius;
      simVy = Math.abs(simVy) * 0.7;
    }
    if (simX - ball.radius < 110) {
      simX = 110 + ball.radius;
      simVx = Math.abs(simVx) * 0.75;
    } else if (simX + ball.radius > 1170) {
      simX = 1170 - ball.radius;
      simVx = -Math.abs(simVx) * 0.75;
    }

    prevX = simX;
    if (s % 2 === 0) {
      points.push({ x: simX, y: simY, time: t });
    }
  }

  if (!foundFirstGround) {
    landingX = simX;
    landingTime = maxSimTime;
  }

  return {
    landingTime,
    landingX,
    threatToRightGoal,
    interceptTimeAtAi,
    interceptHeightAtAi,
    interceptVyAtAi,
    estimatedPeakY,
    points
  };
}
