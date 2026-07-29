import { Score, PlayerStats, Match } from "../types/data";
import { getScores, getMatchesWithDetails } from "./storage";

// 선수별 통계 계산
export const calculatePlayerStats = (): PlayerStats[] => {
  const scores = getScores();
  const statsMap: { [playerId: string]: PlayerStats } = {};

  // 모든 득점 데이터를 선수별로 집계
  scores.forEach((score) => {
    if (!statsMap[score.playerId]) {
      statsMap[score.playerId] = {
        playerId: score.playerId,
        playerName: score.playerName,
        totalGoals: 0,
        totalAssists: 0,
        matchCount: 0,
        momCount: 0,
      };
    }

    statsMap[score.playerId].totalGoals += score.goals;
    statsMap[score.playerId].totalAssists += score.assists;
  });

  // 경기 수 계산 (각 선수가 참여한 고유 매치 수)
  Object.keys(statsMap).forEach((playerId) => {
    const playerScores = scores.filter((s) => s.playerId === playerId);
    const uniqueMatches = new Set(playerScores.map((s) => s.matchId));
    statsMap[playerId].matchCount = uniqueMatches.size;
  });

  // 순위 정렬 (골 > 도움 > 이름 순)
  return Object.values(statsMap).sort((a, b) => {
    if (b.totalGoals !== a.totalGoals) return b.totalGoals - a.totalGoals;
    if (b.totalAssists !== a.totalAssists)
      return b.totalAssists - a.totalAssists;
    return a.playerName.localeCompare(b.playerName, "ko-KR");
  });
};

// 최근 완료된 매치 가져오기
export const getRecentCompletedMatches = (limit: number = 3): Match[] => {
  const matches = getMatchesWithDetails(); // ✅ participants와 scores 포함
  return matches
    .filter((m) => m.isCompleted)
    .sort(
      (a, b) =>
        new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
    )
    .slice(0, limit);
};

// 미완료 매치 가져오기
export const getIncompleteMatches = (): Match[] => {
  const matches = getMatchesWithDetails(); // ✅ participants와 scores 포함
  return matches
    .filter((m) => !m.isCompleted)
    .sort(
      (a, b) =>
        new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
    );
};

