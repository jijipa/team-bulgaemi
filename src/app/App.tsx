import { useState, useEffect, useRef } from "react";
import svgPaths from "../imports/svg-zcyalr9017";
import MercenaryModal from "./components/MercenaryModal";
import MercenaryManagement from "./components/MercenaryManagement";
import ScoreTracking from "./components/ScoreTracking";
import MainScreen from "./components/MainScreen";
import MatchCardScreen from "./components/MatchCardScreen";
import TeamMemberManagement from "./components/TeamMemberManagement";
import MatchListScreen, {
  MatchListItem,
} from "./components/MatchListScreen";
import MatchRegistration from "./components/MatchRegistration";
import TmmboxGuide from "../components/tmmbox-guide-styled/TmmboxGuide";
import type { SectionId as TmmboxGuideSectionId } from "../components/tmmbox-guide-styled/TmmboxGuide";
import {
  JjfcMatchResultCard,
  jjfcMatchResultCardSampleData,
} from "./components/JjfcMatchResultCard";
import { Toaster } from "sonner";
import { isSupabaseConfigured } from "./lib/supabase";
import { fetchMatchesFromSupabase } from "./services/supabaseMatches";
import {
  exportAllData,
  getPlayers,
  getParticipants,
  saveGoalEvents,
  saveMOMs,
  saveMatches,
  saveMercenaries,
  saveParticipants,
  saveScores,
} from "./utils/storage";
import {
  fetchAppDataFromSupabase,
  replaceParticipantsForMatchInSupabase,
  upsertGoalEventsInSupabase,
  upsertMomsInSupabase,
  upsertParticipantsInSupabase,
  upsertScoresInSupabase,
} from "./services/supabaseAppData";
import {
  deletePlayerFromSupabase,
  fetchPlayersFromSupabase,
  upsertPlayersInSupabase,
} from "./services/supabasePlayers";
import { teamConfig } from "./config/team";
import {
  createTeamMemberData,
  deleteTeamMemberData,
  updateTeamMemberData,
} from "./utils/teamMembers";

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
  | { name: "teamMembers" }
  | { name: "newMatch" }
  | { name: "participants"; matchId: string }
  | { name: "score"; matchId: string }
  | { name: "matchCard" }
  | { name: "resultCardPreview" }
  | { name: "tmmboxGuide"; sectionId?: TmmboxGuideSectionId };

const getEditAccessSessionKey = () =>
  `${teamConfig.storageNamespace}:edit-access-granted`;

const hasValidEditKeyInSearch = (search: string) => {
  if (!teamConfig.editAccessKey) return true;

  const params = new URLSearchParams(search);
  return (
    params.get(teamConfig.editAccessQueryParam) ===
    teamConfig.editAccessKey
  );
};

const getInitialEditAccess = (isLocalhost: boolean) => {
  if (isLocalhost || !teamConfig.editAccessKey) {
    return true;
  }

  if (hasValidEditKeyInSearch(window.location.search)) {
    return true;
  }

  return (
    window.sessionStorage.getItem(getEditAccessSessionKey()) ===
    "true"
  );
};

const parseRoute = (pathname: string): AppRoute => {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const isJjfcRouteEnabled = teamConfig.slug === "jjfc";

  if (normalizedPath === "/") return { name: "home" };
  if (normalizedPath === "/matches") return { name: "matches" };
  if (normalizedPath === "/team-members") return { name: "teamMembers" };
  if (normalizedPath === "/matches/new") return { name: "newMatch" };
  if (isJjfcRouteEnabled && normalizedPath === "/matchcard") return { name: "matchCard" };
  if (isJjfcRouteEnabled && normalizedPath === "/result-card-preview") return { name: "resultCardPreview" };
  if (normalizedPath === "/tmmbox/guide") return { name: "tmmboxGuide" };

  const tmmboxGuideMatch = normalizedPath.match(/^\/tmmbox\/guide\/([^/]+)$/);
  if (tmmboxGuideMatch) {
    const sectionId = decodeURIComponent(tmmboxGuideMatch[1]);
    if (["shopping", "arrive", "inspection", "storage", "shipping"].includes(sectionId)) {
      return { name: "tmmboxGuide", sectionId: sectionId as TmmboxGuideSectionId };
    }
    return { name: "tmmboxGuide" };
  }

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
    case "teamMembers":
      return "/team-members";
    case "newMatch":
      return "/matches/new";
    case "participants":
      return `/matches/${encodeURIComponent(route.matchId)}/participants`;
    case "score":
      return `/matches/${encodeURIComponent(route.matchId)}/score`;
    case "matchCard":
      return "/matchcard";
    case "resultCardPreview":
      return "/result-card-preview";
    case "tmmboxGuide":
      return route.sectionId ? `/tmmbox/guide/${route.sectionId}` : "/tmmbox/guide";
  }
};

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
                        ? teamConfig.playerJerseySelectedColor
                        : teamConfig.playerJerseyUnselectedColor
                    }
                  />
                </g>
              </svg>
            </div>
            <p
              className={`absolute inset-[18.75%] flex items-center justify-center leading-[40px] not-italic ${
                isSelected ? "" : ""
              } text-[28px] text-center tracking-[0.28px]`}
              style={{
                color: isSelected
                  ? teamConfig.playerNumberSelectedColor
                  : teamConfig.playerNumberUnselectedColor,
                fontFamily: "var(--font-anton)",
              }}
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
                    fill={teamConfig.playerSelectionCheckColor}
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
  const isLocalhost =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost";
  const appScrollRef = useRef<HTMLDivElement>(null);
  const [route, setRoute] = useState<AppRoute>(() =>
    parseRoute(window.location.pathname),
  );
  const [hasEditAccess, setHasEditAccess] = useState(() =>
    getInitialEditAccess(isLocalhost),
  );
  const [players, setPlayers] = useState<Player[]>(() => {
    const storedPlayers = getPlayers();
    return storedPlayers.length > 0
      ? storedPlayers
      : teamConfig.players;
  });
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

  const syncEditAccessFromLocation = (options?: {
    consumeKey?: boolean;
  }) => {
    if (isLocalhost || !teamConfig.editAccessKey) {
      setHasEditAccess(true);
      return true;
    }

    const sessionKey = getEditAccessSessionKey();
    const params = new URLSearchParams(window.location.search);
    const editKeyFromUrl = params.get(
      teamConfig.editAccessQueryParam,
    );
    const hasUrlAccess =
      editKeyFromUrl === teamConfig.editAccessKey;
    const hasSessionAccess =
      window.sessionStorage.getItem(sessionKey) === "true";
    const nextAccess = hasUrlAccess || hasSessionAccess;

    if (nextAccess) {
      window.sessionStorage.setItem(sessionKey, "true");
    }

    if (hasUrlAccess && options?.consumeKey) {
      params.delete(teamConfig.editAccessQueryParam);
      const nextSearch = params.toString();
      const nextUrl =
        window.location.pathname +
        (nextSearch ? `?${nextSearch}` : "");
      window.history.replaceState(null, "", nextUrl);
    }

    setHasEditAccess(nextAccess);
    return nextAccess;
  };

  useEffect(() => {
    document.title = teamConfig.pageTitle;
  }, []);

  useEffect(() => {
    syncEditAccessFromLocation({ consumeKey: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      syncEditAccessFromLocation();
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (
      hasEditAccess ||
      (route.name !== "newMatch" &&
        route.name !== "participants" &&
        route.name !== "score")
    ) {
      return;
    }

    setCurrentMatchId(null);
    setIsEditMode(false);
    navigateTo({ name: "matches" }, { replace: true });
  }, [hasEditAccess, route]);

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
        const fallbackPlayers = teamConfig.players as Player[];
        setPlayers(fallbackPlayers);
        setCachedGoogleData({
          matches: [],
          scores: [],
          stats: [],
          participants: [],
          players: fallbackPlayers,
          moms: [],
          timestamp: Date.now(),
        });
        setShouldRefetch(false);
        return;
      }

      const supabaseMatches = await fetchMatchesFromSupabase();
      const appData = await fetchAppDataFromSupabase(supabaseMatches);
      let remotePlayers: Player[] = [];

      try {
        remotePlayers = await fetchPlayersFromSupabase();
        if (remotePlayers.length === 0) {
          const seedPlayers = teamConfig.players as Player[];
          await upsertPlayersInSupabase(seedPlayers as Player[]);
          remotePlayers = seedPlayers as Player[];
          console.log("✅ Supabase 선수 명단 초기 저장 완료:", remotePlayers.length, "명");
        } else {
          const remotePlayerIds = new Set(remotePlayers.map((player) => String(player.id)));
          const remotePlayerNames = new Set(remotePlayers.map((player) => player.name.trim()));
          const missingDefaultPlayers = (teamConfig.players as Player[]).filter(
            (player) =>
              !remotePlayerIds.has(String(player.id)) &&
              !remotePlayerNames.has(player.name.trim()),
          );

          if (missingDefaultPlayers.length > 0) {
            await upsertPlayersInSupabase(missingDefaultPlayers);
            remotePlayers = [...remotePlayers, ...missingDefaultPlayers];
          }
        }
      } catch (error) {
        console.warn(
          "⚠️ Supabase 선수 명단 로드 실패, 로컬/기본 명단으로 대체합니다:",
          error,
        );
        remotePlayers = teamConfig.players as Player[];
      }

      saveMatches(appData.matches);
      saveScores(appData.scores);
      saveParticipants(appData.participants);
      saveMOMs(appData.moms);
      saveGoalEvents(appData.goalEvents);
      setPlayers(remotePlayers);
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
        players: remotePlayers,
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

  const toSnapshotData = () => {
    const snapshot = exportAllData();
    return {
      matches: snapshot.matches,
      scores: snapshot.scores,
      players,
      participants: snapshot.participants,
      mercenaries: snapshot.mercenaries,
      moms: snapshot.moms,
      goalEvents: snapshot.goalEvents || [],
    };
  };

  const syncSnapshotToCache = (data: ReturnType<typeof toSnapshotData>) => {
    setCachedGoogleData((prev: any) => ({
      ...(prev || {}),
      matches: data.matches,
      scores: data.scores,
      players: data.players,
      participants: data.participants,
      moms: data.moms,
      goalEvents: data.goalEvents,
      timestamp: Date.now(),
    }));
  };

  const applySnapshotData = (data: ReturnType<typeof toSnapshotData>) => {
    saveMatches(data.matches);
    saveScores(data.scores);
    saveParticipants(data.participants);
    saveMercenaries(data.mercenaries);
    saveMOMs(data.moms);
    saveGoalEvents(data.goalEvents);
    setPlayers(data.players as Player[]);
    syncSnapshotToCache(data);
  };

  const syncTeamMemberRelatedDataToSupabase = async (
    data: ReturnType<typeof toSnapshotData>,
  ) => {
    if (!isSupabaseConfigured) {
      return;
    }

    await Promise.all([
      upsertScoresInSupabase(data.scores),
      upsertParticipantsInSupabase(data.participants),
      upsertGoalEventsInSupabase(data.goalEvents),
      upsertMomsInSupabase(data.moms),
    ]);
  };

  const applyTeamMemberMutation = async (
    buildNextData: (
      currentData: ReturnType<typeof toSnapshotData>,
    ) => ReturnType<typeof toSnapshotData>,
    options?: { deletedPlayerId?: string; syncRelated?: boolean },
  ) => {
    const localData = toSnapshotData();

    // ✅ scores/participants/goalEvents/moms를 함께 동기화해야 하는 경우,
    // 이 브라우저의 로컬 캐시가 오래됐을 수 있으므로 Supabase 최신 데이터를
    // 다시 받아온 뒤 그 위에 변경사항을 적용한다. (그렇지 않으면 다른 곳에서
    // 이미 반영된 최신 득점 기록을 오래된 로컬 캐시로 덮어써버릴 수 있음)
    let baseData = localData;
    if (isSupabaseConfigured && options?.syncRelated) {
      try {
        const freshMatches = await fetchMatchesFromSupabase();
        const freshAppData = await fetchAppDataFromSupabase(freshMatches);
        baseData = {
          ...localData,
          matches: freshAppData.matches,
          scores: freshAppData.scores,
          participants: freshAppData.participants,
          moms: freshAppData.moms,
          goalEvents: freshAppData.goalEvents || [],
        };
      } catch (error) {
        console.warn(
          "⚠️ 최신 데이터 재조회 실패, 로컬 캐시로 진행합니다:",
          error,
        );
      }
    }

    const nextData = buildNextData(baseData);

    applySnapshotData(nextData);

    try {
      if (isSupabaseConfigured) {
        if (options?.deletedPlayerId) {
          await deletePlayerFromSupabase(options.deletedPlayerId);
        } else {
          await upsertPlayersInSupabase(nextData.players);
        }
      }

      if (options?.syncRelated) {
        await syncTeamMemberRelatedDataToSupabase(nextData);
      }
    } catch (error) {
      applySnapshotData(currentData);
      throw error;
    }
  };

  const handleAddTeamMember = async (input: {
    name: string;
    number: string;
  }) => {
    await applyTeamMemberMutation(
      (currentData) => createTeamMemberData(currentData, input),
    );
  };

  const handleUpdateTeamMember = async (
    playerId: string,
    input: { name: string; number: string },
  ) => {
    await applyTeamMemberMutation(
      (currentData) =>
        updateTeamMemberData(currentData, playerId, input),
      { syncRelated: true },
    );
  };

  const handleDeleteTeamMember = async (playerId: string) => {
    await applyTeamMemberMutation(
      (currentData) => deleteTeamMemberData(currentData, playerId),
      { deletedPlayerId: playerId, syncRelated: true },
    );
  };

  const handleAddMatch = () => {
    if (!hasEditAccess) return;
    navigateTo({ name: "newMatch" });
  };

  const handleMatchRegistrationComplete = () => {
    navigateTo({ name: "matches" });
    setShouldRefetch(true);
  };

  const handleScoreMatch = (matchId: string) => {
    if (!hasEditAccess) return;
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
    if (!hasEditAccess) return;
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

  const isProtectedRoute =
    route.name === "teamMembers" ||
    route.name === "newMatch" ||
    route.name === "participants" ||
    route.name === "score";
  const isScoreRoute = hasEditAccess && route.name === "score";
  const isPlayerSelectionRoute =
    hasEditAccess && route.name === "participants";
  const isMatchRegistrationRoute =
    hasEditAccess && route.name === "newMatch";
  const isMatchListRoute =
    route.name === "matches" ||
    (!hasEditAccess && isProtectedRoute);

  if (route.name === "tmmboxGuide") {
    return <TmmboxGuide sectionId={route.sectionId} />;
  }

  return (
    <div ref={appScrollRef} className="bg-white relative h-screen min-h-screen w-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {teamConfig.showDevModeBadge && isLocalhost ? (
        <div className="fixed right-[12px] top-[12px] z-[100] rounded-full bg-[rgba(26,26,28,0.85)] px-[10px] py-[6px] text-[11px] text-white">
          {teamConfig.name} local
        </div>
      ) : null}
      {route.name === "resultCardPreview" ? (
        <div className="flex min-h-full w-full items-start justify-center bg-[#f5f5f5] p-[24px]">
          <JjfcMatchResultCard data={jjfcMatchResultCardSampleData} />
        </div>
      ) : route.name === "matchCard" ? (
        <MatchCardScreen
          cachedData={cachedGoogleData}
          isLoadingCache={isLoadingCache}
        />
      ) : isScoreRoute ? (
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
              <div
                className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-full mb-[96px]"
                style={{ paddingBottom: "100px" }}
              >
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
          canEdit={hasEditAccess}
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
          players={players}
        />
      ) : isMatchRegistrationRoute ? (
        <MatchRegistration
          onComplete={handleMatchRegistrationComplete}
          onCancel={() => navigateTo({ name: "matches" })}
        />
      ) : route.name === "teamMembers" ? (
        <TeamMemberManagement
          onAddMember={handleAddTeamMember}
          onBack={() => navigateTo({ name: "home" })}
          onDeleteMember={handleDeleteTeamMember}
          onUpdateMember={handleUpdateTeamMember}
          players={players}
        />
      ) : (
        <MainScreen
          onNavigateToMatches={() => navigateTo({ name: "matches" })}
          onNavigateToTeamMembers={() =>
            navigateTo({ name: "teamMembers" })
          }
          canManageTeamMembers={hasEditAccess}
          cachedData={cachedGoogleData} // ✅ 캐시 데이터 전달
          isLoadingCache={isLoadingCache} // ✅ 로딩 상태 전달
        />
      )}
      <Toaster />
    </div>
  );
}
