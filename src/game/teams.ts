/**
 * Os 8 Clubes Fictícios de Futebol Retrô
 * Cada clube possui identidade visual original, uniforme característico,
 * escudo exclusivo e habilidade especial balanceada que afeta a jogabilidade.
 */

import { TeamPreset } from './types';

export const TEAMS: TeamPreset[] = [
  {
    id: 'rubro_imperial',
    name: 'Rubro Imperial',
    shortName: 'RBR',
    inspiration: 'Tradição Rubro-Negra Carioca',
    identity: 'Ofensivo e Intenso',
    primaryColor: '#DC2626', // Vermelho vivo
    secondaryColor: '#18181B', // Preto
    accentColor: '#FACC15', // Estrela Dourada
    shortsColor: '#18181B', // Calção Preto
    socksColor: '#18181B', // Meias Escuras
    skinTone: '#D4976A',
    hairColor: '#18181B',
    hairStyle: 'spiky',
    jerseyStyle: 'striped-red-black',
    ability: {
      id: 'canhao',
      name: 'Canhão',
      shortDesc: 'Chute mais potente',
      effectDesc: 'Aumento moderado da força e velocidade do chute ao gol (+18% de potência).'
    }
  },
  {
    id: 'cruz_de_prata',
    name: 'Cruz de Prata',
    shortName: 'CRZ',
    inspiration: 'Tradição Alvinegra da Cruz',
    identity: 'Força e Jogo Aéreo',
    primaryColor: '#18181B', // Preto
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#CBD5E1', // Prata
    shortsColor: '#18181B', // Calção Preto
    socksColor: '#18181B', // Meias Pretas
    skinTone: '#C68642',
    hairColor: '#1F2937',
    hairStyle: 'curly',
    jerseyStyle: 'sash-white',
    ability: {
      id: 'muralha',
      name: 'Muralha',
      shortDesc: 'Cabeceios mais potentes',
      effectDesc: 'Cabeceios aéreos com impulso e impulsão vertical superiores (+25% de força aérea).'
    }
  },
  {
    id: 'tricolor_laranjeiras',
    name: 'Tricolor das Laranjeiras',
    shortName: 'TRI',
    inspiration: 'Tradição Tricolor Clássica',
    identity: 'Técnica e Controle de Bola',
    primaryColor: '#881337', // Vinho nobre
    secondaryColor: '#047857', // Verde esmeralda
    accentColor: '#FFFFFF', // Branco
    shortsColor: '#1E293B', // Calção Escuro
    socksColor: '#881337', // Meias combinando
    skinTone: '#E0AC69',
    hairColor: '#451A03',
    hairStyle: 'classic',
    jerseyStyle: 'tricolor-stripes',
    ability: {
      id: 'maestro',
      name: 'Maestro',
      shortDesc: 'Controle refinado da bola',
      effectDesc: 'Amortece a bola suavemente ao dominar com o peito ou cabeça, deixando-a pronta para finalizar.'
    }
  },
  {
    id: 'estrela_alvinegra',
    name: 'Estrela Alvinegra',
    shortName: 'EST',
    inspiration: 'Tradição Alvinegra da Estrela Solitária',
    identity: 'Precisão e Finalização',
    primaryColor: '#18181B', // Preto
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#FFFFFF',
    shortsColor: '#18181B', // Calção Preto
    socksColor: '#18181B', // Meias Pretas
    skinTone: '#FFDBAC',
    hairColor: '#18181B',
    hairStyle: 'classic',
    jerseyStyle: 'star-chest',
    ability: {
      id: 'estrela',
      name: 'Estrela',
      shortDesc: 'Melhora na precisão dos chutes',
      effectDesc: 'Chutes calibrados que buscam os cantos da trave com curva aperfeiçoada.'
    }
  },
  {
    id: 'uniao_tricolor',
    name: 'União Tricolor Paulista',
    shortName: 'UTP',
    inspiration: 'Tradição Tricolor Paulista',
    identity: 'Equilíbrio entre Ataque e Defesa',
    primaryColor: '#DC2626', // Vermelho
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#18181B', // Preto
    shortsColor: '#18181B', // Calção Escuro
    socksColor: '#18181B', // Meias Combinando
    skinTone: '#ECC09B',
    hairColor: '#27272A',
    hairStyle: 'spiky',
    jerseyStyle: 'geometric-blocks',
    ability: {
      id: 'falcao',
      name: 'Falcão',
      shortDesc: 'Atributos equilibrados',
      effectDesc: 'Equilíbrio polivalente com bônus moderados em corrida (+6%), chute (+8%) e recarga (+10%).'
    }
  },
  {
    id: 'esmeralda_real',
    name: 'Esmeralda Real',
    shortName: 'ESM',
    inspiration: 'Tradição Alviverde Imponente',
    identity: 'Resistência e Domínio Físico',
    primaryColor: '#059669', // Verde
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#FACC15', // Dourado discreto
    shortsColor: '#FFFFFF', // Calção Branco
    socksColor: '#059669', // Meias Verdes
    skinTone: '#D4976A',
    hairColor: '#1C1917',
    hairStyle: 'curly',
    headwear: 'headband',
    jerseyStyle: 'emerald-gold',
    ability: {
      id: 'fortaleza',
      name: 'Fortaleza',
      shortDesc: 'Estabilidade física e recuperação',
      effectDesc: 'Maior peso corporal e firmeza (+35% estabilidade em divididas, sofre menos empurrão).'
    }
  },
  {
    id: 'corinthians_povo',
    name: 'Corinthians do Povo',
    shortName: 'POV',
    inspiration: 'Tradição Alvinegra Popular',
    identity: 'Intensidade e Aceleração',
    primaryColor: '#18181B', // Exclusivamente Preto
    secondaryColor: '#FFFFFF', // e Branco (sem vermelho)
    shortsColor: '#18181B', // Calção Preto
    socksColor: '#FFFFFF', // Meias Brancas
    skinTone: '#8D5524',
    hairColor: '#09090B',
    hairStyle: 'afro',
    jerseyStyle: 'striped-black-white',
    ability: {
      id: 'furia',
      name: 'Fúria',
      shortDesc: 'Aceleração inicial veloz',
      effectDesc: 'Arrancada imediata atingindo a velocidade máxima em fração de segundo.'
    }
  },
  {
    id: 'atlantico_santista',
    name: 'Atlântico Santista',
    shortName: 'SAN',
    inspiration: 'Tradição Alvinegra Praiana',
    identity: 'Agilidade e Movimentação',
    primaryColor: '#FFFFFF', // Exclusivamente Branco
    secondaryColor: '#18181B', // e Preto (sem azul)
    shortsColor: '#FFFFFF', // Calção Branco
    socksColor: '#FFFFFF', // Meias Brancas
    skinTone: '#D4976A',
    hairColor: '#18181B',
    hairStyle: 'classic',
    jerseyStyle: 'white-clean',
    ability: {
      id: 'raio_azul',
      name: 'Raio Azul',
      shortDesc: 'Maior velocidade máxima',
      effectDesc: 'Velocidade de corrida máxima superior para superar adversários (+15% velocidade final).'
    }
  }
];

export const DEFAULT_P1_TEAM = TEAMS[0]; // Rubro Imperial
export const DEFAULT_P2_TEAM = TEAMS[1]; // Cruz de Prata
