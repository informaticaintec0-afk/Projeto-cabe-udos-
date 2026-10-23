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
  },
  // --- 12 NOVOS CLUBES BRASILEIROS ---
  {
    id: 'cruzeiro_celeste',
    name: 'Cruzeiro Celeste',
    shortName: 'CRU',
    inspiration: 'Tradição Celeste Estelar',
    identity: 'Precisão e Visão de Jogo',
    primaryColor: '#1D4ED8', // Azul Royal
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#FACC15',
    shortsColor: '#FFFFFF',
    socksColor: '#1D4ED8',
    skinTone: '#E0AC69',
    hairColor: '#1E293B',
    hairStyle: 'classic',
    jerseyStyle: 'celeste-stars',
    ability: {
      id: 'constelacao',
      name: 'Constelação',
      shortDesc: 'Precisão em média distância',
      effectDesc: 'Chutes de média distância com curva refinada e trajetória calibrada ao ângulo do gol.'
    }
  },
  {
    id: 'furacao_rubro_negro',
    name: 'Furacão Rubro-Negro',
    shortName: 'CAP',
    inspiration: 'Tradição Rubro-Negra do Sul',
    identity: 'Velocidade e Pressão',
    primaryColor: '#DC2626', // Vermelho
    secondaryColor: '#18181B', // Preto
    accentColor: '#F8FAFC',
    shortsColor: '#18181B',
    socksColor: '#18181B',
    skinTone: '#D4976A',
    hairColor: '#0F172A',
    hairStyle: 'spiky',
    jerseyStyle: 'tornado-red-black',
    ability: {
      id: 'vendaval',
      name: 'Vendaval',
      shortDesc: 'Aceleração explosiva',
      effectDesc: 'Arrancadas tempestuosas com aceleração explosiva de pico por curto período.'
    }
  },
  {
    id: 'coritiba_araucarias',
    name: 'Coritiba das Araucárias',
    shortName: 'CWB',
    inspiration: 'Tradição Alviverde Paranaense',
    identity: 'Firmeza e Tradição',
    primaryColor: '#15803D', // Verde
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#166534',
    shortsColor: '#18181B',
    socksColor: '#FFFFFF',
    skinTone: '#ECC09B',
    hairColor: '#451A03',
    hairStyle: 'classic',
    jerseyStyle: 'green-white-hoops',
    ability: {
      id: 'muralha_verde',
      name: 'Muralha Verde',
      shortDesc: 'Estabilidade em disputas físicas',
      effectDesc: 'Massa reforçada e resistência máxima em divididas corpo a corpo contra adversários.'
    }
  },
  {
    id: 'chapeco_esmeralda',
    name: 'Chapecó Esmeralda',
    shortName: 'CHA',
    inspiration: 'Tradição Esmeralda Condá',
    identity: 'Garra e União',
    primaryColor: '#047857', // Verde Esmeralda
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#FACC15',
    shortsColor: '#FFFFFF',
    socksColor: '#047857',
    skinTone: '#C68642',
    hairColor: '#18181B',
    hairStyle: 'curly',
    jerseyStyle: 'emerald-hope',
    ability: {
      id: 'esperanca',
      name: 'Esperança',
      shortDesc: 'Recuperação rápida de colisões',
      effectDesc: 'Recupera o equilíbrio e impulso de corrida instantaneamente após colisões.'
    }
  },
  {
    id: 'leao_amazonia',
    name: 'Leão da Amazônia',
    shortName: 'REM',
    inspiration: 'Tradição Marajoara Azulina',
    identity: 'Imponência e Velocidade',
    primaryColor: '#0F172A', // Azul-Marinho profundo
    secondaryColor: '#38BDF8', // Azul-Celeste
    accentColor: '#FFFFFF', // Branco
    shortsColor: '#FFFFFF',
    socksColor: '#0F172A',
    skinTone: '#8D5524',
    hairColor: '#09090B',
    hairStyle: 'afro',
    jerseyStyle: 'navy-sky-lion',
    ability: {
      id: 'mare_azul',
      name: 'Maré Azul',
      shortDesc: 'Maior velocidade máxima',
      effectDesc: 'Avança com ritmo avassalador atingindo a maior velocidade de corrida contínua (+16%).'
    }
  },
  {
    id: 'sol_de_ouro',
    name: 'Sol de Ouro',
    shortName: 'CUI',
    inspiration: 'Tradição Dourada Pantaneira',
    identity: 'Potência e Fogo',
    primaryColor: '#EAB308', // Amarelo Ouro
    secondaryColor: '#15803D', // Verde
    accentColor: '#18181B', // Preto
    shortsColor: '#15803D',
    socksColor: '#EAB308',
    skinTone: '#D4976A',
    hairColor: '#27272A',
    hairStyle: 'spiky',
    jerseyStyle: 'sun-gold-green',
    ability: {
      id: 'raio_solar',
      name: 'Raio Solar',
      shortDesc: 'Chutes carregados devastadores',
      effectDesc: 'Bônus massivo de impacto (+28% de potência) ao soltar chutes com a barra carregada.'
    }
  },
  {
    id: 'bahia_tricolor',
    name: 'Bahia Tricolor',
    shortName: 'BAH',
    inspiration: 'Tradição Tricolor Baiana',
    identity: 'Raça e Malemolência',
    primaryColor: '#2563EB', // Azul
    secondaryColor: '#DC2626', // Vermelho
    accentColor: '#FFFFFF', // Branco
    shortsColor: '#FFFFFF',
    socksColor: '#2563EB',
    skinTone: '#8D5524',
    hairColor: '#18181B',
    hairStyle: 'curly',
    headwear: 'headband',
    jerseyStyle: 'tricolor-bahia',
    ability: {
      id: 'esquadrao',
      name: 'Esquadrão',
      shortDesc: 'Controle e retomada da bola',
      effectDesc: 'Domínio primoroso ao contato da bola e menor tempo de recarga após finalizar.'
    }
  },
  {
    id: 'tricolor_pampas',
    name: 'Tricolor dos Pampas',
    shortName: 'GRE',
    inspiration: 'Tradição Tricolor Gaúcha',
    identity: 'Espírito Copero e Firmeza',
    primaryColor: '#0284C7', // Azul Celeste
    secondaryColor: '#18181B', // Preto
    accentColor: '#FFFFFF', // Branco
    shortsColor: '#18181B',
    socksColor: '#FFFFFF',
    skinTone: '#E0AC69',
    hairColor: '#3F3F46',
    hairStyle: 'classic',
    jerseyStyle: 'tricolor-pampas',
    ability: {
      id: 'imortalidade',
      name: 'Imortalidade',
      shortDesc: 'Recuperação de estabilidade',
      effectDesc: 'Não perde o rumo em divididas e reage com estabilidade redobrada no chão.'
    }
  },
  {
    id: 'internacional_gaucho',
    name: 'Internacional Gaúcho',
    shortName: 'INT',
    inspiration: 'Tradição Colorada do Sul',
    identity: 'Ataque Feroz e Força',
    primaryColor: '#DC2626', // Vermelho Escarlate
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#B91C1C',
    shortsColor: '#FFFFFF',
    socksColor: '#DC2626',
    skinTone: '#D4976A',
    hairColor: '#1C1917',
    hairStyle: 'spiky',
    jerseyStyle: 'colorado-red',
    ability: {
      id: 'colorado',
      name: 'Colorado',
      shortDesc: 'Maior potência nos chutes',
      effectDesc: 'Disparos de pé direito com força brutal (+20% de potência) superando qualquer bloqueio.'
    }
  },
  {
    id: 'atletico_gerais',
    name: 'Atlético das Gerais',
    shortName: 'CAM',
    inspiration: 'Tradição Alvinegra Montanhesa',
    identity: 'Galo Forte e Vigor Aéreo',
    primaryColor: '#18181B', // Preto
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#CBD5E1',
    shortsColor: '#18181B',
    socksColor: '#FFFFFF',
    skinTone: '#C68642',
    hairColor: '#09090B',
    hairStyle: 'afro',
    jerseyStyle: 'striped-black-white-galo',
    ability: {
      id: 'galo_de_aco',
      name: 'Galo de Aço',
      shortDesc: 'Cabeceios avassaladores',
      effectDesc: 'Impulso e força aérea impiedosa nos cabeceios (+30%), dominando a bola pelo alto.'
    }
  },
  {
    id: 'braganca_rubro_negro',
    name: 'Bragança Rubro-Negro',
    shortName: 'RBB',
    inspiration: 'Tradição Bragantina Veloz',
    identity: 'Dinamismo e Alta Pressão',
    primaryColor: '#DC2626', // Vermelho
    secondaryColor: '#FFFFFF', // Branco
    accentColor: '#18181B', // Preto
    shortsColor: '#18181B',
    socksColor: '#FFFFFF',
    skinTone: '#ECC09B',
    hairColor: '#27272A',
    hairStyle: 'spiky',
    jerseyStyle: 'braganca-turbine',
    ability: {
      id: 'turbina',
      name: 'Turbina',
      shortDesc: 'Aceleração superior',
      effectDesc: 'Aciona turbocompressão nos sprints atingindo velocidade máxima quase de imediato.'
    }
  },
  {
    id: 'vitoria_rubra',
    name: 'Vitória Rubra',
    shortName: 'VIT',
    inspiration: 'Tradição Rubro-Negra da Boa Terra',
    identity: 'Garra e Intensidade',
    primaryColor: '#DC2626', // Vermelho
    secondaryColor: '#18181B', // Preto
    accentColor: '#FACC15',
    shortsColor: '#18181B',
    socksColor: '#DC2626',
    skinTone: '#8D5524',
    hairColor: '#09090B',
    hairStyle: 'classic',
    jerseyStyle: 'vitoria-furia',
    ability: {
      id: 'furia_rubra',
      name: 'Fúria Rubra',
      shortDesc: 'Arrancada imediata',
      effectDesc: 'Partida relâmpago nos primeiros passos, garantindo antecipação em bolas disputadas.'
    }
  }
];

export const DEFAULT_P1_TEAM = TEAMS[0]; // Rubro Imperial
export const DEFAULT_P2_TEAM = TEAMS[1]; // Cruz de Prata

