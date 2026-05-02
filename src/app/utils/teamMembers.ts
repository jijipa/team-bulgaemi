import type {
  GoalEvent,
  MOM,
  Match,
  Mercenary,
  Participant,
  Player,
  Score,
} from "../types/data";
import { generateId } from "./storage";

type AppDataSnapshot = {
  matches: Match[];
  scores: Score[];
  players: Player[];
  participants: Participant[];
  mercenaries: Mercenary[];
  moms: MOM[];
  goalEvents: GoalEvent[];
};

type TeamMemberInput = {
  name: string;
  number: string;
};

const normalizeName = (value: string) => value.trim();
const normalizeNumber = (value: string) => value.replace(/\D/g, "");

export const sortPlayersByNumber = (players: Player[]) =>
  [...players].sort((a, b) => {
    const numberA = Number(a.number || 0);
    const numberB = Number(b.number || 0);

    if (numberA !== numberB) {
      return numberA - numberB;
    }

    return a.name.localeCompare(b.name, "ko-KR");
  });

export const validateTeamMemberInput = (
  input: TeamMemberInput,
  players: Player[],
  editingPlayerId?: string,
) => {
  const name = normalizeName(input.name);
  const number = normalizeNumber(input.number);

  if (!name) {
    return "이름을 입력해주세요.";
  }

  if (name.length > 5) {
    return "이름은 최대 5글자까지 입력할 수 있습니다.";
  }

  if (!number) {
    return "등번호를 입력해주세요.";
  }

  const hasDuplicateNumber = players.some(
    (player) =>
      player.id !== editingPlayerId &&
      String(player.number ?? "") === number,
  );

  if (hasDuplicateNumber) {
    return "이미 사용 중인 등번호입니다.";
  }

  return null;
};

export const createTeamMemberData = (
  currentData: AppDataSnapshot,
  input: TeamMemberInput,
): AppDataSnapshot => {
  const nextPlayer: Player = {
    id: generateId("player"),
    name: normalizeName(input.name),
    number: normalizeNumber(input.number),
  };

  return {
    ...currentData,
    players: sortPlayersByNumber([...currentData.players, nextPlayer]),
  };
};

export const updateTeamMemberData = (
  currentData: AppDataSnapshot,
  playerId: string,
  input: TeamMemberInput,
): AppDataSnapshot => {
  const name = normalizeName(input.name);
  const number = normalizeNumber(input.number);

  return {
    ...currentData,
    players: sortPlayersByNumber(
      currentData.players.map((player) =>
        player.id === playerId ? { ...player, name, number } : player,
      ),
    ),
    scores: currentData.scores.map((score) =>
      score.playerId === playerId
        ? {
            ...score,
            playerName: name,
            playerNumber: number,
          }
        : score,
    ),
    participants: currentData.participants.map((participant) =>
      participant.playerId === playerId
        ? {
            ...participant,
            playerName: name,
            playerNumber: number,
          }
        : participant,
    ),
    goalEvents: currentData.goalEvents.map((event) => ({
      ...event,
      scorerName: event.scorerId === playerId ? name : event.scorerName,
      assistName: event.assistId === playerId ? name : event.assistName,
    })),
  };
};

export const deleteTeamMemberData = (
  currentData: AppDataSnapshot,
  playerId: string,
): AppDataSnapshot => {
  const replacementMercenaryId = `mercenary_${playerId}`;

  return {
    ...currentData,
    players: currentData.players.filter((player) => player.id !== playerId),
    scores: currentData.scores.map((score) =>
      score.playerId === playerId
        ? {
            ...score,
            playerId: replacementMercenaryId,
            isMercenary: true,
          }
        : score,
    ),
    participants: currentData.participants.map((participant) =>
      participant.playerId === playerId
        ? {
            ...participant,
            playerId: replacementMercenaryId,
            isMercenary: true,
          }
        : participant,
    ),
    moms: currentData.moms.map((mom) => ({
      ...mom,
      playerIds: mom.playerIds.map((id) =>
        id === playerId ? replacementMercenaryId : id,
      ),
    })),
    goalEvents: currentData.goalEvents.map((event) => ({
      ...event,
      scorerId:
        event.scorerId === playerId
          ? replacementMercenaryId
          : event.scorerId,
      scorerIsMercenary:
        event.scorerId === playerId
          ? true
          : event.scorerIsMercenary,
      assistId:
        event.assistId === playerId
          ? replacementMercenaryId
          : event.assistId,
      assistIsMercenary:
        event.assistId === playerId
          ? true
          : event.assistIsMercenary,
    })),
  };
};
