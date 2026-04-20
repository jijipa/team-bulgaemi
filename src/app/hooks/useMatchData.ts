import { useState, useEffect } from "react";
import { Match, Score, PlayerStats } from "../types/data";
import {
  getMatchesWithDetails,
  getScores,
  getPlayers,
  addMatch as addMatchToStorage,
  updateMatch as updateMatchInStorage,
} from "../utils/storage";
import {
  calculatePlayerStats,
  getRecentCompletedMatches,
  getIncompleteMatches,
} from "../utils/stats";

// 매치 데이터를 관리하는 커스텀 훅
export const useMatchData = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [incompleteMatches, setIncompleteMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedMatches = getMatchesWithDetails(); // ✅ participants와 scores 포함
      const loadedScores = getScores();
      const calculatedStats = calculatePlayerStats();

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ [useMatchData] 매치 데이터 로드 완료:");
      console.log("  - Matches:", loadedMatches.length, "개");
      console.log("  - 첫 번째 매치:", loadedMatches[0]);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      setMatches(loadedMatches);
      setScores(loadedScores);
      setPlayerStats(calculatedStats);
      
      // 최근 완료된 매치와 미완료 매치도 업데이트
      setRecentMatches(getRecentCompletedMatches(3));
      setIncompleteMatches(getIncompleteMatches());
      
      console.log("✅ 선수 데이터 초기화 완료:", loadedMatches.length, "개");
      console.log("✅ Matches 데이터 로드 완료:", loadedMatches);
      console.log("✅ 매치 개수:", loadedMatches.length);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadData();
  }, []);

  // 데이터 새로고침
  const refreshData = () => {
    loadData();
  };

  return {
    matches,
    scores,
    playerStats,
    recentMatches,
    incompleteMatches,
    isLoading,
    refreshData,
  };
};