import { useState, useEffect, useRef } from "react";
import svgPaths from "../imports/svg-zcyalr9017";
import MercenaryModal from "./components/MercenaryModal";
import MercenaryManagement from "./components/MercenaryManagement";
import ScoreTracking from "./components/ScoreTracking";
import MainScreen from "./components/MainScreen";
import MatchListScreen, {
  MatchListItem,
} from "./components/MatchListScreen";
import MatchRegistration from "./components/MatchRegistration";
import { Toaster } from "sonner";
import { isSupabaseConfigured } from "./lib/supabase";
import { fetchMatchesFromSupabase } from "./services/supabaseMatches";
import {
  getParticipants,
  saveGoalEvents,
  saveMOMs,
  saveMatches,
  saveParticipants,
  saveScores,
} from "./utils/storage";
import {
  fetchAppDataFromSupabase,
  replaceParticipantsForMatchInSupabase,
} from "./services/supabaseAppData";

interface Player {
  id: string;
  number: string;
  name: string;
}

interface Mercenary {
  id: string;
  name: string;
}

type AppRoute =
  | { name: "home" }
  | { name: "matches" }
  | { name: "newMatch" }
  | { name: "participants"; matchId: string }
  | { name: "score"; matchId: string };

const parseRoute = (pathname: string): AppRoute => {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath === "/") return { name: "home" };
  if (normalizedPath === "/matches") return { name: "matches" };
  if (normalizedPath === "/matches/new") return { name: "newMatch" };

  const participantsMatch = normalizedPath.match(/^\/matches\/([^/]+)\/participants$/);
  if (participantsMatch) {
    return { name: "participants", matchId: decodeURIComponent(participantsMatch[1]) };
  }

  const scoreMatch = normalizedPath.match(/^\/matches\/([^/]+)\/score$/);
  if (scoreMatch) {
    return { name: "score", matchId: decodeURIComponent(scoreMatch[1]) };
  }

  return { name: "home" };
};

const buildPath = (route: AppRoute): string => {
  switch (route.name) {
    case "home":
      return "/";
    case "matches":
      return "/matches";
    case "newMatch":
      return "/matches/new";
    case "participants":
      return `/matches/${encodeURIComponent(route.matchId)}/participants`;
    case "score":
      return `/matches/${encodeURIComponent(route.matchId)}/score`;
  }
};

const players: Player[] = [
  { id: "1", number: "1", name: "박지황" },
  { id: "2", number: "4", name: "서준혁" },
  { id: "3", number: "6", name: "강석민" },
  { id: "4", number: "7", name: "김민겸" },
  { id: "5", number: "11", name: "정이삭" },
  { id: "6", number: "12", name: "장준희" },
  { id: "7", number: "19", name: "김동범" },
  { id: "8", number: "23", name: "강민수" },
  { id: "9", number: "27", name: "양재원" },
  { id: "10", number: "30", name: "박성민" },
  { id: "11", number: "49", name: "이현재" },
  { id: "12", number: "66", name: "김대영" },
  { id: "13", number: "77", name: "양준희" },
  { id: "14", number: "88", name: "박효창" },
  { id: "15", number: "96", name: "이찬호" },
  { id: "16", number: "99", name: "전민수" },
  { id: "17", number: "8", name: "한창희" },
  { id: "18", number: "0", name: "김대현" },
  { id: "19", number: "0", name: "권혁수" },
  { id: "20", number: "0", name: "권용찬" },
  { id: "21", number: "0", name: "전용주" },
  { id: "22", number: "0", name: "강대한" },
  { id: "23", number: "0", name: "임수훈" },
  { id: "24", number: "0", name: "박현민" },
];

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  onToggle: () => void;
}

function PlayerCard({
  player,
  isSelected,
  onToggle,
}: PlayerCardProps) {
  return (
    <div
      className={`bg-[#f2f2f2] flex-[1_0_0] min-h-px min-w-[90px] relative rounded-[12px] cursor-pointer transition-all overflow-hidden ${
        isSelected ? "shadow-[inset_0_0_0_2px_#242b35]" : ""
      }`}
      onClick={onToggle}
    >
      <div className="flex flex-col items-center min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-center min-w-[inherit] px-[2px] py-[8px] relative w-full">
          {/* Jersey Icon */}
          <div className="overflow-clip relative shrink-0 size-[64px]">
            <div className="absolute inset-[6.25%_4.21%_6.25%_4.17%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 58.64 56"
              >
                <g>
                  <path
                    d={svgPaths.p1257a430}
                    fill={
                      isSelected
                        ? "var(--fill-0, #242B35)"
                        : "var(--fill-0, #CECECE)"
                    }
                  />
                </g>
              </svg>
            </div>
            <p
              className={`absolute inset-[18.75%] flex items-center justify-center leading-[40px] not-italic ${
                isSelected ? "text-[#f2f2f2]" : "text-[#6e7783]"
              } text-[28px] text-center tracking-[0.28px]`}
              style={{ fontFamily: "var(--font-anton)" }}
            >
              {player.number}
            </p>
          </div>

          {/* Player Name */}
          <p
            className="font-semibold leading-[normal] min-w-full not-italic relative shrink-0 text-[#1a1a1c] text-[16px] text-center w-[min-content] whitespace-pre-wrap"
            style={{ fontFamily: "var(--font-pretendard)" }}
          >
            {player.name}
          </p>

          {/* Checkmark */}
          {isSelected && (
            <div className="absolute left-0 size-[19.998px] top-0">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 19.9976 19.9976"
              >
                <g>
                  <path
                    d={svgPaths.p371c0d00}
                    fill="var(--fill-0, #242B35)"
                  />
                  <path
                    d={svgPaths.p1e582c80}
                    stroke="var(--stroke-0, white)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const appScrollRef = useRef<HTMLDivElement>(null);
  const [route, setRoute] = useState<AppRoute>(() =>
    parseRoute(window.location.pathname),
  );
  const [selectedPlayers, setSelectedPlayers] = useState<
    Set<string>
  >(new Set());
  const [showModal, setShowModal] = useState(false);
  const [showMercenaryManagement, setShowMercenaryManagement] =
    useState(false);
  const [isSavingToGoogle, setIsSavingToGoogle] =
    useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<
    string | null
  >(null); // 현재 득점 입력 중인 매치 ID
  const [isEditMode, setIsEditMode] = useState(false); // ✅ 스코어 수정 모드 추가
  const [matches, setMatches] = useState<MatchListItem[]>([
    // 초기 Mock 데이터
    {
      id: "1",
      date: "2025.09.29",
      dayOfWeek: "토",
      ourScore: 3,
      opponentScore: 1,
      opponentName: "성은 FC",
      result: "win",
      status: "completed",
    },
    {
      id: "2",
      date: "2025.09.22",
      dayOfWeek: "토",
      ourScore: 3,
      opponentScore: 6,
      opponentName: "JJ FC",
      result: "lose",
      status: "completed",
    },
  ]);
  const [mercenaries, setMercenaries] = useState<Mercenary[]>([
    { id: "1", name: "용병  1" },
  ]);
  const [hasNoMercenary, setHasNoMercenary] = useState(false);

  // ✅ 전역 캐시 상태 추가
  const [cachedGoogleData, setCachedGoogleData] =
    useState<any>(null);
  const [isLoadingCache, setIsLoadingCache] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(true); // 데이터를 다시 불러와야 하는지 여부

  const navigateTo = (nextRoute: AppRoute, options?: { replace?: boolean }) => {
    const nextPath = buildPath(nextRoute);
    const currentPath = window.location.pathname + window.location.search;

    if (currentPath !== nextPath) {
      if (options?.replace) {
        window.history.replaceState(null, "", nextPath);
      } else {
        window.history.pushState(null, "", nextPath);
      }
    }

    setRoute(nextRoute);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (route.name === "participants" || route.name === "score") {
      setCurrentMatchId(route.matchId);
    }

    if (
      route.name === "score" &&
      !isLoadingCache &&
      (currentMatchId !== route.matchId || selectedPlayers.size === 0)
    ) {
      const restored = restoreMatchSelectionFromParticipants(route.matchId);
      if (restored) {
        setIsEditMode(true);
      }
    }
  }, [route, isLoadingCache]);

  // 🔄 앱 초기화: 선수 데이터를 LocalStorage에 저장
  useEffect(() => {
    // ✅ 항상 최신 선수 목록으로 업데이트
    console.log("📦 선수 데이터 업데이트 중...");
    localStorage.setItem(
      "soccer_players",
      JSON.stringify(players),
    );
    console.log(
      "✅ 선수 데이터 업데이트 완료:",
      players.length + "명",
    );
  }, []);

  // 🔄 앱 시작 시 Supabase에서 매치 데이터 로드
  useEffect(() => {
    if (shouldRefetch) {
      loadDataFromSupabase();
    }
  }, [shouldRefetch]);

  // 화면 전환 시 이전 화면의 스크롤 위치가 남아 흰 화면처럼 보이는 문제 방지
  useEffect(() => {
    appScrollRef.current?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [route, showMercenaryManagement]);

  const loadDataFromSupabase = async () => {
    setIsLoadingCache(true);
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 Supabase에서 매치 데이터 로드 중...");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      if (!isSupabaseConfigured) {
        console.warn("⚠️ Supabase 설정이 없어 원격 매치 로드를 건너뜁니다.");
        setCachedGoogleData({
          matches: [],
          scores: [],
          stats: [],
          participants: [],
          moms: [],
          timestamp: Date.now(),
        });
        setShouldRefetch(false);
        return;
      }

      const supabaseMatches = await fetchMatchesFromSupabase();
      const appData = await fetchAppDataFromSupabase(supabaseMatches);
      saveMatches(appData.matches);
      saveScores(appData.scores);
      saveParticipants(appData.participants);
      saveMOMs(appData.moms);
      saveGoalEvents(appData.goalEvents);
      const loadedMatches: MatchListItem[] = supabaseMatches.map((match) => {
        const dateOnly = match.matchDate.split("T")[0];
        const [year, month, day] = dateOnly.split("-").map(Number);
        const matchDate = new Date(year, month - 1, day);
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
          matchDate.getDay()
        ];
        const ourScore = match.ourScore ?? 0;
        const opponentScore = match.opponentScore ?? 0;
        let result: "win" | "lose" | "draw" | undefined;

        if (match.isCompleted) {
          if (ourScore > opponentScore) result = "win";
          else if (ourScore < opponentScore) result = "lose";
          else result = "draw";
        }

        return {
          id: match.id,
          date: dateOnly.replace(/-/g, "."),
          dayOfWeek,
          ourScore,
          opponentScore,
          opponentName: match.opponentName,
          result,
          status: match.isCompleted ? "completed" : "pending",
          imageUrl: match.imageUrl,
        };
      });
      setMatches(loadedMatches);
      const cacheData = {
        matches: appData.matches,
        scores: appData.scores,
        stats: [],
        participants: appData.participants,
        moms: appData.moms,
        goalEvents: appData.goalEvents,
        timestamp: Date.now(),
      };

      setCachedGoogleData(cacheData);
      setShouldRefetch(false);
      console.log("✅ Supabase 매치 캐시 저장 완료:", supabaseMatches.length, "개");

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🎉 Supabase 데이터 로드 완료!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (error) {
      console.error("❌ Supabase 데이터 로드 실패:", error);
    } finally {
      setIsLoadingCache(false);
    }
  };

  const restoreMatchSelectionFromParticipants = (matchId: string) => {
    const allParticipants = getParticipants();

    if (allParticipants.length === 0) {
      return false;
    }

    const matchParticipants = allParticipants.filter(
      (p: any) =>
        p["matchId"] === matchId ||
        p["경기ID"] === matchId,
    );

    if (matchParticipants.length === 0) {
      return false;
    }

    const regularPlayers = matchParticipants.filter(
      (p: any) => {
        const playerId = String(p["playerId"] || "");
        const playerNumber = String(p["playerNumber"] || "");
        const playerName = String(
          p["playerName"] || p["이름"] || "",
        );

        return (
          !playerId.startsWith("mercenary_") &&
          playerNumber !== "GUEST" &&
          playerName !== "용병없음" &&
          playerId !== "nomercenary"
        );
      },
    );

    const mercenaryPlayers = matchParticipants.filter(
      (p: any) => {
        const playerId = String(p["playerId"] || "");
        const playerNumber = String(p["playerNumber"] || "");

        return (
          playerId.startsWith("mercenary_") ||
          playerNumber === "GUEST"
        );
      },
    );

    const hasNoMercenaryFlag = matchParticipants.some(
      (p: any) => {
        const playerId = String(p["playerId"] || "");
        const playerName = String(
          p["playerName"] || p["이름"] || "",
        );
        return (
          playerName === "용병없음" ||
          playerId === "nomercenary"
        );
      },
    );

    const selectedPlayerIds = new Set<string>();
    regularPlayers.forEach((p: any) => {
      const playerName = p["이름"] || p["playerName"];
      const foundPlayer = players.find(
        (player) => player.name === playerName,
      );
      if (foundPlayer) {
        selectedPlayerIds.add(foundPlayer.id);
      }
    });

    const restoredMercenaries: Mercenary[] =
      mercenaryPlayers.map((p: any, index: number) => ({
        id: `mercenary_${Date.now()}_${index}_${Math.random()}`,
        name: p["이름"] || p["playerName"],
      }));

    setSelectedPlayers(selectedPlayerIds);
    setMercenaries(restoredMercenaries);
    setHasNoMercenary(hasNoMercenaryFlag);
    setCurrentMatchId(matchId);

    return true;
  };

  const handleAddMatch = () => {
    navigateTo({ name: "newMatch" });
  };

  const handleMatchRegistrationComplete = () => {
    navigateTo({ name: "matches" });
    setShouldRefetch(true);
  };

  const handleScoreMatch = (matchId: string) => {
    // 스코어 버튼 클릭 시 선수 선택 화면으로 이동
    setCurrentMatchId(matchId); // 현재 득점 입력 중인 매치 ID 설정
    setSelectedPlayers(new Set()); // 선수 선택 초기화
    setMercenaries([]); // ✅ 용병 배열 초기화
    setHasNoMercenary(false); // 용병 설정 초기화
    setIsEditMode(false); // ✅ 새 매치 입력 모드
    navigateTo({ name: "participants", matchId });
  };

  // ✅ 스코어 수정 핸들러 추가
  const handleEditScore = async (matchId: string) => {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📝 스코어 수정 모드 진입");
      console.log("Match ID:", matchId);
      restoreMatchSelectionFromParticipants(matchId);
      setCurrentMatchId(matchId);
      setIsEditMode(true);
      navigateTo({ name: "participants", matchId });
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (error) {
      console.error("❌ 스코어 수정 데이터 로드 실패:", error);
      alert("데이터를 불러오는데 실패했습니다.");
    }
  };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    console.log("🔍 handleSave 호출, isEditMode:", isEditMode);
    console.log("🔍 현재 mercenaries 상태:", mercenaries);

    // ✅ 수정 모드일 때는 바로 용병 등록 화면으로 이동
    if (isEditMode) {
      setShowMercenaryManagement(true);
    } else {
      // 새 경기 등록 모드일 때는 기존대로 모달 표시
      setShowModal(true);
    }
  };

  const handleSaveParticipants = async (forceNoMercenary = hasNoMercenary) => {
    const selected = players.filter((p) =>
      selectedPlayers.has(p.id),
    );

    setIsSavingToGoogle(true);

    try {
      const participantsData = [
        ...selected.map((p) => ({
          id: `participant_${currentMatchId}_${p.id}_${Date.now()}`,
          matchId: currentMatchId,
          playerId: p.id,
          playerName: p.name,
          playerNumber: p.number,
          isMercenary: false, // ✅ 용병 여부 추가
        })),
        // 용병 선수
        ...mercenaries.map((m) => ({
          id: `participant_${currentMatchId}_mercenary_${m.id}_${Date.now()}`,
          matchId: currentMatchId,
          playerId: `mercenary_${m.id}`,
          playerName: m.name,
          playerNumber: "GUEST", // 용병은 번호 없음
          isMercenary: true, // ✅ 용병 여부
        })),
        ...(forceNoMercenary
          ? [
              {
                id: `participant_${currentMatchId}_nomercenary_${Date.now()}`,
                matchId: currentMatchId,
                playerId: "nomercenary",
                playerName: "용병없음",
                playerNumber: "",
                isMercenary: false,
              },
            ]
          : []),
      ];

      const otherParticipants = getParticipants().filter(
        (participant) => participant.matchId !== currentMatchId,
      );
      saveParticipants([...otherParticipants, ...participantsData]);

      if (currentMatchId && isSupabaseConfigured) {
        await replaceParticipantsForMatchInSupabase(
          currentMatchId,
          participantsData,
        );
      }

      // 모달 닫고 득점 입력 페이지로 이동
      setShowModal(false);
      setShowMercenaryManagement(false);
      if (currentMatchId) {
        navigateTo({ name: "score", matchId: currentMatchId });
      }
    } catch (error) {
      console.error("참가자 저장 실패:", error);
      alert("참가자 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSavingToGoogle(false);
    }
  };

  const isScoreRoute = route.name === "score";
  const isPlayerSelectionRoute = route.name === "participants";
  const isMatchListRoute = route.name === "matches";
  const isMatchRegistrationRoute = route.name === "newMatch";

  return (
    <div ref={appScrollRef} className="bg-white relative h-screen min-h-screen w-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {isScoreRoute ? (
        <ScoreTracking
          selectedPlayers={players.filter((p) =>
            selectedPlayers.has(p.id),
          )}
          mercenaries={hasNoMercenary ? [] : mercenaries}
          matchId={currentMatchId}
          isEditMode={isEditMode} // ✅ 수정 모드 전달
          onBack={() => {
            setCurrentMatchId(null); // 매치 ID 초기화
            setIsEditMode(false); // ✅ 수정 모드 초기화
            setShouldRefetch(true); // ✅ 득점 입력 완료 후 Supabase 다시 불러오기
            navigateTo({ name: "matches" });
          }}
          opponentName={
            currentMatchId
              ? matches.find((m) => m.id === currentMatchId)
                  ?.opponentName
              : undefined
          }
        />
      ) : isPlayerSelectionRoute ? (
        !showMercenaryManagement ? (
          <div className="bg-white relative size-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Header - Close Button */}
            <div className="absolute h-[48px] left-0 right-0 top-[24px]">
              <button
                onClick={() => {
                  console.log("닫기 버튼 클릭");
                  setSelectedPlayers(new Set());
                  setCurrentMatchId(null);
                  navigateTo({ name: "matches" });
                }}
                className="-translate-y-1/2 absolute content-stretch flex items-center justify-center right-[8px] size-[40px] top-1/2"
              >
                <div className="flex items-center justify-center relative shrink-0">
                  <div className="flex-none rotate-180">
                    <div className="relative size-[24px]">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 24 24"
                      >
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
                </div>
              </button>
            </div>

            {/* vs Opponent Name */}
            <div className="absolute h-[48px] left-0 right-0 top-[65px]">
              <div className="absolute content-stretch flex flex-col items-center left-[20px] top-[14px]">
                <div
                  className="content-stretch flex font-semibold gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#7b8087] text-[18px]"
                  style={{
                    fontFamily: "var(--font-paperlogy)",
                  }}
                >
                  <p className="relative shrink-0">vs</p>
                  <p className="relative shrink-0">
                    {currentMatchId
                      ? matches.find(
                          (m) => m.id === currentMatchId,
                        )?.opponentName || "상대팀"
                      : "상대팀"}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-0 top-[113px] w-full px-[20px]">
              {/* Title */}
              <div className="relative shrink-0 w-full">
                <div
                  className="font-bold leading-[32px] not-italic relative shrink-0 text-[#242b35] text-[24px] tracking-[-0.48px]"
                  style={{
                    fontFamily: "var(--font-pretendard)",
                  }}
                >
                  <p className="mb-0">경기에 참여하는 팀원을</p>
                  <p>모두 선택해주세요</p>
                </div>
              </div>

              {/* Counter */}
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-end size-full">
                  <div className="content-stretch flex gap-[4px] items-center justify-end relative w-full">
                    <div className="relative shrink-0 size-[24px]">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 24 24"
                      >
                        <g>
                          <g>
                            <path
                              d={svgPaths.pae23200}
                              fill="var(--fill-0, #242B35)"
                            />
                            <path
                              d={svgPaths.p205eda00}
                              fill="var(--fill-0, #242B35)"
                            />
                            <path
                              d={svgPaths.p158cf900}
                              fill="var(--fill-0, #242B35)"
                            />
                            <path
                              d={svgPaths.p1db26f00}
                              fill="var(--fill-0, #242B35)"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                    <p
                      className="font-semibold leading-[24px] not-italic relative shrink-0 text-[#242b35] text-[20px] tracking-[-0.4px]"
                      style={{
                        fontFamily: "var(--font-pretendard)",
                      }}
                    >
                      {selectedPlayers.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Player Grid */}
              <div className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-full mb-[96px]">
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isSelected={selectedPlayers.has(player.id)}
                    onToggle={() => togglePlayer(player.id)}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            {selectedPlayers.size > 0 && (
              <div className="fixed backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-0 content-stretch flex flex-col items-start pb-[24px] pt-[16px] px-[20px] border-t border-[rgba(255,255,255,0.5)] animate-[slideUp_0.3s_ease-out]">
                <button
                  onClick={handleSave}
                  disabled={isSavingToGoogle}
                  className={`w-full h-[52px] rounded-[8px] font-medium text-[18px] transition-all ${
                    isSavingToGoogle
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#242b35] text-white hover:bg-[#1a2129]"
                  }`}
                  style={{
                    fontFamily: "var(--font-paperlogy)",
                  }}
                >
                  {isSavingToGoogle
                    ? "저장 중..."
                    : isEditMode
                      ? "다음"
                      : "저장"}
                </button>
              </div>
            )}

            {/* Modal */}
            {showModal && (
              <MercenaryModal
                isSaving={isSavingToGoogle}
                onClose={() => {
                  setShowModal(false); // 배경 클릭 시 모달만 닫기
                }}
                onNoMercenary={() => {
                  setHasNoMercenary(true);
                  handleSaveParticipants(true); // "없어요" 버튼 클릭 시 저장
                }}
                onAddMercenary={() => {
                  setShowModal(false);
                  setShowMercenaryManagement(true);
                }}
              />
            )}
          </div>
        ) : (
          <MercenaryManagement
            mercenaries={mercenaries}
            setMercenaries={setMercenaries}
            isSaving={isSavingToGoogle}
            onBack={() => setShowMercenaryManagement(false)}
            onNext={() => {
              handleSaveParticipants(false); // "다음" 버튼 클릭 시 저장
            }}
            opponentName={
              currentMatchId
                ? matches.find((m) => m.id === currentMatchId)
                    ?.opponentName
                : undefined
            }
          />
        )
      ) : isMatchListRoute ? (
        <MatchListScreen
          onBack={() => {
            setShouldRefetch(true); // ✅ 매치 리스트에서 메인으로 돌아갈 때 데이터 새로고침
            navigateTo({ name: "home" });
          }}
          onAddMatch={handleAddMatch}
          onScoreMatch={handleScoreMatch}
          onEditScore={handleEditScore} // ✅ 스코어 수정 콜백 전달
          onMomSaved={() => {
            console.log(
              "🏆 MOM 저장 완료 - 데이터 새로고침 트리거",
            );
            setShouldRefetch(true); // ✅ MOM 선정 완료 후 Supabase 다시 불러오기
          }}
          onMatchImageSaved={() => {
            console.log(
              "🖼️ 매치 이미지 저장 완료 - 데이터 새로고침 트리거",
            );
            setShouldRefetch(true);
          }}
        />
      ) : isMatchRegistrationRoute ? (
        <MatchRegistration
          onComplete={handleMatchRegistrationComplete}
          onCancel={() => navigateTo({ name: "matches" })}
        />
      ) : (
        <MainScreen
          onNavigateToMatches={() => navigateTo({ name: "matches" })}
          cachedData={cachedGoogleData} // ✅ 캐시 데이터 전달
          isLoadingCache={isLoadingCache} // ✅ 로딩 상태 전달
        />
      )}
      <Toaster />
    </div>
  );
}
