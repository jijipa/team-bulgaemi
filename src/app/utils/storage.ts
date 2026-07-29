import { Match, Score, Player, Participant, Mercenary, MOM, GoalEvent } from "../types/data";
import { teamConfig } from "../config/team";

// LocalStorage 키
const keyWithNamespace = (suffix: string) =>
  `${teamConfig.storageNamespace}_${suffix}`;

const STORAGE_KEYS = {
  MATCHES: keyWithNamespace("matches"),
  SCORES: keyWithNamespace("scores"),
  PLAYERS: keyWithNamespace("players"),
  PARTICIPANTS: keyWithNamespace("participants"),
  MERCENARIES: keyWithNamespace("mercenaries"),
  MOMS: keyWithNamespace("moms"),
  GOAL_EVENTS: keyWithNamespace("goal_events"),
};

// ============= 매치 데이터 =============

export const saveMatches = (matches: Match[]): void => {
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
};

export const getMatches = (): Match[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
  return data ? JSON.parse(data) : [];
};

// ✅ participants와 scores를 포함한 전체 매치 데이터 가져오기
export const getMatchesWithDetails = (): Match[] => {
  const matches = getMatches();
  const allParticipants = getParticipants();
  const allScores = getScores();

  return matches.map(match => {
    // 해당 매치의 participants 찾기
    const matchParticipants = allParticipants.filter(p => p.matchId === match.id);
    
    // 해당 매치의 scores 찾기
    const matchScores = allScores.filter(s => s.matchId === match.id);
    
    return {
      ...match,
      participants: matchParticipants,
      scores: matchScores,
    };
  });
};

export const addMatch = (match: Match): void => {
  const matches = getMatches();
  matches.push(match);
  saveMatches(matches);
};

export const updateMatch = (matchId: string, updates: Partial<Match>): void => {
  const matches = getMatches();
  const index = matches.findIndex((m) => m.id === matchId);
  if (index !== -1) {
    matches[index] = { ...matches[index], ...updates };
    saveMatches(matches);
  }
};

export const getMatchById = (matchId: string): Match | undefined => {
  const matches = getMatches();
  return matches.find((m) => m.id === matchId);
};

export const deleteMatch = (matchId: string): void => {
  // 매치 삭제
  const matches = getMatches();
  const filteredMatches = matches.filter((m) => m.id !== matchId);
  saveMatches(filteredMatches);

  // 관련 득점 데이터 삭제
  const scores = getScores();
  const filteredScores = scores.filter((s) => s.matchId !== matchId);
  saveScores(filteredScores);

  // 관련 참가자 데이터 삭제
  const participants = getParticipants();
  const filteredParticipants = participants.filter((p) => p.matchId !== matchId);
  saveParticipants(filteredParticipants);

  // 관련 골 이벤트 데이터 삭제
  const goalEvents = getGoalEvents();
  const filteredGoalEvents = goalEvents.filter((e) => e.matchId !== matchId);
  saveGoalEvents(filteredGoalEvents);

  // 관련 MOM 데이터 삭제
  const moms = getMOMs();
  const filteredMoms = moms.filter((m) => m.matchId !== matchId);
  saveMOMs(filteredMoms);
};

// ============= 득점 데이터 =============

export const saveScores = (scores: Score[]): void => {
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
};

export const getScores = (): Score[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SCORES);
  return data ? JSON.parse(data) : [];
};

export const getScoresByMatchId = (matchId: string): Score[] => {
  const scores = getScores();
  return scores.filter((s) => s.matchId === matchId);
};

// ============= 골 이벤트 데이터 =============

export const saveGoalEvents = (goalEvents: GoalEvent[]): void => {
  localStorage.setItem(STORAGE_KEYS.GOAL_EVENTS, JSON.stringify(goalEvents));
};

export const getGoalEvents = (): GoalEvent[] => {
  const data = localStorage.getItem(STORAGE_KEYS.GOAL_EVENTS);
  return data ? JSON.parse(data) : [];
};

export const replaceGoalEventsByMatchId = (
  matchId: string,
  newGoalEvents: GoalEvent[]
): void => {
  const remainingGoalEvents = getGoalEvents().filter((e) => e.matchId !== matchId);
  saveGoalEvents([...remainingGoalEvents, ...newGoalEvents]);
};

// ============= 선수 데이터 =============

export const savePlayers = (players: Player[]): void => {
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
};

export const getPlayers = (): Player[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
  return data ? JSON.parse(data) : [];
};

// ============= 참가자 데이터 =============

export const saveParticipants = (participants: Participant[]): void => {
  localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
};

export const getParticipants = (): Participant[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  return data ? JSON.parse(data) : [];
};

// ============= 고용병 데이터 =============

export const saveMercenaries = (mercenaries: Mercenary[]): void => {
  localStorage.setItem(STORAGE_KEYS.MERCENARIES, JSON.stringify(mercenaries));
};

export const getMercenaries = (): Mercenary[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MERCENARIES);
  return data ? JSON.parse(data) : [];
};

// ============= 매치 최고 선수 데이터 =============

export const saveMOMs = (moms: MOM[]): void => {
  localStorage.setItem(STORAGE_KEYS.MOMS, JSON.stringify(moms));
};

export const getMOMs = (): MOM[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MOMS);
  return data ? JSON.parse(data) : [];
};

// ============= 유틸리티 =============

// 고유 ID 생성
export const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

// 모든 데이터 내보내기 (백업용)
export const exportAllData = () => {
  return {
    matches: getMatches(),
    scores: getScores(),
    players: getPlayers(),
    participants: getParticipants(),
    mercenaries: getMercenaries(),
    moms: getMOMs(),
    goalEvents: getGoalEvents(),
    exportedAt: new Date().toISOString(),
  };
};
