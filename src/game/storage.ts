/**
 * Módulo de Salvamento Local e Persistência Offline
 * Utiliza LocalStorage versionado com proteção contra perda de dados antigos.
 * Permite salvar temporadas do Brasileirão, chaveamentos da Copa do Brasil,
 * partidas em andamento durante o Gol de Ouro e sala de troféus.
 */

import { LeagueSeason, CupTournament, TrophyRecord, COUNTRIES, CountryInfo } from './tournaments';
import { AIDifficulty, TeamPreset } from './types';
import { TEAMS } from './teams';

const STORAGE_KEY_V2 = 'FUTEBOL_RETRO_DATA_V2';
const STORAGE_KEY_V1 = 'FUTEBOL_RETRO_DATA_V1';

export interface SavedGoldenGoalSession {
  competitionType: 'copa_brasil' | 'copa_internacional';
  cupId: string;
  tieId: string;
  teamAId: string;
  teamBId: string;
  period: number;
  timeLeft: number;
  leg1GoalsA: number;
  leg1GoalsB: number;
  leg2GoalsA: number;
  leg2GoalsB: number;
  p1IsTeamA: boolean;
  difficulty: AIDifficulty;
}

export interface AppSaveData {
  version: 2;
  lastUpdated: string;
  leagueSeason: LeagueSeason | null;
  cupTournament: CupTournament | null;
  activeGoldenGoal: SavedGoldenGoalSession | null;
  trophies: TrophyRecord[];
  p1TeamId: string;
  p2TeamId: string;
  difficulty: AIDifficulty;
  isMuted: boolean;
}

const DEFAULT_SAVE_DATA: AppSaveData = {
  version: 2,
  lastUpdated: new Date().toISOString(),
  leagueSeason: null,
  cupTournament: null,
  activeGoldenGoal: null,
  trophies: [],
  p1TeamId: TEAMS[0].id,
  p2TeamId: TEAMS[1].id,
  difficulty: 'medio',
  isMuted: false
};

export const storage = {
  load(): AppSaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_V2);
      if (raw) {
        const parsed = JSON.parse(raw) as AppSaveData;
        if (parsed && parsed.version === 2) {
          return {
            ...DEFAULT_SAVE_DATA,
            ...parsed
          };
        }
      }

      // Migração suave se houver dados da versão antiga
      const oldRaw = localStorage.getItem(STORAGE_KEY_V1);
      if (oldRaw) {
        try {
          const oldData = JSON.parse(oldRaw);
          return {
            ...DEFAULT_SAVE_DATA,
            p1TeamId: oldData.p1TeamId || TEAMS[0].id,
            p2TeamId: oldData.p2TeamId || TEAMS[1].id,
            isMuted: !!oldData.isMuted
          };
        } catch {
          // ignora erro e usa padrão
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar dados do LocalStorage:', e);
    }
    return DEFAULT_SAVE_DATA;
  },

  save(data: Partial<AppSaveData>) {
    try {
      const current = this.load();
      const updated: AppSaveData = {
        ...current,
        ...data,
        version: 2,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar no LocalStorage:', e);
    }
  },

  // Métodos de conveniência
  saveLeagueSeason(season: LeagueSeason | null) {
    this.save({ leagueSeason: season });
  },

  saveCupTournament(cup: CupTournament | null) {
    this.save({ cupTournament: cup });
  },

  saveActiveGoldenGoal(session: SavedGoldenGoalSession | null) {
    this.save({ activeGoldenGoal: session });
  },

  addTrophy(trophy: TrophyRecord) {
    const current = this.load();
    const updated = [trophy, ...current.trophies];
    this.save({ trophies: updated });
  },

  /**
   * Verifica quais países estão desbloqueados baseado na regra estrita:
   * - Brasil: desbloqueado por padrão
   * - Espanha: vencer Campeonato do Brasil E Copa do Brasil
   * - Inglaterra: vencer Campeonato da Espanha E Copa da Espanha
   * - Itália: vencer Campeonato da Inglaterra E Copa da Inglaterra
   * - Alemanha: vencer Campeonato da Itália E Copa da Itália
   */
  getCountryUnlockStatus(trophies: TrophyRecord[]): Record<string, { unlocked: boolean; reason: string }> {
    const hasBrasilLeague = trophies.some((t) => t.competition === 'Campeonato do Brasil');
    const hasBrasilCup = trophies.some((t) => t.competition === 'Copa do Brasil');
    const espanhaUnlocked = hasBrasilLeague && hasBrasilCup;

    const hasEspanhaLeague = trophies.some((t) => t.competition === 'Campeonato da Espanha');
    const hasEspanhaCup = trophies.some((t) => t.competition === 'Copa da Espanha');
    const inglaterraUnlocked = espanhaUnlocked && hasEspanhaLeague && hasEspanhaCup;

    const hasInglaterraLeague = trophies.some((t) => t.competition === 'Campeonato da Inglaterra');
    const hasInglaterraCup = trophies.some((t) => t.competition === 'Copa da Inglaterra');
    const italiaUnlocked = inglaterraUnlocked && hasInglaterraLeague && hasInglaterraCup;

    const hasItaliaLeague = trophies.some((t) => t.competition === 'Campeonato da Itália');
    const hasItaliaCup = trophies.some((t) => t.competition === 'Copa da Itália');
    const alemanhaUnlocked = italiaUnlocked && hasItaliaLeague && hasItaliaCup;

    return {
      brasil: { unlocked: true, reason: 'Liberado' },
      espanha: {
        unlocked: espanhaUnlocked,
        reason: 'Conquiste o Campeonato do Brasil e a Copa do Brasil'
      },
      inglaterra: {
        unlocked: inglaterraUnlocked,
        reason: 'Conquiste o Campeonato da Espanha e a Copa da Espanha'
      },
      italia: {
        unlocked: italiaUnlocked,
        reason: 'Conquiste o Campeonato da Inglaterra e a Copa da Inglaterra'
      },
      alemanha: {
        unlocked: alemanhaUnlocked,
        reason: 'Conquiste o Campeonato da Itália e a Copa da Itália'
      }
    };
  }
};
