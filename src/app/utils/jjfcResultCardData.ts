import type { GoalEvent, Match as RegisteredMatch } from "../types/data";
import { teamConfig } from "../config/team";
import type {
  JjfcMatchResultCardData,
  JjfcMatchResultParticipant,
} from "../components/JjfcMatchResultCard";

export type ResultCardMatch = {
  id: string;
  date: string;
  ourScore: number;
  opponentScore: number;
  opponentName: string;
};

type PlayerLike = {
  id?: string;
  playerId?: string;
  "선수ID"?: string;
  name?: string;
  playerName?: string;
  "이름"?: string;
  number?: string;
};

const getField = (item: any, keys: string[]) => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
};

export const getStoredMatchId = (item: any) =>
  String(getField(item, ["matchId", "경기ID"]) || "");

export const getRegisteredMatchId = (item: any) =>
  String(getField(item, ["id", "matchId", "경기ID"]) || "");

export const formatResultCardDate = (value: unknown, fallback: string) => {
  if (!value) return fallback;
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  const dateString = String(value);
  if (dateString.includes("T")) {
    const date = new Date(dateString);
    if (!Number.isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    }
  }

  if (dateString.includes("-")) return dateString.split("T")[0].replace(/-/g, ".");
  return dateString || fallback;
};

export const normalizeGoalEvent = (event: any): GoalEvent => ({
  id: String(getField(event, ["id", "goalEventId", "골이벤트ID"]) || ""),
  matchId: getStoredMatchId(event),
  quarter: Number(getField(event, ["quarter", "쿼터"]) || 1),
  goalType: getField(event, ["goalType", "득점유형"]) || "team_player",
  scorerId: String(getField(event, ["scorerId", "득점자ID"]) || ""),
  scorerName: String(getField(event, ["scorerName", "득점자명", "playerName", "이름"]) || ""),
  scorerIsMercenary: Boolean(getField(event, ["scorerIsMercenary", "득점자용병여부", "isMercenary"])),
  assistId: getField(event, ["assistId", "도움ID"]) ?? null,
  assistName: getField(event, ["assistName", "도움선수명"]) ?? null,
  assistIsMercenary: Boolean(getField(event, ["assistIsMercenary", "도움용병여부"])),
  isOpponentGoal: Boolean(getField(event, ["isOpponentGoal", "상대팀득점여부"])),
  timestamp: String(getField(event, ["timestamp", "기록시간"]) || ""),
  createdAt: String(getField(event, ["createdAt", "생성일시"]) || ""),
});

const parseQuarterCount = (value: unknown) => {
  const parsed = Number.parseInt(String(value || "").match(/\d+/)?.[0] || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 4;
};

const getPlayerNameById = (
  playerId: string,
  players: PlayerLike[],
  participants: JjfcMatchResultParticipant[],
) => {
  const player = players.find((item) =>
    String(getField(item, ["id", "playerId", "선수ID"])) === String(playerId),
  );
  const playerName = getField(player, ["name", "playerName", "이름"]);
  if (playerName) return String(playerName);

  const participant = participants.find(
    (item) => String(item.playerId) === String(playerId),
  );
  return participant?.playerName || participant?.name || "";
};

const getMomNamesForMatch = (
  matchId: string,
  moms: any[],
  players: PlayerLike[],
  participants: JjfcMatchResultParticipant[],
) => {
  const mom = moms.find((item) => getStoredMatchId(item) === matchId);
  if (!mom) return [];

  const rawNames = getField(mom, ["playerNames", "player_names", "playerName", "player_name", "이름"]);
  if (Array.isArray(rawNames)) {
    const names = rawNames.map(String).map((name) => name.trim()).filter(Boolean);
    if (names.length > 0) return names;
  }
  if (typeof rawNames === "string" && rawNames.trim()) {
    return rawNames.split(",").map((name) => name.trim()).filter(Boolean);
  }

  const playerIds = getField(mom, ["playerIds", "player_ids", "playerId", "player_id", "선수ID"]);
  const playerIdArray = Array.isArray(playerIds) ? playerIds : [playerIds].filter(Boolean);
  return playerIdArray
    .map((playerId) => getPlayerNameById(String(playerId), players, participants))
    .filter(Boolean);
};

export const buildJjfcMatchResultCardData = ({
  match,
  registeredMatches,
  localMatches,
  participants,
  goalEvents,
  moms,
  players,
}: {
  match: ResultCardMatch;
  registeredMatches: any[];
  localMatches: RegisteredMatch[];
  participants: any[];
  goalEvents: any[];
  moms: any[];
  players: PlayerLike[];
}): JjfcMatchResultCardData => {
  const registeredMatch =
    registeredMatches.find((item) => getRegisteredMatchId(item) === match.id) ||
    localMatches.find((item: any) => getRegisteredMatchId(item) === match.id);
  const matchParticipants = participants
    .filter((participant) => getStoredMatchId(participant) === match.id)
    .map((participant) => ({
      playerId: String(getField(participant, ["playerId", "선수ID"]) || ""),
      playerName: String(getField(participant, ["playerName", "이름"]) || ""),
      playerNumber: String(getField(participant, ["playerNumber", "번호"]) || ""),
      isMercenary: Boolean(getField(participant, ["isMercenary", "용병여부"])),
    }));
  const matchGoalEvents = goalEvents
    .map(normalizeGoalEvent)
    .filter((event) => event.matchId === match.id);
  const registeredQuarterCount = parseQuarterCount(
    getField(registeredMatch, ["quarterCount", "quarter_count", "쿼터수", "쿼터"]),
  );
  const maxGoalQuarter = matchGoalEvents.reduce(
    (maxQuarter, event) => Math.max(maxQuarter, Number(event.quarter) || 0),
    0,
  );
  const quarterCount = Math.max(registeredQuarterCount, maxGoalQuarter, 4);

  const quarterSummaries = Array.from({ length: quarterCount }, (_, index) => index + 1).map((quarter) => {
    const quarterEvents = matchGoalEvents.filter(
      (event) => Number(event.quarter) === quarter,
    );
    const opponentEvents = quarterEvents.filter(
      (event) => event.isOpponentGoal || event.goalType === "opponent_team",
    );
    const ourEvents = quarterEvents.filter(
      (event) => !event.isOpponentGoal && event.goalType !== "opponent_team",
    );

    return {
      quarter,
      ourScore: ourEvents.length,
      opponentScore: opponentEvents.length,
      goals: ourEvents.map((event) => ({
        scorerName: event.scorerName || "득점",
        assistName: event.assistName || null,
      })),
    };
  });

  return {
    date: formatResultCardDate(
      getField(registeredMatch, ["matchDate", "날짜"]),
      match.date,
    ),
    location:
      String(getField(registeredMatch, ["location", "장소"]) || "").trim() ||
      "경기장",
    teamName: teamConfig.name,
    opponentName: match.opponentName,
    ourScore: match.ourScore,
    opponentScore: match.opponentScore,
    momNames: getMomNamesForMatch(match.id, moms, players, matchParticipants),
    participants: matchParticipants,
    registeredPlayerNames: (players.length > 0 ? players : teamConfig.players).map(
      (player) => player.name || "",
    ),
    quarterSummaries,
  };
};

export const toResultCardMatch = (match: any, index = 0): ResultCardMatch => {
  const rawDate = getField(match, ["matchDate", "날짜"]);
  const uniqueId =
    getField(match, ["id", "matchId", "경기ID"]) || `match_card_${index}`;

  return {
    id: String(uniqueId),
    date: formatResultCardDate(rawDate, "N/A"),
    ourScore: Number(getField(match, ["ourScore", "우리팀득점"]) || 0),
    opponentScore: Number(getField(match, ["opponentScore", "상대팀득점"]) || 0),
    opponentName: String(getField(match, ["opponentName", "상대팀"]) || "상대팀"),
  };
};
