/**
 * Entidades do Jogo: Bola, Jogador Cabeçudo, Balizas (Gols) e Sistema de Partículas
 */

import { TeamPreset, Particle, FloatingText } from './types';
import { clamp, dist } from './physics';
import { sound } from './audio';

export class Ball {
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public radius: number = 20;
  public mass: number = 1.0;
  public rotation: number = 0;
  public angularVelocity: number = 0;
  public isSuper: boolean = false;
  public superTimer: number = 0;
  public trail: Array<{ x: number; y: number; alpha: number; isSuper?: boolean }> = [];
  public lastHitBy: 'p1' | 'p2' | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public reset(x: number, y: number, dropVy: number = -150) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = dropVy;
    this.angularVelocity = (Math.random() - 0.5) * 4;
    this.isSuper = false;
    this.superTimer = 0;
    this.trail = [];
    this.lastHitBy = null;
  }

  public update(dt: number, groundY: number, leftWall: number, rightWall: number, ceilingY: number = 30) {
    // Gravidade
    const gravity = 880;
    this.vy += gravity * dt;

    // Arrasto do ar
    this.vx *= 0.996;
    this.vy *= 0.996;

    // Movimento
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Rotação da bola baseada na velocidade horizontal
    this.rotation += this.angularVelocity * dt;
    this.angularVelocity *= 0.98;

    // Temporizador de Super Chute
    if (this.isSuper) {
      this.superTimer -= dt;
      if (this.superTimer <= 0) {
        this.isSuper = false;
      }
    }

    // Rastro da bola (especialmente para chutes rápidos)
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 250 || this.isSuper) {
      this.trail.push({ x: this.x, y: this.y, alpha: 0.8, isSuper: this.isSuper });
      if (this.trail.length > 8) {
        this.trail.shift();
      }
    } else if (this.trail.length > 0) {
      this.trail.shift();
    }
    this.trail.forEach(t => t.alpha *= 0.85);

    // Colisão com Teto
    if (this.y - this.radius < ceilingY) {
      this.y = ceilingY + this.radius;
      this.vy = Math.abs(this.vy) * 0.7;
      sound.playBounce(0.3);
    }

    // Colisão com Paredes laterais externas
    if (this.x - this.radius < leftWall) {
      this.x = leftWall + this.radius;
      this.vx = Math.abs(this.vx) * 0.75;
      sound.playBounce(0.3);
    } else if (this.x + this.radius > rightWall) {
      this.x = rightWall - this.radius;
      this.vx = -Math.abs(this.vx) * 0.75;
      sound.playBounce(0.3);
    }

    // Colisão com o Gramado
    if (this.y + this.radius > groundY) {
      this.y = groundY - this.radius;
      if (Math.abs(this.vy) > 40) {
        sound.playBounce(Math.abs(this.vy) / 600);
      }
      this.vy = -this.vy * 0.72;
      this.vx *= 0.96; // Atrito com a grama
      this.angularVelocity = (this.vx / this.radius) * 1.5;

      if (Math.abs(this.vy) < 25) {
        this.vy = 0;
      }
    }
  }

  public applyKick(angle: number, power: number, isSuper: boolean = false, fromWho: 'p1' | 'p2' = 'p1') {
    this.vx = Math.cos(angle) * power;
    this.vy = -Math.sin(angle) * power;
    this.angularVelocity = (this.vx > 0 ? 1 : -1) * (power / 40);
    this.lastHitBy = fromWho;

    if (isSuper) {
      this.isSuper = true;
      this.superTimer = 2.2;
      this.vx *= 1.35;
      this.vy *= 1.2;
      sound.playSuperKick();
    } else {
      sound.playKick(power / 600);
    }
  }
}

export class Player {
  public id: 'p1' | 'p2';
  public team: TeamPreset;
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public facing: 1 | -1; // 1 = olhando para direita, -1 = olhando para esquerda
  public isGrounded: boolean = false;

  // Dimensões do personagem cabeçudo
  public headRadius: number = 42;
  public headOffsetY: number = 66; // distância do pé ao centro da cabeça
  public mass: number = 12.0;

  // Estado de chutes
  public isKicking: boolean = false;
  public kickProgress: number = 0; // 0 a 1 durante a animação
  public kickDuration: number = 0.22; // segundos
  public kickCooldown: number = 0;

  // Sistema de Chute Carregado com Mira
  public isChargingKick: boolean = false;
  public kickCharge: number = 0; // 0.0 (toque rápido) a 1.0 (carga máxima)
  public lastReleasedCharge: number = 0; // carga retida no momento do disparo

  // Super chute
  public superMeter: number = 25; // 0 a 100
  public maxSuperMeter: number = 100;

  // Expressões faciais e pose
  public eyeLookX: number = 0;
  public eyeLookY: number = 0;
  public mouthState: 'normal' | 'happy' | 'determined' | 'open' = 'normal';
  public cheerTimer: number = 0;
  public jumpCooldown: number = 0;

  // Limites de movimentação
  public minX: number = 80;
  public maxX: number = 1200;

  public isAwayKit: boolean = false;

  constructor(id: 'p1' | 'p2', team: TeamPreset, startX: number, facing: 1 | -1, isAwayKit: boolean = false) {
    this.id = id;
    this.team = team;
    this.x = startX;
    this.y = 590;
    this.facing = facing;
    this.isAwayKit = isAwayKit;
    this.applyTeamAttributes();
  }

  public setTeam(team: TeamPreset, isAwayKit: boolean = false) {
    this.team = team;
    this.isAwayKit = isAwayKit;
    this.applyTeamAttributes();
  }

  private applyTeamAttributes() {
    // Ajusta massa baseada na habilidade Fortaleza ou Falcão
    if (this.team.ability?.id === 'fortaleza') {
      this.mass = 16.5; // Mais pesado e estável em disputas
    } else if (this.team.ability?.id === 'falcao') {
      this.mass = 13.0; // Leve bônus equilibrado
    } else {
      this.mass = 12.0;
    }
  }

  public reset(startX: number, facing: 1 | -1) {
    this.x = startX;
    this.y = 590;
    this.vx = 0;
    this.vy = 0;
    this.facing = facing;
    this.isKicking = false;
    this.kickProgress = 0;
    this.kickCooldown = 0;
    this.isChargingKick = false;
    this.kickCharge = 0;
    this.lastReleasedCharge = 0;
    this.mouthState = 'normal';
    this.cheerTimer = 0;
  }

  public getHeadPos(): { x: number; y: number; radius: number } {
    return {
      x: this.x,
      y: this.y - this.headOffsetY,
      radius: this.headRadius
    };
  }

  public getFootPos(): { x: number; y: number } {
    // Posição do pé chutador considerando a extensão da animação de chute
    const forwardOffset = this.facing * (24 + Math.sin(this.kickProgress * Math.PI) * 36);
    const heightOffset = -12 - Math.sin(this.kickProgress * Math.PI) * 26;
    return {
      x: this.x + forwardOffset,
      y: this.y + heightOffset
    };
  }

  public update(dt: number, groundY: number, ball: Ball) {
    // Gravidade
    const gravity = 1500;
    this.vy += gravity * dt;

    // Movimentação
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Atrito com chão
    if (this.isGrounded) {
      this.vx *= 0.82;
      if (Math.abs(this.vx) < 5) this.vx = 0;
    } else {
      this.vx *= 0.92;
    }

    // Colisão com o chão
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // Restrições de borda da quadra
    this.x = clamp(this.x, this.minX, this.maxX);

    // Atualização da animação do chute
    if (this.isKicking) {
      this.kickProgress += dt / this.kickDuration;
      if (this.kickProgress >= 1.0) {
        this.isKicking = false;
        this.kickProgress = 0;
        this.kickCooldown = 0.12;
      }
    }
    if (this.kickCooldown > 0) {
      this.kickCooldown -= dt;
    }
    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= dt;
    }

    // Carregamento passivo do super medidor (+1 por segundo; Falcão ganha +10% de recarga)
    const meterRate = this.team.ability?.id === 'falcao' ? 1.65 : 1.5;
    this.superMeter = Math.min(this.maxSuperMeter, this.superMeter + dt * meterRate);

    // Atualização do Chute Carregado
    if (this.isChargingKick) {
      // Carrega de 0 a 1 em aproximadamente 0.75s
      this.kickCharge = Math.min(1.0, this.kickCharge + dt * 1.35);
    }

    // Expressão facial e direção dos olhos acompanhando a bola
    const head = this.getHeadPos();
    const dX = ball.x - head.x;
    const dY = ball.y - head.y;
    const distanceToBall = Math.sqrt(dX * dX + dY * dY);
    if (distanceToBall > 0) {
      this.eyeLookX = (dX / distanceToBall) * 4.5;
      this.eyeLookY = (dY / distanceToBall) * 3.5;
    }

    // Expressão da boca
    if (this.cheerTimer > 0) {
      this.cheerTimer -= dt;
      this.mouthState = 'happy';
    } else if (this.isKicking || this.isChargingKick) {
      this.mouthState = 'open';
    } else if (distanceToBall < 110) {
      this.mouthState = 'determined';
    } else {
      this.mouthState = 'normal';
    }
  }

  public move(dir: number) {
    // Velocidade máxima configurada pela habilidade especial
    let moveSpeed = 360;

    if (this.team.ability?.id === 'raio_azul') {
      moveSpeed = 415; // +15% de velocidade máxima (Raio Azul)
    } else if (this.team.ability?.id === 'falcao') {
      moveSpeed = 380; // Bônus equilibrado Falcão
    }

    // Enquanto carrega o chute, mantém 85% da velocidade para controle fino
    if (this.isChargingKick) {
      moveSpeed *= 0.85;
    }

    // Fúria: aceleração inicial rápida instantânea
    if (this.team.ability?.id === 'furia' && Math.abs(this.vx) < 50) {
      this.vx = dir * moveSpeed * 0.95;
    } else {
      this.vx = dir * moveSpeed;
    }
  }

  public jump() {
    if (this.isGrounded && this.jumpCooldown <= 0) {
      // Pulo com ligeiro bônus se for Muralha
      const jumpImpulse = this.team.ability?.id === 'muralha' ? -660 : -640;
      this.vy = jumpImpulse;
      this.isGrounded = false;
      this.jumpCooldown = 0.15;
    }
  }

  public startChargingKick() {
    if (!this.isKicking && this.kickCooldown <= 0) {
      this.isChargingKick = true;
      this.kickCharge = 0;
    }
  }

  public releaseKick(): boolean {
    if (this.isChargingKick) {
      // Salva a carga atingida para aplicar no impacto da chuteira
      this.lastReleasedCharge = Math.max(0.08, this.kickCharge);
      this.isChargingKick = false;
      this.kickCharge = 0;
      return this.kick();
    } else if (!this.isKicking && this.kickCooldown <= 0) {
      // Toque rápido sem carregar
      this.lastReleasedCharge = 0;
      return this.kick();
    }
    return false;
  }

  public cancelChargingKick() {
    this.isChargingKick = false;
    this.kickCharge = 0;
  }

  public kick(): boolean {
    if (!this.isKicking && this.kickCooldown <= 0) {
      this.isKicking = true;
      this.kickProgress = 0;
      return true;
    }
    return false;
  }

  public canSuperKick(): boolean {
    return this.superMeter >= this.maxSuperMeter && !this.isKicking;
  }

  public triggerSuperKick(): boolean {
    if (this.canSuperKick()) {
      this.superMeter = 0;
      this.isKicking = true;
      this.kickProgress = 0;
      return true;
    }
    return false;
  }

  public celebrate() {
    this.cheerTimer = 2.4;
    this.jump();
  }
}

export class Goal {
  public isLeft: boolean;
  public postX: number;
  public crossbarY: number = 390;
  public groundY: number = 590;
  public depth: number = 110;
  public postRadius: number = 9;

  constructor(isLeft: boolean) {
    this.isLeft = isLeft;
    this.postX = isLeft ? 110 : 1170;
  }

  public checkGoal(ball: Ball): boolean {
    // A bola conta gol quando passa inteira pela linha de gol entre a trave e o chão
    if (this.isLeft) {
      // Gol esquerdo: bola entra para x < postX e está abaixo do travessão
      if (ball.x + ball.radius < this.postX && ball.y > this.crossbarY && ball.y < this.groundY) {
        return true;
      }
    } else {
      // Gol direito: bola entra para x > postX e está abaixo do travessão
      if (ball.x - ball.radius > this.postX && ball.y > this.crossbarY && ball.y < this.groundY) {
        return true;
      }
    }
    return false;
  }
}

export class ParticleSystem {
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  private nextTextId: number = 1;

  public update(dt: number) {
    // Atualiza partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt;
      p.alpha = 1 - (p.life / p.maxLife);

      if (p.shape === 'square') {
        p.vy += 220 * dt; // gravidade leve para confete
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed * dt;
        }
      } else if (p.shape === 'smoke') {
        p.size += dt * 18;
      }

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Atualiza textos flutuantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 45 * dt;
      ft.life += dt;
      ft.alpha = 1 - (ft.life / ft.maxLife);
      ft.scale = 1 + (ft.life / ft.maxLife) * 0.25;

      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  public addConfettiBurst(centerX: number, centerY: number, count: number = 80) {
    const colors = ['#FACC15', '#EF4444', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#FFFFFF'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 380;
      this.particles.push({
        x: centerX + (Math.random() - 0.5) * 80,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 180,
        size: 7 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 2.2 + Math.random() * 1.0,
        shape: 'square',
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 12
      });
    }
  }

  public addKickSpark(x: number, y: number, color: string = '#FACC15', count: number = 14) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 180;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.25 + Math.random() * 0.2,
        shape: 'spark'
      });
    }
  }

  public addTurfDust(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y,
        vx: (Math.random() - 0.5) * 90,
        vy: -40 - Math.random() * 70,
        size: 4 + Math.random() * 3,
        color: '#15803D',
        alpha: 0.7,
        life: 0,
        maxLife: 0.35,
        shape: 'circle'
      });
    }
  }

  public addFireTrail(x: number, y: number) {
    const colors = ['#F97316', '#EF4444', '#FBBF24'];
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 40,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.9,
        life: 0,
        maxLife: 0.3,
        shape: 'smoke'
      });
    }
  }

  public showFloatingText(x: number, y: number, text: string, color: string = '#FACC15') {
    this.floatingTexts.push({
      id: this.nextTextId++,
      x,
      y,
      text,
      color,
      scale: 1,
      alpha: 1,
      life: 0,
      maxLife: 1.2
    });
  }

  public clear() {
    this.particles = [];
    this.floatingTexts = [];
  }
}
