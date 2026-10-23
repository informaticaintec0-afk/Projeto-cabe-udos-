/**
 * Escudos dos 8 Clubes Fictícios de Futebol Retrô
 * Implementação 100% local em SVG e Canvas 2D.
 * Sem nenhuma imagem externa, sem chamadas de rede e totalmente offline.
 */

import React from 'react';

export interface CrestProps {
  clubId: string;
  size?: number;
  className?: string;
}

/**
 * Componente React SVG com renderização vetorial nítida dos escudos
 */
export const ClubCrest: React.FC<CrestProps> = ({ clubId, size = 48, className = '' }) => {
  switch (clubId) {
    case 'rubro_imperial':
      // 1. RUBRO IMPERIAL: listras diagonais vermelhas e pretas com estrela dourada
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="rubroClip">
              <path d="M50 5 L88 20 C88 65 50 95 50 95 C50 95 12 65 12 20 Z" />
            </clipPath>
          </defs>
          {/* Borda dourada externa */}
          <path
            d="M50 3 L90 19 C90 67 50 97 50 97 C50 97 10 67 10 19 Z"
            fill="#FACC15"
            stroke="#B45309"
            strokeWidth="2"
          />
          {/* Fundo do escudo com listras diagonais vermelhas e pretas */}
          <g clipPath="url(#rubroClip)">
            <rect width="100" height="100" fill="#DC2626" />
            {/* Listras diagonais pretas */}
            <path d="M-20 0 L40 100 L20 100 L-40 0 Z" fill="#18181B" />
            <path d="M10 0 L70 100 L50 100 L-10 0 Z" fill="#18181B" />
            <path d="M40 0 L100 100 L80 100 L20 0 Z" fill="#18181B" />
            <path d="M70 0 L130 100 L110 100 L50 0 Z" fill="#18181B" />
            {/* Faixa superior preta suave para destaque da estrela */}
            <path d="M12 20 L88 20 L88 38 L12 38 Z" fill="rgba(24,24,27,0.7)" />
          </g>
          {/* Pequena estrela dourada no topo */}
          <polygon
            points="50,15 53,24 62,24 55,29 57,38 50,33 43,38 45,29 38,24 47,24"
            fill="#FACC15"
            stroke="#78350F"
            strokeWidth="0.8"
          />
        </svg>
      );

    case 'cruz_de_prata':
      // 2. CRUZ DE PRATA: fundo preto com faixa branca e cruz prateada estilizada
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="cruzClip">
              <path d="M50 5 L88 18 C88 64 50 95 50 95 C50 95 12 64 12 18 Z" />
            </clipPath>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          {/* Borda prateada externa */}
          <path
            d="M50 3 L90 17 C90 66 50 97 50 97 C50 97 10 66 10 17 Z"
            fill="url(#silverGrad)"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Conteúdo com faixa branca */}
          <g clipPath="url(#cruzClip)">
            <rect width="100" height="100" fill="#09090B" />
            {/* Faixa diagonal branca */}
            <polygon points="12,18 36,18 90,82 66,82" fill="#F8FAFC" />
            {/* Cruz prateada estilizada */}
            <g transform="translate(50, 48)">
              {/* Cruz pátea / medieval prateada */}
              <path
                d="M-5 -22 L5 -22 L3 -6 L18 -8 L18 2 L3 4 L6 20 L-6 20 L-3 4 L-18 2 L-18 -8 L-3 -6 Z"
                fill="url(#silverGrad)"
                stroke="#0F172A"
                strokeWidth="1.2"
              />
              <circle cx="0" cy="-1" r="3" fill="#E2E8F0" />
            </g>
          </g>
        </svg>
      );

    case 'tricolor_laranjeiras':
      // 3. TRICOLOR DAS LARANJEIRAS: faixas verticais vinho, verde e branco com moldura elegante
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="tricolorClip">
              <path d="M50 5 L88 20 C88 65 50 95 50 95 C50 95 12 20 12 20 Z" />
            </clipPath>
          </defs>
          {/* Moldura dourada elegante */}
          <path
            d="M50 3 L90 19 C90 67 50 97 50 97 C50 97 10 67 10 19 Z"
            fill="#D97706"
            stroke="#78350F"
            strokeWidth="1.5"
          />
          <g clipPath="url(#tricolorClip)">
            <rect width="100" height="100" fill="#047857" />
            {/* Faixa vertical Vinho à esquerda */}
            <rect x="0" y="0" width="36" height="100" fill="#881337" />
            {/* Faixa vertical Branca no meio */}
            <rect x="36" y="0" width="28" height="100" fill="#F8FAFC" />
            {/* Faixa vertical Verde à direita */}
            <rect x="64" y="0" width="36" height="100" fill="#065F46" />
            {/* Linhas douradas divisórias */}
            <line x1="36" y1="0" x2="36" y2="100" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="64" y1="0" x2="64" y2="100" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Ramos elegantes estilizados no centro */}
            <circle cx="50" cy="46" r="10" fill="#881337" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M47 43 L53 43 L50 50 Z" fill="#FBBF24" />
          </g>
        </svg>
      );

    case 'estrela_alvinegra':
      // 4. ESTRELA ALVINEGRA: fundo preto com grande estrela branca simétrica
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="estrelaClip">
              <path d="M50 5 C75 5 88 15 88 35 C88 66 50 95 50 95 C50 95 12 66 12 35 C12 15 25 5 50 5 Z" />
            </clipPath>
          </defs>
          {/* Borda branca e preta reforçada */}
          <path
            d="M50 3 C77 3 90 14 90 35 C90 68 50 97 50 97 C50 97 10 68 10 35 C10 14 23 3 50 3 Z"
            fill="#FFFFFF"
            stroke="#09090B"
            strokeWidth="2"
          />
          <g clipPath="url(#estrelaClip)">
            <rect width="100" height="100" fill="#09090B" />
            {/* Filete interno sutil */}
            <path
              d="M50 9 C72 9 84 18 84 35 C84 62 50 89 50 89 C50 89 16 62 16 35 C16 18 28 9 50 9 Z"
              stroke="#F8FAFC"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Estrela branca solitária grande e nítida */}
            <polygon
              points="50,22 56,38 74,38 60,49 65,66 50,55 35,66 40,49 26,38 44,38"
              fill="#FFFFFF"
              stroke="#09090B"
              strokeWidth="1.2"
            />
          </g>
        </svg>
      );

    case 'uniao_tricolor':
      // 5. UNIÃO TRICOLOR PAULISTA: geométrico angular com faixas horizontais assimétricas e losango central
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="uniaoClip">
              {/* Formato geométrico angular hexagonal */}
              <polygon points="50,4 90,20 84,70 50,96 16,70 10,20" />
            </clipPath>
          </defs>
          {/* Borda angular externa */}
          <polygon
            points="50,2 92,19 86,72 50,98 14,72 8,19"
            fill="#FFFFFF"
            stroke="#09090B"
            strokeWidth="2.5"
          />
          <g clipPath="url(#uniaoClip)">
            {/* Faixa superior Vermelha */}
            <rect x="0" y="0" width="100" height="38" fill="#DC2626" />
            {/* Faixa intermediária Branca */}
            <rect x="0" y="38" width="100" height="24" fill="#FFFFFF" />
            {/* Faixa inferior Preta */}
            <rect x="0" y="62" width="100" height="38" fill="#18181B" />
            {/* Losango branco central com relevo */}
            <polygon
              points="50,26 68,50 50,74 32,50"
              fill="#FFFFFF"
              stroke="#09090B"
              strokeWidth="2"
            />
            <polygon
              points="50,33 60,50 50,67 40,50"
              fill="#DC2626"
            />
            <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'esmeralda_real':
      // 6. ESMERALDA REAL: verde, branco e dourado com sol dourado sobre montanhas geométricas
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="esmeraldaClip">
              <path d="M50 5 L88 22 C88 66 50 95 50 95 C50 95 12 66 12 22 Z" />
            </clipPath>
          </defs>
          {/* Borda dourada nobre */}
          <path
            d="M50 3 L90 21 C90 68 50 97 50 97 C50 97 10 68 10 21 Z"
            fill="#FACC15"
            stroke="#854D0E"
            strokeWidth="2"
          />
          <g clipPath="url(#esmeraldaClip)">
            {/* Fundo Verde Esmeralda */}
            <rect width="100" height="100" fill="#047857" />
            {/* Sol Dourado Radiante */}
            <circle cx="50" cy="38" r="14" fill="#FACC15" />
            {/* Raios do Sol */}
            <g stroke="#FACC15" strokeWidth="2" strokeLinecap="round">
              <line x1="50" y1="18" x2="50" y2="14" />
              <line x1="33" y1="26" x2="30" y2="23" />
              <line x1="67" y1="26" x2="70" y2="23" />
              <line x1="28" y1="38" x2="24" y2="38" />
              <line x1="72" y1="38" x2="76" y2="38" />
            </g>
            {/* Montanhas geométricas em tons de verde e branco */}
            <polygon points="10,80 38,44 65,80" fill="#065F46" />
            <polygon points="38,44 45,56 32,56" fill="#F8FAFC" />
            <polygon points="40,85 64,48 88,85" fill="#059669" />
            <polygon points="64,48 70,58 58,58" fill="#F8FAFC" />
            {/* Faixa inferior de base */}
            <path d="M12 75 L88 75 L88 95 L12 95 Z" fill="#064E3B" />
          </g>
        </svg>
      );

    case 'corinthians_povo':
      // 7. CORINTHIANS DO POVO: preto e branco exclusivo, listras verticais e símbolo central abstrato
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="povoClip">
              {/* Escudo arredondado clássico */}
              <path d="M50 5 C78 5 88 18 88 38 C88 68 50 95 50 95 C50 95 12 68 12 38 C12 18 22 5 50 5 Z" />
            </clipPath>
          </defs>
          {/* Borda dupla preto e branco */}
          <path
            d="M50 3 C80 3 90 17 90 38 C90 70 50 97 50 97 C50 97 10 70 10 38 C10 17 20 3 50 3 Z"
            fill="#FFFFFF"
            stroke="#09090B"
            strokeWidth="3"
          />
          <g clipPath="url(#povoClip)">
            {/* Fundo com listras verticais pretas e brancas */}
            <rect width="100" height="100" fill="#FFFFFF" />
            <rect x="0" y="0" width="16" height="100" fill="#09090B" />
            <rect x="28" y="0" width="14" height="100" fill="#09090B" />
            <rect x="58" y="0" width="14" height="100" fill="#09090B" />
            <rect x="84" y="0" width="16" height="100" fill="#09090B" />
            {/* Símbolo central abstrato: círculo duplo alvinegro com cruz angular */}
            <circle cx="50" cy="46" r="20" fill="#09090B" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="50" cy="46" r="13" fill="#FFFFFF" stroke="#09090B" strokeWidth="2" />
            <polygon points="50,38 53,46 50,54 47,46" fill="#09090B" />
            <polygon points="42,46 50,43 58,46 50,49" fill="#09090B" />
          </g>
        </svg>
      );

    case 'atlantico_santista':
      // 8. ATLÂNTICO SANTISTA: exclusivamente preto e branco, onda estilizada e peixe geométrico
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="atlanticoClip">
              <path d="M50 5 L88 20 C88 66 50 95 50 95 C50 95 12 66 12 20 Z" />
            </clipPath>
          </defs>
          {/* Borda alvinegra nítida */}
          <path
            d="M50 3 L90 19 C90 68 50 97 50 97 C50 97 10 68 10 19 Z"
            fill="#09090B"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <g clipPath="url(#atlanticoClip)">
            {/* Metade superior branca, inferior preta */}
            <rect width="100" height="50" fill="#FFFFFF" />
            <rect y="50" width="100" height="50" fill="#09090B" />
            {/* Onda estilizada no horizonte */}
            <path
              d="M10 50 Q30 38 50 50 T90 50 L90 65 L10 65 Z"
              fill="#09090B"
            />
            <path
              d="M10 52 Q30 42 50 52 T90 52"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
            />
            {/* Peixe geométrico estilizado no centro superior */}
            <g transform="translate(50, 36) scale(0.9)">
              {/* Corpo do peixe */}
              <path
                d="M-18 0 Q0 -9 14 0 Q0 9 -18 0 Z"
                fill="#09090B"
              />
              {/* Cauda */}
              <polygon points="12,0 22,-8 22,8" fill="#09090B" />
              {/* Olho branco do peixe */}
              <circle cx="-10" cy="-1.5" r="2" fill="#FFFFFF" />
            </g>
            {/* Estrelas sutis no mar */}
            <circle cx="34" cy="74" r="2" fill="#FFFFFF" />
            <circle cx="50" cy="80" r="2.5" fill="#FFFFFF" />
            <circle cx="66" cy="74" r="2" fill="#FFFFFF" />
          </g>
        </svg>
      );

    default:
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs ${className}`}
        >
          ⚽
        </div>
      );
  }
};

/**
 * Desenha o escudo diretamente em um contexto 2D de Canvas
 * Útil para desenhar no placar e em sobreposições do canvas sem gastar DOM
 */
export function drawCrestToCanvas(
  ctx: CanvasRenderingContext2D,
  clubId: string,
  x: number,
  y: number,
  radius: number = 14
) {
  ctx.save();
  ctx.translate(x, y);

  // Fundo circular com borda
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.clip();

  switch (clubId) {
    case 'rubro_imperial': {
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.moveTo(-radius, radius);
      ctx.lineTo(radius, -radius);
      ctx.lineTo(radius, radius);
      ctx.fill();
      // Estrela
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.35, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'cruz_de_prata': {
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      // Faixa branca
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(-radius, -radius * 0.5);
      ctx.lineTo(-radius * 0.5, -radius);
      ctx.lineTo(radius, radius * 0.5);
      ctx.lineTo(radius * 0.5, radius);
      ctx.closePath();
      ctx.fill();
      // Cruz prateada
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(-radius * 0.15, -radius * 0.6, radius * 0.3, radius * 1.2);
      ctx.fillRect(-radius * 0.6, -radius * 0.15, radius * 1.2, radius * 0.3);
      break;
    }
    case 'tricolor_laranjeiras': {
      ctx.fillStyle = '#881337';
      ctx.fillRect(-radius, -radius, radius * 0.65, radius * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-radius * 0.35, -radius, radius * 0.7, radius * 2);
      ctx.fillStyle = '#047857';
      ctx.fillRect(radius * 0.35, -radius, radius * 0.65, radius * 2);
      break;
    }
    case 'estrela_alvinegra': {
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'uniao_tricolor': {
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 0.7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-radius, -radius * 0.3, radius * 2, radius * 0.6);
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius, radius * 0.3, radius * 2, radius * 0.7);
      break;
    }
    case 'esmeralda_real': {
      ctx.fillStyle = '#059669';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.2, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(-radius * 0.7, radius);
      ctx.lineTo(0, radius * 0.2);
      ctx.lineTo(radius * 0.7, radius);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'corinthians_povo': {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius, -radius, radius * 0.4, radius * 2);
      ctx.fillRect(0, -radius, radius * 0.4, radius * 2);
      ctx.fillRect(radius * 0.6, -radius, radius * 0.4, radius * 2);
      // Anel central
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'atlantico_santista': {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-radius, -radius, radius * 2, radius);
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius, 0, radius * 2, radius);
      // Onda e peixe
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.3, radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, radius * 0.35, radius * 0.25, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default:
      ctx.fillStyle = '#334155';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      break;
  }

  ctx.restore();

  // Borda externa
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}
