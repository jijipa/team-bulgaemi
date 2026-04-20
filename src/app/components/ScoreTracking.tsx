import { useState, useEffect, useRef } from "react";
import svgPaths from "../../imports/svg-cgpq26t2iw";
import goalSvgPaths from "../../imports/svg-t73dq809gt";
import { motion, AnimatePresence } from "motion/react";
import ScorerSelectSheet from "./ScorerSelectSheet";
import AssistSelectSheet from "./AssistSelectSheet";
import {
  generateId,
  addScores,
  updateMatch,
  getParticipants,
  saveParticipants,
  replaceGoalEventsByMatchId,
} from "../utils/storage";
import { Score, Participant, GoalEvent, GoalType } from "../types/data";
import { fetchJSONP } from "../utils/jsonp";

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
  googleScriptUrl: string;
  opponentName?: string; // 상대팀 이름
}

interface QuarterScore {
  our: number;
  opponent: number;
}

interface GoalRecord {
  id: string;
  quarter: number;
  goalType: GoalType;
  scorer: { name: string; isMercenary: boolean };
  assist: { name: string; isMercenary: boolean } | null;
  isOpponentGoal: boolean;
}

export default function ScoreTracking({ selectedPlayers, mercenaries, matchId, isEditMode, onBack, googleScriptUrl, opponentName }: ScoreTrackingProps) {
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [quarterScores, setQuarterScores] = useState<QuarterScore[]>([
    { our: 0, opponent: 0 },
    { our: 0, opponent: 0 },
    { our: 0, opponent: 0 },
    { our: 0, opponent: 0 },
  ]);
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

  // ✅ 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && matchId && googleScriptUrl) {
      loadExistingMatchData();
    }
  }, [isEditMode, matchId, googleScriptUrl]);

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
      const newQuarterScores: QuarterScore[] = [
        { our: 0, opponent: 0 },
        { our: 0, opponent: 0 },
        { our: 0, opponent: 0 },
        { our: 0, opponent: 0 },
      ];

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
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📥 기존 매치 데이터 로드 중...");
      console.log("Match ID:", matchId);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Google Sheets에서 Scores와 Matches 데이터 병렬 로드
      const [scoresData, matchesData] = await Promise.all([
        fetchJSONP<{ success: boolean; scores: any[] }>(
          `${googleScriptUrl}?action=getScores`
        ),
        fetchJSONP<{ success: boolean; matches: any[] }>(
          `${googleScriptUrl}?action=getMatches`
        ),
      ]);

      // 해당 매치의 데이터 찾기
      const currentMatch = matchesData.success 
        ? matchesData.matches.find((m: any) => 
            (m["경기ID"] === matchId) || (m["id"] === matchId)
          )
        : null;

      console.log("📊 현재 매치 데이터:", currentMatch);

      if (scoresData.success && scoresData.scores) {
        // 해당 매치의 득점 데이터만 필터링
        const matchScores = scoresData.scores.filter(
          (score: any) => (score["matchId"] === matchId) || (score["경기ID"] === matchId)
        );

        console.log("📊 매치 득점 데이터:", matchScores);

        if (matchScores.length > 0 || currentMatch) {
          // 쿼터별 골 기록 복원
          const restoredGoalRecords: GoalRecord[] = [];
          const newQuarterScores: QuarterScore[] = [
            { our: 0, opponent: 0 },
            { our: 0, opponent: 0 },
            { our: 0, opponent: 0 },
            { our: 0, opponent: 0 },
          ];

          // ✅ 1. 골/도움 기록 복원 (Scores 시트)
          // 선수별 쿼터별 골/도움 데이터를 먼저 수집
          const playerGoalsMap = new Map<string, Map<number, { goals: number; assists: number }>>();
          
          matchScores.forEach((score: any) => {
            const playerName = score["playerName"] || score["이름"];
            const playerId = String(score["playerId"] ?? score["선수ID"] ?? "").toLowerCase();
            const isMercenary = score["isMercenary"] || score["용병여부"] || false;
            let quarterData = score["quarterData"] || [];

            // ✅ opponent 데이터는 playerGoalsMap에 추가하지 않음
            if (playerId === "opponent") {
              return;
            }

            // ✅ quarterData가 문자열이면 파싱
            if (typeof quarterData === "string") {
              try {
                quarterData = JSON.parse(quarterData);
              } catch (e) {
                console.error("❌ quarterData 파싱 실패:", e);
                quarterData = [];
              }
            }

            if (!playerGoalsMap.has(playerName)) {
              playerGoalsMap.set(playerName, new Map());
            }

            quarterData.forEach((qData: any) => {
              const quarter = qData.quarter;
              const goals = qData.goals || 0;
              const assists = qData.assists || 0;

              playerGoalsMap.get(playerName)!.set(quarter, { goals, assists });
            });
          });

          console.log("📊 선수별 골/도움 맵:", playerGoalsMap);

          // 골 기록 생성 (도움은 나중에 매칭)
          const goalsByQuarterPlayer: Array<{
            quarter: number;
            scorer: string;
            isMercenary: boolean;
          }> = [];

          // ✅ 현재 용병 이름 목록 (Google Sheets 데이터가 부정확할 수 있으므로)
          const currentMercenaryNames = new Set(mercenaries.map(m => m.name));

          matchScores.forEach((score: any) => {
            const playerName = score["playerName"] || score["이름"];
            const playerId = String(score["playerId"] ?? score["선수ID"] ?? "").toLowerCase();
            // ✅ isOpponentGoal 필드 확인 (실점 데이터)
            const isOpponentGoal = score["isOpponentGoal"] || score["실점여부"] || playerId === "opponent";
            
            // ✅ 실점 데이터는 별도로 처리
            if (isOpponentGoal) {
              console.log("🔴 실점 데이터 발견:", playerName, "playerId:", playerId);
              let quarterData = score["quarterData"] || [];
              
              // ✅ quarterData가 문자열이면 파싱
              if (typeof quarterData === "string") {
                try {
                  quarterData = JSON.parse(quarterData);
                } catch (e) {
                  console.error("❌ quarterData 파싱 실패:", e);
                  quarterData = [];
                }
              }
              
              quarterData.forEach((qData: any) => {
                const quarter = qData.quarter;
                const goals = qData.goals || 0;

                console.log(`  🔴 Q${quarter} 실점 ${goals}개 복원`);

                // 실점 기록 생성
                for (let i = 0; i < goals; i++) {
                  restoredGoalRecords.push({
                    id: `opponent_${Date.now()}_${Math.random()}`,
                    quarter: quarter,
                    scorer: { name: "상대팀 득점", isMercenary: false },
                    assist: null,
                    isOpponentGoal: true,
                  });
                  newQuarterScores[quarter - 1].opponent += 1;
                }
              });
              return; // 실점은 골/도움 매칭 스킵
            }
            
            // ✅ isMercenary 필드가 부정확할 수 있으므로 용병 목록에서도 확인
            const isMercenaryFromSheet = score["isMercenary"] || score["용병여부"] || false;
            const isMercenary = isMercenaryFromSheet || currentMercenaryNames.has(playerName);
            const quarterData = score["quarterData"] || [];

            quarterData.forEach((qData: any) => {
              const quarter = qData.quarter;
              const goals = qData.goals || 0;

              // 골 기록 생성
              for (let i = 0; i < goals; i++) {
                goalsByQuarterPlayer.push({
                  quarter,
                  scorer: playerName,
                  isMercenary,
                });
              }
            });
          });

          console.log("📊 골 기록 목록:", goalsByQuarterPlayer);

          // ✅ 도움 매칭 로직: 각 쿼터별 도움을 "실제 도움 횟수"만큼만 펼쳐서 사용
          const assistsByQuarterPlayer: Array<{
            quarter: number;
            assister: string;
            isMercenary: boolean;
            count: number;
          }> = [];

          playerGoalsMap.forEach((quarterMap, playerName) => {
            quarterMap.forEach((stats, quarter) => {
              if (stats.assists > 0) {
                const isMercenary = matchScores.find(
                  (s: any) => (s["playerName"] || s["이름"]) === playerName
                )?.["isMercenary"] || matchScores.find(
                  (s: any) => (s["playerName"] || s["이름"]) === playerName
                )?.["용병여부"] || false;

                assistsByQuarterPlayer.push({
                  quarter,
                  assister: playerName,
                  isMercenary: isMercenary || currentMercenaryNames.has(playerName), // ✅ 용병 목록에서도 확인
                  count: stats.assists,
                });
              }
            });
          });

          console.log("📊 도움 기록 목록:", assistsByQuarterPlayer);

          // 쿼터별 도움 슬롯 생성
          // 예: 1쿼터에 A가 도움 2개, B가 도움 1개면 [A, A, B]
          // 복원 시 이 배열을 앞에서부터 하나씩만 소모해서
          // 도움 수보다 골 수가 많을 경우 남는 골은 assist=null로 유지한다.
          const assistSlotsByQuarter = new Map<
            number,
            Array<{ name: string; isMercenary: boolean }>
          >();

          assistsByQuarterPlayer.forEach((assistData) => {
            const quarterSlots =
              assistSlotsByQuarter.get(assistData.quarter) || [];

            for (let i = 0; i < assistData.count; i++) {
              quarterSlots.push({
                name: assistData.assister,
                isMercenary: assistData.isMercenary,
              });
            }

            assistSlotsByQuarter.set(assistData.quarter, quarterSlots);
          });

          console.log("📊 쿼터별 도움 슬롯:", assistSlotsByQuarter);

          // ✅ 골 기록 생성 (쿼터별로 도움 매칭)
          goalsByQuarterPlayer.forEach((goalData) => {
            // ✅ 자책골 체크
            if (goalData.scorer === "자책골") {
              restoredGoalRecords.push({
                id: `restored_${Date.now()}_${Math.random()}`,
                quarter: goalData.quarter,
                scorer: { name: "자책골", isMercenary: false },
                assist: null,
                isOpponentGoal: false,
              });
              newQuarterScores[goalData.quarter - 1].our += 1;
              return; // 자책골은 도움 없음
            }

            let assist: { name: string; isMercenary: boolean } | null = null;

            // ✅ 해당 쿼터의 도움이 남아 있는 경우에만 순서대로 하나씩 할당
            const quarterAssistSlots =
              assistSlotsByQuarter.get(goalData.quarter) || [];

            if (quarterAssistSlots.length > 0) {
              const assistData = quarterAssistSlots.shift()!;
              assist = {
                name: assistData.name,
                isMercenary: assistData.isMercenary,
              };
            }

            restoredGoalRecords.push({
              id: `restored_${Date.now()}_${Math.random()}`,
              quarter: goalData.quarter,
              scorer: { name: goalData.scorer, isMercenary: goalData.isMercenary },
              assist,
              isOpponentGoal: false,
            });

            newQuarterScores[goalData.quarter - 1].our += 1;
          });

          console.log("✅ 골/도움 기록 복원 완료:", restoredGoalRecords);
          console.log("✅ 쿼터 스코어 복원 완료:", newQuarterScores);

          // ✅ 데이터 로드 완료 후 제거된 선수의 골/도움 기록 필터링
          // setTimeout 대신 직접 필터링 (state 업데이트는 비동기이므로)
          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          console.log("🔍 제거된 선수/용병 골 기록 필터링 시작...");
          
          const selectedPlayerNames = new Set(selectedPlayers.map(p => p.name));
          // currentMercenaryNames는 이미 위에서 선언됨 (287번 줄)
          
          console.log("📋 현재 참가 인원:", {
            선수: Array.from(selectedPlayerNames),
            용병: Array.from(currentMercenaryNames),
          });
          console.log("📋 복원된 골 기록 (필터링 전):", restoredGoalRecords);

          // 골 기록 필터링
          const filteredGoalRecords = restoredGoalRecords.filter(record => {
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

          // 변경 사항이 있으면 다시 계산
          if (filteredGoalRecords.length !== restoredGoalRecords.length || 
              JSON.stringify(filteredGoalRecords) !== JSON.stringify(restoredGoalRecords)) {
            
            console.log("⚠️ 골 기록 변경 감지:", {
              이전: restoredGoalRecords.length,
              이후: filteredGoalRecords.length,
              삭제됨: restoredGoalRecords.length - filteredGoalRecords.length
            });

            // 쿼터 스코어 재계산
            const filteredQuarterScores: QuarterScore[] = [
              { our: 0, opponent: 0 },
              { our: 0, opponent: 0 },
              { our: 0, opponent: 0 },
              { our: 0, opponent: 0 },
            ];

            filteredGoalRecords.forEach(record => {
              if (record.isOpponentGoal) {
                filteredQuarterScores[record.quarter - 1].opponent += 1;
              } else {
                filteredQuarterScores[record.quarter - 1].our += 1;
              }
            });

            // ✅ 필터링된 데이터로 업데이트
            setGoalRecords(filteredGoalRecords);
            setQuarterScores(filteredQuarterScores);

            console.log("✅ 필터링된 골 기록:", filteredGoalRecords);
            console.log("✅ 재계산된 쿼터 스코어:", filteredQuarterScores);
          } else {
            console.log("✅ 제거된 선수 없음 - 필터링 불필요");
            // 필터링 불필요하면 원본 데이터 사용
            setGoalRecords(restoredGoalRecords);
            setQuarterScores(newQuarterScores);
          }

          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }

        // ✅ 최초 데이터 로드 시 prevMercenariesRef 초기화 (필터링 방지)
        prevMercenariesRef.current = [...mercenaries];
        console.log("✅ prevMercenariesRef 초기화 완료:", mercenaries);

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🎉 기존 데이터 로드 완료!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        setIsInitialLoadComplete(true);
      }
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
      const newQuarterScores: QuarterScore[] = [
        { our: 0, opponent: 0 },
        { our: 0, opponent: 0 },
        { our: 0, opponent: 0 },
        { our: 0, opponent: 0 },
      ];

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

  const currentQuarterScore = quarterScores[currentQuarter - 1];

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
    // 다음 쿼터로 이동 (4쿼터가 아닌 경우)
    if (currentQuarter < 4) {
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
      // ✅ 수정 모드일 때 기존 데이터 삭제
      if (isEditMode) {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🗑️ 수정 모드: 기존 데이터 삭제 중...");
        
        // Google Sheets에서 기존 Scores 및 Participants 삭제
        await fetch(googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            action: "deleteMatchScores",
            data: JSON.stringify({ matchId: matchId }),
          }),
        });
        
        console.log("✅ 기존 스코어 데이터 삭제 완료");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }

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
        id: generateId("score"),
        matchId: matchId,
        playerId: player.id,
        playerName: player.name,
        goals: playerStats[player.name].goals,
        assists: playerStats[player.name].assists,
      })));

      // ✅ Score 데이터 생성 (용병)
      const mercenaryScores: Score[] = mercenaries.map((merc) => ({
        id: generateId("score"),
        matchId: matchId,
        playerId: `mercenary_${merc.id}`,
        playerName: merc.name,
        goals: playerStats[merc.name]?.goals || 0,
        assists: playerStats[merc.name]?.assists || 0,
      }));

      // ✅ 자책골 데이터 생성
      const ownGoalCount = goalRecords.filter(
        (record) => !record.isOpponentGoal && record.scorer.name === "자책골"
      ).length;

      const ownGoalScores: Score[] = ownGoalCount > 0 ? [{
        id: generateId("score"),
        matchId: matchId,
        playerId: "0", // 자책골은 playerId 0으로 설정
        playerName: "자책골",
        goals: ownGoalCount,
        assists: 0,
      }] : [];

      const scores = [...regularPlayerScores, ...mercenaryScores, ...ownGoalScores];

      // LocalStorage에 득점 데이터 저장
      addScores(scores);

      // ✅ LocalStorage에 참가자 데이터 저장
      const participantData: Participant[] = selectedPlayers.map(player => ({
        id: `participant_${matchId}_${player.id}`,
        matchId: matchId,
        playerId: player.id,
        isMercenary: false,
      }));
      
      const mercenaryParticipants: Participant[] = mercenaries.map(merc => ({
        id: `participant_${matchId}_mercenary_${merc.id}`,
        matchId: matchId,
        playerId: `mercenary_${merc.id}`,
        isMercenary: true,
      }));

      const allParticipants = [...participantData, ...mercenaryParticipants];
      
      // 기존 참가자 데이터 중 이 매치 것만 제거하고 새로 추가
      const existingParticipants = getParticipants().filter(p => p.matchId !== matchId);
      saveParticipants([...existingParticipants, ...allParticipants]);
      
      console.log("✅ 참가자 데이터 저장 완료:", allParticipants);

      // 매치 완료 ��리
      updateMatch(matchId, {
        isCompleted: true,
        ourScore: totalScore.our,
        opponentScore: totalScore.opponent,
      });

      console.log("✅ 득점 데이터 저장 완료:", scores);
      console.log("✅ 매치 업데이트 완료:", { matchId, ourScore: totalScore.our, opponentScore: totalScore.opponent });

      // 구글 시트에 완전한 데이터 저장
      try {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📤 구글 시트 저장 시작...");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔍 선택된 선수 전체 정보:", selectedPlayers);
        console.log("🔍 생성된 득점 데이터:", scores);
        console.log("🔍 득점 기록:", goalRecords);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        // 1. 매치 스코어 업데이트 (쿼터별 상세 정보 포함)
        console.log("📤 [1/3] 매치 업데이트 (Matches 시트)");
        
        // ✅ 쿼터별 득점/실점 데이터 생성
        const quarterScoresData = quarterScores.map((qScore, index) => ({
          quarter: index + 1,
          ourScore: qScore.our,
          opponentScore: qScore.opponent,
        }));
        
        console.log("📊 쿼터별 스코어 데이터:", quarterScoresData);
        
        await fetch(googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            action: "updateMatch",
            data: JSON.stringify({
              matchId: matchId,
              isCompleted: true,
              ourScore: totalScore.our,
              opponentScore: totalScore.opponent,
              quarterScores: quarterScoresData, // ✅ 쿼터별 데이터 추가
            }),
          }),
        });
        console.log("✅ 매치 업데이트 완료");

        // 2. 득점 데이터 저장 (쿼터별 상세 정보 포함)
        const scoreData = scores
          .filter((score) => score.goals > 0 || score.assists > 0)
          .map((score) => {
            // ✅ 자책골인지 확인
            const isOwnGoal = score.playerName === "자책골";
            
            // ✅ 일반 선수인지 용병인지 확인
            const player = selectedPlayers.find((p) => p.id === score.playerId);
            const mercenary = mercenaries.find((m) => `mercenary_${m.id}` === score.playerId);
            
            // 쿼터별 데이터 생성
            const quarterData = [1, 2, 3, 4].map((quarter) => {
              const quarterGoals = goalRecords.filter(
                (record) =>
                  record.quarter === quarter &&
                  !record.isOpponentGoal &&
                  record.scorer.name === score.playerName
              ).length;
              
              const quarterAssists = goalRecords.filter(
                (record) =>
                  record.quarter === quarter &&
                  !record.isOpponentGoal &&
                  record.assist?.name === score.playerName
              ).length;
              
              return { quarter, goals: quarterGoals, assists: quarterAssists };
            });
            
            return {
              id: score.id,
              matchId: score.matchId,
              playerId: score.playerId,
              playerName: score.playerName,
              playerNumber: isOwnGoal ? "0" : (mercenary ? "GUEST" : (player?.number || "?")),
              goals: score.goals,
              assists: score.assists,
              isMercenary: isOwnGoal ? false : (mercenary ? true : false),
              quarterData: quarterData,
            };
          });

        // ✅ 실점 데이터 생성 (상대팀 골을 Scores 시트에 저장)
        const opponentScoreData = quarterScores.flatMap((qScore, index) => {
          if (qScore.opponent === 0) return [];
          
          const quarter = index + 1;
          const quarterData = [1, 2, 3, 4].map((q) => ({
            quarter: q,
            goals: q === quarter ? qScore.opponent : 0,
            assists: 0,
          }));
          
          return [{
            id: `opponent_${matchId}_q${quarter}_${Date.now()}`,
            matchId: matchId,
            playerId: "opponent",
            playerName: opponentName || "상대팀",
            playerNumber: "OPP",
            goals: qScore.opponent,
            assists: 0,
            isMercenary: false,
            isOpponentGoal: true,
            quarterData: quarterData,
          }];
        });

        // ✅ 득점 + 실점 데이터 합치기
        const allScoreData = [...scoreData, ...opponentScoreData];

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📤 [2/3] 득점+실점 데이터 (Scores 시트):");
        console.log("  득점 데이터:", scoreData.length, "개");
        console.log("  실점 데이터:", opponentScoreData.length, "개");
        console.log(JSON.stringify(allScoreData, null, 2));
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        if (allScoreData.length > 0) {
          // ✅ 기존 Scores 데이터 삭제 (중복 방지)
          await fetch(googleScriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
              action: "deleteMatchScores",
              data: JSON.stringify({ matchId: matchId }),
            }),
          });
          console.log("✅ 기존 Scores 데이터 삭제 완료");

          // 새로운 Scores 데이터 저장
          await fetch(googleScriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
              action: "saveScores",
              data: JSON.stringify(allScoreData),
            }),
          });
          console.log("✅ 득점+실점 데이터 저장 완료");
        } else {
          console.log("⚠️ 득점 데이터 없음 (스킵)");
        }

        // 3. 선수 마스터 이터 저장
        const playerData = selectedPlayers.map((player) => ({
          id: player.id,
          number: player.number,
          name: player.name,
          isMercenary: false,
        }));

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📤 [3/3] 선수 마스터 데이터 (Players 시트):");
        console.log(JSON.stringify(playerData, null, 2));
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        await fetch(googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            action: "savePlayers",
            data: JSON.stringify(playerData),
          }),
        });
        console.log("✅ 선수 데이터 저장 완료");

        // 4. 경기 참가 인원 저장 (Participants 시트) ✅ 용병 포함!
        const participantsData = [
          // 일반 선수
          ...selectedPlayers.map((player) => ({
            id: `participant_${matchId}_${player.id}_${Date.now()}`,
            matchId: matchId,
            playerId: player.id,
            playerName: player.name,
            playerNumber: player.number,
            isMercenary: false,
          })),
          // 용병 선수
          ...mercenaries.map((m) => ({
            id: `participant_${matchId}_mercenary_${m.id}_${Date.now()}`,
            matchId: matchId,
            playerId: `mercenary_${m.id}`,
            playerName: m.name,
            playerNumber: "GUEST",
            isMercenary: true,
          })),
        ];

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📤 [4/4] 경기 참가 인원 데이터 (Participants 시트):");
        console.log(JSON.stringify(participantsData, null, 2));
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        // ✅ 기존 Participants 데이터 삭제 (중복 방지)
        await fetch(googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            action: "deleteMatchParticipants",
            data: JSON.stringify({ matchId: matchId }),
          }),
        });
        console.log("✅ 기존 Participants 데이터 삭제 완료");

        // 새로운 Participants 데이터 저장
        await fetch(googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            action: "saveParticipants",
            data: JSON.stringify(participantsData),
          }),
        });
        console.log("✅ 경기 참가 인원 저장 완료");

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🎉 구글 시트 저장 모두 완료!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━━");
      } catch (error) {
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.error("❌ 구글 시트 저장 실패:", error);
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
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
            <p className="relative shrink-0">{opponentName || "팀불개미"}</p>
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
        <div className="relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start px-[20px] relative w-full">
            <div className="bg-[#f2f2f2] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center p-[4px] relative w-full">
                  {[1, 2, 3, 4].map((quarter) => {
                    const isActive = currentQuarter === quarter;
                    const score = quarterScores[quarter - 1];
                    return (
                      <button
                        key={quarter}
                        onClick={() => handleQuarterClick(quarter)}
                        className={`flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] ${
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
                      팀불개미
                    </p>
                    <button
                      onClick={() => setShowScorerSheet(true)}
                      className="bg-clip-text bg-gradient-to-b leading-[168px] relative shrink-0 text-[164px] text-center from-[#616274] to-[#21252a] cursor-pointer"
                      style={{ WebkitTextFillColor: "transparent", fontFamily: 'var(--font-anton)' }}
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
                      {opponentName || "팀불개미"}
                    </p>
                    <button
                      onClick={handleOpponentGoal}
                      className="bg-clip-text bg-gradient-to-b leading-[168px] relative shrink-0 text-[164px] text-center from-[#616274] to-[#21252a] cursor-pointer"
                      style={{ WebkitTextFillColor: "transparent", fontFamily: 'var(--font-anton)' }}
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
                  {currentQuarter < 4 && (
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
                  {currentQuarter === 4 && <div className="size-[40px]" />}
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
      <div className="fixed backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-0 content-stretch flex flex-col items-start pb-[48px] pt-[16px] px-[20px] border-t border-[rgba(255,255,255,0.5)]">
        {currentQuarter === 4 ? (
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
