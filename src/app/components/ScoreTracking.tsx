import { useState, useEffect, useRef } from "react";
import svgPaths from "../../imports/svg-cgpq26t2iw";
import goalSvgPaths from "../../imports/svg-t73dq809gt";
import { motion, AnimatePresence } from "motion/react";
import ScorerSelectSheet from "./ScorerSelectSheet";
import AssistSelectSheet from "./AssistSelectSheet";
import {
  getScores,
  saveScores,
  updateMatch,
  getMatchById,
  getParticipants,
  saveParticipants,
  replaceGoalEventsByMatchId,
  getGoalEvents,
} from "../utils/storage";
import { Score, Participant, GoalEvent, GoalType } from "../types/data";
import { isSupabaseConfigured } from "../lib/supabase";
import { updateMatchInSupabase } from "../services/supabaseMatches";
import {
  replaceGoalEventsForMatchInSupabase,
  replaceParticipantsForMatchInSupabase,
  replaceScoresForMatchInSupabase,
} from "../services/supabaseAppData";
import { teamConfig } from "../config/team";

interface Player {
  id: string;
  number: string;
  name: string;
}

interface Mercenary {
  id: string;
  name: string;
}

interface ScoreTrackingProps {
  selectedPlayers: Player[];
  mercenaries: Mercenary[];
  matchId: string | null; // 현재 득점 입력 중인 매치 ID
  isEditMode?: boolean; // ✅ 수정 모드 추가
  onBack: () => void;
  opponentName?: string; // 상대팀 이름
}

interface QuarterScore {
  our: number;
  opponent: number;
}

interface GoalRecord {
  id: string;
  quarter: number;
  goalType?: GoalType;
  scorer: { name: string; isMercenary: boolean };
  assist: { name: string; isMercenary: boolean } | null;
  isOpponentGoal: boolean;
}

const DEFAULT_QUARTER_COUNT = 4;

const parseQuarterCount = (quarterCount?: string): number => {
  const parsed = Number.parseInt(quarterCount?.match(/\d+/)?.[0] || "", 10);
  return [2, 4, 6, 8].includes(parsed) ? parsed : DEFAULT_QUARTER_COUNT;
};

const createEmptyQuarterScores = (count: number): QuarterScore[] =>
  Array.from({ length: count }, () => ({ our: 0, opponent: 0 }));

export default function ScoreTracking({ selectedPlayers, mercenaries, matchId, isEditMode, onBack, opponentName }: ScoreTrackingProps) {
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [registeredQuarterCount, setRegisteredQuarterCount] = useState(DEFAULT_QUARTER_COUNT);
  const [quarterScores, setQuarterScores] = useState<QuarterScore[]>(() =>
    createEmptyQuarterScores(DEFAULT_QUARTER_COUNT),
  );
  const [showScorerSheet, setShowScorerSheet] = useState(false);
  const [showAssistSheet, setShowAssistSheet] = useState(false);
  const [selectedScorer, setSelectedScorer] = useState<{ player: Player | Mercenary; isMercenary: boolean } | null>(null);
  const [goalRecords, setGoalRecords] = useState<GoalRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false); // ✅ 데이터 로딩 상태 추가
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false); // ✅ 초기 로드 완료 플래그
  
  // ✅ 이전 용병 목록 추적
  const prevMercenariesRef = useRef<Mercenary[]>([]);

  useEffect(() => {
    const match = matchId ? getMatchById(matchId) : undefined;
    const nextQuarterCount = parseQuarterCount(match?.quarterCount);

    setRegisteredQuarterCount(nextQuarterCount);
    setCurrentQuarter((quarter) => Math.min(quarter, nextQuarterCount));
    setQuarterScores((scores) =>
      Array.from(
        { length: nextQuarterCount },
        (_, index) => scores[index] || { our: 0, opponent: 0 },
      ),
    );
  }, [matchId]);

  // ✅ 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && matchId) {
      loadExistingMatchData();
    }
  }, [isEditMode, matchId]);

  // ✅ 선수/용병 변경 시 득점 기록 필터링 (더 확실한 방법)
  useEffect(() => {
    if (!isEditMode) return;

    // ✅ 초기 로드 완료 전에는 필터링 스킵
    if (!isInitialLoadComplete) {
      console.log("⏳ 초기 로드 중 - 필터링 스킵");
      return;
    }

    // goalRecords가 비어있으면 필터링 불필요
    if (goalRecords.length === 0) return;

    // ✅ 최초 로드 시 prevMercenariesRef 초기화 (필터링 스킵)
    if (prevMercenariesRef.current.length === 0) {
      prevMercenariesRef.current = [...mercenaries];
      console.log("✅ 최초 로드: prevMercenariesRef 초기화", mercenaries);
      return;
    }

    // 용병 목록이 실제로 변경되었는지 확인
    const prevMercNames = prevMercenariesRef.current.map(m => m.name).sort().join(',');
    const currMercNames = mercenaries.map(m => m.name).sort().join(',');
    
    console.log("🔍 용병 변경 확인:", {
      이전: prevMercNames,
      현재: currMercNames,
      변경됨: prevMercNames !== currMercNames
    });

    // 변경이 없으면 스킵
    if (prevMercNames === currMercNames) {
      console.log("✅ 용병 변경 없음 - 필터링 스킵");
      return;
    }

    console.log("⚠️ 용병 변경 감지 - 필터링 시작");

    // 이전 용병 목록 업데이트
    prevMercenariesRef.current = [...mercenaries];

    // 현재 선택된 선수 이름 목록
    const selectedPlayerNames = new Set(selectedPlayers.map(p => p.name));
    const currentMercenaryNames = new Set(mercenaries.map(m => m.name));
    
    console.log("📋 현재 상태:", {
      선수: Array.from(selectedPlayerNames),
      용병: Array.from(currentMercenaryNames),
      득점기록: goalRecords.length
    });

    // ✅ 득점 기록 필터링: 삭제된 선수/용병만 제거
    const updatedGoalRecords = goalRecords
      .map(record => {
        // 상대팀 골은 그대로 유지
        if (record.isOpponentGoal) return record;

        let scorerExists = true;
        let assistExists = true;

        // 득점자 확인
        if (record.scorer.isMercenary) {
          scorerExists = currentMercenaryNames.has(record.scorer.name);
        } else {
          scorerExists = selectedPlayerNames.has(record.scorer.name);
        }

        // 도���자 확인
        if (record.assist) {
          if (record.assist.isMercenary) {
            assistExists = currentMercenaryNames.has(record.assist.name);
          } else {
            assistExists = selectedPlayerNames.has(record.assist.name);
          }
        }

        console.log(`🔍 기록 확인: ${record.scorer.name} → ${record.assist?.name || "도움없음"}`, {
          득점자존재: scorerExists,
          도움자존재: assistExists
        });

        // ✅ 득점자가 없으면 골 기록 전체 삭제
        if (!scorerExists) {
          console.log(`❌ 득점자 삭제: ${record.scorer.name}`);
          return null;
        }

        // ✅ 도움자가 없으면 도움만 null로 변경 (골 기록은 유지)
        if (!assistExists && record.assist) {
          console.log(`⚠️ 도움자 삭제: ${record.assist.name}`);
          return {
            ...record,
            assist: null
          };
        }

        return record;
      })
      .filter((record): record is GoalRecord => record !== null);

    // 필터링/업데이트된 기록이 원래와 다르면 업데이트
    if (JSON.stringify(updatedGoalRecords) !== JSON.stringify(goalRecords)) {
      console.log("⚠️ 득점 기록 변경됨:", {
        이전: goalRecords.length,
        이후: updatedGoalRecords.length,
        삭제됨: goalRecords.length - updatedGoalRecords.length
      });

      // 쿼터 스코어 재계산
      const newQuarterScores = createEmptyQuarterScores(registeredQuarterCount);

      updatedGoalRecords.forEach(record => {
        if (record.isOpponentGoal) {
          newQuarterScores[record.quarter - 1].opponent += 1;
        } else {
          newQuarterScores[record.quarter - 1].our += 1;
        }
      });

      setGoalRecords(updatedGoalRecords);
      setQuarterScores(newQuarterScores);

      console.log("✅ 득점 기록 업데이트 완료:", updatedGoalRecords);
      console.log("✅ 쿼터 스코어 재계산 완료:", newQuarterScores);
    } else {
      console.log("✅ 득점 기록 변경 없음");
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }, [selectedPlayers, mercenaries, isEditMode]); // ✅ goalRecords 제거!

  const loadExistingMatchData = async () => {
    if (!matchId) return;

    setIsLoadingData(true);
    try {
      const matchEvents = getGoalEvents().filter((event) => event.matchId === matchId);
      const restoredGoalRecords: GoalRecord[] = matchEvents.map((event) => ({
        id: event.id,
        quarter: event.quarter,
        goalType: event.goalType,
        scorer: {
          name: event.isOpponentGoal ? "상대팀 득점" : event.scorerName,
          isMercenary: event.scorerIsMercenary,
        },
        assist: event.assistName
          ? {
              name: event.assistName,
              isMercenary: event.assistIsMercenary,
            }
          : null,
        isOpponentGoal: event.isOpponentGoal,
      }));

      const match = getMatchById(matchId);
      const restoredQuarterCount = Math.max(
        parseQuarterCount(match?.quarterCount),
        ...restoredGoalRecords.map((record) => record.quarter),
      );
      const newQuarterScores = createEmptyQuarterScores(restoredQuarterCount);

      restoredGoalRecords.forEach((record) => {
        if (!newQuarterScores[record.quarter - 1]) return;
        if (record.isOpponentGoal) {
          newQuarterScores[record.quarter - 1].opponent += 1;
        } else {
          newQuarterScores[record.quarter - 1].our += 1;
        }
      });

      setGoalRecords(restoredGoalRecords);
      setRegisteredQuarterCount(restoredQuarterCount);
      setCurrentQuarter((quarter) => Math.min(quarter, restoredQuarterCount));
      setQuarterScores(newQuarterScores);
      prevMercenariesRef.current = [...mercenaries];
      setIsInitialLoadComplete(true);
    } catch (error) {
      console.error("❌ 기존 데이터 로드 실패:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // ✅ 제거된 선수/용병의 골/도움 기록 필터링 함수
  const filterRemovedPlayersGoals = () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 제거된 선수/용병 골 기록 필터링 시작...");
    
    const selectedPlayerNames = new Set(selectedPlayers.map(p => p.name));
    const currentMercenaryNames = new Set(mercenaries.map(m => m.name));
    
    console.log("📋 현재 참가 인원:", {
      선수: Array.from(selectedPlayerNames),
      용병: Array.from(currentMercenaryNames),
    });

    // 골 기록 필터링
    const filteredGoalRecords = goalRecords.filter(record => {
      // 상대팀 골과 자책골은 유지
      if (record.isOpponentGoal || record.scorer.name === "자책골") return true;

      // 득점자 확인
      const scorerExists = record.scorer.isMercenary
        ? currentMercenaryNames.has(record.scorer.name)
        : selectedPlayerNames.has(record.scorer.name);

      if (!scorerExists) {
        console.log(`❌ 득점자 제거됨: ${record.scorer.name} (${record.quarter}쿼터)`);
        return false;
      }

      // 도움자 확인 (있는 경우만)
      if (record.assist) {
        const assistExists = record.assist.isMercenary
          ? currentMercenaryNames.has(record.assist.name)
          : selectedPlayerNames.has(record.assist.name);

        if (!assistExists) {
          console.log(`⚠️ 도움자 제거됨: ${record.assist.name} → 도움만 null로 변경`);
          // 도움자만 제거 (골 기록은 유지)
          record.assist = null;
        }
      }

      return true;
    });

    // 변경 사항이 있으면 업데이트
    if (filteredGoalRecords.length !== goalRecords.length || 
        JSON.stringify(filteredGoalRecords) !== JSON.stringify(goalRecords)) {
      
      console.log("⚠️ 골 기록 변경 감지:", {
        이전: goalRecords.length,
        이후: filteredGoalRecords.length,
        삭제됨: goalRecords.length - filteredGoalRecords.length
      });

      // 쿼터 스코어 재계산
      const newQuarterScores = createEmptyQuarterScores(registeredQuarterCount);

      filteredGoalRecords.forEach(record => {
        if (record.isOpponentGoal) {
          newQuarterScores[record.quarter - 1].opponent += 1;
        } else {
          newQuarterScores[record.quarter - 1].our += 1;
        }
      });

      setGoalRecords(filteredGoalRecords);
      setQuarterScores(newQuarterScores);

      console.log("✅ 필터링된 골 기록:", filteredGoalRecords);
      console.log("✅ 재계산된 쿼터 스코어:", newQuarterScores);
    } else {
      console.log("✅ 제거된 선수 없음 - 필터링 불필요");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  };

  const totalScore = quarterScores.reduce(
    (acc, score) => ({
      our: acc.our + score.our,
      opponent: acc.opponent + score.opponent,
    }),
    { our: 0, opponent: 0 }
  );

  const quarterNumbers = Array.from(
    { length: registeredQuarterCount },
    (_, index) => index + 1,
  );
  const shouldScrollQuarterTabs = registeredQuarterCount > 4;
  const currentQuarterScore = quarterScores[currentQuarter - 1] || { our: 0, opponent: 0 };
  const scoreNumberStyle = {
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundImage: "linear-gradient(180deg, #616274 0%, #21252a 100%)",
    color: "transparent",
    fontFamily: "var(--font-anton)",
    fontSize: "128px",
    lineHeight: "132px",
  } as const;

  const getMatchResult = () => {
    if (totalScore.our > totalScore.opponent) return '승';
    if (totalScore.our < totalScore.opponent) return '패';
    return '무';
  };

  const handleQuarterClick = (quarter: number) => {
    setCurrentQuarter(quarter);
  };

  const handleScorerSelect = (player: Player | Mercenary, isMercenary: boolean, isOwnGoal?: boolean) => {
    // ✅ 자책골인 경우 도움 선택 없이 바로 기록
    if (isOwnGoal) {
      const newGoal: GoalRecord = {
        id: Date.now().toString(),
        quarter: currentQuarter,
        scorer: { name: "자책골", isMercenary: false },
        assist: null,
        isOpponentGoal: false,
      };

      setGoalRecords([...goalRecords, newGoal]);

      // 쿼터 점수 업데이트
      const newQuarterScores = [...quarterScores];
      newQuarterScores[currentQuarter - 1].our += 1;
      setQuarterScores(newQuarterScores);

      // 상태 초기화
      setShowScorerSheet(false);
      
      console.log("자책골 기록:", newGoal);
      return;
    }

    // 일반 득점자 선택 시 도움 선택 화면으로 이동
    setSelectedScorer({ player, isMercenary });
    setShowScorerSheet(false);
    setShowAssistSheet(true);
  };

  const handleAssistSelect = (assist: Player | Mercenary | null, isMercenary: boolean) => {
    if (!selectedScorer) return;

    // 득점 기록 추가
    const newGoal: GoalRecord = {
      id: Date.now().toString(),
      quarter: currentQuarter,
      scorer: { name: selectedScorer.player.name, isMercenary: selectedScorer.isMercenary },
      assist: assist ? { name: assist.name, isMercenary } : null,
      isOpponentGoal: false,
    };

    setGoalRecords([...goalRecords, newGoal]);

    // 쿼터 점수 업데이트
    const newQuarterScores = [...quarterScores];
    newQuarterScores[currentQuarter - 1].our += 1;
    setQuarterScores(newQuarterScores);

    // 상태 초기화
    setShowAssistSheet(false);
    setSelectedScorer(null);

    console.log("득점 기록:", newGoal);
  };

  const handleOpponentGoal = () => {
    // 상대팀 득점 추가
    const newGoal: GoalRecord = {
      id: Date.now().toString(),
      quarter: currentQuarter,
      scorer: { name: "상대팀 득점", isMercenary: false },
      assist: null,
      isOpponentGoal: true,
    };

    setGoalRecords([...goalRecords, newGoal]);

    // 쿼터 점수 업데이트
    const newQuarterScores = [...quarterScores];
    newQuarterScores[currentQuarter - 1].opponent += 1;
    setQuarterScores(newQuarterScores);

    console.log("실점 기록:", newGoal);
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goalRecords.find(g => g.id === goalId);
    if (!goalToDelete) return;

    // 기록 삭제
    setGoalRecords(goalRecords.filter(g => g.id !== goalId));

    // 쿼터 점수 업데이트
    const newQuarterScores = [...quarterScores];
    if (goalToDelete.isOpponentGoal) {
      newQuarterScores[goalToDelete.quarter - 1].opponent -= 1;
    } else {
      newQuarterScores[goalToDelete.quarter - 1].our -= 1;
    }
    setQuarterScores(newQuarterScores);
  };

  const handleQuarterComplete = () => {
    // 다음 쿼터로 이동
    if (currentQuarter < registeredQuarterCount) {
      setCurrentQuarter(currentQuarter + 1);
    }
  };

  const handleFinalScoreSave = async () => {
    if (!matchId) {
      alert("매치 정보를 찾을 수 없습니다.");
      return;
    }

    setIsSaving(true);
    
    try {
      // 각 선수별 골/도움 집계
      const playerStats: { [name: string]: { goals: number; assists: number } } = {};

      // 선수 이름으로 초기화 (일반 선수만)
      selectedPlayers.forEach((player) => {
        playerStats[player.name] = { goals: 0, assists: 0 };
      });

      // ✅ 용병도 초기화
      mercenaries.forEach((merc) => {
        playerStats[merc.name] = { goals: 0, assists: 0 };
      });

      // 득점 기록을 순회하며 통계 집계
      goalRecords.forEach((record) => {
        // 상대팀 득점은 무시 (자책골은 별도 처리)
        if (record.isOpponentGoal) return;
        
        // 자책골은 선수 통계에서 제외 (별도로 처리)
        if (record.scorer.name === "자책골") return;

        // 득점 집계 (일반 선수 + 용병)
        if (playerStats[record.scorer.name]) {
          playerStats[record.scorer.name].goals += 1;
        }

        // 도움 집계 (일반 선수 + 용병)
        if (record.assist && playerStats[record.assist.name]) {
          playerStats[record.assist.name].assists += 1;
        }
      });

      // Score 데이터 생성 (일반 선수)
      const regularPlayerScores: Score[] = selectedPlayers.map((player) => (({
        id: `score_${matchId}_${player.id}`,
        matchId: matchId,
        playerId: player.id,
        playerName: player.name,
        playerNumber: player.number,
        goals: playerStats[player.name].goals,
        assists: playerStats[player.name].assists,
        isMercenary: false,
      })));

      // ✅ Score 데이터 생성 (용병)
      const mercenaryScores: Score[] = mercenaries.map((merc) => ({
        id: `score_${matchId}_mercenary_${merc.id}`,
        matchId: matchId,
        playerId: `mercenary_${merc.id}`,
        playerName: merc.name,
        playerNumber: "GUEST",
        goals: playerStats[merc.name]?.goals || 0,
        assists: playerStats[merc.name]?.assists || 0,
        isMercenary: true,
      }));

      // ✅ 자책골 데이터 생성
      const ownGoalCount = goalRecords.filter(
        (record) => !record.isOpponentGoal && record.scorer.name === "자책골"
      ).length;

      const ownGoalScores: Score[] = ownGoalCount > 0 ? [{
        id: `score_${matchId}_own_goal`,
        matchId: matchId,
        playerId: "0", // 자책골은 playerId 0으로 설정
        playerName: "자책골",
        playerNumber: "0",
        goals: ownGoalCount,
        assists: 0,
        isMercenary: false,
      }] : [];

      const scores = [...regularPlayerScores, ...mercenaryScores, ...ownGoalScores];
      const quarterNumbers = quarterScores.map((_, index) => index + 1);
      const scoreData = scores
        .filter((score) => score.goals > 0 || score.assists > 0)
        .map((score) => ({
          ...score,
          quarterData: quarterNumbers.map((quarter) => ({
            quarter,
            goals: goalRecords.filter(
              (record) =>
                record.quarter === quarter &&
                !record.isOpponentGoal &&
                record.scorer.name === score.playerName
            ).length,
            assists: goalRecords.filter(
              (record) =>
                record.quarter === quarter &&
                !record.isOpponentGoal &&
                record.assist?.name === score.playerName
            ).length,
          })),
        }));

      const opponentScoreData: Score[] = quarterScores.flatMap((qScore, index) => {
        if (qScore.opponent === 0) return [];

        const quarter = index + 1;
        return [{
          id: `score_${matchId}_opponent_q${quarter}`,
          matchId,
          playerId: "opponent",
          playerName: opponentName || "상대팀",
          playerNumber: "OPP",
          goals: qScore.opponent,
          assists: 0,
          isMercenary: false,
          isOpponentGoal: true,
          quarterData: quarterNumbers.map((q) => ({
            quarter: q,
            goals: q === quarter ? qScore.opponent : 0,
            assists: 0,
          })),
        }];
      });

      const allScoreData = [...scoreData, ...opponentScoreData];

      const participantData: Participant[] = selectedPlayers.map(player => ({
        id: `participant_${matchId}_${player.id}`,
        matchId: matchId,
        playerId: player.id,
        playerName: player.name,
        playerNumber: player.number,
        isMercenary: false,
      }));

      const mercenaryParticipants: Participant[] = mercenaries.map(merc => ({
        id: `participant_${matchId}_mercenary_${merc.id}`,
        matchId: matchId,
        playerId: `mercenary_${merc.id}`,
        playerName: merc.name,
        playerNumber: "GUEST",
        isMercenary: true,
      }));

      const allParticipants = [...participantData, ...mercenaryParticipants];
      const now = new Date().toISOString();
      const goalEvents: GoalEvent[] = goalRecords.map((record, index) => {
        const scorerPlayer = selectedPlayers.find((player) => player.name === record.scorer.name);
        const scorerMercenary = mercenaries.find((mercenary) => mercenary.name === record.scorer.name);
        const assistPlayer = selectedPlayers.find((player) => player.name === record.assist?.name);
        const assistMercenary = mercenaries.find((mercenary) => mercenary.name === record.assist?.name);

        const scorerId = record.isOpponentGoal
          ? "opponent"
          : record.scorer.name === "자책골"
            ? "0"
            : scorerPlayer?.id || (scorerMercenary ? `mercenary_${scorerMercenary.id}` : record.scorer.name);

        const goalType: GoalType = record.isOpponentGoal
          ? "opponent_team"
          : record.scorer.name === "자책골"
            ? "opponent_own_goal"
            : record.scorer.isMercenary
              ? "mercenary"
              : "team_player";

        return {
          id: `goal_${matchId}_${index}_${record.id}`,
          matchId,
          quarter: record.quarter,
          goalType,
          scorerId,
          scorerName: record.isOpponentGoal ? (opponentName || "상대팀") : record.scorer.name,
          scorerIsMercenary: record.scorer.isMercenary,
          assistId: assistPlayer?.id || (assistMercenary ? `mercenary_${assistMercenary.id}` : null),
          assistName: record.assist?.name || null,
          assistIsMercenary: Boolean(record.assist?.isMercenary),
          isOpponentGoal: record.isOpponentGoal,
          timestamp: now,
          createdAt: now,
        };
      });

      saveScores([
        ...getScores().filter((score) => score.matchId !== matchId),
        ...allScoreData,
      ]);

      const existingParticipants = getParticipants().filter(p => p.matchId !== matchId);
      saveParticipants([...existingParticipants, ...allParticipants]);
      replaceGoalEventsByMatchId(matchId, goalEvents);

      updateMatch(matchId, {
        isCompleted: true,
        ourScore: totalScore.our,
        opponentScore: totalScore.opponent,
      });

      if (isSupabaseConfigured) {
        await updateMatchInSupabase(matchId, {
          isCompleted: true,
          ourScore: totalScore.our,
          opponentScore: totalScore.opponent,
        });
        await Promise.all([
          replaceScoresForMatchInSupabase(matchId, allScoreData),
          replaceParticipantsForMatchInSupabase(matchId, allParticipants),
          replaceGoalEventsForMatchInSupabase(matchId, goalEvents),
        ]);
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        // ✅ 저장 완료 후 메인 화면으로 이동
        onBack();
      }, 2000);
    } catch (error) {
      console.error("득점 저장 실패:", error);
      alert("득점 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      transition={{ type: "tween", duration: 0.3 }}
      className="bg-white relative size-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {/* ✅ 로딩 중 표시 */}
      {isLoadingData && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#242b35]"></div>
          <p className="font-semibold text-[18px] text-[#242b35]" style={{ fontFamily: 'var(--font-pretendard)' }}>
            기존 스코어 데이터를 불러오는 중...
          </p>
        </div>
      )}

      {/* Header - Back Button */}
      <div className="absolute h-[48px] left-0 right-0 top-[24px]">
        <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center right-[8px] size-[40px] top-1/2">
          <button onClick={onBack} className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <div className="relative size-[24px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g>
                    <path
                      d={svgPaths.p208b6880}
                      stroke="var(--stroke-0, #242B35)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* vs Opponent Name */}
      <div className="absolute h-[48px] left-0 right-0 top-[65px]">
        <div className="absolute content-stretch flex flex-col items-center left-[20px] top-[14px]">
          <div className="content-stretch flex font-semibold gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#7b8087] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>
            <p className="relative shrink-0">vs</p>
            <p className="relative shrink-0">{opponentName || "상대팀"}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 right-0 top-[113px]">
        {/* Title */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col justify-end size-full">
            <div className="content-stretch flex flex-col items-start justify-end px-[20px] relative w-full">
              <p className="font-bold leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                쿼터 별 득점을 등록해주세요
              </p>
            </div>
          </div>
        </div>

        {/* Quarter Tabs */}
        <div className="relative shrink-0 w-full overflow-hidden">
          <div className="content-stretch flex flex-col items-start relative w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div
              className={`content-stretch flex flex-col items-start px-[20px] relative ${
                shouldScrollQuarterTabs ? "w-max" : "w-full"
              }`}
            >
            <div className="bg-[#f2f2f2] relative rounded-[12px] shrink-0 w-full">
              <div
                className={`content-stretch flex items-center p-[4px] relative ${
                  shouldScrollQuarterTabs ? "w-max" : "w-full"
                }`}
              >
                  {quarterNumbers.map((quarter) => {
                    const isActive = currentQuarter === quarter;
                    const score = quarterScores[quarter - 1] || { our: 0, opponent: 0 };
                    return (
                      <button
                        key={quarter}
                        onClick={() => handleQuarterClick(quarter)}
                        className={`relative rounded-[8px] ${
                          shouldScrollQuarterTabs
                            ? "shrink-0 w-[80px]"
                            : "flex-[1_0_0] min-w-px"
                        } ${
                          isActive ? "bg-white shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1)]" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center size-full">
                          <div className={`content-stretch flex flex-col items-center leading-[normal] not-italic px-[2px] py-[4px] relative w-full ${
                            isActive ? "text-[#242b35]" : "text-[#7b8087]"
                          }`}>
                            <p className="font-semibold relative shrink-0 text-[18px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                              {quarter}쿼터
                            </p>
                            <div className="content-stretch flex items-center relative shrink-0" style={{ fontFamily: 'var(--font-anton)' }}>
                              <p className="relative shrink-0 text-[18px] text-center w-[18px] whitespace-pre-wrap">{score.our}</p>
                              <p className="relative shrink-0 text-[16px]">:</p>
                              <p className="relative shrink-0 text-[18px] text-center w-[18px] whitespace-pre-wrap">{score.opponent}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
          {/* Quarter Label */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex gap-[8px] items-center px-[20px] relative w-full">
                <div className="bg-gradient-to-r flex-[1_0_0] from-[rgba(36,43,53,0)] h-[2px] min-h-px min-w-px rounded-[30px] to-[#242b35]" />
                <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                  {currentQuarter}쿼터
                </p>
                <div className="flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative">
                  <div className="-scale-y-100 flex-none rotate-180 w-full">
                    <div className="bg-gradient-to-r from-[rgba(36,43,53,0)] h-[2px] rounded-[30px] to-[#242b35] w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Board */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-center pt-[16px] px-[8px] relative w-full">
                {/* Left Arrow */}
                <div className="content-stretch flex items-center pb-[40px] relative shrink-0">
                  {currentQuarter > 1 && (
                    <button
                      onClick={() => setCurrentQuarter(currentQuarter - 1)}
                      className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]"
                    >
                      <div className="flex items-center justify-center relative shrink-0">
                        <div className="-scale-y-100 flex-none rotate-180">
                          <div className="relative size-[32px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g>
                                <path
                                  d={svgPaths.p29563800}
                                  stroke="var(--stroke-0, #242B35)"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                  {currentQuarter === 1 && <div className="size-[40px]" />}
                </div>

                {/* Our Team */}
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center min-h-px min-w-px relative">
                  <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0">
                    <p className="font-semibold leading-[normal] relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                      {teamConfig.name}
                    </p>
                    <button
                      onClick={() => setShowScorerSheet(true)}
                      className="relative shrink-0 text-center cursor-pointer"
                      style={scoreNumberStyle}
                    >
                      {currentQuarterScore.our}
                    </button>
                  </div>
                  <button
                    className="h-[52px] relative rounded-[8px] shrink-0 w-full border border-[#e1e4ec]"
                    onClick={() => setShowScorerSheet(true)}
                  >
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
                        <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>
                          득점 추가
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Colon */}
                <div className="content-stretch flex flex-col items-center justify-center pb-[40px] relative shrink-0 w-[16px]">
                  <p className="leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[64px] w-full whitespace-pre-wrap" style={{ fontFamily: 'var(--font-anton)' }}>
                    :
                  </p>
                </div>

                {/* Opponent Team */}
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center min-h-px min-w-px relative">
                  <div className="content-stretch flex flex-col gap-[4px] items-center not-italic relative shrink-0">
                    <p className="font-semibold leading-[normal] relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-pretendard)' }}>
                      {opponentName || "상대팀"}
                    </p>
                    <button
                      onClick={handleOpponentGoal}
                      className="relative shrink-0 text-center cursor-pointer"
                      style={scoreNumberStyle}
                    >
                      {currentQuarterScore.opponent}
                    </button>
                  </div>
                  <button className="h-[52px] relative rounded-[8px] shrink-0 w-full border border-[#e1e4ec]" onClick={handleOpponentGoal}>
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
                        <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>
                          실점 추가
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Right Arrow */}
                <div className="content-stretch flex items-center pb-[40px] relative shrink-0">
                  {currentQuarter < registeredQuarterCount && (
                    <button
                      onClick={() => setCurrentQuarter(currentQuarter + 1)}
                      className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]"
                    >
                      <div className="flex items-center justify-center relative shrink-0">
                        <div className="-scale-y-100 flex-none">
                          <div className="relative size-[32px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g>
                                <path
                                  d={svgPaths.p29563800}
                                  stroke="var(--stroke-0, #242B35)"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                  {currentQuarter === registeredQuarterCount && <div className="size-[40px]" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score History */}
        {goalRecords.filter((g) => g.quarter === currentQuarter).length > 0 && (
          <div className="px-[40px] pb-[120px] w-full">
            <div className="content-stretch flex gap-[24px] items-start justify-center relative w-full">
              {/* Our Goals */}
              <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px relative">
                {goalRecords
                  .filter((g) => g.quarter === currentQuarter && !g.isOpponentGoal)
                  .map((goal, index, arr) => {
                    const isLast = index === arr.length - 1;
                    return (
                      <div key={goal.id} className="content-stretch flex gap-[8px] items-start relative shrink-0">
                        <div className="content-stretch flex flex-col gap-[2px] items-end justify-center pt-[3px] relative shrink-0 w-[66px]">
                          <div className="content-stretch flex items-center relative shrink-0 w-full">
                            <p className="font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#2c2f37] text-[14px] text-ellipsis text-right w-full whitespace-nowrap" style={{ fontFamily: 'var(--font-pretendard)' }}>
                              {goal.scorer.name}
                            </p>
                          </div>
                          {goal.scorer.name === "자책골" ? (
                            <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#7b8087] text-[12px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                              자책골
                            </p>
                          ) : goal.assist && (
                            <div className="content-stretch flex gap-[2px] items-start justify-end relative shrink-0 w-full">
                              <p className="flex-[1_0_0] font-medium leading-[normal] min-h-px min-w-px not-italic overflow-hidden relative text-[#7b8087] text-[12px] text-ellipsis text-right whitespace-nowrap" style={{ fontFamily: 'var(--font-pretendard)' }}>
                                {goal.assist.name}
                              </p>
                              <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#7b8087] text-[12px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                                도움
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="content-stretch flex flex-col items-center relative self-stretch shrink-0">
                          <div className="bg-[#d9d9d9] h-[4px] shrink-0 w-px" />
                          <div className="relative shrink-0 size-[16px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <path d={goalSvgPaths.pba5d500} fill="var(--fill-0, #2C2F37)" />
                            </svg>
                          </div>
                          <div className={`bg-[#d9d9d9] shrink-0 w-px ${isLast ? "flex-[1_0_0] min-h-px min-w-px" : "h-[28px]"}`} />
                        </div>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="flex items-center justify-center relative shrink-0"
                        >
                          <div className="flex-none rotate-180">
                            <div className="relative size-[24px]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                <g>
                                  <path d="M8 12L16 12" stroke="var(--stroke-0, #CF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                  <circle cx="12" cy="12" r="9" stroke="var(--stroke-0, #CF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="rotate(180 12 12)" />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Opponent Goals */}
              <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px relative">
                {goalRecords
                  .filter((g) => g.quarter === currentQuarter && g.isOpponentGoal)
                  .map((goal, index, arr) => {
                    const isLast = index === arr.length - 1;
                    return (
                      <div key={goal.id} className="content-stretch flex gap-[8px] items-start relative shrink-0">
                        <div className="content-stretch flex flex-col items-end justify-center pt-[3px] relative shrink-0">
                          <div className="content-stretch flex items-center relative shrink-0">
                            <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#2c2f37] text-[14px] text-center" style={{ fontFamily: 'var(--font-pretendard)' }}>
                              상대팀 득점
                            </p>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col items-center relative self-stretch shrink-0">
                          <div className="bg-[#d9d9d9] h-[4px] shrink-0 w-px" />
                          <div className="relative shrink-0 size-[16px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <path d={goalSvgPaths.pba5d500} fill="var(--fill-0, #2C2F37)" />
                            </svg>
                          </div>
                          <div className={`bg-[#d9d9d9] shrink-0 w-px ${isLast ? "h-[4px]" : "h-[28px]"}`} />
                        </div>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="flex items-center justify-center relative shrink-0"
                        >
                          <div className="flex-none rotate-180">
                            <div className="relative size-[24px]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                <g>
                                  <path d="M8 12L16 12" stroke="var(--stroke-0, #CF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                  <circle cx="12" cy="12" r="9" stroke="var(--stroke-0, #CF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="rotate(180 12 12)" />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="fixed backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-0 content-stretch flex flex-col items-start pb-[24px] pt-[16px] px-[20px] border-t border-[rgba(255,255,255,0.5)]">
        {currentQuarter === registeredQuarterCount ? (
          <button 
            onClick={handleFinalScoreSave}
            disabled={isSaving}
            className={`content-stretch flex gap-[8px] items-center justify-center not-italic p-[10px] relative rounded-[8px] w-full h-[52px] text-[18px] ${
              isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#242b35]'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <p className="font-medium leading-[normal] relative shrink-0 text-white" style={{ fontFamily: 'var(--font-paperlogy)' }}>
                  저장 중...
                </p>
              </>
            ) : (
              <>
                <p className="font-medium leading-[normal] relative shrink-0 text-[#a2a8b0]" style={{ fontFamily: 'var(--font-paperlogy)' }}>
                  최종 스코어
                </p>
                <p className="font-bold leading-[0] relative shrink-0 text-white tracking-[1.08px]" style={{ fontFamily: 'var(--font-paperlogy)' }}>
                  <span className="leading-[normal]">{totalScore.our}:{totalScore.opponent}</span>
                  <span className="font-medium leading-[normal]">({getMatchResult()})</span>
                </p>
                <p className="font-medium leading-[normal] relative shrink-0 text-white" style={{ fontFamily: 'var(--font-paperlogy)' }}>
                  등록
                </p>
              </>
            )}
          </button>
        ) : (
          <button onClick={handleQuarterComplete} className="w-full h-[52px] rounded-[8px] bg-white border border-[#242b35] font-medium text-[18px] text-[#242b35]" style={{ fontFamily: 'var(--font-paperlogy)' }}>
            {currentQuarter}쿼터 점수 등록 완료
          </button>
        )}
      </div>

      {/* Scorer Select Sheet */}
      <AnimatePresence>
        {showScorerSheet && (
          <ScorerSelectSheet
            selectedPlayers={selectedPlayers}
            mercenaries={mercenaries}
            onScorerSelect={handleScorerSelect}
            onClose={() => setShowScorerSheet(false)}
          />
        )}
      </AnimatePresence>

      {/* Assist Select Sheet */}
      <AnimatePresence>
        {showAssistSheet && selectedScorer && (
          <AssistSelectSheet
            scorerName={selectedScorer.player.name}
            scorerIsMercenary={selectedScorer.isMercenary}
            selectedPlayers={selectedPlayers}
            mercenaries={mercenaries}
            excludePlayerId={'id' in selectedScorer.player ? selectedScorer.player.id : undefined}
            onSelectAssist={handleAssistSelect}
            onClose={() => {
              setShowAssistSheet(false);
              setSelectedScorer(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Success Toast */}
      {showSuccessToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-28 left-1/2 transform -translate-x-1/2 bg-[#242b35] text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <p className="font-medium text-[16px]" style={{ fontFamily: 'var(--font-pretendard)' }}>
            ✅ 골/도움 통계가 업데이트되었습니다!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
