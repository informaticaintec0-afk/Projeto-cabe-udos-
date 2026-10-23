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

    case 'cruzeiro_celeste':
      // 9. CRUZEIRO CELESTE: azul royal com constelação do Cruzeiro do Sul em estrelas brancas
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="cruzeiroClip">
              <path d="M50 5 L88 20 C88 66 50 95 50 95 C50 95 12 66 12 20 Z" />
            </clipPath>
          </defs>
          <path d="M50 3 L90 19 C90 68 50 97 50 97 C50 97 10 68 10 19 Z" fill="#FACC15" stroke="#1D4ED8" strokeWidth="2" />
          <g clipPath="url(#cruzeiroClip)">
            <rect width="100" height="100" fill="#1D4ED8" />
            <circle cx="50" cy="50" r="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* 5 Estrelas da Constelação */}
            {/* Alfa Crucis (Sul) */}
            <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#FFFFFF" />
            {/* Gama Crucis (Norte) */}
            <polygon points="50,22 52,27 57,27 53,30 54,35 50,32 46,35 47,30 43,27 48,27" fill="#FFFFFF" />
            {/* Beta Crucis (Leste) */}
            <polygon points="34,45 36,50 41,50 37,53 38,58 34,55 30,58 31,53 27,50 32,50" fill="#FFFFFF" />
            {/* Delta Crucis (Oeste) */}
            <polygon points="66,42 68,47 73,47 69,50 70,55 66,52 62,55 63,50 59,47 64,47" fill="#FFFFFF" />
            {/* Epsilon Crucis (Intrometida) */}
            <polygon points="57,53 58,56 61,56 59,58 60,61 57,59 55,61 56,58 53,56 56,56" fill="#FACC15" />
          </g>
        </svg>
      );

    case 'furacao_rubro_negro':
      // 10. FURACÃO RUBRO-NEGRO: vermelho e preto com faixas diagonais dinâmicas e tufão
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="furacaoClip">
              <polygon points="50,5 92,20 86,76 50,96 14,76 8,20" />
            </clipPath>
          </defs>
          <polygon points="50,3 94,19 88,78 50,98 12,78 6,19" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2.5" />
          <g clipPath="url(#furacaoClip)">
            <rect width="100" height="100" fill="#18181B" />
            {/* Faixas em tufão / vendaval diagonal */}
            <polygon points="20,0 45,0 10,100 -15,100" fill="#DC2626" />
            <polygon points="48,0 73,0 38,100 13,100" fill="#DC2626" />
            <polygon points="76,0 101,0 66,100 41,100" fill="#DC2626" />
            <path d="M30 50 Q 50 30, 70 50 T 50 75 Z" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'coritiba_araucarias':
      // 11. CORITIBA DAS ARAUCÁRIAS: verde e branco com silhueta da majestosa Araucária
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="araucariaClip">
              <circle cx="50" cy="50" r="44" />
            </clipPath>
          </defs>
          <circle cx="50" cy="50" r="46" fill="#15803D" stroke="#FFFFFF" strokeWidth="3" />
          <g clipPath="url(#araucariaClip)">
            <rect width="100" height="100" fill="#15803D" />
            {/* Duas faixas brancas horizontais */}
            <rect x="0" y="32" width="100" height="8" fill="#FFFFFF" />
            <rect x="0" y="60" width="100" height="8" fill="#FFFFFF" />
            {/* Araucária central estilizada */}
            <g transform="translate(50, 48)">
              <rect x="-2" y="-10" width="4" height="28" fill="#451A03" />
              {/* Copas da araucária em leque */}
              <ellipse cx="0" cy="-14" rx="22" ry="5" fill="#166534" stroke="#FFFFFF" strokeWidth="1" />
              <ellipse cx="0" cy="-20" rx="16" ry="4" fill="#22C55E" />
              <circle cx="-16" cy="-14" r="3" fill="#FFFFFF" />
              <circle cx="16" cy="-14" r="3" fill="#FFFFFF" />
            </g>
          </g>
        </svg>
      );

    case 'chapeco_esmeralda':
      // 12. CHAPECÓ ESMERALDA: verde esmeralda com estrela dourada da esperança e flecha condá
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="chapecoClip">
              <path d="M50 8 L86 24 C86 66 50 94 50 94 C50 94 14 66 14 24 Z" />
            </clipPath>
          </defs>
          {/* Estrela dourada no topo acima do escudo */}
          <polygon points="50,1 52,6 57,6 53,9 54,14 50,11 46,14 47,9 43,6 48,6" fill="#FACC15" />
          <path d="M50 7 L88 23 C88 68 50 96 50 96 C50 96 12 68 12 23 Z" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
          <g clipPath="url(#chapecoClip)">
            <rect width="100" height="100" fill="#047857" />
            {/* Ramos verdes da esperança */}
            <circle cx="50" cy="50" r="26" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <path d="M35 55 Q 50 35, 65 55 Q 50 62, 35 55 Z" fill="#FACC15" />
            <polygon points="50,32 54,44 50,42 46,44" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'leao_amazonia':
      // 13. LEÃO DA AMAZÔNIA: azul-marinho profundo com perfil do leão estilizado em azul celeste e branco
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="leaoClip">
              <path d="M50 5 L88 20 C88 66 50 95 50 95 C50 95 12 66 12 20 Z" />
            </clipPath>
          </defs>
          <path d="M50 3 L90 19 C90 68 50 97 50 97 C50 97 10 68 10 19 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
          <g clipPath="url(#leaoClip)">
            <rect width="100" height="100" fill="#0F172A" />
            {/* Faixa diagonal azul celeste */}
            <polygon points="12,20 30,20 88,80 70,80" fill="#0369A1" />
            {/* Cabeça do Leão estilizada */}
            <g transform="translate(50, 48)">
              {/* Juba do leão */}
              <circle cx="0" cy="0" r="22" fill="#0284C7" />
              <polygon points="0,-24 7,-15 -7,-15" fill="#38BDF8" />
              <polygon points="-22,-5 -14,2 -18,-12" fill="#38BDF8" />
              <polygon points="22,-5 14,2 18,-12" fill="#38BDF8" />
              {/* Rosto do leão */}
              <circle cx="0" cy="2" r="14" fill="#FFFFFF" />
              <polygon points="-4,2 4,2 0,7" fill="#0F172A" />
              <circle cx="-5" cy="-2" r="2" fill="#0F172A" />
              <circle cx="5" cy="-2" r="2" fill="#0F172A" />
            </g>
          </g>
        </svg>
      );

    case 'sol_de_ouro':
      // 14. SOL DE OURO: amarelo solar com sol geométrico sobre verde e preto pantaneiro
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="solClip">
              <polygon points="50,4 92,24 76,88 50,96 24,88 8,24" />
            </clipPath>
          </defs>
          <polygon points="50,2 94,23 78,90 50,98 22,90 6,23" fill="#15803D" stroke="#18181B" strokeWidth="2" />
          <g clipPath="url(#solClip)">
            <rect width="100" height="100" fill="#EAB308" />
            {/* Metade inferior verde e preta */}
            <polygon points="0,55 100,55 100,100 0,100" fill="#15803D" />
            <polygon points="0,75 100,75 100,100 0,100" fill="#18181B" />
            {/* Sol radiante */}
            <g transform="translate(50, 48)">
              <circle cx="0" cy="0" r="18" fill="#FACC15" stroke="#78350F" strokeWidth="1.5" />
              {/* Raios do sol */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                <line
                  key={ang}
                  x1={Math.cos((ang * Math.PI) / 180) * 20}
                  y1={Math.sin((ang * Math.PI) / 180) * 20}
                  x2={Math.cos((ang * Math.PI) / 180) * 27}
                  y2={Math.sin((ang * Math.PI) / 180) * 27}
                  stroke="#CA8A04"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ))}
              <circle cx="0" cy="0" r="10" fill="#FEF08A" />
            </g>
          </g>
        </svg>
      );

    case 'bahia_tricolor':
      // 15. BAHIA TRICOLOR: azul, vermelho e branco com estrela da vitória e faixas clássicas
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="bahiaClip">
              <path d="M50 5 L88 20 C88 66 50 95 50 95 C50 95 12 66 12 20 Z" />
            </clipPath>
          </defs>
          <path d="M50 3 L90 19 C90 68 50 97 50 97 C50 97 10 68 10 19 Z" fill="#FACC15" stroke="#1E3A8A" strokeWidth="2" />
          <g clipPath="url(#bahiaClip)">
            {/* Fundo azul */}
            <rect width="100" height="100" fill="#2563EB" />
            {/* Faixa branca horizontal */}
            <rect x="0" y="34" width="100" height="32" fill="#FFFFFF" />
            {/* Faixa vermelha horizontal */}
            <rect x="0" y="44" width="100" height="12" fill="#DC2626" />
            {/* Timão / Círculo nobre central com estrela */}
            <circle cx="50" cy="50" r="18" fill="#1E3A8A" stroke="#FACC15" strokeWidth="2" />
            <polygon points="50,38 53,46 61,46 55,51 57,59 50,54 43,59 45,51 39,46 47,46" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'tricolor_pampas':
      // 16. TRICOLOR DOS PAMPAS: azul celeste, preto e branco em listras verticais com monograma prateado
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="pampasClip">
              <path d="M50 5 C76 5 88 18 88 38 C88 68 50 95 50 95 C50 95 12 68 12 38 C12 18 24 5 50 5 Z" />
            </clipPath>
          </defs>
          <path d="M50 3 C78 3 90 17 90 38 C90 70 50 97 50 97 C50 97 10 70 10 38 C10 17 22 3 50 3 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <g clipPath="url(#pampasClip)">
            <rect width="100" height="100" fill="#0284C7" />
            {/* Listras pretas com frisos brancos */}
            <rect x="22" y="0" width="16" height="100" fill="#18181B" />
            <rect x="42" y="0" width="16" height="100" fill="#18181B" />
            <rect x="62" y="0" width="16" height="100" fill="#18181B" />
            <rect x="20" y="0" width="2" height="100" fill="#FFFFFF" />
            <rect x="38" y="0" width="4" height="100" fill="#FFFFFF" />
            <rect x="58" y="0" width="4" height="100" fill="#FFFFFF" />
            <rect x="78" y="0" width="2" height="100" fill="#FFFFFF" />
            {/* Bola e faixa central */}
            <circle cx="50" cy="50" r="17" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
            <circle cx="50" cy="50" r="13" fill="#0284C7" />
            <text x="50" y="55" fontSize="12" fontWeight="900" fill="#FFFFFF" textAnchor="middle" fontFamily="Outfit, sans-serif">P</text>
          </g>
        </svg>
      );

    case 'internacional_gaucho':
      // 17. INTERNACIONAL GAÚCHO: vermelho vibrante com coroa de louros e monograma clássico branco
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="interClip">
              <circle cx="50" cy="50" r="44" />
            </clipPath>
          </defs>
          <circle cx="50" cy="50" r="46" fill="#DC2626" stroke="#FFFFFF" strokeWidth="3" />
          <g clipPath="url(#interClip)">
            <rect width="100" height="100" fill="#DC2626" />
            <circle cx="50" cy="50" r="38" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
            {/* Coroa de Louros estilizada em arco */}
            <path d="M26 50 C26 70 74 70 74 50" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeDasharray="4 4" />
            {/* Letras entrelaçadas IG */}
            <g transform="translate(50, 48)">
              <circle cx="0" cy="0" r="16" fill="#B91C1C" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="6" fontSize="16" fontWeight="900" fill="#FFFFFF" textAnchor="middle" fontFamily="Outfit, sans-serif">I</text>
            </g>
          </g>
        </svg>
      );

    case 'atletico_gerais':
      // 18. ATLÉTICO DAS GERAIS: escudo pontiagudo alvinegro com o Galo de Aço imponente
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="galoClip">
              <path d="M50 4 L90 20 L84 66 L50 96 L16 66 L10 20 Z" />
            </clipPath>
          </defs>
          <path d="M50 2 L92 19 L86 68 L50 98 L14 68 L8 19 Z" fill="#FACC15" stroke="#18181B" strokeWidth="2.5" />
          <g clipPath="url(#galoClip)">
            <rect width="100" height="100" fill="#FFFFFF" />
            {/* Listras pretas verticais */}
            <rect x="18" y="0" width="13" height="100" fill="#18181B" />
            <rect x="44" y="0" width="12" height="100" fill="#18181B" />
            <rect x="69" y="0" width="13" height="100" fill="#18181B" />
            {/* Galo de Aço no topo central */}
            <g transform="translate(50, 42)">
              <circle cx="0" cy="0" r="15" fill="#18181B" stroke="#FACC15" strokeWidth="2" />
              {/* Crista vermelha do galo */}
              <polygon points="0,-12 4,-7 0,-4" fill="#DC2626" />
              <polygon points="4,-11 7,-6 3,-4" fill="#DC2626" />
              {/* Bico dourado */}
              <polygon points="6,0 12,2 6,4" fill="#FACC15" />
              {/* Olho de aço */}
              <circle cx="1" cy="-1" r="2.5" fill="#FFFFFF" />
              <circle cx="2" cy="-1" r="1" fill="#18181B" />
            </g>
          </g>
        </svg>
      );

    case 'braganca_rubro_negro':
      // 19. BRAGANÇA RUBRO-NEGRO: vermelho, branco e preto com turbina aerodinâmica
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="bragancaClip">
              <polygon points="50,4 90,24 80,82 50,96 20,82 10,24" />
            </clipPath>
          </defs>
          <polygon points="50,2 92,23 82,84 50,98 18,84 8,23" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2.5" />
          <g clipPath="url(#bragancaClip)">
            <rect width="100" height="100" fill="#DC2626" />
            {/* Base preta e branca */}
            <polygon points="0,50 100,50 100,100 0,100" fill="#18181B" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#FFFFFF" strokeWidth="4" />
            {/* Turbina com pás brancas */}
            <g transform="translate(50, 46)">
              <circle cx="0" cy="0" r="20" fill="#18181B" stroke="#FFFFFF" strokeWidth="2" />
              {[0, 90, 180, 270].map((ang) => (
                <path
                  key={ang}
                  d="M0 0 L14 -5 Q18 0 12 6 Z"
                  fill="#FFFFFF"
                  transform={`rotate(${ang})`}
                />
              ))}
              <circle cx="0" cy="0" r="5" fill="#DC2626" />
            </g>
          </g>
        </svg>
      );

    case 'vitoria_rubra':
      // 20. VITÓRIA RUBRA: listras horizontais vermelho e preto com fúria rubra e âncora dourada
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="vitoriaClip">
              <path d="M50 5 L88 20 C88 66 50 95 50 95 C50 95 12 66 12 20 Z" />
            </clipPath>
          </defs>
          <path d="M50 3 L90 19 C90 68 50 97 50 97 C50 97 10 68 10 19 Z" fill="#FACC15" stroke="#18181B" strokeWidth="2" />
          <g clipPath="url(#vitoriaClip)">
            <rect width="100" height="100" fill="#18181B" />
            {/* Listras horizontais vermelhas */}
            <rect x="0" y="20" width="100" height="12" fill="#DC2626" />
            <rect x="0" y="44" width="100" height="12" fill="#DC2626" />
            <rect x="0" y="68" width="100" height="12" fill="#DC2626" />
            {/* Monograma central V dourado com garras */}
            <g transform="translate(50, 48)">
              <circle cx="0" cy="0" r="18" fill="#18181B" stroke="#FACC15" strokeWidth="2" />
              <path d="M-8 -9 L0 10 L8 -9 L4 -9 L0 4 L-4 -9 Z" fill="#FACC15" stroke="#B45309" strokeWidth="0.8" />
            </g>
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
    case 'cruzeiro_celeste': {
      ctx.fillStyle = '#1D4ED8';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#FFFFFF';
      // 5 estrelas em pontinhos
      const pts = [[0, -radius * 0.55], [0, radius * 0.55], [-radius * 0.45, -radius * 0.1], [radius * 0.45, -radius * 0.15], [radius * 0.18, radius * 0.1]];
      pts.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, radius * 0.14, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
    case 'furacao_rubro_negro': {
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.moveTo(-radius, radius * 0.6);
      ctx.lineTo(radius * 0.6, -radius);
      ctx.lineTo(radius, -radius);
      ctx.lineTo(-radius * 0.2, radius);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'coritiba_araucarias': {
      ctx.fillStyle = '#15803D';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-radius, -radius * 0.35, radius * 2, radius * 0.2);
      ctx.fillRect(-radius, radius * 0.2, radius * 2, radius * 0.2);
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.1, radius * 0.32, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'chapeco_esmeralda': {
      ctx.fillStyle = '#047857';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.55, radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'leao_amazonia': {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, radius * 0.05, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'sol_de_ouro': {
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(-radius, -radius, radius * 2, radius);
      ctx.fillStyle = '#15803D';
      ctx.fillRect(-radius, 0, radius * 2, radius);
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }
    case 'bahia_tricolor': {
      ctx.fillStyle = '#2563EB';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 0.7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-radius, -radius * 0.3, radius * 2, radius * 0.6);
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-radius, -radius * 0.05, radius * 2, radius * 0.35);
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'tricolor_pampas': {
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius * 0.5, -radius, radius * 0.35, radius * 2);
      ctx.fillRect(radius * 0.15, -radius, radius * 0.35, radius * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'internacional_gaucho': {
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'atletico_gerais': {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius * 0.6, -radius, radius * 0.35, radius * 2);
      ctx.fillRect(radius * 0.25, -radius, radius * 0.35, radius * 2);
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(0, -radius * 0.2, radius * 0.15, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'braganca_rubro_negro': {
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-radius, -radius, radius * 2, radius);
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius, 0, radius * 2, radius);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'vitoria_rubra': {
      ctx.fillStyle = '#18181B';
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-radius, -radius * 0.6, radius * 2, radius * 0.3);
      ctx.fillRect(-radius, 0, radius * 2, radius * 0.3);
      ctx.fillRect(-radius, radius * 0.6, radius * 2, radius * 0.3);
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
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
