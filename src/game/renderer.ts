/**
 * Renderizador Gráfico 2D Procedural em Canvas
 * Estilo visual de desenho animado moderno, cabeçudos expressivos,
 * campo vibrante e iluminação de estádio sem dependências externas.
 */

import { Ball, Player, Goal, ParticleSystem } from './entities';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  public width: number = 1280;
  public height: number = 720;
  public groundY: number = 590;
  public screenShake: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public triggerScreenShake(intensity: number = 10) {
    this.screenShake = intensity;
  }

  public update(dt: number) {
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }
  }

  public render(
    ball: Ball,
    p1: Player,
    p2: Player,
    goalLeft: Goal,
    goalRight: Goal,
    particles: ParticleSystem,
    time: number,
    trajectoryPoints?: Array<{ x: number; y: number }>,
    isKickoffDropPhase?: boolean
  ) {
    const ctx = this.ctx;
    ctx.save();

    // Aplica tremor de tela (screen shake) se houver
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Céu do estádio e iluminação
    this.drawSkyAndStadium(ctx, time);

    // 2. Campo de futebol
    this.drawPitch(ctx);

    // 3. Traves e redes traseiras
    this.drawGoalBack(ctx, goalLeft);
    this.drawGoalBack(ctx, goalRight);

    // 4. Sombras projetadas no gramado
    this.drawShadows(ctx, ball, p1, p2);

    // 5. Linha de Mira do Chute Carregado (abaixo dos jogadores/bola para não obstruir visão)
    if (trajectoryPoints && trajectoryPoints.length > 0) {
      this.drawKickAimTrajectory(ctx, trajectoryPoints, p1.kickCharge, time);
    }

    // 6. Jogadores (Cabeçudos)
    this.drawPlayer(ctx, p1, time);
    this.drawPlayer(ctx, p2, time);

    // 7. Barras de Força do Chute Carregado
    if (p1.isChargingKick) {
      this.drawKickPowerGauge(ctx, p1);
    }
    if (p2.isChargingKick) {
      this.drawKickPowerGauge(ctx, p2);
    }

    // 8. Bola com rotação e rastro
    this.drawBall(ctx, ball);

    // 9. Traves frontais (postes e travessão sobrepostos)
    this.drawGoalFront(ctx, goalLeft);
    this.drawGoalFront(ctx, goalRight);

    // 10. Aviso visual durante a fase de descida da bola no início da jogada
    if (isKickoffDropPhase) {
      this.drawKickoffNotice(ctx, time);
    }

    // 11. Partículas e textos flutuantes
    this.drawParticles(ctx, particles);

    ctx.restore();
  }

  /**
   * Linha de mira da trajetória prevista da bola durante o chute carregado
   */
  public drawKickAimTrajectory(
    ctx: CanvasRenderingContext2D,
    points: Array<{ x: number; y: number }>,
    charge: number,
    time: number
  ) {
    if (!points || points.length < 2) return;

    ctx.save();
    // Cor dinâmica baseada no nível de força carregada
    let strokeColor = '#FACC15'; // amarelo inicial
    let dotColor = '#FEF08A';
    if (charge > 0.7) {
      strokeColor = '#EF4444'; // vermelho potente
      dotColor = '#FCA5A5';
    } else if (charge > 0.35) {
      strokeColor = '#F97316'; // laranja forte
      dotColor = '#FDBA74';
    }

    // 1. Arco suave tracejado
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -time * 35; // animação sutil de fluxo apontando o caminho
    ctx.globalAlpha = 0.78;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // 2. Pontos esféricos discretos ao longo da trajetória prevista
    ctx.setLineDash([]);
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 6;

    for (let i = 1; i < points.length; i += 2) {
      const p = points[i];
      const progress = i / points.length;
      const radius = 2.8 + progress * 2.2;
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Marcador / Alvo de impacto no solo ou travessão
    const endPt = points[points.length - 1];
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(endPt.x, endPt.y, 11, 4.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(endPt.x, endPt.y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Medidor de força do chute carregado sobre o jogador
   */
  public drawKickPowerGauge(ctx: CanvasRenderingContext2D, p: Player) {
    if (!p.isChargingKick) return;

    ctx.save();
    const charge = p.kickCharge; // 0.0 a 1.0
    const gaugeW = 52;
    const gaugeH = 7;
    const gx = p.x - gaugeW / 2;
    const gy = p.y - p.headOffsetY - p.headRadius - 32;

    // Fundo escuro com borda destacada
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(gx - 2, gy - 2, gaugeW + 4, gaugeH + 4, 4);
    ctx.fill();
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Preenchimento gradiente de força (Verde -> Amarelo -> Laranja -> Vermelho)
    const fillW = Math.max(3, gaugeW * charge);
    const grad = ctx.createLinearGradient(gx, gy, gx + gaugeW, gy);
    grad.addColorStop(0, '#10B981'); // Verde
    grad.addColorStop(0.45, '#FACC15'); // Amarelo
    grad.addColorStop(0.8, '#F97316'); // Laranja
    grad.addColorStop(1, '#EF4444'); // Vermelho Fogo

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(gx, gy, fillW, gaugeH, 3);
    ctx.fill();

    // Marcadores de divisão (33%, 66%)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gx + gaugeW * 0.33, gy);
    ctx.lineTo(gx + gaugeW * 0.33, gy + gaugeH);
    ctx.moveTo(gx + gaugeW * 0.66, gy);
    ctx.lineTo(gx + gaugeW * 0.66, gy + gaugeH);
    ctx.stroke();

    // Texto de porcentagem
    ctx.font = 'bold 9px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    const pct = Math.round(charge * 100);
    ctx.fillText(`${pct}% FORÇA`, p.x, gy - 5);

    ctx.restore();
  }

  /**
   * Aviso de disputa congelada no início da jogada (até o primeiro quique no solo)
   */
  public drawKickoffNotice(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();
    const cx = this.width / 2;
    const cy = 200;
    const bounce = Math.sin(time * 6) * 3;

    // Placa de aviso translúcida
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - 170, cy - 18 + bounce, 340, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FEF08A';
    ctx.fillText('⏳ AGUARDE O 1º TOQUE DA BOLA NO CHÃO!', cx, cy + bounce);

    ctx.restore();
  }

  /**
   * Fundo do Estádio: Céu noturno, holofotes e silhueta da torcida
   */
  private drawSkyAndStadium(ctx: CanvasRenderingContext2D, time: number) {
    // Gradiente do céu noturno com iluminação esportiva
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.groundY);
    skyGrad.addColorStop(0, '#090d16');
    skyGrad.addColorStop(0.55, '#131e33');
    skyGrad.addColorStop(1, '#1b3227');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Holofotes de estádio (cones de luz suaves)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const drawLightBeam = (sourceX: number, targetX: number) => {
      const grad = ctx.createRadialGradient(sourceX, 40, 10, targetX, this.groundY, 650);
      grad.addColorStop(0, 'rgba(255, 255, 240, 0.22)');
      grad.addColorStop(0.6, 'rgba(220, 240, 255, 0.05)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(sourceX - 30, 30);
      ctx.lineTo(sourceX + 30, 30);
      ctx.lineTo(targetX + 260, this.groundY);
      ctx.lineTo(targetX - 260, this.groundY);
      ctx.closePath();
      ctx.fill();
    };

    drawLightBeam(160, 480);
    drawLightBeam(this.width - 160, this.width - 480);
    ctx.restore();

    // Silhuetas da torcida nas arquibancadas
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, this.groundY - 140, this.width, 60);

    // Cabeças da multidão em ondas
    ctx.fillStyle = '#1e293b';
    for (let x = 10; x < this.width; x += 18) {
      const wave = Math.sin(x * 0.05 + time * 3) * 3;
      ctx.beginPath();
      ctx.arc(x, this.groundY - 110 + wave, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Banners e faixas de torcida coloridas
    const bannerColors = ['#dc2626', '#2563eb', '#f59e0b', '#10b981'];
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = bannerColors[i % bannerColors.length];
      ctx.fillRect(80 + i * 170, this.groundY - 128, 110, 10);
    }

    // Placa de publicidade eletrônica no fundo
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, this.groundY - 80, this.width, 24);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.9)';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚽ FUTEBOL RETRÔ • CAMPEONATO ARCADE 2D • 8 CLUBES ⚽', this.width / 2, this.groundY - 64);
    ctx.restore();
  }

  /**
   * Gramado vibrante com faixas alternadas e linhas brancas
   */
  private drawPitch(ctx: CanvasRenderingContext2D) {
    const pitchH = this.height - this.groundY;

    // Base da grama
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, this.groundY, this.width, pitchH);

    // Faixas verticais de gramado cortado
    const stripeW = 80;
    ctx.fillStyle = '#16a34a';
    for (let x = 0; x < this.width; x += stripeW * 2) {
      ctx.fillRect(x, this.groundY, stripeW, pitchH);
    }

    // Borda superior da grama com textura de lâminas
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, this.groundY - 2, this.width, 3);

    // Linhas brancas do campo
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Linha de fundo / lateral do campo
    ctx.beginPath();
    ctx.moveTo(110, this.groundY);
    ctx.lineTo(this.width - 110, this.groundY);
    ctx.stroke();

    // Linha central
    const midX = this.width / 2;
    ctx.beginPath();
    ctx.moveTo(midX, this.groundY - 100);
    ctx.lineTo(midX, this.groundY);
    ctx.stroke();

    // Círculo central (meia-lua visível)
    ctx.beginPath();
    ctx.arc(midX, this.groundY, 70, Math.PI, 0);
    ctx.stroke();

    // Ponto central
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(midX, this.groundY - 2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Áreas do gol
    ctx.beginPath();
    ctx.rect(110, this.groundY - 80, 100, 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(this.width - 210, this.groundY - 80, 100, 80);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Rede e estrutura traseira dos gols
   */
  private drawGoalBack(ctx: CanvasRenderingContext2D, goal: Goal) {
    const depth = goal.depth;
    const postX = goal.postX;
    const crossY = goal.crossbarY;
    const groundY = goal.groundY;
    const backX = goal.isLeft ? postX - depth : postX + depth;

    ctx.save();

    // Fundo escuro da caixa da rede
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.moveTo(postX, crossY);
    ctx.lineTo(backX, crossY + 40);
    ctx.lineTo(backX, groundY);
    ctx.lineTo(postX, groundY);
    ctx.closePath();
    ctx.fill();

    // Malha da rede quadriculada
    ctx.strokeStyle = 'rgba(240, 240, 250, 0.35)';
    ctx.lineWidth = 1.2;

    // Linhas horizontais da rede
    for (let y = crossY; y <= groundY; y += 14) {
      const topRatio = (y - crossY) / (groundY - crossY);
      const curBackY = (crossY + 40) + topRatio * (groundY - (crossY + 40));
      ctx.beginPath();
      ctx.moveTo(postX, y);
      ctx.lineTo(backX, curBackY);
      ctx.stroke();
    }

    // Linhas verticais da rede
    for (let x = 0; x <= depth; x += 14) {
      const curX = goal.isLeft ? postX - x : postX + x;
      ctx.beginPath();
      ctx.moveTo(curX, crossY + (x / depth) * 40);
      ctx.lineTo(curX, groundY);
      ctx.stroke();
    }

    // Estrutura metálica traseira de suporte
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(backX, crossY + 40);
    ctx.lineTo(backX, groundY);
    ctx.lineTo(postX, groundY);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Traves e postes frontais com acabamento metálico
   */
  private drawGoalFront(ctx: CanvasRenderingContext2D, goal: Goal) {
    const postX = goal.postX;
    const crossY = goal.crossbarY;
    const groundY = goal.groundY;

    ctx.save();

    // Gradiente metálico para a trave
    const metalGrad = ctx.createLinearGradient(postX - 8, 0, postX + 8, 0);
    metalGrad.addColorStop(0, '#e2e8f0');
    metalGrad.addColorStop(0.4, '#ffffff');
    metalGrad.addColorStop(1, '#94a3b8');

    // Post vertical frontal
    ctx.fillStyle = metalGrad;
    ctx.fillRect(postX - 6, crossY, 12, groundY - crossY);

    // Contorno
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(postX - 6, crossY, 12, groundY - crossY);

    // Travessão superior
    const crossGrad = ctx.createLinearGradient(0, crossY - 6, 0, crossY + 6);
    crossGrad.addColorStop(0, '#ffffff');
    crossGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = crossGrad;

    const barStartX = goal.isLeft ? postX - goal.depth : postX;
    const barW = goal.depth + 6;
    ctx.fillRect(barStartX, crossY - 6, barW, 12);
    ctx.strokeRect(barStartX, crossY - 6, barW, 12);

    // Quina arredondada da trave
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(postX, crossY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Sombras elípticas projetadas no chão
   */
  private drawShadows(ctx: CanvasRenderingContext2D, ball: Ball, p1: Player, p2: Player) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';

    // Sombra da Bola (diminui conforme sobe)
    const ballHeight = Math.max(0, this.groundY - ball.y);
    const ballShadowScale = Math.max(0.3, 1 - ballHeight / 400);
    const ballShadowAlpha = Math.max(0.08, 0.4 * (1 - ballHeight / 450));

    ctx.fillStyle = `rgba(0, 0, 0, ${ballShadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(ball.x, this.groundY + 3, ball.radius * ballShadowScale * 1.4, ball.radius * 0.4 * ballShadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sombras dos jogadores
    const drawPlayerShadow = (p: Player) => {
      const pHeight = Math.max(0, this.groundY - p.y);
      const pScale = Math.max(0.4, 1 - pHeight / 400);
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.1, 0.35 * (1 - pHeight / 400))})`;
      ctx.beginPath();
      ctx.ellipse(p.x, this.groundY + 3, 36 * pScale, 10 * pScale, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    drawPlayerShadow(p1);
    drawPlayerShadow(p2);
    ctx.restore();
  }

  /**
   * Desenho do Jogador Cabeçudo estilo desenho animado
   */
  private drawPlayer(ctx: CanvasRenderingContext2D, p: Player, time: number) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.facing, 1); // Espelha se olhar para esquerda

    const team = p.team;
    const isMoving = Math.abs(p.vx) > 10;
    const walkBob = isMoving ? Math.sin(time * 16) * 3 : 0;

    // Cores adaptadas se for uniforme reserva / visitante para diferenciar o jogo espelho
    const shortsColor = p.isAwayKit
      ? (team.shortsColor === '#FFFFFF' ? '#18181B' : '#FFFFFF')
      : team.shortsColor;
    const socksColor = p.isAwayKit
      ? (team.socksColor === '#FFFFFF' ? '#18181B' : '#FFFFFF')
      : team.socksColor;

    // 1. Perna e Chuteira Traseira (Apoio)
    this.drawBoot(ctx, -14, -8 + (isMoving ? -walkBob : 0), 0, socksColor);

    // 2. Tronco / Uniforme pequeno
    ctx.save();
    ctx.translate(0, -28 + walkBob * 0.5);

    // Calção
    ctx.fillStyle = shortsColor;
    ctx.beginPath();
    ctx.roundRect(-16, 8, 32, 16, [0, 0, 6, 6]);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Faixa lateral do calção
    ctx.fillStyle = team.secondaryColor;
    ctx.fillRect(-16, 9, 4, 14);

    // Camisa recortada com padrão específico do clube
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-18, -14, 36, 24, [8, 8, 2, 2]);
    ctx.clip(); // Restringe os grafismos aos limites da camisa

    // Fundo base da camisa
    ctx.fillStyle = p.isAwayKit
      ? (team.primaryColor === '#FFFFFF' ? '#18181B' : '#FFFFFF')
      : team.primaryColor;
    ctx.fillRect(-18, -14, 36, 24);

    // Padrão visual de acordo com o estilo do clube
    switch (team.jerseyStyle) {
      case 'striped-red-black': // Rubro Imperial: listras horizontais vermelho e preto
        ctx.fillStyle = p.isAwayKit ? '#DC2626' : '#18181B';
        ctx.fillRect(-18, -14, 36, 6);
        ctx.fillRect(-18, -2, 36, 6);
        break;

      case 'sash-white': // Cruz de Prata: faixa diagonal branca sobre camisa preta
        ctx.fillStyle = p.isAwayKit ? '#18181B' : '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(-18, -14);
        ctx.lineTo(-6, -14);
        ctx.lineTo(18, 6);
        ctx.lineTo(6, 6);
        ctx.closePath();
        ctx.fill();
        break;

      case 'tricolor-stripes': // Tricolor das Laranjeiras: faixas verticais vinho, branco e verde
        ctx.fillStyle = '#881337'; // Vinho
        ctx.fillRect(-18, -14, 12, 24);
        ctx.fillStyle = '#FFFFFF'; // Branco
        ctx.fillRect(-6, -14, 12, 24);
        ctx.fillStyle = '#047857'; // Verde
        ctx.fillRect(6, -14, 12, 24);
        break;

      case 'star-chest': // Estrela Alvinegra: camisa preta com estrela no peito
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(6, -4, 3.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'geometric-blocks': // União Tricolor Paulista: blocos geométricos vermelho, branco e preto
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(-18, -14, 18, 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, -14, 18, 12);
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-18, -2, 36, 12);
        break;

      case 'emerald-gold': // Esmeralda Real: camisa verde com detalhes dourados no ombro e gola
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(-18, -14, 36, 4);
        ctx.fillRect(-18, -14, 5, 24);
        break;

      case 'striped-black-white': // Corinthians do Povo: listras verticais pretas e brancas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-18, -14, 6, 24);
        ctx.fillRect(-6, -14, 6, 24);
        ctx.fillRect(6, -14, 6, 24);
        break;

      case 'white-clean': // Atlântico Santista: camisa branca com vivos pretos nos ombros
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-18, -14, 36, 3);
        break;

      case 'celeste-stars': // Cruzeiro Celeste: azul royal com estrelas brancas
        ctx.fillStyle = '#1D4ED8';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-18, -14, 36, 3);
        ctx.beginPath();
        ctx.arc(6, -6, 2.5, 0, Math.PI * 2);
        ctx.arc(10, -3, 2, 0, Math.PI * 2);
        ctx.arc(3, -2, 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'tornado-red-black': // Furacão: faixas diagonais vermelhas e pretas
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.moveTo(-18, -14);
        ctx.lineTo(-4, -14);
        ctx.lineTo(8, 10);
        ctx.lineTo(-6, 10);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(6, -14);
        ctx.lineTo(18, -14);
        ctx.lineTo(18, 0);
        ctx.closePath();
        ctx.fill();
        break;

      case 'green-white-hoops': // Coritiba: verde com duas faixas horizontais brancas no peito
        ctx.fillStyle = '#15803D';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-18, -7, 36, 4);
        ctx.fillRect(-18, 1, 36, 4);
        break;

      case 'emerald-hope': // Chapecó: verde esmeralda com detalhe dourado na gola
        ctx.fillStyle = '#047857';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(-18, -14, 36, 3);
        break;

      case 'navy-sky-lion': // Leão da Amazônia: azul-marinho com mangas em azul-celeste
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(-18, -14, 8, 12);
        ctx.fillRect(10, -14, 8, 12);
        break;

      case 'sun-gold-green': // Sol de Ouro: amarelo ouro com peito verde
        ctx.fillStyle = '#EAB308';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#15803D';
        ctx.fillRect(-18, -14, 36, 8);
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-18, -6, 36, 2);
        break;

      case 'tricolor-bahia': // Bahia: azul com faixas horizontais branca e vermelha
        ctx.fillStyle = '#2563EB';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-18, -6, 36, 8);
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(-18, -3, 36, 3);
        break;

      case 'tricolor-pampas': // Grêmio: azul celeste com listras pretas e frisos brancos
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-12, -14, 6, 24);
        ctx.fillRect(0, -14, 6, 24);
        ctx.fillRect(12, -14, 6, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-13, -14, 1, 24);
        ctx.fillRect(-6, -14, 1, 24);
        ctx.fillRect(-1, -14, 1, 24);
        ctx.fillRect(6, -14, 1, 24);
        break;

      case 'colorado-red': // Internacional: vermelho puro com gola e punhos brancos
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-18, -14, 36, 3);
        break;

      case 'striped-black-white-galo': // Atlético-MG: listras verticais pretas e brancas largas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-18, -14, 9, 24);
        ctx.fillRect(0, -14, 9, 24);
        break;

      case 'braganca-turbine': // Bragantino: vermelho e preto dividido com faixa branca
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(-18, -14, 36, 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-18, -2, 36, 3);
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-18, 1, 36, 9);
        break;

      case 'vitoria-furia': // Vitória: listras horizontais vermelhas e pretas
        ctx.fillStyle = '#18181B';
        ctx.fillRect(-18, -14, 36, 24);
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(-18, -14, 36, 6);
        ctx.fillRect(-18, -2, 36, 6);
        break;
    }

    ctx.restore(); // fim padrão camisa

    // Contorno da camisa
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-18, -14, 36, 24, [8, 8, 2, 2]);
    ctx.stroke();

    // Gola da camisa
    ctx.fillStyle = team.accentColor || team.secondaryColor;
    ctx.beginPath();
    ctx.arc(0, -14, 7, 0, Math.PI);
    ctx.fill();

    // Número na camisa (com cor de alto contraste)
    ctx.fillStyle = (team.jerseyStyle === 'white-clean' && !p.isAwayKit) ? '#0F172A' : '#FFFFFF';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.id === 'p1' ? '10' : '7', 0, -2);

    // Braço pequeno com punho cerrado
    const armSwing = isMoving ? Math.cos(time * 16) * 15 : 0;
    ctx.save();
    ctx.translate(-8, -8);
    ctx.rotate((armSwing * Math.PI) / 180);
    ctx.fillStyle = team.skinTone;
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 18, 5);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Faixa de Capitão neon se for partida espelho (mesmo time)
    if (p.isAwayKit) {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-5, 4, 10, 5);
    }
    ctx.restore();

    ctx.restore(); // fim tronco

    // 3. Perna e Chuteira Dianteira (Chute animado)
    let kickAngle = 0;
    let kickOffsetX = 12;
    let kickOffsetY = -8;

    if (p.isKicking) {
      // Arco do chute de -15 a 65 graus com extensão
      const t = p.kickProgress;
      const swing = Math.sin(t * Math.PI);
      kickAngle = -0.3 + swing * 1.5;
      kickOffsetX = 12 + swing * 34;
      kickOffsetY = -8 - swing * 26;
    } else if (isMoving) {
      kickOffsetY += walkBob;
    }

    this.drawBoot(ctx, kickOffsetX, kickOffsetY, kickAngle, socksColor, true);

    // 4. Cabeça Grande (Cabeçudo)
    const headOffsetY = p.headOffsetY - walkBob;
    ctx.save();
    ctx.translate(0, -headOffsetY);

    // Círculo base da cabeça com gradiente de pele suave
    const skinGrad = ctx.createRadialGradient(-8, -10, 8, 0, 0, p.headRadius);
    skinGrad.addColorStop(0, this.lightenColor(team.skinTone, 15));
    skinGrad.addColorStop(1, team.skinTone);

    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.arc(0, 0, p.headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    // Bochechas rosadas
    ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
    ctx.beginPath();
    ctx.arc(18, 8, 9, 0, Math.PI * 2);
    ctx.arc(-16, 8, 8, 0, Math.PI * 2);
    ctx.fill();

    // Olhos Expressivos estilo desenho animado
    this.drawCartoonEyes(ctx, p);

    // Nariz pequeno e fofo
    ctx.fillStyle = this.darkenColor(team.skinTone, 20);
    ctx.beginPath();
    ctx.arc(14, 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Boca (sorriso, determinada, aberta)
    this.drawMouth(ctx, p);

    // Cabelo do personagem
    this.drawHair(ctx, team, p.headRadius);

    // Faixa na cabeça (headband) se tiver
    if (team.headwear === 'headband') {
      ctx.fillStyle = team.secondaryColor;
      ctx.beginPath();
      ctx.roundRect(-p.headRadius - 1, -22, p.headRadius * 2 + 2, 10, 4);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore(); // fim cabeça

    // Indicador sobre o jogador
    ctx.save();
    ctx.translate(0, -headOffsetY - p.headRadius - 18);
    const bounce = Math.sin(time * 6) * 3;

    if (p.id === 'p1') {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(-7, -4 + bounce);
      ctx.lineTo(7, -4 + bounce);
      ctx.lineTo(0, 5 + bounce);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VOCÊ', 0, -8 + bounce);
    } else {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(-6, -3 + bounce);
      ctx.lineTo(6, -3 + bounce);
      ctx.lineTo(0, 4 + bounce);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.isAwayKit ? 'IA (2º)' : 'IA', 0, -7 + bounce);
    }
    ctx.restore();

    ctx.restore();
  }

  /**
   * Olhos de desenho animado que seguem a posição da bola
   */
  private drawCartoonEyes(ctx: CanvasRenderingContext2D, p: Player) {
    const eyeX = 14;
    const eyeY = -4;
    const lookX = p.eyeLookX;
    const lookY = p.eyeLookY;

    // Olho dianteiro (maior)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 11, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Pupila dianteira
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(eyeX + lookX, eyeY + lookY, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Brilho do olho
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX + lookX - 1.8, eyeY + lookY - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Sobrancelha dianteira
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (p.mouthState === 'determined') {
      ctx.moveTo(eyeX - 8, eyeY - 14);
      ctx.lineTo(eyeX + 10, eyeY - 10);
    } else {
      ctx.moveTo(eyeX - 10, eyeY - 12);
      ctx.lineTo(eyeX + 10, eyeY - 14);
    }
    ctx.stroke();
  }

  /**
   * Boca animada do personagem
   */
  private drawMouth(ctx: CanvasRenderingContext2D, p: Player) {
    ctx.save();
    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';

    if (p.mouthState === 'open' || p.mouthState === 'happy') {
      // Boca aberta gritando ou sorrindo
      ctx.beginPath();
      ctx.arc(8, 16, 9, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Língua
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(8, 20, 6, 0, Math.PI);
      ctx.fill();
    } else if (p.mouthState === 'determined') {
      // Dentes cerrados
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(4, 15, 14, 5, 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Sorriso simpático de lado
      ctx.beginPath();
      ctx.arc(8, 14, 8, 0.2, Math.PI * 0.85);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Cabelo procedural cartunesco
   */
  private drawHair(ctx: CanvasRenderingContext2D, team: Player['team'], radius: number) {
    ctx.save();
    ctx.fillStyle = team.hairColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;

    const style = team.hairStyle;
    if (style === 'spiky') {
      // Cabelo espetado
      ctx.beginPath();
      ctx.moveTo(-radius + 6, -10);
      ctx.lineTo(-radius, -radius * 0.7);
      ctx.lineTo(-radius * 0.5, -radius - 12);
      ctx.lineTo(0, -radius * 0.9);
      ctx.lineTo(radius * 0.5, -radius - 16);
      ctx.lineTo(radius * 0.8, -radius * 0.8);
      ctx.lineTo(radius + 4, -10);
      ctx.lineTo(radius * 0.4, -radius * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (style === 'curly' || style === 'afro') {
      // Cabelo crespo / cacheado volumoso
      const bumpCount = style === 'afro' ? 8 : 6;
      ctx.beginPath();
      for (let i = 0; i <= bumpCount; i++) {
        const ang = Math.PI + (i / bumpCount) * Math.PI;
        const bx = Math.cos(ang) * (radius + 6);
        const by = Math.sin(ang) * (radius + 6);
        ctx.arc(bx, by, 14, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();
    } else if (style === 'classic') {
      // Topete clássico
      ctx.beginPath();
      ctx.arc(0, -12, radius + 2, Math.PI * 0.85, Math.PI * 2.15);
      ctx.lineTo(radius, -10);
      ctx.quadraticCurveTo(0, -radius * 1.3, -radius + 4, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // Bald não desenha nada
    ctx.restore();
  }

  /**
   * Chuteira com travas e meião
   */
  private drawBoot(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    sockColor: string,
    isCleatUp: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Meião
    ctx.fillStyle = sockColor;
    ctx.fillRect(-5, -12, 10, 12);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(-5, -12, 10, 12);

    // Chuteira base
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-8, 0, 22, 10, [2, 6, 2, 2]);
    ctx.fill();

    // Faixa colorida na chuteira
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, 0, 4, 10);

    // Travas de futebol na sola
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, 9, 3, 3);
    ctx.fillRect(4, 9, 3, 3);
    ctx.fillRect(10, 9, 3, 3);

    ctx.restore();
  }

  /**
   * Bola com pentágonos desenhados e rotação realística
   */
  private drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
    ctx.save();

    // Rastro de velocidade, chute potente ou super chute
    if (ball.trail.length > 1) {
      ball.trail.forEach(t => {
        ctx.fillStyle = t.isSuper
          ? `rgba(249, 115, 22, ${t.alpha * 0.6})`
          : (ball.isKicked
              ? `rgba(250, 204, 21, ${t.alpha * 0.45})`
              : `rgba(255, 255, 255, ${t.alpha * 0.25})`);
        ctx.beginPath();
        ctx.arc(t.x, t.y, ball.radius * (0.6 + t.alpha * 0.4), 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    // Chamas ao redor se estiver em Super Chute
    if (ball.isSuper) {
      ctx.save();
      const fireGrad = ctx.createRadialGradient(0, 0, ball.radius, 0, 0, ball.radius + 18);
      fireGrad.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
      fireGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.6)');
      fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(0, 0, ball.radius + 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Gradiente esférico 3D da bola
    const ballGrad = ctx.createRadialGradient(-6, -6, 2, 0, 0, ball.radius);
    ballGrad.addColorStop(0, '#ffffff');
    ballGrad.addColorStop(0.7, '#f1f5f9');
    ballGrad.addColorStop(1, '#94a3b8');

    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Pentágono central
    ctx.fillStyle = '#0f172a';
    this.drawPentagon(ctx, 0, 0, 6.5);

    // Pentágonos adjacentes de costura
    for (let i = 0; i < 5; i++) {
      const ang = (i * 72 * Math.PI) / 180;
      const px = Math.cos(ang) * 14;
      const py = Math.sin(ang) * 14;
      this.drawPentagon(ctx, px, py, 4.2);

      // Linhas de costura conectando
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * 6, Math.sin(ang) * 6);
      ctx.lineTo(px, py);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawPentagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 18) * (Math.PI / 180);
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Desenha partículas e textos flutuantes
   */
  private drawParticles(ctx: CanvasRenderingContext2D, particles: ParticleSystem) {
    // 1. Partículas
    particles.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'square') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      } else if (p.shape === 'spark') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'smoke') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'shockwave' || p.shape === 'ring') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1.5, 3.5 * p.alpha);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 2. Textos flutuantes
    particles.floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.translate(ft.x, ft.y);
      ctx.scale(ft.scale, ft.scale);

      ctx.font = '900 28px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sombra e contorno preto forte
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 5;
      ctx.strokeText(ft.text, 0, 0);

      // Texto preenchido
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, 0, 0);

      ctx.restore();
    });
  }

  // Utilitários de cor
  private lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  private darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }
}
