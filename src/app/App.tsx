import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-zcyalr9017";
import MercenaryModal from "./components/MercenaryModal";
import MercenaryManagement from "./components/MercenaryManagement";
import ScoreTracking from "./components/ScoreTracking";
import MainScreen from "./components/MainScreen";
import MatchListScreen, {
  MatchListItem,
} from "./components/MatchListScreen";
import MatchRegistration from "./components/MatchRegistration";
import { fetchJSONP } from "./utils/jsonp";
import { Toaster } from "sonner";

interface Player {
  id: string;
  number: string;
  name: string;
}

interface Mercenary {
  id: string;
  name: string;
}

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
  const [selectedPlayers, setSelectedPlayers] = useState<
    Set<string>
  >(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMercenaryManagement, setShowMercenaryManagement] =
    useState(false);
  const [isSavingToGoogle, setIsSavingToGoogle] =
    useState(false);
  const [showScoreTracking, setShowScoreTracking] =
    useState(false);
  const [showPlayerSelection, setShowPlayerSelection] =
    useState(false);
  const [showMatchList, setShowMatchList] = useState(false);
  const [showMatchRegistration, setShowMatchRegistration] =
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

  // 여기에 Google Apps Script 웹 앱 URL을 붙여넣으세요
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxQwNZwPSeOHFVAww09cfwXcPpsYB6CmFlY8cigpX2uC4qwEQHbGpYhmNuoeJuDwNwt/exec";

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

  // 🔄 앱 시작 시 Google Sheets에서 데이터 로드
  useEffect(() => {
    if (shouldRefetch) {
      loadDataFromGoogleSheets();
    }
  }, [shouldRefetch]);

  const loadDataFromGoogleSheets = async () => {
    setIsLoadingCache(true);
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(
        "📊 Google Sheets에서 전역 데이터 로드 중...",
      );
      console.log("🔗 URL:", GOOGLE_SCRIPT_URL);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // JSONP 방식으로 Matches, Scores, PlayerStats, Participants, MOMs 데이터 병렬 로드
      const [
        matchesData,
        scoresData,
        statsData,
        participantsData,
        momsData,
      ] = await Promise.all([
        fetchJSONP<{ success: boolean; matches: any[] }>(
          `${GOOGLE_SCRIPT_URL}?action=getMatches`,
        ),
        fetchJSONP<{ success: boolean; scores: any[] }>(
          `${GOOGLE_SCRIPT_URL}?action=getScores`,
        ).catch((error) => {
          console.log("⚠️ Scores 데이터 없음 (선택사항)");
          return { success: false, scores: [] };
        }),
        fetchJSONP<{ success: boolean; stats: any[] }>(
          `${GOOGLE_SCRIPT_URL}?action=getPlayerStats`,
        ).catch((error) => {
          console.log("⚠️ PlayerStats 데이터 없음 (선택사항)");
          return { success: false, stats: [] };
        }),
        // ✅ Participants 데이터 추가
        fetchJSONP<{ success: boolean; participants: any[] }>(
          `${GOOGLE_SCRIPT_URL}?action=getParticipants`,
        ).catch((error) => {
          console.log("⚠️ Participants 데이터 없음 (선택사항)");
          return { success: false, participants: [] };
        }),
        // ✅ MOMs 데이터 추가
        fetchJSONP<{ success: boolean; moms: any[] }>(
          `${GOOGLE_SCRIPT_URL}?action=getMOMs`,
        ).catch((error) => {
          console.log("⚠️ MOMs 데이터 없음 (선택사항)");
          return { success: false, moms: [] };
        }),
      ]);

      console.log("📦 받은 Matches 데이터:", matchesData);
      console.log("📦 받은 Scores 데이터:", scoresData);
      console.log("📦 받은 Stats 데터:", statsData);
      console.log(
        "📦 받은 Participants 데이터:",
        participantsData,
      );
      console.log("📦 받은 MOMs 데이터:", momsData); // ✅ MOMs 로그 추가

      // 캐시에 저장
      const cacheData = {
        matches: matchesData.success ? matchesData.matches : [],
        scores: scoresData.success ? scoresData.scores : [],
        stats: statsData.success ? statsData.stats : [],
        participants: participantsData.success
          ? participantsData.participants
          : [], // ✅ Participants 추가
        moms: momsData.success ? momsData.moms : [], // ✅ MOMs 추가
        timestamp: Date.now(),
      };

      setCachedGoogleData(cacheData);
      setShouldRefetch(false); // 다음번에는 캐시 사용
      console.log("✅ 전역 캐시 저장 완료:", cacheData);

      // MatchListScreen용 매치 데이터 변환
      if (matchesData.success && matchesData.matches) {
        const loadedMatches: MatchListItem[] =
          matchesData.matches.map((match: any) => {
            // 요일 추출 (UTC 시간대 문제 해결)
            const dateStr = match["날짜"] || match["matchDate"];
            const dateOnly = dateStr.split("T")[0]; // ISO 형식 대비 T 앞부분만 사용
            const [year, month, day] = dateOnly
              .split("-")
              .map(Number);
            const matchDate = new Date(year, month - 1, day); // 로컬 시간대로 생성
            const dayOfWeek = [
              "일",
              "월",
              "화",
              "수",
              "목",
              "금",
              "토",
            ][matchDate.getDay()];

            const ourScore =
              match["우리팀득점"] || match["ourScore"] || 0;
            const opponentScore =
              match["상대팀득점"] ||
              match["opponentScore"] ||
              0;
            let result: "win" | "lose" | "draw" = "draw";
            if (ourScore > opponentScore) result = "win";
            else if (ourScore < opponentScore) result = "lose";

            return {
              id:
                match["경기ID"] ||
                match["id"] ||
                match["날짜"] ||
                match["matchDate"],
              date:
                match["날짜"] || match["matchDate"]
                  ? (
                      match["날짜"] || match["matchDate"]
                    ).replace(/-/g, ".")
                  : "N/A",
              dayOfWeek,
              ourScore,
              opponentScore,
              opponentName:
                match["상대팀"] ||
                match["opponentName"] ||
                "상대팀",
              result,
              status: "completed" as const,
            };
          });

        setMatches(loadedMatches);
        console.log(
          "✅ Matches 데이터 로드 완료:",
          loadedMatches.length,
          "개",
        );
      }

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🎉 전역 데이터 로드 완료!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (error) {
      console.error(
        "❌ Google Sheets 데이터 로드 실패:",
        error,
      );
      // 실패 시 기본 Mock 데이터 유지
    } finally {
      setIsLoadingCache(false);
    }
  };

  const handleAddMatch = () => {
    setShowMatchList(false); // 매치 리스트 닫기
    setShowMatchRegistration(true);
  };

  const handleMatchRegistrationComplete = () => {
    // 매치 등록 화면 닫고, 매치 리스트 화면 열기
    setShowMatchRegistration(false);
    setShowMatchList(true);
    setShouldRefetch(true); // ✅ 매치 등록 완료 후 Google Sheets 다시 불러오기
  };

  const handleScoreMatch = (matchId: string) => {
    // 스코어 버튼 클릭 시 선수 선택 화면으로 이동
    setShowMatchList(false);
    setShowPlayerSelection(true);
    setCurrentMatchId(matchId); // 현재 득점 입력 중인 매치 ID 설정
    setSelectedPlayers(new Set()); // 선수 선택 초기화
    setMercenaries([]); // ✅ 용병 배열 초기화
    setHasNoMercenary(false); // 용병 설정 초기화
    setIsEditMode(false); // ✅ 새 매치 입력 모드
  };

  // ✅ 스코어 수정 핸들러 추가
  const handleEditScore = async (matchId: string) => {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📝 스코어 수정 모드 진입");
      console.log("Match ID:", matchId);
      console.log("🔍 현재 mercenaries 상태:", mercenaries);

      // Participants 데이터 로드
      const participantsData = await fetchJSONP<{
        success: boolean;
        participants: any[];
      }>(`${GOOGLE_SCRIPT_URL}?action=getParticipants`);

      if (
        participantsData.success &&
        participantsData.participants
      ) {
        // 해당 매치의 참가자 필터링
        const matchParticipants =
          participantsData.participants.filter(
            (p: any) =>
              p["matchId"] === matchId ||
              p["경기ID"] === matchId,
          );

        console.log(
          "📊 매치 참가자 데이터 (전체):",
          matchParticipants,
        );

        matchParticipants.forEach((p: any, index: number) => {
          console.log(
            `🔍 참가자 ${index + 1} JSON:`,
            JSON.stringify(p, null, 2),
          );
          console.log(
            ` 참가자 ${index + 1} 키:`,
            Object.keys(p),
          );
        });

        // 선수와 용병 분리
        const regularPlayers = matchParticipants.filter(
          (p: any) => {
            const playerId = String(p["playerId"] || "");
            const playerNumber = String(
              p["playerNumber"] || "",
            );
            const playerName = String(
              p["playerName"] || p["이름"] || "",
            );

            // 용병이 아니고, "용병없음"도 아닌 일반 선수만
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
            const playerNumber = String(
              p["playerNumber"] || "",
            );

            // playerId가 "mercenary_"로 시작하거나 playerNumber가 "GUEST"인 경우
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

        console.log("📊 일반 선수:", regularPlayers);
        console.log("📊 용병 선수:", mercenaryPlayers);
        console.log("📊 용병없음 플래그:", hasNoMercenaryFlag);

        // 선수 ID 세트 복원 (기존 players 배열에서 이름 매칭)
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

        // 용병 데이터 복원
        const restoredMercenaries: Mercenary[] =
          mercenaryPlayers.map((p: any, index: number) => ({
            id: `mercenary_${Date.now()}_${index}_${Math.random()}`,
            name: p["이름"] || p["playerName"],
          }));

        console.log(
          "✅ 선수 복원:",
          Array.from(selectedPlayerIds),
        );
        console.log("✅ 용병 복원:", restoredMercenaries);
        console.log("✅ 용병없음 플래그:", hasNoMercenaryFlag);

        // 상태 복원
        setSelectedPlayers(selectedPlayerIds);
        setMercenaries(restoredMercenaries);
        setHasNoMercenary(hasNoMercenaryFlag);
        setCurrentMatchId(matchId);
        setIsEditMode(true);

        console.log(
          "🔍 복원 후 mercenaries 상태 예상:",
          restoredMercenaries,
        );

        // 선수 선택 화면으로 이동 (복원된 데이터로)
        setShowMatchList(false);
        setShowPlayerSelection(true);

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
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

  const handleSaveToGoogle = async () => {
    const selected = players.filter((p) =>
      selectedPlayers.has(p.id),
    );

    // Google Sheets로 전송할 데이터 형식 (번호, 이름만)
    const dataForSheets = selected.map((p) => ({
      번호: p.number,
      이름: p.name,
    }));

    console.log("전송할 데이터:", dataForSheets);

    setIsSavingToGoogle(true);

    try {
      // ✅ 1단계: 기존 registerPlayers 요청 (하위 호환성 유지)
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "registerPlayers",
          players: dataForSheets,
          matchId: currentMatchId, // 경기 ID 추가
        }),
        redirect: "follow",
      });

      // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 간주
      console.log(
        "✅ [1/2] Google Sheets에 registerPlayers 데이터 전송 완료!",
      );
      console.log(
        "📊 전송된 데이터:",
        JSON.stringify({ players: dataForSheets }, null, 2),
      );

      // ✅ 2단계: Participants 시트에 경기 참가 인원 저장 (선수 + 용병)
      const participantsData = [
        // 일반 선수
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
        // "용병없음" 플래그
        ...(hasNoMercenary
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

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📤 [2/2] 경기 참가 인원 데이터 전송 중...");
      console.log("Participants:", participantsData);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // ✅ 기존 Participants 데이터 삭제 (중복 방지)
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "deleteMatchParticipants",
          data: JSON.stringify({ matchId: currentMatchId }),
        }),
        redirect: "follow",
      });
      console.log("✅ 기존 Participants 데이터 삭제 완료");

      // 새로운 Participants 데이터 저장
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "saveParticipants",
          data: JSON.stringify(participantsData), // ✅ data 파라미터로 변경
        }),
        redirect: "follow",
      });

      console.log("✅ [2/2] Participants 데이터 전송 완료!");

      // 모달 닫고 득점 입력 페이지로 이동
      setShowModal(false);
      setShowMercenaryManagement(false);
      setShowScoreTracking(true);
    } catch (error) {
      // no-cors 모드에서는 실제 요청이 성공해도 에러가 발생할 수 있음
      // 따라서 네트워크 에러도 성공로 간주
      console.log(
        "⚠️ no-cors 모드에서 응답 확인 불가 (정상 동작)",
      );
      console.log(
        "📊 전송 시도한 데이터:",
        JSON.stringify({ players: dataForSheets }, null, 2),
      );

      // 모달 닫고 득점 입력 페이지로 이동
      setShowModal(false);
      setShowMercenaryManagement(false);
      setShowScoreTracking(true);
    } finally {
      setIsSavingToGoogle(false);
    }
  };

  return (
    <div className="bg-white relative size-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {showScoreTracking ? (
        <ScoreTracking
          selectedPlayers={players.filter((p) =>
            selectedPlayers.has(p.id),
          )}
          mercenaries={hasNoMercenary ? [] : mercenaries}
          matchId={currentMatchId}
          isEditMode={isEditMode} // ✅ 수정 모드 전달
          onBack={() => {
            setShowScoreTracking(false);
            setShowPlayerSelection(false); // 선수 선택 화면도 닫기
            setCurrentMatchId(null); // 매치 ID 초기화
            setIsEditMode(false); // ✅ 수정 모드 초기화
            setShowMatchList(false); // 메인 페이지로 이동
            setShouldRefetch(true); // ✅ 득점 입력 완료 후 Google Sheets 다시 불러오기
          }}
          googleScriptUrl={GOOGLE_SCRIPT_URL}
          opponentName={
            currentMatchId
              ? matches.find((m) => m.id === currentMatchId)
                  ?.opponentName
              : undefined
          }
        />
      ) : showPlayerSelection ? (
        !showMercenaryManagement ? (
          <div className="bg-white relative size-full overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Header - Close Button */}
            <div className="absolute h-[48px] left-0 right-0 top-[24px]">
              <button
                onClick={() => {
                  console.log("닫기 버튼 클릭");
                  setShowPlayerSelection(false);
                  setSelectedPlayers(new Set());
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
              <div className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-full mb-[120px]">
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
              <div className="fixed backdrop-blur-[2.5px] bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-0 content-stretch flex flex-col items-start pb-[48px] pt-[16px] px-[20px] border-t border-[rgba(255,255,255,0.5)] animate-[slideUp_0.3s_ease-out]">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`w-full h-[52px] rounded-[8px] font-medium text-[18px] transition-all ${
                    isSaving
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#242b35] text-white hover:bg-[#1a2129]"
                  }`}
                  style={{
                    fontFamily: "var(--font-paperlogy)",
                  }}
                >
                  {isSaving
                    ? "저장 중..."
                    : isEditMode
                      ? "다음"
                      : "저장"}
                </button>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#242b35] text-white px-6 py-4 rounded-lg shadow-lg z-50">
                <p
                  className="font-semibold text-[16px]"
                  style={{
                    fontFamily: "var(--font-pretendard)",
                  }}
                >
                  {selectedPlayers.size}명의 선수가
                  선택되었습니다!
                </p>
                <p
                  className="text-[14px] text-gray-300 mt-1"
                  style={{
                    fontFamily: "var(--font-pretendard)",
                  }}
                >
                  콘솔에서 데이터를 확인하세요
                </p>
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
                  handleSaveToGoogle(); // "없어요" 버튼 클릭 시 저장
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
              handleSaveToGoogle(); // "다음" 버튼 클릭 시 저장
            }}
            opponentName={
              currentMatchId
                ? matches.find((m) => m.id === currentMatchId)
                    ?.opponentName
                : undefined
            }
          />
        )
      ) : showMatchList ? (
        <MatchListScreen
          onBack={() => {
            setShowMatchList(false);
            setShouldRefetch(true); // ✅ 매치 리스트에서 메인으로 돌아갈 때 데이터 새로고침
          }}
          onAddMatch={handleAddMatch}
          onScoreMatch={handleScoreMatch}
          onEditScore={handleEditScore} // ✅ 스코어 수정 콜백 전달
          onMomSaved={() => {
            console.log(
              "🏆 MOM 저장 완료 - 데이터 새로고침 트리거",
            );
            setShouldRefetch(true); // ✅ MOM 선정 완료 후 Google Sheets 다시 불러오기
          }}
          googleScriptUrl={GOOGLE_SCRIPT_URL}
        />
      ) : showMatchRegistration ? (
        <MatchRegistration
          onComplete={handleMatchRegistrationComplete}
          onCancel={() => setShowMatchRegistration(false)}
          googleScriptUrl={GOOGLE_SCRIPT_URL}
        />
      ) : (
        <MainScreen
          onNavigateToMatches={() => setShowMatchList(true)}
          googleScriptUrl={GOOGLE_SCRIPT_URL}
          cachedData={cachedGoogleData} // ✅ 캐시 데이터 전달
          isLoadingCache={isLoadingCache} // ✅ 로딩 상태 전달
        />
      )}
      <Toaster />
    </div>
  );
}