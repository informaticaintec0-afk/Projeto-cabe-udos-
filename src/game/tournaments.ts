/**
 * Sistema de Competições de Futebol Retrô
 * - Campeonato do Brasil: Pontos corridos com 20 clubes (38 rodadas, 380 partidas, ida e volta)
 * - Copa do Brasil: Torneio eliminatório em ida e volta com 20 clubes e regra do Gol de Ouro
 * - Estruturas internacionais expansíveis (Espanha, Inglaterra, Itália, Alemanha) desbloqueadas por títulos
 */

import { TEAMS } from './teams';
import { TeamPreset } from './types';

export interface LeagueStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface FixtureMatch {
  id: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  played: boolean;
}

export interface LeagueSeason {
  id: string;
  seasonNumber: number;
  userTeamId: string;
  currentRound: number; // 1 a 38
  fixtures: FixtureMatch[]; // 380 partidas
  standings: LeagueStanding[];
  isCompleted: boolean;
  championTeamId: string | null;
}

export interface CupTie {
  id: string;
  roundName: 'Fase 1' | 'Fase 2' | 'Quartas de Final' | 'Semifinais' | 'Final';
  teamAId: string; // Mandante no jogo 1, Visitante no jogo 2
  teamBId: string; // Visitante no jogo 1, Mandante no jogo 2
  leg1Played: boolean;
  leg1GoalsA: number | null;
  leg1GoalsB: number | null;
  leg2Played: boolean;
  leg2GoalsA: number | null; // Gols do time A no jogo 2
  leg2GoalsB: number | null; // Gols do time B no jogo 2
  aggGoalsA: number;
  aggGoalsB: number;
  goldenGoalWinnerId: string | null;
  goldenGoalPeriod: number | null;
  winnerTeamId: string | null;
}

export interface CupTournament {
  id: string;
  seasonNumber: number;
  userTeamId: string;
  fase1Byes: string[]; // 4 clubes com bye
  fase2Byes: string[]; // 4 clubes com bye para as quartas
  currentStage: 'Fase 1' | 'Fase 2' | 'Quartas de Final' | 'Semifinais' | 'Final' | 'Encerrada';
  ties: CupTie[];
  isCompleted: boolean;
  championTeamId: string | null;
}

export interface TrophyRecord {
  id: string;
  competition: 'Campeonato do Brasil' | 'Copa do Brasil' | 'Campeonato da Espanha' | 'Copa da Espanha' | 'Campeonato da Inglaterra' | 'Copa da Inglaterra' | 'Campeonato da Itália' | 'Copa da Itália' | 'Campeonato da Alemanha' | 'Copa da Alemanha';
  country: 'Brasil' | 'Espanha' | 'Inglaterra' | 'Itália' | 'Alemanha';
  teamId: string;
  season: number;
  date: string;
}

export interface CountryInfo {
  id: 'brasil' | 'espanha' | 'inglaterra' | 'italia' | 'alemanha';
  name: string;
  flag: string;
  leagueName: string;
  cupName: string;
  requiredTitlesDesc: string;
}

export const COUNTRIES: CountryInfo[] = [
  {
    id: 'brasil',
    name: 'Brasil',
    flag: '🇧🇷',
    leagueName: 'Campeonato do Brasil',
    cupName: 'Copa do Brasil',
    requiredTitlesDesc: 'Desbloqueado por padrão'
  },
  {
    id: 'espanha',
    name: 'Espanha',
    flag: '🇪🇸',
    leagueName: 'Campeonato da Espanha',
    cupName: 'Copa da Espanha',
    requiredTitlesDesc: 'Vencer o Campeonato do Brasil e a Copa do Brasil'
  },
  {
    id: 'inglaterra',
    name: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    leagueName: 'Campeonato da Inglaterra',
    cupName: 'Copa da Inglaterra',
    requiredTitlesDesc: 'Vencer o Campeonato da Espanha e a Copa da Espanha'
  },
  {
    id: 'italia',
    name: 'Itália',
    flag: '🇮🇹',
    leagueName: 'Campeonato da Itália',
    cupName: 'Copa da Itália',
    requiredTitlesDesc: 'Vencer o Campeonato da Inglaterra e a Copa da Inglaterra'
  },
  {
    id: 'alemanha',
    name: 'Alemanha',
    flag: '🇩🇪',
    leagueName: 'Campeonato da Alemanha',
    cupName: 'Copa da Alemanha',
    requiredTitlesDesc: 'Vencer o Campeonato da Itália e a Copa da Itália'
  }
];

/**
 * Algoritmo do Calendário de Pontos Corridos (Double Round-Robin)
 * Gera exatamente 38 rodadas com 10 confrontos cada (380 partidas).
 * Todos os 20 clubes se enfrentam duas vezes (1 como mandante e 1 como visitante).
 */
export function generateLeagueSchedule(teams: TeamPreset[]): FixtureMatch[] {
  const n = teams.length; // 20
  if (n !== 20) {
    throw new Error('O Campeonato do Brasil exige exatamente 20 clubes.');
  }

  const teamIds = teams.map((t) => t.id);
  const fixtures: FixtureMatch[] = [];

  // Usamos o algoritmo clássico de rotação circular (Polygon / Berger)
  const rotating: string[] = teamIds.slice(1);
  const fixed = teamIds[0];

  const firstLegRounds: Array<Array<{ home: string; away: string }>> = [];

  for (let round = 0; round < n - 1; round++) {
    const roundPairs: Array<{ home: string; away: string }> = [];

    // O primeiro confronto é entre o fixo e o primeiro do array rotativo
    if (round % 2 === 0) {
      roundPairs.push({ home: fixed, away: rotating[0] });
    } else {
      roundPairs.push({ home: rotating[0], away: fixed });
    }

    // Os outros 9 confrontos
    for (let i = 1; i < n / 2; i++) {
      const t1 = rotating[i];
      const t2 = rotating[rotating.length - i];
      if ((round + i) % 2 === 0) {
        roundPairs.push({ home: t1, away: t2 });
      } else {
        roundPairs.push({ home: t2, away: t1 });
      }
    }

    firstLegRounds.push(roundPairs);

    // Rotaciona os clubes para a próxima rodada
    const last = rotating.pop()!;
    rotating.unshift(last);
  }

  // Gera o primeiro turno (Rodadas 1 a 19)
  let matchCounter = 1;
  for (let r = 0; r < 19; r++) {
    const pairs = firstLegRounds[r];
    pairs.forEach((pair) => {
      fixtures.push({
        id: `br_m_${matchCounter++}`,
        round: r + 1,
        homeTeamId: pair.home,
        awayTeamId: pair.away,
        homeGoals: null,
        awayGoals: null,
        played: false
      });
    });
  }

  // Gera o segundo turno (Rodadas 20 a 38) com mandos rigorosamente invertidos
  for (let r = 0; r < 19; r++) {
    const pairs = firstLegRounds[r];
    pairs.forEach((pair) => {
      fixtures.push({
        id: `br_m_${matchCounter++}`,
        round: r + 20,
        homeTeamId: pair.away, // Inverte mando
        awayTeamId: pair.home,
        homeGoals: null,
        awayGoals: null,
        played: false
      });
    });
  }

  return fixtures;
}

/**
 * Cria uma nova temporada do Campeonato do Brasil
 */
export function createNewLeagueSeason(userTeamId: string, seasonNumber: number = 1): LeagueSeason {
  const fixtures = generateLeagueSchedule(TEAMS);
  const standings: LeagueStanding[] = TEAMS.map((t) => ({
    teamId: t.id,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  }));

  return {
    id: `season_${Date.now()}`,
    seasonNumber,
    userTeamId,
    currentRound: 1,
    fixtures,
    standings,
    isCompleted: false,
    championTeamId: null
  };
}

/**
 * Recalcula a tabela de classificação com base em todas as partidas disputadas
 * Critérios de desempate: Pontos > Saldo de Gols > Gols Marcados > Vitórias
 */
export function recalculateStandings(fixtures: FixtureMatch[], teams: TeamPreset[]): LeagueStanding[] {
  const map = new Map<string, LeagueStanding>();

  teams.forEach((t) => {
    map.set(t.id, {
      teamId: t.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    });
  });

  fixtures.forEach((f) => {
    if (!f.played || f.homeGoals === null || f.awayGoals === null) return;

    const home = map.get(f.homeTeamId);
    const away = map.get(f.awayTeamId);

    if (home && away) {
      home.played += 1;
      away.played += 1;

      home.goalsFor += f.homeGoals;
      home.goalsAgainst += f.awayGoals;
      home.goalDifference = home.goalsFor - home.goalsAgainst;

      away.goalsFor += f.awayGoals;
      away.goalsAgainst += f.homeGoals;
      away.goalDifference = away.goalsFor - away.goalsAgainst;

      if (f.homeGoals > f.awayGoals) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if (f.homeGoals < f.awayGoals) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        home.points += 1;
        away.drawn += 1;
        away.points += 1;
      }
    }
  });

  const list = Array.from(map.values());

  // Ordenação: Pontos desc, Saldo desc, Gols Pró desc, Vitórias desc
  list.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return b.won - a.won;
  });

  return list;
}

/**
 * Simula de forma balanceada o placar de uma partida automática (IA vs IA)
 */
export function simulateAIMatch(homeTeamId: string, awayTeamId: string): { homeGoals: number; awayGoals: number } {
  const homeWeights = [0.22, 0.35, 0.25, 0.12, 0.06]; // ligeira vantagem ao mandante
  const awayWeights = [0.28, 0.36, 0.22, 0.10, 0.04];

  const pickWeighted = (weights: number[]) => {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (r <= sum) return i;
    }
    return 1;
  };

  const homeGoals = pickWeighted(homeWeights);
  const awayGoals = pickWeighted(awayWeights);

  return { homeGoals, awayGoals };
}

/**
 * Criação da Copa do Brasil
 * 20 clubes participantes.
 * Chaveamento estruturado e determinístico sem clubes duplicados:
 * - Fase 1: 4 clubes recebem passagem direta (byes), 16 clubes disputam 8 confrontos de ida e volta -> 8 classificados.
 * - Fase 2: 12 clubes classificados. Para formar as Quartas com exatamente 8 clubes:
 *     4 clubes recebem passagem direta para as quartas e 8 clubes disputam 4 confrontos de ida e volta -> 4 classificados.
 * - Quartas de final: 8 clubes (4 confrontos de ida e volta).
 * - Semifinais: 4 clubes (2 confrontos de ida e volta).
 * - Final: 2 clubes (1 confronto de ida e volta com Gol de Ouro se empate no agregado).
 */
export function createNewCupTournament(userTeamId: string, seasonNumber: number = 1): CupTournament {
  const allTeamIds = TEAMS.map((t) => t.id);

  // Embaralha para o sorteio inicial da copa
  const shuffled = [...allTeamIds].sort(() => Math.random() - 0.5);

  // 4 clubes sorteados com bye na Fase 1
  const fase1Byes = shuffled.slice(0, 4);
  const fase1Playing = shuffled.slice(4); // 16 clubes

  const ties: CupTie[] = [];

  // 8 confrontos da Fase 1 (ida e volta)
  for (let i = 0; i < 8; i++) {
    const teamA = fase1Playing[i * 2];
    const teamB = fase1Playing[i * 2 + 1];
    ties.push({
      id: `cup_f1_t${i + 1}`,
      roundName: 'Fase 1',
      teamAId: teamA,
      teamBId: teamB,
      leg1Played: false,
      leg1GoalsA: null,
      leg1GoalsB: null,
      leg2Played: false,
      leg2GoalsA: null,
      leg2GoalsB: null,
      aggGoalsA: 0,
      aggGoalsB: 0,
      goldenGoalWinnerId: null,
      goldenGoalPeriod: null,
      winnerTeamId: null
    });
  }

  return {
    id: `cup_${Date.now()}`,
    seasonNumber,
    userTeamId,
    fase1Byes,
    fase2Byes: [],
    currentStage: 'Fase 1',
    ties,
    isCompleted: false,
    championTeamId: null
  };
}

/**
 * Avança a Copa do Brasil quando a fase atual estiver concluída
 */
export function advanceCupStage(cup: CupTournament): CupTournament {
  if (cup.currentStage === 'Fase 1') {
    // 8 vencedores da Fase 1 + 4 byes = 12 clubes
    const f1Winners = cup.ties
      .filter((t) => t.roundName === 'Fase 1')
      .map((t) => t.winnerTeamId!)
      .filter(Boolean);

    if (f1Winners.length !== 8) return cup;

    const round2Clubs = [...cup.fase1Byes, ...f1Winners];
    // Dos 12 clubes, 4 recebem bye para as Quartas e 8 disputam a Fase 2 (4 confrontos)
    const fase2Byes = round2Clubs.slice(0, 4);
    const fase2Playing = round2Clubs.slice(4); // 8 clubes

    const newTies: CupTie[] = [...cup.ties];

    for (let i = 0; i < 4; i++) {
      newTies.push({
        id: `cup_f2_t${i + 1}`,
        roundName: 'Fase 2',
        teamAId: fase2Playing[i * 2],
        teamBId: fase2Playing[i * 2 + 1],
        leg1Played: false,
        leg1GoalsA: null,
        leg1GoalsB: null,
        leg2Played: false,
        leg2GoalsA: null,
        leg2GoalsB: null,
        aggGoalsA: 0,
        aggGoalsB: 0,
        goldenGoalWinnerId: null,
        goldenGoalPeriod: null,
        winnerTeamId: null
      });
    }

    return {
      ...cup,
      fase2Byes,
      currentStage: 'Fase 2',
      ties: newTies
    };
  }

  if (cup.currentStage === 'Fase 2') {
    // 4 vencedores da Fase 2 + 4 byes da Fase 2 = 8 clubes nas Quartas de Final
    const f2Winners = cup.ties
      .filter((t) => t.roundName === 'Fase 2')
      .map((t) => t.winnerTeamId!)
      .filter(Boolean);

    if (f2Winners.length !== 4) return cup;

    const qfClubs = [...cup.fase2Byes, ...f2Winners];
    const newTies: CupTie[] = [...cup.ties];

    for (let i = 0; i < 4; i++) {
      newTies.push({
        id: `cup_qf_t${i + 1}`,
        roundName: 'Quartas de Final',
        teamAId: qfClubs[i * 2],
        teamBId: qfClubs[i * 2 + 1],
        leg1Played: false,
        leg1GoalsA: null,
        leg1GoalsB: null,
        leg2Played: false,
        leg2GoalsA: null,
        leg2GoalsB: null,
        aggGoalsA: 0,
        aggGoalsB: 0,
        goldenGoalWinnerId: null,
        goldenGoalPeriod: null,
        winnerTeamId: null
      });
    }

    return {
      ...cup,
      currentStage: 'Quartas de Final',
      ties: newTies
    };
  }

  if (cup.currentStage === 'Quartas de Final') {
    const qfWinners = cup.ties
      .filter((t) => t.roundName === 'Quartas de Final')
      .map((t) => t.winnerTeamId!)
      .filter(Boolean);

    if (qfWinners.length !== 4) return cup;

    const newTies: CupTie[] = [...cup.ties];
    for (let i = 0; i < 2; i++) {
      newTies.push({
        id: `cup_sf_t${i + 1}`,
        roundName: 'Semifinais',
        teamAId: qfWinners[i * 2],
        teamBId: qfWinners[i * 2 + 1],
        leg1Played: false,
        leg1GoalsA: null,
        leg1GoalsB: null,
        leg2Played: false,
        leg2GoalsA: null,
        leg2GoalsB: null,
        aggGoalsA: 0,
        aggGoalsB: 0,
        goldenGoalWinnerId: null,
        goldenGoalPeriod: null,
        winnerTeamId: null
      });
    }

    return {
      ...cup,
      currentStage: 'Semifinais',
      ties: newTies
    };
  }

  if (cup.currentStage === 'Semifinais') {
    const sfWinners = cup.ties
      .filter((t) => t.roundName === 'Semifinais')
      .map((t) => t.winnerTeamId!)
      .filter(Boolean);

    if (sfWinners.length !== 2) return cup;

    const newTies: CupTie[] = [...cup.ties];
    newTies.push({
      id: 'cup_final_t1',
      roundName: 'Final',
      teamAId: sfWinners[0],
      teamBId: sfWinners[1],
      leg1Played: false,
      leg1GoalsA: null,
      leg1GoalsB: null,
      leg2Played: false,
      leg2GoalsA: null,
      leg2GoalsB: null,
      aggGoalsA: 0,
      aggGoalsB: 0,
      goldenGoalWinnerId: null,
      goldenGoalPeriod: null,
      winnerTeamId: null
    });

    return {
      ...cup,
      currentStage: 'Final',
      ties: newTies
    };
  }

  if (cup.currentStage === 'Final') {
    const finalTie = cup.ties.find((t) => t.roundName === 'Final');
    if (finalTie && finalTie.winnerTeamId) {
      return {
        ...cup,
        currentStage: 'Encerrada',
        isCompleted: true,
        championTeamId: finalTie.winnerTeamId
      };
    }
  }

  return cup;
}
