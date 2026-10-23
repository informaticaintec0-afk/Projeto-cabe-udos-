/**
 * Tipos e Interfaces do Jogo de Futebol Arcade 2D "Futebol Retrô"
 * Estrutura modular preparada para conversão offline Android (Capacitor/Cordova/WebView)
 */

export type GameState =
  | 'MENU'
  | 'SELECT_TEAMS'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'GOAL_CELEBRATION'
  | 'PAUSED'
  | 'GAME_OVER';

export type AIDifficulty = 'facil' | 'medio' | 'dificil';

export type ClubAbilityId =
  | 'canhao'
  | 'muralha'
  | 'maestro'
  | 'estrela'
  | 'falcao'
  | 'fortaleza'
  | 'furia'
  | 'raio_azul'
  // 12 Novos Clubes Brasileiros
  | 'constelacao'
  | 'vendaval'
  | 'muralha_verde'
  | 'esperanca'
  | 'mare_azul'
  | 'raio_solar'
  | 'esquadrao'
  | 'imortalidade'
  | 'colorado'
  | 'galo_de_aco'
  | 'turbina'
  | 'furia_rubra';

export interface ClubAbility {
  id: ClubAbilityId;
  name: string;
  shortDesc: string;
  effectDesc: string;
}

export type JerseyStyle =
  | 'striped-red-black'
  | 'sash-white'
  | 'tricolor-stripes'
  | 'star-chest'
  | 'geometric-blocks'
  | 'emerald-gold'
  | 'striped-black-white'
  | 'white-clean'
  // Novos estilos
  | 'celeste-stars'
  | 'tornado-red-black'
  | 'green-white-hoops'
  | 'emerald-hope'
  | 'navy-sky-lion'
  | 'sun-gold-green'
  | 'tricolor-bahia'
  | 'tricolor-pampas'
  | 'colorado-red'
  | 'striped-black-white-galo'
  | 'braganca-turbine'
  | 'vitoria-furia';

export interface TeamPreset {
  id: string;
  name: string;
  shortName: string;
  inspiration: string;
  identity: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  shortsColor: string;
  socksColor: string;
  skinTone: string;
  hairColor: string;
  hairStyle: 'classic' | 'curly' | 'spiky' | 'afro' | 'bald';
  headwear?: 'headband' | 'none';
  jerseyStyle: JerseyStyle;
  ability: ClubAbility;
}

export type CompetitionType = 'friendly' | 'brasileirao' | 'copa_brasil';

export interface GoldenGoalContext {
  isGoldenGoal: boolean;
  period: number; // 1, 2, 3...
  periodDuration: number; // 120s
  periodTimeLeft: number;
  aggP1: number;
  aggP2: number;
  leg1P1Goals: number;
  leg1P2Goals: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  kick: boolean;
  superKick: boolean;
}

export interface MatchStats {
  p1Goals: number;
  p2Goals: number;
  p1Shots: number;
  p2Shots: number;
  p1Headers: number;
  p2Headers: number;
  p1Saves: number;
  p2Saves: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'square' | 'spark' | 'smoke';
  rotation?: number;
  rotationSpeed?: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  scale: number;
  alpha: number;
  life: number;
  maxLife: number;
}
