import { useState, useEffect } from "react";
import { Match } from "../types/data";
import { useMatchData } from "../hooks/useMatchData";
import svgPaths from "../../imports/svg-pst6m3rsp2";
import { motion, AnimatePresence } from "motion/react";
import MatchActionsSheet from "./MatchActionsSheet";
import { deleteMatch, getParticipants } from "../utils/storage";
import MomSelectionModal from "./MomSelectionModal";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  deleteMatchFromSupabase,
  fetchMatchesFromSupabase,
} from "../services/supabaseMatches";
import {
  fetchAppDataFromSupabase,
  saveMomToSupabase,
} from "../services/supabaseAppData";
import {
  saveGoalEvents,
  saveMOMs,
  saveMatches,
  saveParticipants,
  saveScores,
} from "../utils/storage";

// 매치 데이터 타입
export interface MatchListItem {
  id: string;
  date: string; // YYYY.MM.DD 형식
  dayOfWeek: string; // 요일: 월, 화, 수, 목, 금, 토, 일
  ourScore?: number;
  opponentScore?: number;
  opponentName: string;
  result?: "win" | "lose" | "draw"; // 승, 패, 무
  status: "pending" | "completed"; // pending: 득점 미입력, completed: 득점 입력 완료
}

interface MatchListScreenProps {
  onBack: () => void;
  onAddMatch: () => void;
  onScoreMatch: (matchId: string) => void; // 스코어 버튼 클릭 핸들러
  onEditScore: (matchId: string) => void; // ✅ 스코어 수정 핸들러 추가
  onMomSaved?: () => void; // ✅ MOM 저장 완료 콜백 
}

export default function MatchListScreen({ onBack, onAddMatch, onScoreMatch, onEditScore, onMomSaved }: MatchListScreenProps) {
  // 실제 데이터 로드
  const { matches: realMatches, refreshData } = useMatchData();
  const [isRefreshing, setIsRefreshing] = useState(true);
  
  // 더보기 메뉴 상태
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // MOM 선정 모달 상태
  const [showMomModal, setShowMomModal] = useState(false);
  const [momMatchData, setMomMatchData] = useState<{
    matchId: string;
    matchDate: string;
    opponentName: string;
    participants: string[];
    scores: Array<{
      playerId: string;
      playerName: string;
      goals: number;
      assists: number;
      isMercenary?: boolean;
    }>;
  } | null>(null);
  
  // ✅ MOM 데이터 상태 추가
  const [momsData, setMomsData] = useState<any[]>([]);
  
  // 스켈레톤 컴포넌트
  const MonthSkeleton = () => (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
      {/* Month Title Skeleton */}
      <div className="h-[40px] relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center pl-[20px] pr-[8px] relative size-full">
            <div className="h-6 w-16 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>
      {/* Match Items Skeleton */}
      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
        {[1, 2, 3].map((i) => (
          <MatchItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );

  const MatchItemSkeleton = () => (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
          {/* Result Badge Skeleton */}
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative w-[38px]">
            <div className="bg-gray-300 col-1 ml-0 mt-0 rounded-[56px] row-1 size-[38px] animate-pulse" />
          </div>

          {/* Team Name and Date Skeleton */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px relative">
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mt-[2px]" />
          </div>

          {/* Score Button Skeleton */}
          <div className="h-[40px] w-[100px] bg-gray-300 rounded-[58px] animate-pulse" />

          {/* More Button Skeleton */}
          <div className="relative shrink-0 size-[40px]">
            <div className="size-full bg-gray-300 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  // 컴포넌트 마운트 시 Supabase에서 최신 매치 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsRefreshing(true);
      try {
        if (!isSupabaseConfigured) {
          console.warn("⚠️ [MatchListScreen] Supabase 설정이 없어 로컬 캐시만 표시합니다.");
          refreshData();
          return;
        }

        const matches = await fetchMatchesFromSupabase();
        const appData = await fetchAppDataFromSupabase(matches);
        saveMatches(appData.matches);
        saveScores(appData.scores);
        saveParticipants(appData.participants);
        saveMOMs(appData.moms);
        saveGoalEvents(appData.goalEvents);
        setMomsData(appData.moms);
        refreshData();
        console.log("✅ [MatchListScreen] Supabase Matches 로드 완료:", matches.length);
      } catch (error) {
        console.error("❌ [MatchListScreen] 데이터 로드 실패:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 실제 데이터를 MatchListItem 형식으로 변환
  const matches: MatchListItem[] = realMatches.map((match: Match) => {
    // 날짜 처리 (UTC 시간대 문제 해결)
    let dateStr = match.matchDate || "N/A";
    let formattedDate = dateStr;
    
    // ISO 형식 (2026-02-05T15:00:00.000Z) 또는 YYYY-MM-DD 형식 처리
    if (dateStr.includes("T")) {
      // ISO 형식: T 앞부분만 사용
      formattedDate = dateStr.split("T")[0].replace(/-/g, ".");
    } else if (dateStr.includes("-")) {
      // YYYY-MM-DD 형식
      formattedDate = dateStr.replace(/-/g, ".");
    }
    
    // 요일 추출 (UTC 시간대 문제 해결: YYYY-MM-DD를 로 날짜로 변환)
    const dateOnly = dateStr.split("T")[0]; // ISO 형식 대비 T 앞부분만 사용
    const [year, month, day] = dateOnly.split("-").map(Number);
    const date = new Date(year, month - 1, day); // 로컬 시간대로 생성
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = days[date.getDay()];

    // 경기 결과 계산
    let result: "win" | "lose" | "draw" | undefined = undefined;
    if (match.isCompleted && match.ourScore !== undefined && match.opponentScore !== undefined) {
      if (match.ourScore > match.opponentScore) {
        result = "win";
      } else if (match.ourScore < match.opponentScore) {
        result = "lose";
      } else {
        result = "draw";
      }
    }

    return {
      id: match.id,
      date: formattedDate,
      dayOfWeek: dayOfWeek,
      ourScore: match.ourScore,
      opponentScore: match.opponentScore,
      opponentName: match.opponentName,
      result: result,
      status: match.isCompleted ? "completed" : "pending",
    };
  });

  // 월별로 그룹핑
  const groupByMonth = (): { [key: string]: MatchListItem[] } => {
    const grouped: { [key: string]: MatchListItem[] } = {};
    matches.forEach((match) => {
      const monthKey = match.date.substring(5, 7); // "09", "08", "07" 추출
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(match);
    });
    
    // 각 월별 그룹 내에서 날짜 기준 내림차순 정렬 (최신 경기가 위로)
    Object.keys(grouped).forEach((month) => {
      grouped[month].sort((a, b) => {
        // YYYY.MM.DD 형식을 날짜로 변환하여 비교
        const dateA = new Date(a.date.replace(/\./g, "-"));
        const dateB = new Date(b.date.replace(/\./g, "-"));
        return dateB.getTime() - dateA.getTime(); // 내림차순 (최신 날짜가 위)
      });
    });
    
    return grouped;
  };

  const groupedMatches = groupByMonth();
  const sortedMonths = Object.keys(groupedMatches).sort((a, b) => b.localeCompare(a)); // 내림차순 정렬

  // 결과에 따른 배경색과 텍스트 색상
  const getResultStyles = (result: "win" | "lose" | "draw") => {
    switch (result) {
      case "win":
        return {
          bg: "bg-[#c1f0d6]",
          text: "text-[#327450]",
          label: "승",
        };
      case "lose":
        return {
          bg: "bg-[#f9d0d1]",
          text: "text-[#9f4646]",
          label: "패",
        };
      case "draw":
        return {
          bg: "bg-[#d7d9e0]",
          text: "text-[#4a5560]",
          label: "무",
        };
    }
  };

  // 스코어 색상
  const getScoreColor = (result: "win" | "lose" | "draw") => {
    switch (result) {
      case "win":
        return "text-[#148458]";
      case "lose":
        return "text-[#b53535]";
      case "draw":
        return "text-[#1a1a1c]";
    }
  };

  // 매치 삭제 핸들러
  const handleDeleteMatch = async () => {
    if (!selectedMatchId) return;

    const confirmDelete = window.confirm("정말 이 매치를 삭제하시겠습니까?\n관련된 모든 득점 데이터도 함께 삭제됩니다.");
    
    if (!confirmDelete) return;

    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🗑️ 매치 삭제 시작:", selectedMatchId);
      
      // 로컬 스토리지에서 매치 삭제 (관련 score, participant 데이터도 삭제)
      deleteMatch(selectedMatchId);
      console.log("✅ 로컬 스토리지에서 삭제 완료");

      if (isSupabaseConfigured) {
        await deleteMatchFromSupabase(selectedMatchId);
      }
      console.log("✅ Supabase 삭제 완료");
      
      // UI 업데이트
      setShowMoreMenu(false);
      setSelectedMatchId(null);
      refreshData(); // 데이터 새로고침
      
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (error) {
      console.error("❌ 매치 삭제 실패:", error);
      alert("매치 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 스코어 수정 핸들러
  const handleEditMatch = () => {
    if (!selectedMatchId) return;
    
    setShowMoreMenu(false);
    onEditScore(selectedMatchId); // ✅ App.tsx의 handleEditScore 호출
    setSelectedMatchId(null);
  };

  // MOM 선정 핸들러
  const handleMOMSelect = () => {
    if (!selectedMatchId) return;

    const match = realMatches.find(m => m.id === selectedMatchId);
    if (!match) return;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🏆 MOM 선정 데이터 준비");
    console.log("  - Match:", match);
    console.log("  - Match ID:", match.id);
    console.log("  - Participants:", match.participants);
    console.log("  - Scores:", match.scores);

    // ✅ LocalStorage에서 직접 Participants 확인
    const allParticipantsFromStorage = getParticipants();
    console.log("  - ALL Participants (from storage):", allParticipantsFromStorage);
    const matchParticipantsFromStorage = allParticipantsFromStorage.filter(p => p.matchId === match.id);
    console.log("  - Match Participants (from storage):", matchParticipantsFromStorage);

    // ✅ LocalStorage의 participants에서 참가자 ID를 추출 (용병 제외는 MomSelectionModal에서 처리)
    const participantIds = matchParticipantsFromStorage.map(p => p.playerId);
    console.log("  - Participant IDs (from storage):", participantIds);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    setMomMatchData({
      matchId: match.id,
      matchDate: match.matchDate,
      opponentName: match.opponentName,
      participants: participantIds, // ✅ LocalStorage에서 추출한 ID 배열
      scores: match.scores || [],
    });
    setShowMomModal(true);
    setShowMoreMenu(false);
    setSelectedMatchId(null);
  };

  return (
    <div className="fixed inset-0 z-30 bg-white h-screen min-h-screen w-full overflow-hidden">
      {/* Header */}
      <div className="absolute h-[48px] left-0 right-0 top-[24px] z-10">
        <button
          onClick={onBack}
          className="absolute content-stretch flex items-center justify-center left-[8px] size-[40px] top-1/2 -translate-y-1/2"
        >
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <div className="h-[25px] relative w-[24px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25">
                  <g>
                    <path d="M8 5L16 12.5L8 20" stroke="var(--stroke-0, #242B35)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 leading-[normal] not-italic text-[#242b35] text-[18px]" style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 600 }}>
          매치
        </p>
      </div>

      {/* Match List */}
      <div className="absolute bottom-[116px] content-stretch flex flex-col gap-[48px] items-start left-0 right-0 top-[96px] w-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isRefreshing ? (
          <MonthSkeleton />
        ) : sortedMonths.length === 0 ? (
          <div className="content-stretch flex flex-col gap-[12px] items-center justify-center min-h-[360px] px-[20px] relative shrink-0 w-full">
            <p
              className="leading-[normal] not-italic text-[#242b35] text-[22px] text-center"
              style={{ fontFamily: "var(--font-paperlogy)", fontWeight: 700 }}
            >
              아직 등록된 매치가 없어요
            </p>
            <p
              className="leading-[22px] not-italic text-[#82828f] text-[15px] text-center whitespace-pre-wrap"
              style={{ fontFamily: "var(--font-pretendard)", fontWeight: 500 }}
            >
              아래의 매치 추가 버튼으로 첫 경기를 등록하면{"\n"}
              Supabase에 저장되고 이 목록에 표시됩니다.
            </p>
          </div>
        ) : (
          sortedMonths.map((month) => (
            <div key={month} className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
              {/* Month Title */}
              <div className="h-[40px] relative shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex items-center pl-[20px] pr-[8px] relative size-full">
                    <p className="leading-[normal] not-italic relative shrink-0 text-[#82828f] text-[20px]" style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 700 }}>
                      {parseInt(month)}월
                    </p>
                  </div>
                </div>
              </div>

              {/* Match Items */}
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                {groupedMatches[month].map((match) => {
                  const resultStyles = match.result ? getResultStyles(match.result) : { bg: "bg-[#f2f2f2]", text: "text-[#82828f]", label: "대기" };
                  const scoreColor = match.result ? getScoreColor(match.result) : "text-[#82828f]";

                  return (
                    <div key={match.id} className="relative shrink-0 w-full">
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex gap-[12px] items-center pl-[20px] pr-[12px] relative w-full">
                          {/* Result Badge or Loading */}
                          {match.status === "pending" ? (
                            // Team Info Card (Figma Design)
                            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
                              <div className="border border-[#e6e8f3] border-solid col-1 ml-0 mt-0 rounded-[53.2px] row-1 size-[38px]" style={{ backgroundImage: "linear-gradient(113.629deg, rgb(236, 237, 245) 6.2357%, rgb(249, 249, 249) 128.38%)" }} />
                              <div className="col-1 content-stretch flex gap-[3px] items-center ml-[7px] relative row-1">
                                <div className="bg-[#b5bac8] rounded-[3px] shrink-0 size-[6px]" />
                                <div className="bg-[#b5bac8] rounded-[3px] shrink-0 size-[6px]" />
                                <div className="bg-[#b5bac8] rounded-[3px] shrink-0 size-[6px]" />
                              </div>
                            </div>
                          ) : (
                            // Result Badge
                            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative w-[38px]">
                              <div className={`${resultStyles.bg} col-1 ml-0 mt-0 rounded-[56px] row-1 size-[38px]`} />
                              <p className={`-translate-x-1/2 col-1 leading-[normal] ml-[19px] mt-[8px] not-italic relative row-1 ${resultStyles.text} text-[18px] text-center w-[38px] whitespace-pre-wrap`} style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 700 }}>
                                {resultStyles.label}
                              </p>
                            </div>
                          )}

                          {/* Team Name and Date */}
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-h-px min-w-px not-italic relative whitespace-pre-wrap">
                            <p className="relative shrink-0 text-[#1a1a1c] text-[16px] w-full" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 600 }}>
                              {match.opponentName}
                            </p>
                            <p className="relative shrink-0 text-[#54545c] text-[14px] w-full" style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 500 }}>
                              {match.date}({match.dayOfWeek})
                            </p>
                          </div>

                          {/* Score or Score Button */}
                          {match.status === "pending" ? (
                            <button
                              onClick={() => onScoreMatch(match.id)}
                              className="content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[58px] shrink-0"
                            >
                              <div className="absolute border border-[#1a1a1c] border-solid inset-0 pointer-events-none rounded-[58px]" />
                              <p className="leading-[normal] not-italic relative shrink-0 text-[#1a1a1c] text-[14px]" style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 500 }}>
                                스코어 입력
                              </p>
                            </button>
                          ) : (
                            <div className="bg-[#f2f2f2] content-stretch flex gap-[4px] items-center leading-[40px] not-italic px-[2px] relative rounded-[8px] shrink-0" style={{ fontFamily: 'var(--font-anton)' }}>
                              <p className={`relative shrink-0 ${scoreColor} text-[28px] text-center w-[28px] whitespace-pre-wrap`}>
                                {match.ourScore}
                              </p>
                              <p className="relative shrink-0 text-[#82828f] text-[32px]">:</p>
                              <p className="h-[40px] relative shrink-0 text-[#82828f] text-[28px] text-center w-[28px] whitespace-pre-wrap">
                                {match.opponentScore}
                              </p>
                            </div>
                          )}

                          {/* More Button */}
                          <button
                            className="relative shrink-0 size-[40px]"
                            onClick={() => {
                              setSelectedMatchId(match.id);
                              setShowMoreMenu(true);
                            }}
                          >
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
                              <g>
                                <path d={svgPaths.p119e640} fill="var(--fill-0, #82828F)" />
                              </g>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Match Button */}
      <div className="fixed backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-0 z-20 content-stretch flex flex-col items-start pb-[48px] pt-[16px] px-[20px] border-t border-[rgba(255,255,255,0.5)]">
        <button
          onClick={onAddMatch}
          className="bg-[#242b35] content-stretch flex gap-[8px] items-center justify-center not-italic p-[10px] relative rounded-[8px] w-full h-[52px] text-[18px]"
        >
          <p className="leading-[normal] relative shrink-0 text-white" style={{ fontFamily: 'var(--font-paperlogy)', fontWeight: 500 }}>
            매치 추가
          </p>
        </button>
      </div>

      {/* More Menu - Match Actions Sheet */}
      <AnimatePresence>
        {showMoreMenu && selectedMatchId && (() => {
          const selectedMatch = matches.find((match) => match.id === selectedMatchId);
          const canSelectMom = selectedMatch?.status === "completed";
          // ✅ 해당 매치의 MOM 존재 여부 확인
          const hasMomRecord = momsData.some((mom: any) => 
            (mom["matchId"] === selectedMatchId) || (mom["경기ID"] === selectedMatchId)
          );
          console.log(`🔍 Match ${selectedMatchId} MOM 존재 여부:`, hasMomRecord);
          
          return (
            <MatchActionsSheet
              onClose={() => {
                setShowMoreMenu(false);
                setSelectedMatchId(null);
              }}
              onDelete={handleDeleteMatch}
              onEdit={handleEditMatch}
              onMOM={handleMOMSelect}
              hasMom={hasMomRecord}
              canSelectMom={canSelectMom}
            />
          );
        })()}
      </AnimatePresence>

      {/* MOM 선정 모달 */}
      {showMomModal && momMatchData && (
        <MomSelectionModal
          isOpen={showMomModal}
          onClose={() => {
            setShowMomModal(false);
            setMomMatchData(null);
          }}
          matchId={momMatchData.matchId}
          matchDate={momMatchData.matchDate}
          opponentName={momMatchData.opponentName}
          participants={momMatchData.participants}
          scores={momMatchData.scores}
          onSelectMom={async (selectedPlayerIds: string[]) => {
            try {
              console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
              console.log("🏆 MOM 선정 시작");
              console.log("  - Match ID:", momMatchData.matchId);
              console.log("  - 선수 IDs:", selectedPlayerIds);
              
              await saveMomToSupabase(momMatchData.matchId, selectedPlayerIds);
              console.log("✅ MOM Supabase 저장 완료");
              console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

              // 데이터 새로고침
              refreshData();

              // ✅ MOM 저장 완료 콜백 호출
              if (onMomSaved) {
                onMomSaved();
              }

              setShowMomModal(false);
              setMomMatchData(null);
            } catch (error) {
              console.error("❌ MOM 저장 실패:", error);
              alert("MOM 선정에 실패했습니다. 다시 시도해주세요.");
            }
          }}
        />
      )}
    </div>
  );
}
